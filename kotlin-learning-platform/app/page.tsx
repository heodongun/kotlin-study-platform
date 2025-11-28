import lessonsData from '@/lib/content/lessons.json';
import { ParsedContent } from '@/types';
import Link from 'next/link';

export default function Home() {
  const { chapters } = lessonsData as ParsedContent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-cyan-100 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
        {/* Hero */}
        <header className="bg-white/80 dark:bg-gray-800/70 backdrop-blur rounded-2xl shadow-xl border border-amber-200/80 dark:border-gray-700 p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <p className="inline-flex items-center text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-3 py-1 rounded-full">
                크립토좀비 스타일 · Kotlin 캠페인
              </p>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Kotlin 성채를 탈환하는 3단계 여정
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
                기본 → 중급 → 고급 순서로 스토리를 따라가며 코드를 쌓아 올리세요. 각 챕터 안에 또 다른 액트가 있어,
                CryptoZombies처럼 미션을 깨며 다음 스킬을 잠금 해제합니다.
              </p>
              <div className="inline-flex items-center text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                ⚠️ 우리 정답 체점기는 멍청한 문자열 감별사입니다. 코드가 요구 조건 문자열을 포함하는지만 확인하니, 설명을 잘 읽고 그대로 써주세요.
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-600 to-emerald-500 text-white rounded-2xl p-6 w-full lg:w-72 shadow-lg">
              <p className="text-sm uppercase tracking-wide text-cyan-50/80 mb-2">캠페인 맵</p>
              <ul className="space-y-2 text-white/90">
                <li>1. Kotlin 기본 · 스타쉽 부팅</li>
                <li>2. Kotlin 중급 · 비동기 던전 & DSL 공방</li>
                <li>3. Kotlin 고급 · 고급 동시성 & 미래 기술</li>
              </ul>
              <p className="mt-4 text-sm text-cyan-50/80">
                각 액트는 이전 미션에서 작성한 코드를 이어받아 더 강한 장비로 진화합니다.
              </p>
            </div>
          </div>
        </header>

        {/* Chapter List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/chapter/${chapter.id}`}
              className="group"
            >
              <div className="bg-white/90 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 h-full border-2 border-transparent hover:border-emerald-500">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {chapter.title}
                  </h2>
                  <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-sm font-semibold px-3 py-1 rounded-full">
                    {chapter.lessons.length} 레슨
                  </span>
                </div>
                
                {chapter.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {chapter.description}
                  </p>
                )}

                <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-2 transition-transform">
                  학습 시작하기
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
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {chapters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              아직 학습 콘텐츠가 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
