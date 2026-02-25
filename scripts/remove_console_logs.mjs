import fs from 'fs';
import path from 'path';

const base = 'C:/develop/reviewx-web';

// console.log/warn 제거 대상 파일 (console.error는 catch 블록에서 유지)
const files = [
  'src/data/manager_ga/member/partners.ts',
  'src/data/manager_ga/member/reviewers.ts',
  'src/data/manager_ga/progress.ts',
];

let modified = 0;

for (const rel of files) {
  const full = path.join(base, rel);
  try {
    const original = fs.readFileSync(full, 'utf-8');
    const lines = original.split('\n');

    const fixed_lines = lines.filter(line => {
      // console.log 또는 console.warn 로 시작하는 독립 라인만 제거
      // console.error는 유지
      return !/^\s*console\.(log|warn)\(/.test(line);
    });

    const fixed = fixed_lines.join('\n');

    if (fixed !== original) {
      const removed = lines.length - fixed_lines.length;
      fs.writeFileSync(full, fixed, 'utf-8');
      modified++;
      console.log(`✅ 수정 (${removed}줄 제거): ${rel}`);
    } else {
      console.log(`⏭  변경 없음: ${rel}`);
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log(`❌ 파일 없음: ${rel}`);
    } else {
      console.log(`❌ 오류 (${rel}): ${e.message}`);
    }
  }
}

console.log(`\n총 ${modified}개 파일 수정 완료`);
