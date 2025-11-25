// Lesson validation types
export type ValidationType = 'contains' | 'exact' | 'regex';

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
  codeExample?: string;
  initialCode?: string;
  hint?: string;
  validation?: ValidationRule;
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
