import re
import sys

def remove_commented_console(content):
    """
    주석 처리된 console 구문들을 완전히 제거
    패턴:
    1. // console.log('...', {
         prop1: value1,
       });
    2. // console.log(
         "some text"
       );
    3. 단일 라인: // console.log(...);
    """
    lines = content.split('\n')
    result = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # 주석 처리된 console 구문 시작을 찾음
        if stripped.startswith('// console.'):
            # 여러 줄에 걸쳐 있는지 확인
            # 세미콜론이나 닫는 괄호로 끝나지 않으면 여러 줄
            if not (stripped.endswith(';') or stripped.endswith(');')):
                # 여러 줄 console 구문 - 끝까지 스킵
                i += 1
                while i < len(lines):
                    next_line = lines[i].strip()
                    # 빈 줄이 아니고 주석이 아니면 끝
                    if next_line and not next_line.startswith('//'):
                        # 닫는 괄호 찾기
                        if next_line.startswith('}') or next_line.startswith(']') or next_line.startswith(')'):
                            i += 1
                            continue
                        else:
                            break
                    # 주석으로 시작하는 줄 계속 스킵
                    if next_line.startswith('//'):
                        i += 1
                        # 세미콜론으로 끝나면 console 구문 끝
                        if next_line.endswith(');') or next_line.endswith('});'):
                            break
                    else:
                        break
                i += 1
                continue
            else:
                # 단일 라인 console 구문 - 이 줄만 스킵
                i += 1
                continue
        else:
            result.append(line)
            i += 1
    
    return '\n'.join(result)

if __name__ == '__main__':
    file_path = sys.argv[1]
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = remove_commented_console(content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Processed: {file_path}")
