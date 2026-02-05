# Node.js 경로 오류 해결 가이드

## 문제 상황
Cursor의 Claude 기능에서 `/usr/bin/node: No such file or directory` 오류가 발생하는 경우

이 오류는 Cursor의 Claude가 Bash 명령어를 실행할 때 Windows 환경에서 Linux 경로를 찾으려고 해서 발생합니다.

## 해결 방법

### 방법 1: NVM-Windows 설치 (권장)

Windows에서는 nvm-windows를 사용합니다.

#### 1단계: nvm-windows 다운로드 및 설치
1. [nvm-windows GitHub 릴리스 페이지](https://github.com/coreybutler/nvm-windows/releases)에서 최신 버전 다운로드
2. `nvm-setup.exe` 파일을 실행하여 설치
3. 설치 후 **관리자 권한으로** PowerShell을 다시 시작

#### 2단계: Node.js LTS 버전 설치
PowerShell에서 실행:
```powershell
nvm install lts
nvm use lts
```

#### 3단계: 설치 확인
```powershell
node --version
npm --version
nvm version
```

### 방법 2: WSL에 Node.js 설치 (WSL 사용 시)

WSL을 사용하는 경우:

```bash
# WSL 터미널에서 실행
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

### 방법 3: Cursor Claude 설정 변경 (가장 빠른 해결책)

Cursor의 Claude 기능이 Bash 대신 PowerShell을 사용하도록 설정:

1. `Ctrl + ,`로 설정 열기
2. "claude" 또는 "terminal" 검색
3. `terminal.integrated.defaultProfile.windows`를 "PowerShell"로 설정
4. Cursor 완전히 재시작 (모든 창 닫고 다시 열기)

또는 Cursor 설정 파일 직접 수정:
- `Ctrl + Shift + P` → "Preferences: Open User Settings (JSON)"
- 다음 추가:
```json
{
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

### 방법 4: 기존 Node.js 경로 확인

현재 Node.js가 설치되어 있는 경우:
```powershell
where.exe node
```

경로가 `C:\Program Files\nodejs\`에 있다면 정상입니다.

## 참고사항

- Windows에서는 Linux의 `/usr/bin/node` 경로가 존재하지 않습니다
- Cursor의 Claude 기능이 bash를 사용할 때 이 오류가 발생할 수 있습니다
- PowerShell을 사용하면 대부분의 경우 문제가 해결됩니다

