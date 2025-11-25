import lessonsData from '@/lib/content/lessons.json';
import { ParsedContent } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { chapters } = lessonsData as ParsedContent;
  const chapter = chapters.find((c) => c.id === id);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 font-medium"
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
          챕터 목록으로
        </Link>

        {/* Chapter Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {chapter.title}
          </h1>
          {chapter.description && (
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {chapter.description}
            </p>
          )}
          <div className="mt-4 text-gray-600 dark:text-gray-400">
            총 {chapter.lessons.length}개의 레슨
          </div>
        </header>

        {/* Lesson List */}
        <div className="space-y-4">
          {chapter.lessons.map((lesson, index) => (
            <Link
              key={lesson.id}
              href={`/lesson/${lesson.id}`}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-blue-500">
                <div className="flex items-start gap-6">
                  {/* Lesson Number */}
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    {index + 1}
                  </div>

                  {/* Lesson Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {lesson.title}
                    </h3>
                    {lesson.content && (
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {lesson.content.substring(0, 150)}
                        {lesson.content.length > 150 ? '...' : ''}
                      </p>
                    )}
                    {lesson.codeExample && (
                      <div className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                        코드 예제 포함
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-2 transition-all">
                    <svg
                      className="w-6 h-6"
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
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
