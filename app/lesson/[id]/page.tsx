import lessonsData from '@/lib/content/lessons.json';
import { ParsedContent, Lesson, Chapter } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/chapter/${chapter.id}`}
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
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
            <div className="text-sm text-gray-600 dark:text-gray-400">
              레슨 {currentIndex + 1} / {chapter.lessons.length}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left: Lesson Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {lesson.title}
            </h1>

            {lesson.content && (
              <div className="prose dark:prose-invert max-w-none mb-8">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {lesson.content}
                </div>
              </div>
            )}

            {lesson.codeExample && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  코드 예제
                </h3>
                <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{lesson.codeExample}</code>
                </pre>
              </div>
            )}

            {lesson.hint && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
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

            {/* Navigation Buttons */}
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
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

          {/* Right: Code Editor Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              코드 에디터
            </h2>
            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 min-h-[400px] font-mono text-sm">
              <pre className="text-gray-300">
                {lesson.initialCode || '// 여기에 코드를 작성하세요\n'}
              </pre>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                코드 실행
              </button>
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                초기화
              </button>
            </div>
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡 코드 에디터는 곧 구현될 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
