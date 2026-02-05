const fs = require('fs');

function removeCommentedConsole(content) {
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // 주석 처리된 console 구문 시작을 찾음
    if (trimmed.startsWith('// console.')) {
      // 세미콜론으로 끝나지 않으면 여러 줄
      if (!trimmed.endsWith(';') && !trimmed.endsWith(');')) {
        // 여러 줄 console 구문 - 끝까지 스킵
        i++;
        while (i < lines.length) {
          const nextLine = lines[i].trim();
          
          // 빈 줄
          if (!nextLine) {
            i++;
            continue;
          }
          
          // 주석으로 시작하는 줄
          if (nextLine.startsWith('//')) {
            i++;
            // 세미콜론으로 끝나면 console 구문 끝
            if (nextLine.endsWith(');') || nextLine.endsWith('});')) {
              break;
            }
            continue;
          }
          
          // 닫는 괄호들
          if (nextLine.startsWith('}') || nextLine.startsWith(']') || nextLine.startsWith(')')) {
            i++;
            continue;
          }
          
          // console 구문이 아닌 다른 코드 시작
          break;
        }
        i++;
        continue;
      } else {
        // 단일 라인 console 구문
        i++;
        continue;
      }
    } else {
      result.push(line);
      i++;
    }
  }
  
  return result.join('\n');
}

const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf-8');
const newContent = removeCommentedConsole(content);
fs.writeFileSync(filePath, newContent, 'utf-8');
console.log(`Processed: ${filePath}`);
