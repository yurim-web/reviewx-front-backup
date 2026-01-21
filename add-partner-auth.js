/**
 * 파트너 페이지에 withPartnerAuth 추가하는 스크립트
 * Node.js로 실행: node add-partner-auth.js
 */

const fs = require('fs');
const path = require('path');

// 보호가 필요한 파트너 페이지 목록
const protectedPages = [
  'src/app/partner/notification/page.tsx',
  'src/app/partner/campaign/create/delivery/page.tsx',
  'src/app/partner/campaign/create/visit/page.tsx',
  'src/app/partner/campaign/create/review/page.tsx',
  'src/app/partner/campaign/create/reporter/page.tsx',
  'src/app/partner/campaign/create/mission/page.tsx',
  'src/app/partner/point/page.tsx',
  'src/app/partner/point/charge/page.tsx',
  'src/app/partner/mypage/edit/page.tsx',
];

protectedPages.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  파일 없음: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');

  // 이미 withPartnerAuth가 있는지 확인
  if (content.includes('withPartnerAuth')) {
    console.log(`✅ 이미 보호됨: ${filePath}`);
    return;
  }

  // import 추가
  if (!content.includes('import { withPartnerAuth }')) {
    // "use client" 다음 줄에 import 추가
    content = content.replace(
      /("use client";)/,
      '$1\n\nimport { withPartnerAuth } from "@/components/auth/withAuth";'
    );
  }

  // export default function을 function으로 변경
  const functionMatch = content.match(/export default function (\w+)/);
  if (functionMatch) {
    const functionName = functionMatch[1];
    content = content.replace(
      /export default function (\w+)/,
      'function $1'
    );

    // 파일 끝에 export 추가
    if (!content.trim().endsWith(`export default withPartnerAuth(${functionName});`)) {
      content = content.trimEnd() + `\n\n// 파트너 전용 페이지로 보호\nexport default withPartnerAuth(${functionName});\n`;
    }

    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ 보호 추가: ${filePath}`);
  } else {
    console.log(`⚠️  함수 찾기 실패: ${filePath}`);
  }
});

console.log('\n✨ 완료!');
