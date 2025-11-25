# Implementation Plan

- [x] 1. 프로젝트 초기 설정
  - Next.js 14 프로젝트 생성 (App Router)
  - TypeScript, Tailwind CSS, ESLint 설정
  - 프로젝트 폴더 구조 생성 (app, components, lib, types)
  - _Requirements: 7.1, 7.3_

- [x] 2. 타입 정의 및 데이터 모델
  - Lesson, Chapter, Progress 타입 정의
  - ValidationResult, ParsedContent 인터페이스 정의
  - _Requirements: 7.2_

- [x] 3. HTML 콘텐츠 파서 구현
  - [x] 3.1 HTML 파일 읽기 및 파싱 로직 구현
    - docs 폴더에서 모든 HTML 파일 재귀적으로 검색
    - 각 HTML 파일을 읽고 파일명 추출
    - cheerio 또는 jsdom으로 HTML 파싱
    - _Requirements: 4.1, 4.2_
  
  - [x] 3.2 섹션 및 코드 블록 추출
    - 제목(h1, h2, h3) 추출
    - 코드 블록(<pre><code>) 추출
    - 설명 텍스트 추출
    - _Requirements: 4.2, 4.4_
  
  - [x] 3.3 레슨 데이터 변환
    - 각 HTML 파일을 하나의 Chapter로 변환
    - 파일 내 섹션을 Lesson 객체로 변환
    - 모든 챕터를 하나의 ParsedContent로 통합
    - JSON 파일로 저장 (lib/content/lessons.json)
    - _Requirements: 4.3, 4.5_
  
  - [x] 3.4 Property test for HTML parsing
    - **Property 11: HTML Parsing Element Extraction**
    - **Validates: Requirements 4.2**
  
  - [x] 3.5 Property test for section conversion
    - **Property 12: Section to Lesson Conversion**
    - **Validates: Requirements 4.3**
  
  - [x] 3.6 Property test for code block separation
    - **Property 13: Code Block Separation**
    - **Validates: Requirements 4.4**
  
  - [x] 3.7 Property test for JSON output
    - **Property 14: JSON Output Structure**
    - **Validates: Requirements 4.5**

- [ ] 4. Progress Tracker 구현
  - [ ] 4.1 LocalStorage 기반 저장/로드 함수
    - saveProgress, loadProgress 함수 구현
    - 완료된 레슨 ID 배열 관리
    - _Requirements: 3.1, 3.2_
  
  - [ ] 4.2 진행률 계산 함수
    - 챕터별 완료율 계산
    - 전체 진행률 계산
    - _Requirements: 3.3_
  
  - [ ] 4.3 초기화 함수
    - 모든 진행 데이터 삭제
    - _Requirements: 3.5_
  
  - [ ] 4.4 Property test for progress persistence
    - **Property 7: Progress Persistence Round Trip**
    - **Validates: Requirements 3.1, 3.2**
  
  - [ ] 4.5 Property test for progress calculation
    - **Property 8: Chapter Progress Calculation**
    - **Validates: Requirements 3.3**
  
  - [ ] 4.6 Property test for progress reset
    - **Property 10: Progress Reset Completeness**
    - **Validates: Requirements 3.5**

- [ ] 5. Code Validator 구현
  - [ ] 5.1 검증 로직 구현
    - contains, exact, regex 검증 타입 구현
    - ValidationResult 반환
    - _Requirements: 2.4, 2.5_
  
  - [ ] 5.2 Property test for code validation
    - **Property 6: Code Validation Result Display**
    - **Validates: Requirements 2.4, 2.5**

- [ ] 6. UI 컴포넌트 - 레이아웃
  - [ ] 6.1 메인 레이아웃 컴포넌트
    - 좌우 분할 레이아웃 (데스크톱)
    - 상하 배치 (모바일)
    - 반응형 브레이크포인트 (768px)
    - _Requirements: 5.1, 6.1, 6.2_
  
  - [ ] 6.2 헤더 및 Progress Bar
    - 현재 챕터/레슨 표시
    - 진행률 바 표시
    - _Requirements: 3.3_
  
  - [ ] 6.3 Property test for responsive layout
    - **Property 16: Responsive Layout Switching**
    - **Validates: Requirements 6.1, 6.2**
  
  - [ ] 6.4 Property test for layout adaptation
    - **Property 17: Layout Adaptation on Resize**
    - **Validates: Requirements 6.4**

- [ ] 7. UI 컴포넌트 - 챕터 및 레슨 목록
  - [ ] 7.1 ChapterList 컴포넌트
    - 챕터 목록 표시
    - 완료율 표시
    - 챕터 선택 핸들러
    - _Requirements: 1.1, 3.3_
  
  - [ ] 7.2 LessonList 컴포넌트
    - 레슨 목록 표시
    - 완료 체크 표시
    - 레슨 선택 핸들러
    - _Requirements: 1.2, 3.4_
  
  - [ ] 7.3 Property test for chapter display
    - **Property 1: Chapter List Display Completeness**
    - **Validates: Requirements 1.1**
  
  - [ ] 7.4 Property test for lesson display
    - **Property 2: Lesson List Display for Selected Chapter**
    - **Validates: Requirements 1.2**
  
  - [ ] 7.5 Property test for completed lesson indicator
    - **Property 9: Completed Lesson Indicator**
    - **Validates: Requirements 3.4**

- [ ] 8. UI 컴포넌트 - 레슨 뷰어
  - [ ] 8.1 LessonViewer 컴포넌트
    - 레슨 제목, 내용 표시
    - 코드 예제 표시
    - 스크롤 가능한 컨테이너
    - _Requirements: 1.3, 1.4, 5.2_
  
  - [ ] 8.2 네비게이션 버튼
    - 이전/다음 레슨 버튼
    - 부드러운 전환 효과
    - _Requirements: 1.5, 5.5_
  
  - [ ] 8.3 Property test for lesson content display
    - **Property 3: Lesson Content Display**
    - **Validates: Requirements 1.3**
  
  - [ ] 8.4 Property test for content completeness
    - **Property 4: Lesson Content Completeness**
    - **Validates: Requirements 1.4**
  
  - [ ] 8.5 Property test for progress saving
    - **Property 5: Progress Saving on Navigation**
    - **Validates: Requirements 1.5**

- [ ] 9. UI 컴포넌트 - 코드 에디터
  - [ ] 9.1 Monaco Editor 통합
    - Monaco Editor 설치 및 설정
    - 동적 import로 번들 크기 최적화
    - _Requirements: 2.1_
  
  - [ ] 9.2 CodeEditor 컴포넌트
    - 구문 강조 (Kotlin 언어)
    - 자동 들여쓰기
    - 코드 변경 핸들러
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ] 9.3 제출 및 리셋 버튼
    - 코드 제출 버튼
    - 코드 리셋 버튼
    - _Requirements: 2.4_
  
  - [ ] 9.4 검증 결과 표시
    - 성공/실패 메시지
    - 힌트 표시 (실패 시)
    - _Requirements: 2.5, 5.4_
  
  - [ ] 9.5 Property test for hint display
    - **Property 15: Validation Failure Hint Display**
    - **Validates: Requirements 5.4**

- [ ] 10. 상태 관리
  - [ ] 10.1 React Context 설정
    - LearningContext 생성
    - 현재 챕터/레슨 상태 관리
    - 진행 상황 상태 관리
    - _Requirements: 7.4_
  
  - [ ] 10.2 커스텀 훅
    - useProgress 훅
    - useLesson 훅
    - useCodeValidation 훅
    - _Requirements: 7.4_

- [ ] 11. 페이지 구현
  - [ ] 11.1 홈 페이지 (/)
    - 챕터 목록 표시
    - 전체 진행률 표시
    - _Requirements: 1.1_
  
  - [ ] 11.2 챕터 페이지 (/chapter/[id])
    - 레슨 목록 표시
    - 챕터 정보 표시
    - _Requirements: 1.2_
  
  - [ ] 11.3 레슨 페이지 (/lesson/[id])
    - 레슨 뷰어 + 코드 에디터
    - 좌우 분할 레이아웃
    - _Requirements: 1.3, 5.1_

- [ ] 12. 스타일링 및 애니메이션
  - [ ] 12.1 Tailwind CSS 테마 설정
    - 컬러 팔레트 정의
    - 다크 모드 설정
    - 타이포그래피 설정
    - _Requirements: 7.3_
  
  - [ ] 12.2 애니메이션 구현
    - 페이지 전환 애니메이션
    - 레슨 완료 축하 애니메이션
    - 버튼 호버 효과
    - _Requirements: 5.3, 5.5_

- [ ] 13. 빌드 및 최적화
  - [ ] 13.1 정적 사이트 생성 설정
    - next.config.js 설정
    - 모든 페이지 사전 렌더링
    - _Requirements: 7.5_
  
  - [ ] 13.2 번들 크기 최적화
    - 코드 스플리팅
    - 이미지 최적화
    - Tailwind CSS purge
    - _Requirements: 7.5_

- [ ] 14. Checkpoint - 모든 테스트 통과 확인
  - 모든 테스트가 통과하는지 확인
  - 사용자에게 질문이 있으면 문의

- [ ] 15. 문서화 및 배포 준비
  - [ ] 15.1 README 작성
    - 프로젝트 소개
    - 설치 및 실행 방법
    - 빌드 및 배포 방법
  
  - [ ] 15.2 환경 변수 설정
    - .env.example 파일 생성
    - 필요한 환경 변수 문서화
  
  - [ ] 15.3 .gitignore 파일 생성
    - node_modules, .next, out 폴더 제외
    - 환경 변수 파일 (.env.local) 제외
    - IDE 설정 파일 제외
    - 빌드 결과물 제외
