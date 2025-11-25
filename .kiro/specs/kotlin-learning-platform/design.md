# Design Document

## Overview

크립토좀비 스타일의 인터랙티브 코틀린 학습 플랫폼입니다. Next.js 14 App Router, TypeScript, Tailwind CSS를 사용하여 깔끔하고 현대적인 UI를 제공합니다. docs 폴더의 모든 HTML 학습 자료를 자동으로 파싱하여 구조화된 레슨으로 변환하고, 사용자는 좌우 분할 레이아웃에서 학습 내용을 읽고 코드를 작성하며 실시간 피드백을 받습니다. 각 HTML 파일은 하나의 챕터가 되며, 파일 내의 주요 섹션들이 개별 레슨으로 변환됩니다.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App                          │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   UI Layer   │  │ State Layer  │  │  Data Layer  │  │
│  │              │  │              │  │              │  │
│  │ - Pages      │  │ - Context    │  │ - Parser     │  │
│  │ - Components │  │ - Hooks      │  │ - Storage    │  │
│  │              │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │  docs/*.html  │
                  └───────────────┘
```

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Code Editor**: Monaco Editor (VS Code 기반)
- **Storage**: LocalStorage API
- **Build**: Static Site Generation (SSG)

## Components and Interfaces

### 1. Content Parser

HTML 파일을 파싱하여 구조화된 레슨 데이터로 변환합니다.

```typescript
interface Lesson {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  hint?: string;
  validation?: {
    type: 'contains' | 'exact' | 'regex';
    pattern: string;
  };
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface ParsedContent {
  chapters: Chapter[];
}

class ContentParser {
  parseAllHtmlFiles(docsDir: string): ParsedContent;
  parseHtmlFile(filePath: string): Chapter;
  extractSections(html: string): Section[];
  extractCodeBlocks(section: string): CodeBlock[];
  convertToLesson(section: Section): Lesson;
  generateChapterId(fileName: string): string;
}
```

### 2. Progress Tracker

사용자의 학습 진행 상황을 관리합니다.

```typescript
interface Progress {
  completedLessons: Set<string>;
  currentChapter: string;
  currentLesson: string;
  lastUpdated: Date;
}

class ProgressTracker {
  saveProgress(lessonId: string): void;
  loadProgress(): Progress;
  getChapterProgress(chapterId: string): number;
  resetProgress(): void;
}
```

### 3. Code Validator

사용자가 작성한 코드를 검증합니다.

```typescript
interface ValidationResult {
  success: boolean;
  message: string;
  hint?: string;
}

class CodeValidator {
  validate(code: string, lesson: Lesson): ValidationResult;
  checkContains(code: string, pattern: string): boolean;
  checkExact(code: string, expected: string): boolean;
  checkRegex(code: string, regex: string): boolean;
}
```

### 4. UI Components

#### LessonViewer

학습 내용을 표시하는 컴포넌트입니다.

```typescript
interface LessonViewerProps {
  lesson: Lesson;
  onComplete: () => void;
}

function LessonViewer({ lesson, onComplete }: LessonViewerProps): JSX.Element;
```

#### CodeEditor

코드 작성 영역입니다.

```typescript
interface CodeEditorProps {
  initialCode: string;
  onCodeChange: (code: string) => void;
  onSubmit: (code: string) => void;
  language: string;
}

function CodeEditor({ 
  initialCode, 
  onCodeChange, 
  onSubmit,
  language 
}: CodeEditorProps): JSX.Element;
```

#### ProgressBar

진행 상황을 시각화합니다.

```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  chapterTitle: string;
}

function ProgressBar({ 
  current, 
  total, 
  chapterTitle 
}: ProgressBarProps): JSX.Element;
```

#### ChapterList

챕터 목록을 표시합니다.

```typescript
interface ChapterListProps {
  chapters: Chapter[];
  progress: Progress;
  onSelectChapter: (chapterId: string) => void;
}

function ChapterList({ 
  chapters, 
  progress, 
  onSelectChapter 
}: ChapterListProps): JSX.Element;
```

## Data Models

### Lesson Model

```typescript
type Lesson = {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  initialCode?: string;
  hint?: string;
  validation?: {
    type: 'contains' | 'exact' | 'regex';
    pattern: string;
    message: string;
  };
  order: number;
};
```

### Chapter Model

```typescript
type Chapter = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
};
```

### Progress Model

```typescript
type Progress = {
  completedLessons: string[];
  currentChapter: string;
  currentLesson: string;
  lastUpdated: string;
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Chapter List Display Completeness

*For any* set of chapters, when a user accesses the platform, all chapters should be displayed in the chapter list.

**Validates: Requirements 1.1**

### Property 2: Lesson List Display for Selected Chapter

*For any* chapter selection, the system should display all lessons belonging to that chapter.

**Validates: Requirements 1.2**

### Property 3: Lesson Content Display

*For any* lesson selection, the system should display both the lesson content and the code editor.

**Validates: Requirements 1.3**

### Property 4: Lesson Content Completeness

*For any* lesson, the rendered content should include the title, description, and code example (if present).

**Validates: Requirements 1.4**

### Property 5: Progress Saving on Navigation

*For any* lesson, when navigating to the next lesson, the current progress should be saved.

**Validates: Requirements 1.5**

### Property 6: Code Validation Result Display

*For any* code submission, the system should validate the code and display a result (success or failure).

**Validates: Requirements 2.4, 2.5**

### Property 7: Progress Persistence Round Trip

*For any* completed lesson, saving the progress and then loading it should restore the completion status.

**Validates: Requirements 3.1, 3.2**

### Property 8: Chapter Progress Calculation

*For any* chapter, the completion percentage should equal (completed lessons / total lessons) * 100.

**Validates: Requirements 3.3**

### Property 9: Completed Lesson Indicator

*For any* lesson list, completed lessons should be marked with a check indicator.

**Validates: Requirements 3.4**

### Property 10: Progress Reset Completeness

*For any* progress data, when reset is triggered, all progress data should be deleted.

**Validates: Requirements 3.5**

### Property 11: HTML Parsing Element Extraction

*For any* HTML file, parsing should extract all titles, sections, and code blocks.

**Validates: Requirements 4.2**

### Property 12: Section to Lesson Conversion

*For any* HTML content with N sections, parsing should produce N lessons.

**Validates: Requirements 4.3**

### Property 13: Code Block Separation

*For any* code block in HTML, parsing should separate the code example from the description.

**Validates: Requirements 4.4**

### Property 14: JSON Output Structure

*For any* parsed content, the output should be valid JSON with all required fields (id, title, content, etc.).

**Validates: Requirements 4.5**

### Property 15: Validation Failure Hint Display

*For any* failed code validation, if a hint exists, the system should display the hint message.

**Validates: Requirements 5.4**

### Property 16: Responsive Layout Switching

*For any* screen width below 768px, the layout should switch to vertical orientation.

**Validates: Requirements 6.1, 6.2**

### Property 17: Layout Adaptation on Resize

*For any* screen size change, the layout should automatically adjust to the appropriate orientation.

**Validates: Requirements 6.4**

## Error Handling

### Content Parsing Errors

- **Missing HTML Files**: 시스템 시작 시 docs 폴더가 비어있거나 파일이 없으면 기본 샘플 레슨을 표시
- **Malformed HTML**: 파싱 실패 시 해당 섹션을 건너뛰고 로그에 경고 메시지 기록
- **Empty Sections**: 내용이 없는 섹션은 레슨으로 변환하지 않음

### Code Validation Errors

- **Invalid Regex**: 검증 패턴이 잘못된 경우 항상 성공으로 처리하고 경고 표시
- **Timeout**: 코드 검증이 5초 이상 걸리면 타임아웃 처리
- **Empty Code**: 빈 코드 제출 시 "코드를 작성해주세요" 메시지 표시

### Storage Errors

- **LocalStorage Full**: 저장 공간 부족 시 가장 오래된 진행 데이터 삭제
- **Corrupted Data**: 진행 데이터가 손상된 경우 초기화하고 사용자에게 알림
- **Access Denied**: LocalStorage 접근 불가 시 메모리 기반 임시 저장소 사용

### UI Errors

- **Component Render Failure**: Error Boundary로 감싸서 폴백 UI 표시
- **Navigation Errors**: 잘못된 경로 접근 시 홈으로 리다이렉트
- **Asset Loading Failure**: 이미지나 폰트 로딩 실패 시 기본 스타일 사용

## Testing Strategy

### Unit Testing

- **Content Parser**: HTML 파싱 로직, 섹션 추출, 코드 블록 추출 테스트
- **Code Validator**: 각 검증 타입(contains, exact, regex)별 테스트
- **Progress Tracker**: 저장, 로드, 초기화 기능 테스트
- **Utility Functions**: 날짜 포맷팅, 문자열 처리 등

### Property-Based Testing

프로퍼티 기반 테스트는 **fast-check** 라이브러리를 사용하여 구현합니다. 각 테스트는 최소 100회 반복 실행됩니다.

#### Property Test 1: Chapter Display Order
```typescript
// Feature: kotlin-learning-platform, Property 1: Chapter and Lesson Display
fc.assert(
  fc.property(
    fc.array(lessonGenerator, { minLength: 1 }),
    (lessons) => {
      const chapter = { id: 'test', title: 'Test', lessons, order: 1 };
      const displayed = displayLessons(chapter);
      return displayed.every((lesson, i) => lesson.order === i);
    }
  ),
  { numRuns: 100 }
);
```

#### Property Test 2: Progress Round Trip
```typescript
// Feature: kotlin-learning-platform, Property 2: Progress Persistence
fc.assert(
  fc.property(
    fc.array(fc.string(), { minLength: 1 }),
    (lessonIds) => {
      lessonIds.forEach(id => saveProgress(id));
      const loaded = loadProgress();
      return lessonIds.every(id => loaded.completedLessons.includes(id));
    }
  ),
  { numRuns: 100 }
);
```

#### Property Test 3: Code Validation Consistency
```typescript
// Feature: kotlin-learning-platform, Property 3: Code Validation Consistency
fc.assert(
  fc.property(
    fc.string(),
    fc.string(),
    (pattern, code) => {
      const lesson = { 
        validation: { type: 'contains', pattern } 
      };
      const result1 = validate(code, lesson);
      const result2 = validate(code, lesson);
      return result1.success === result2.success;
    }
  ),
  { numRuns: 100 }
);
```

#### Property Test 4: HTML Parsing Completeness
```typescript
// Feature: kotlin-learning-platform, Property 4: HTML Parsing Completeness
fc.assert(
  fc.property(
    fc.array(fc.record({ heading: fc.string(), content: fc.string() })),
    (sections) => {
      const html = sectionsToHtml(sections);
      const parsed = parseHtml(html);
      return parsed.length === sections.length;
    }
  ),
  { numRuns: 100 }
);
```

#### Property Test 5: Responsive Layout
```typescript
// Feature: kotlin-learning-platform, Property 5: Responsive Layout Adaptation
fc.assert(
  fc.property(
    fc.integer({ min: 320, max: 2560 }),
    (width) => {
      const layout = getLayout(width);
      if (width < 768) {
        return layout === 'vertical';
      } else {
        return layout === 'horizontal';
      }
    }
  ),
  { numRuns: 100 }
);
```

#### Property Test 6: Progress Calculation
```typescript
// Feature: kotlin-learning-platform, Property 6: Progress Calculation Accuracy
fc.assert(
  fc.property(
    fc.integer({ min: 1, max: 20 }),
    fc.integer({ min: 0, max: 20 }),
    (total, completed) => {
      fc.pre(completed <= total);
      const percentage = calculateProgress(completed, total);
      const expected = (completed / total) * 100;
      return Math.abs(percentage - expected) < 0.01;
    }
  ),
  { numRuns: 100 }
);
```

### Integration Testing

- **End-to-End Flow**: 챕터 선택 → 레슨 진행 → 코드 작성 → 검증 → 다음 레슨
- **Progress Persistence**: 페이지 새로고침 후 진행 상황 복원
- **Responsive Behavior**: 다양한 화면 크기에서 레이아웃 전환

### Manual Testing

- **UI/UX**: 애니메이션, 전환 효과, 사용자 피드백
- **Accessibility**: 키보드 네비게이션, 스크린 리더 호환성
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge

## UI/UX Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Header (Progress)                     │
├──────────────────────────┬──────────────────────────────┤
│                          │                              │
│    Lesson Content        │      Code Editor             │
│    (Scrollable)          │      (Monaco)                │
│                          │                              │
│    - Title               │      - Syntax Highlight      │
│    - Description         │      - Auto Indent           │
│    - Code Example        │      - Line Numbers          │
│    - Hint (if needed)    │                              │
│                          │      [Submit Button]         │
│                          │      [Reset Button]          │
│                          │                              │
│    [Previous] [Next]     │      [Validation Result]     │
│                          │                              │
└──────────────────────────┴──────────────────────────────┘
```

### Color Scheme (깔끔한 디자인)

```css
/* Light Mode */
--background: #ffffff
--foreground: #1a1a1a
--primary: #3b82f6      /* Blue */
--secondary: #64748b    /* Slate */
--accent: #10b981       /* Green */
--border: #e5e7eb
--code-bg: #f9fafb

/* Dark Mode */
--background: #0f172a
--foreground: #f1f5f9
--primary: #60a5fa
--secondary: #94a3b8
--accent: #34d399
--border: #334155
--code-bg: #1e293b
```

### Typography

- **Headings**: Inter (sans-serif)
- **Body**: Inter (sans-serif)
- **Code**: JetBrains Mono (monospace)

### Spacing

- **Container**: max-width: 1400px
- **Padding**: 1rem (mobile), 2rem (desktop)
- **Gap**: 1.5rem between sections

### Animations

- **Page Transitions**: 300ms ease-in-out
- **Button Hover**: 150ms ease
- **Success Feedback**: Confetti animation (lightweight)
- **Error Shake**: 500ms shake animation

## Performance Considerations

### Code Splitting

- 각 챕터를 별도 번들로 분리
- Monaco Editor는 dynamic import로 로드
- 이미지는 Next.js Image 컴포넌트로 최적화

### Caching

- 파싱된 콘텐츠는 빌드 타임에 JSON으로 생성
- Static Generation으로 모든 페이지 사전 렌더링
- LocalStorage로 진행 상황 캐싱

### Bundle Size

- Tailwind CSS purge로 미사용 스타일 제거
- Tree shaking으로 미사용 코드 제거
- 목표: Initial bundle < 200KB (gzipped)

## Deployment

### Build Process

```bash
npm run build
npm run export
```

### Static Hosting

- Vercel, Netlify, GitHub Pages 등에 배포 가능
- CDN을 통한 전 세계 배포
- HTTPS 기본 지원

### Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://kotlin-learning.com
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X (optional)
```

## Future Enhancements

- 사용자 계정 시스템 (로그인/회원가입)
- 서버 사이드 진행 상황 동기화
- 코드 실행 기능 (샌드박스 환경)
- 커뮤니티 기능 (댓글, 질문)
- 다국어 지원 (i18n)
- 학습 통계 및 분석
- 배지 및 성취 시스템
