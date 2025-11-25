'use client';

import { useEffect, useRef, useState } from 'react';
import { Lesson } from '@/types';

interface KotlinPlaygroundProps {
  lesson: Lesson;
  onSuccess?: () => void;
}

export default function KotlinPlayground({ lesson, onSuccess }: KotlinPlaygroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [userCode, setUserCode] = useState(lesson.initialCode || '// 여기에 코드를 작성하세요\n');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    // Kotlin Playground 스크립트 로드
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/kotlin-playground@1';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const checkAnswer = () => {
    setIsChecking(true);
    setResult(null);

    // 간단한 검증: 사용자 코드와 정답 코드 비교
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

    switch (type) {
      case 'contains':
        // 특정 코드가 포함되어 있는지 확인
        success = userCode.includes(pattern);
        break;
      case 'exact':
        // 정확히 일치하는지 확인 (공백 제거 후)
        success = userCode.trim() === pattern.trim();
        break;
      case 'regex':
        // 정규식 패턴 매칭
        const regex = new RegExp(pattern);
        success = regex.test(userCode);
        break;
    }

    if (success) {
      setResult({
        success: true,
        message: message || '정답입니다! 🎉',
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
    setUserCode(lesson.initialCode || '// 여기에 코드를 작성하세요\n');
    setResult(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Code Editor */}
      <div className="flex-1 mb-4">
        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          className="w-full h-full min-h-[400px] bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={checkAnswer}
          disabled={isChecking}
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

      {/* Result Message */}
      {result && (
        <div
          className={`p-4 rounded-lg ${
            result.success
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
                className={`font-medium ${
                  result.success
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

      {/* Kotlin Playground (hidden, for future use) */}
      <div className="hidden">
        <iframe
          ref={iframeRef}
          title="Kotlin Playground"
          className="w-full h-96 border-0"
        />
      </div>
    </div>
  );
}
