'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Lesson } from '@/types';

interface KotlinPlaygroundProps {
  lesson: Lesson;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    KotlinPlayground: any;
  }
}

// Use the latest version from the official CDN
const PLAYGROUND_CDN = 'https://unpkg.com/kotlin-playground@1';

const storageKey = (lessonId: string) => `kotlin-playground-${lessonId}`;

export default function KotlinPlayground({ lesson, onSuccess }: KotlinPlaygroundProps) {
  const codeRef = useRef<HTMLDivElement>(null);
  const [userCode, setUserCode] = useState(lesson.initialCode || '');
  const [isChecking, setIsChecking] = useState(false);
  const [playgroundStatus, setPlaygroundStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [resolvedInitialCode, setResolvedInitialCode] = useState(lesson.initialCode || '');
  const [carriedFrom, setCarriedFrom] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const resolveInitialCode = useCallback(() => {
    const fallback = lesson.initialCode || lesson.codeExample || '// 코드를 작성하세요';

    if (typeof window === 'undefined') {
      return { code: fallback, carried: null };
    }

    const saved = localStorage.getItem(storageKey(lesson.id));
    if (saved) {
      return { code: saved, carried: null };
    }

    if (lesson.continueFrom) {
      const previous = localStorage.getItem(storageKey(lesson.continueFrom));
      if (previous) {
        return {
          code: `// 이전 스테이지 코드에서 이어집니다\n${previous}`,
          carried: lesson.continueFrom,
        };
      }
    }

    return { code: fallback, carried: null };
  }, [lesson]);

  // Load Kotlin Playground Script manually for better control
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.KotlinPlayground) {
      setPlaygroundStatus('ready');
      return;
    }

    const scriptId = 'kotlin-playground-script';
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      existingScript.addEventListener('load', () => setPlaygroundStatus('ready'));
      existingScript.addEventListener('error', () => setPlaygroundStatus('error'));
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = PLAYGROUND_CDN;
    script.async = true;
    script.onload = () => setPlaygroundStatus('ready');
    script.onerror = () => setPlaygroundStatus('error');
    document.body.appendChild(script);

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (!window.KotlinPlayground) {
        setPlaygroundStatus('error');
      }
    }, 10000); // 10s timeout

    return () => clearTimeout(timeout);
  }, []);

  // When lesson changes, figure out starting code
  useEffect(() => {
    const { code, carried } = resolveInitialCode();
    setUserCode(code);
    setResolvedInitialCode(code);
    setCarriedFrom(carried);
    setResult(null);
  }, [lesson, resolveInitialCode]);

  // Initialize Kotlin Playground
  useEffect(() => {
    if (playgroundStatus !== 'ready' || !resolvedInitialCode || !codeRef.current || !window.KotlinPlayground) return;

    codeRef.current.innerHTML = '';

    const codeElement = document.createElement('code');
    codeElement.className = 'kotlin-code';
    codeElement.textContent = resolvedInitialCode;

    codeElement.setAttribute('theme', 'darcula');
    codeElement.setAttribute('data-target-platform', 'jvm');
    codeElement.setAttribute('data-autocomplete', 'true');
    codeElement.setAttribute('data-highlight-on-fly', 'true');
    codeElement.setAttribute('match-brackets', 'true');
    codeElement.setAttribute('indent', '4');

    codeRef.current.appendChild(codeElement);

    window.KotlinPlayground(codeElement, {
      onChange: (code: string) => {
        setUserCode(code);
      },
      onTestPassed: () => {
        // Optional hook
      }
    });

  }, [playgroundStatus, resolvedInitialCode, lesson.id]);

  // Persist code
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(storageKey(lesson.id), userCode);
  }, [lesson.id, userCode]);

  const checkAnswer = () => {
    setIsChecking(true);
    setResult(null);

    if (!lesson.validation) {
      setResult({
        success: true,
        message: '이 레슨은 자유 연습입니다. 코드를 실행해보세요!',
      });
      setIsChecking(false);
      return;
    }

    const { type, pattern, message } = lesson.validation;
    let success = false;

    const cleanCode = userCode.replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, '');

    switch (type) {
      case 'contains':
        success = cleanCode.includes(pattern);
        break;
      case 'notContains':
        success = !cleanCode.includes(pattern);
        break;
      case 'exact':
        success = cleanCode.trim() === pattern.trim();
        break;
      case 'regex':
        success = new RegExp(pattern).test(cleanCode);
        break;
    }

    if (success) {
      setResult({
        success: true,
        message: lesson.checkpointMessage || message || '정답입니다! 🎉',
      });
      onSuccess?.();
    } else {
      setResult({
        success: false,
        message: message || '다시 시도해보세요.',
      });
    }

    setIsChecking(false);
  };

  const resetCode = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey(lesson.id));
    }
    const { code, carried } = resolveInitialCode();
    setUserCode(code);
    setResolvedInitialCode(code);
    setCarriedFrom(carried);
    setResult(null);
  };

  // Fallback URL for iframe
  const getFallbackUrl = () => {
    const baseUrl = 'https://play.kotlinlang.org/embed/v1';
    const params = new URLSearchParams({
      code: userCode,
      targetPlatform: 'jvm',
      theme: 'darcula'
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 text-sm text-blue-900 dark:text-blue-200">
        ⚠️ 이 실습의 채점 시스템은 코드의 구조와 패턴을 분석합니다. 문제의 요구사항에 맞춰 정확하게 코드를 작성해주세요.
      </div>

      {carriedFrom && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
          이전 스테이지({carriedFrom})에 저장된 코드를 불러왔어요. 위에 필요한 부분만 추가해 더 강한 스킬을 만들면 됩니다.
        </div>
      )}

      <div className="flex-1 mb-2 relative min-h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner bg-gray-950">
        {playgroundStatus === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-900 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span>에디터 로딩 중...</span>
            </div>
          </div>
        )}

        {playgroundStatus === 'error' ? (
          <div className="w-full h-full flex flex-col">
            <div className="bg-red-500/10 text-red-500 text-xs p-2 text-center">
              스크립트 로딩 실패. 백업 에디터(IFrame)를 사용합니다. (자동 저장/검증 제한됨)
            </div>
            <iframe
              src={getFallbackUrl()}
              className="w-full h-full border-0"
              title="Kotlin Playground Fallback"
            />
          </div>
        ) : (
          <div ref={codeRef} className="w-full h-full [&_.kotlin-playground-wrapper]:h-full [&_.kotlin-playground-wrapper]:flex [&_.kotlin-playground-wrapper]:flex-col" />
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={checkAnswer}
          disabled={isChecking || playgroundStatus === 'error'}
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChecking ? '확인 중...' : '정답 확인'}
        </button>
        <button
          onClick={resetCode}
          className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          초기화
        </button>
      </div>

      {result && (
        <div
          className={`p-4 rounded-lg ${result.success
            ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
            : 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
            }`}
        >
          <div className="flex items-start">
            {result.success ? (
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${result.success
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-red-800 dark:text-red-300'
                  }`}
              >
                {result.message}
              </p>
              {!result.success && lesson.hint && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  💡 힌트: {lesson.hint}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
