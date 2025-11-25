# Requirements Document

## Introduction

크립토좀비(CryptoZombies) 스타일의 인터랙티브 코틀린 학습 플랫폼입니다. 사용자는 단계별로 코틀린 개념을 학습하고, 각 단계마다 코드를 작성하며 실시간 피드백을 받을 수 있습니다. docs 폴더의 모든 HTML 학습 자료를 자동으로 파싱하여 구조화된 학습 경험을 제공합니다. 현재 docs 폴더에는 코루틴, 코틀린 미래, 코틀린 DSL 관련 자료가 있으며, 향후 추가되는 모든 HTML 파일도 자동으로 학습 콘텐츠로 변환됩니다.

## Glossary

- **Learning Platform**: 사용자가 코틀린을 학습할 수 있는 웹 기반 플랫폼
- **Lesson**: 특정 주제에 대한 학습 단위 (예: 코루틴 기초)
- **Chapter**: 여러 레슨으로 구성된 학습 모듈 (예: 코루틴 챕터)
- **Code Editor**: 사용자가 코드를 작성할 수 있는 인터랙티브 에디터
- **Progress Tracker**: 사용자의 학습 진행 상황을 추적하는 시스템
- **Content Parser**: HTML 학습 자료를 파싱하여 구조화된 데이터로 변환하는 컴포넌트

## Requirements

### Requirement 1

**User Story:** 사용자로서, 코틀린 학습 자료를 단계별로 탐색하고 싶습니다. 그래야 체계적으로 학습할 수 있습니다.

#### Acceptance Criteria

1. WHEN 사용자가 플랫폼에 접속하면 THEN the Learning Platform SHALL 사용 가능한 모든 챕터 목록을 표시한다
2. WHEN 사용자가 챕터를 선택하면 THEN the Learning Platform SHALL 해당 챕터의 모든 레슨 목록을 표시한다
3. WHEN 사용자가 레슨을 선택하면 THEN the Learning Platform SHALL 레슨 내용과 코드 에디터를 표시한다
4. WHEN 레슨 내용이 표시되면 THEN the Learning Platform SHALL 학습 자료의 제목, 설명, 코드 예제를 포함한다
5. WHEN 사용자가 다음 레슨으로 이동하면 THEN the Learning Platform SHALL 현재 진행 상황을 저장한다

### Requirement 2

**User Story:** 사용자로서, 인터랙티브 코드 에디터에서 코틀린 코드를 작성하고 싶습니다. 그래야 실습하며 학습할 수 있습니다.

#### Acceptance Criteria

1. WHEN 사용자가 레슨 페이지에 접근하면 THEN the Code Editor SHALL 구문 강조 기능을 제공한다
2. WHEN 사용자가 코드를 입력하면 THEN the Code Editor SHALL 실시간으로 구문 강조를 업데이트한다
3. WHEN 사용자가 코드를 작성하면 THEN the Code Editor SHALL 자동 들여쓰기 기능을 제공한다
4. WHEN 사용자가 코드 실행 버튼을 클릭하면 THEN the Learning Platform SHALL 코드를 검증하고 결과를 표시한다
5. WHEN 코드 검증이 완료되면 THEN the Learning Platform SHALL 성공 또는 실패 메시지를 표시한다

### Requirement 3

**User Story:** 사용자로서, 학습 진행 상황을 추적하고 싶습니다. 그래야 어디까지 학습했는지 알 수 있습니다.

#### Acceptance Criteria

1. WHEN 사용자가 레슨을 완료하면 THEN the Progress Tracker SHALL 완료 상태를 로컬 스토리지에 저장한다
2. WHEN 사용자가 플랫폼에 재접속하면 THEN the Progress Tracker SHALL 이전 진행 상황을 복원한다
3. WHEN 챕터 목록이 표시되면 THEN the Learning Platform SHALL 각 챕터의 완료율을 표시한다
4. WHEN 레슨 목록이 표시되면 THEN the Learning Platform SHALL 완료된 레슨에 체크 표시를 한다
5. WHEN 사용자가 진행 상황을 초기화하면 THEN the Progress Tracker SHALL 모든 진행 데이터를 삭제한다

### Requirement 4

**User Story:** 사용자로서, HTML 학습 자료가 자동으로 구조화된 레슨으로 변환되기를 원합니다. 그래야 일관된 학습 경험을 얻을 수 있습니다.

#### Acceptance Criteria

1. WHEN 시스템이 시작되면 THEN the Content Parser SHALL docs 폴더의 모든 HTML 파일을 재귀적으로 검색하고 읽는다
2. WHEN HTML 파일을 읽으면 THEN the Content Parser SHALL 파일명, 제목, 모든 섹션, 모든 코드 블록을 추출한다
3. WHEN 콘텐츠를 파싱하면 THEN the Content Parser SHALL 각 HTML 파일을 챕터로, 각 주요 섹션을 개별 레슨으로 변환한다
4. WHEN 코드 블록을 발견하면 THEN the Content Parser SHALL 코드 예제와 설명을 분리한다
5. WHEN 파싱이 완료되면 THEN the Content Parser SHALL 구조화된 JSON 데이터를 생성한다

### Requirement 5

**User Story:** 사용자로서, 크립토좀비와 유사한 UI/UX를 경험하고 싶습니다. 그래야 친숙하고 재미있게 학습할 수 있습니다.

#### Acceptance Criteria

1. WHEN 페이지가 로드되면 THEN the Learning Platform SHALL 좌측에 학습 내용, 우측에 코드 에디터를 배치한다
2. WHEN 레슨 내용이 표시되면 THEN the Learning Platform SHALL 스크롤 가능한 컨테이너에 내용을 표시한다
3. WHEN 사용자가 레슨을 완료하면 THEN the Learning Platform SHALL 축하 애니메이션을 표시한다
4. WHEN 코드 검증이 실패하면 THEN the Learning Platform SHALL 힌트 메시지를 표시한다
5. WHEN 사용자가 다음 레슨 버튼을 클릭하면 THEN the Learning Platform SHALL 부드러운 전환 효과와 함께 다음 레슨으로 이동한다

### Requirement 6

**User Story:** 사용자로서, 반응형 디자인을 통해 다양한 기기에서 학습하고 싶습니다. 그래야 언제 어디서나 학습할 수 있습니다.

#### Acceptance Criteria

1. WHEN 화면 너비가 768px 미만이면 THEN the Learning Platform SHALL 레이아웃을 세로 방향으로 변경한다
2. WHEN 모바일 레이아웃이 활성화되면 THEN the Learning Platform SHALL 학습 내용과 코드 에디터를 상하로 배치한다
3. WHEN 터치 기기에서 접근하면 THEN the Learning Platform SHALL 터치 친화적인 버튼 크기를 제공한다
4. WHEN 화면 크기가 변경되면 THEN the Learning Platform SHALL 레이아웃을 자동으로 조정한다
5. WHEN 모바일에서 코드를 입력하면 THEN the Code Editor SHALL 가상 키보드와 호환되는 입력 방식을 제공한다

### Requirement 7

**User Story:** 개발자로서, Next.js 기반의 확장 가능한 아키텍처를 원합니다. 그래야 향후 기능 추가가 용이합니다.

#### Acceptance Criteria

1. WHEN 프로젝트를 설정하면 THEN the Learning Platform SHALL Next.js 14 이상의 App Router를 사용한다
2. WHEN 컴포넌트를 작성하면 THEN the Learning Platform SHALL TypeScript를 사용하여 타입 안정성을 보장한다
3. WHEN 스타일을 적용하면 THEN the Learning Platform SHALL Tailwind CSS를 사용한다
4. WHEN 상태 관리가 필요하면 THEN the Learning Platform SHALL React Context 또는 Zustand를 사용한다
5. WHEN 빌드를 실행하면 THEN the Learning Platform SHALL 정적 사이트로 내보내기가 가능하다
