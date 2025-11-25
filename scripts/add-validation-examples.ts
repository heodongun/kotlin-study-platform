import * as fs from 'fs';
import * as path from 'path';

// lessons.json에 검증 예제 추가
const lessonsPath = path.join(process.cwd(), 'lib/content/lessons.json');
const lessonsData = JSON.parse(fs.readFileSync(lessonsPath, 'utf-8'));

// 첫 번째 챕터의 몇 가지 레슨에 validation 추가
if (lessonsData.chapters.length > 0) {
  const firstChapter = lessonsData.chapters[0];
  
  // 레슨 1: suspend 함수 작성하기
  if (firstChapter.lessons.length > 1) {
    firstChapter.lessons[1] = {
      ...firstChapter.lessons[1],
      initialCode: `// suspend 함수를 작성해보세요
// fetchUser 함수를 만들고, delay(1000)을 사용하세요

`,
      validation: {
        type: 'contains',
        pattern: 'suspend fun fetchUser',
        message: '정답입니다! suspend 함수를 올바르게 작성했습니다. 🎉'
      },
      hint: 'suspend 키워드를 함수 앞에 붙이고, delay() 함수를 사용해보세요.'
    };
  }

  // 레슨 2: launch 코루틴 빌더 사용하기
  if (firstChapter.lessons.length > 6) {
    firstChapter.lessons[6] = {
      ...firstChapter.lessons[6],
      initialCode: `// GlobalScope.launch를 사용하여 코루틴을 시작해보세요
// "코루틴 시작"을 출력하세요

`,
      validation: {
        type: 'contains',
        pattern: 'GlobalScope.launch',
        message: '정답입니다! 코루틴을 성공적으로 시작했습니다. 🎉'
      },
      hint: 'GlobalScope.launch { } 블록 안에 코드를 작성하세요.'
    };
  }
}

// 저장
fs.writeFileSync(lessonsPath, JSON.stringify(lessonsData, null, 2), 'utf-8');
console.log('✅ Validation examples added to lessons.json');
