import lessonsData from '@/lib/content/lessons.json';
import { ParsedContent } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const { chapters } = lessonsData as ParsedContent;
  const chapter = chapters.find((c) => c.id === decodedId);

  if (!chapter) {
    notFound();
  }

  const groupedLessons = chapter.lessons.reduce<Record<string, typeof chapter.lessons>>((acc, lesson) => {
    const arc = lesson.arc || '기본 진행';
    acc[arc] = acc[arc] || [];
    acc[arc].push(lesson);
    return acc;
  }, {});

  const arcEntries = Object.entries(groupedLessons).sort(([, a], [, b]) => {
    const orderA = a[0]?.order ?? 0;
    const orderB = b[0]?.order ?? 0;
    return orderA - orderB;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-cyan-100 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
        <Link
          href="/"
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
          챕터 목록으로
        </Link>

        <header className="bg-white/90 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-xl border border-amber-200 dark:border-gray-700 p-8">
          <div className="flex flex-col gap-3">
            <p className="inline-flex items-center text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-3 py-1 rounded-full w-fit">
              캠페인 진행 중
            </p>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              {chapter.title}
            </h1>
            {chapter.description && (
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {chapter.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">{chapter.lessons.length}개 레슨</span>
              <span className="text-gray-400">·</span>
              <span>아래 액트 순서대로 진행하면 코드가 자연스럽게 누적됩니다.</span>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {arcEntries.map(([arc, lessons]) => (
            <section key={arc} className="bg-white/90 dark:bg-gray-800/80 rounded-2xl shadow-lg border border-emerald-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 font-bold">
                    {lessons[0].order + 1}
                  </span>
                  <div>
                    <p className="text-sm uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                      {arc}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      스토리대로 따라가면 코드가 누적되며 업그레이드됩니다.
                    </p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 rounded-full border border-emerald-100 dark:border-emerald-800">
                  {lessons.length} 단계
                </span>
              </div>
              <div className="space-y-3">
                {lessons
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.id}`}
                      className="group block"
                    >
                      <div className="bg-gradient-to-r from-white dark:from-gray-900 via-white dark:via-gray-800 to-emerald-50 dark:to-emerald-900/20 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-200 font-bold text-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {lesson.continueFrom && (
                                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
                                  코드 이어쓰기
                                </span>
                              )}
                              {lesson.codeExample && (
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
                                  예제 포함
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                              {lesson.title}
                            </h3>
                            {lesson.story && (
                              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                {lesson.story}
                              </p>
                            )}
                            {!lesson.story && lesson.content && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {lesson.content.substring(0, 140)}
                                {lesson.content.length > 140 ? '...' : ''}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-2 transition-all">
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
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
