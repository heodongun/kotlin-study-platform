// Lesson validation types
export type ValidationType = 'contains' | 'exact' | 'regex' | 'notContains';

export interface ValidationRule {
  type: ValidationType;
  pattern: string;
  message: string;
}

// Lesson model
export interface Lesson {
  id: string;
  title: string;
  content: string;
  arc?: string; // 이야기/세부 트랙 구분
  story?: string; // 크립토좀비 스타일 서사
  codeExample?: string;
  initialCode?: string;
  hint?: string;
  continueFrom?: string; // 이전 레슨 코드와 이어 붙일 때 사용
  validation?: ValidationRule;
  checkpointMessage?: string;
  order: number;
}

// Chapter model
export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

// Progress model
export interface Progress {
  completedLessons: string[];
  currentChapter: string;
  currentLesson: string;
  lastUpdated: string;
}

// Validation result
export interface ValidationResult {
  success: boolean;
  message: string;
  hint?: string;
}

// Parsed content structure
export interface ParsedContent {
  chapters: Chapter[];
}

// HTML parsing intermediate types
export interface Section {
  heading: string;
  level: number;
  content: string;
  codeBlocks: CodeBlock[];
}

export interface CodeBlock {
  language: string;
  code: string;
}
