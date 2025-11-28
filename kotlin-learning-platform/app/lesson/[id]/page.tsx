import lessonsData from '@/lib/content/lessons.json';
import { ParsedContent, Lesson, Chapter } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KotlinPlayground from '@/components/KotlinPlayground';

function findLessonAndChapter(lessonId: string): { lesson: Lesson; chapter: Chapter } | null {
  const { chapters } = lessonsData as ParsedContent;

  for (const chapter of chapters) {
    const lesson = chapter.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      return { lesson, chapter };
    }
  }

  return null;
}

export const runtime = 'edge';

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // URL 디코딩 (Next.js가 자동으로 하지만 명시적으로 처리)
  const decodedId = decodeURIComponent(id);
  const result = findLessonAndChapter(decodedId);

  if (!result) {
    // 디버깅: 어떤 ID를 찾으려고 했는지 콘솔에 출력
    console.log('Lesson not found:', decodedId);
    console.log('Original ID:', id);
    notFound();
  }

  const { lesson, chapter } = result;
  const currentIndex = chapter.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? chapter.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < chapter.lessons.length - 1 ? chapter.lessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-cyan-100 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900">
      <header className="bg-white/90 dark:bg-gray-800/80 border-b border-amber-200 dark:border-gray-800 sticky top-0 z-10 backdrop-blur">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Link
              href={`/chapter/${chapter.id}`}
              className="inline-flex items-center text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {chapter.title}
            </Link>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              {lesson.arc && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
                  {lesson.arc}
                </span>
              )}
              <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs">
                레슨 {currentIndex + 1} / {chapter.lessons.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-gray-800/80 rounded-2xl shadow-lg border border-amber-200 dark:border-gray-700 p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-300 mb-1">
                    CryptoZombies style Quest
                  </p>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {lesson.title}
                  </h1>
                </div>
                <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-100 text-xs px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  코드가 단계별로 누적됩니다
                </div>
              </div>

              {lesson.story && (
                <div className="mt-4 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/30 dark:to-cyan-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 text-sm text-gray-800 dark:text-gray-200">
                  {lesson.story}
                </div>
              )}

              {lesson.content && (
                <div className="prose dark:prose-invert max-w-none mt-6">
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {lesson.content}
                  </div>
                </div>
              )}

              {lesson.codeExample && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    코드 예제
                  </h3>
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{lesson.codeExample}</code>
                  </pre>
                </div>
              )}

              {lesson.hint && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded mt-6">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                        힌트
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-400">
                        {lesson.hint}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                {prevLesson ? (
                  <Link
                    href={`/lesson/${prevLesson.id}`}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    이전 레슨
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson && (
                  <Link
                    href={`/lesson/${nextLesson.id}`}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    다음 레슨
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/80 rounded-2xl shadow-lg border border-emerald-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              코드 에디터
            </h2>
            <KotlinPlayground lesson={lesson} />
          </div>
        </div>
      </div>
    </div>
  );
}
