#!/bin/bash

###############################################################################
# Reviewer-MCP 자동 설치 스크립트
#
# 이 스크립트는 Reviewer-MCP를 자동으로 설치하고 설정합니다.
# Confluence 문서 기반: https://markx.atlassian.net/wiki/spaces/MarkX/pages/19562504
###############################################################################

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로깅 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 제목 출력
print_header() {
    echo ""
    echo "======================================================================"
    echo "  📦 Reviewer-MCP 자동 설치 스크립트"
    echo "======================================================================"
    echo ""
}

# OS 감지
detect_os() {
    case "$(uname -s)" in
        Linux*)     OS="Linux";;
        Darwin*)    OS="Mac";;
        CYGWIN*|MINGW*|MSYS*)    OS="Windows";;
        *)          OS="Unknown";;
    esac
    log_info "감지된 OS: $OS"
}

# 1. Bun 설치 확인 및 설치
install_bun() {
    log_info "Step 1/5: Bun 설치 확인 중..."

    if command -v bun &> /dev/null; then
        BUN_VERSION=$(bun --version)
        log_success "Bun이 이미 설치되어 있습니다. (버전: $BUN_VERSION)"
    else
        log_warning "Bun이 설치되어 있지 않습니다. 설치를 시작합니다..."

        # Bun 설치
        curl -fsSL https://bun.sh/install | bash

        # 환경 변수 설정
        export BUN_INSTALL="$HOME/.bun"
        export PATH="$BUN_INSTALL/bin:$PATH"

        # shell rc 파일에 추가
        SHELL_RC=""
        if [ -f "$HOME/.bashrc" ]; then
            SHELL_RC="$HOME/.bashrc"
        elif [ -f "$HOME/.zshrc" ]; then
            SHELL_RC="$HOME/.zshrc"
        fi

        if [ -n "$SHELL_RC" ]; then
            if ! grep -q "BUN_INSTALL" "$SHELL_RC"; then
                echo '' >> "$SHELL_RC"
                echo '# Bun' >> "$SHELL_RC"
                echo 'export BUN_INSTALL="$HOME/.bun"' >> "$SHELL_RC"
                echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> "$SHELL_RC"
                log_success "환경 변수가 $SHELL_RC에 추가되었습니다."
            fi
        fi

        # 설치 확인
        if command -v bun &> /dev/null; then
            BUN_VERSION=$(bun --version)
            log_success "Bun 설치 완료! (버전: $BUN_VERSION)"
        else
            log_error "Bun 설치에 실패했습니다."
            exit 1
        fi
    fi
}

# 2. reviewer-mcp 리포지토리 클론
clone_reviewer_mcp() {
    log_info "Step 2/5: reviewer-mcp 리포지토리 클론 중..."

    REVIEWER_MCP_DIR="$HOME/reviewer-mcp"

    if [ -d "$REVIEWER_MCP_DIR" ]; then
        log_warning "reviewer-mcp 디렉토리가 이미 존재합니다."
        read -p "기존 디렉토리를 삭제하고 다시 클론하시겠습니까? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$REVIEWER_MCP_DIR"
            log_info "기존 디렉토리를 삭제했습니다."
        else
            log_info "기존 디렉토리를 유지합니다."
            return
        fi
    fi

    cd "$HOME"
    git clone https://github.com/marchellodev/reviewer-mcp.git
    log_success "reviewer-mcp 클론 완료!"
}

# 3. 의존성 설치
install_dependencies() {
    log_info "Step 3/5: 의존성 설치 중..."

    cd "$HOME/reviewer-mcp"

    # PATH에 Bun 추가 (현재 세션용)
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"

    bun install
    log_success "의존성 설치 완료!"
}

# 4. cursor-tools 설치
install_cursor_tools() {
    log_info "Step 4/5: cursor-tools 설치 확인 중..."

    if command -v cursor-tools &> /dev/null; then
        CURSOR_TOOLS_VERSION=$(cursor-tools --version 2>&1 | grep -oP '(?<=version )\S+' || echo "unknown")
        log_success "cursor-tools가 이미 설치되어 있습니다. (버전: $CURSOR_TOOLS_VERSION)"
    else
        log_warning "cursor-tools가 설치되어 있지 않습니다. 설치를 시작합니다..."
        npm install -g cursor-tools
        log_success "cursor-tools 설치 완료!"
    fi
}

# 5. Claude Code MCP 설정
configure_claude_mcp() {
    log_info "Step 5/5: Claude Code MCP 설정 중..."

    CLAUDE_DIR="$HOME/.claude"
    MCP_CONFIG="$CLAUDE_DIR/mcp_config.json"

    # .claude 디렉토리 생성
    mkdir -p "$CLAUDE_DIR"

    # 사용자명 및 경로 감지
    USERNAME=$(whoami)

    # OS별 경로 설정
    case "$OS" in
        Windows)
            REVIEWER_PATH="/c/Users/$USERNAME/reviewer-mcp/index.ts"
            ;;
        Mac)
            REVIEWER_PATH="/Users/$USERNAME/reviewer-mcp/index.ts"
            ;;
        Linux)
            REVIEWER_PATH="/home/$USERNAME/reviewer-mcp/index.ts"
            ;;
    esac

    # mcp_config.json 생성 또는 업데이트
    if [ -f "$MCP_CONFIG" ]; then
        log_warning "기존 mcp_config.json 파일이 존재합니다."

        # 백업 생성
        cp "$MCP_CONFIG" "$MCP_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
        log_info "기존 설정을 백업했습니다."

        # reviewer-mcp 설정 추가 또는 업데이트
        if grep -q "reviewer-mcp" "$MCP_CONFIG"; then
            log_info "기존 reviewer-mcp 설정을 업데이트합니다."
        else
            log_info "reviewer-mcp 설정을 추가합니다."
        fi
    fi

    # mcp_config.json 작성
    cat > "$MCP_CONFIG" << EOF
{
  "mcpServers": {
    "reviewer-mcp": {
      "command": "bun",
      "args": ["run", "$REVIEWER_PATH"],
      "env": {
        "CURSOR_TOOLS_PATH": "cursor-tools"
      }
    }
  }
}
EOF

    log_success "MCP 설정 파일 생성 완료!"
    log_info "설정 파일 위치: $MCP_CONFIG"
}

# 6. 설치 검증
verify_installation() {
    echo ""
    log_info "설치 검증 중..."
    echo ""

    # Bun 확인
    if command -v bun &> /dev/null; then
        echo -e "  ✅ Bun: $(bun --version)"
    else
        echo -e "  ❌ Bun: 설치되지 않음"
    fi

    # reviewer-mcp 확인
    if [ -d "$HOME/reviewer-mcp" ]; then
        echo -e "  ✅ reviewer-mcp: 설치됨"
    else
        echo -e "  ❌ reviewer-mcp: 설치되지 않음"
    fi

    # cursor-tools 확인
    if command -v cursor-tools &> /dev/null; then
        echo -e "  ✅ cursor-tools: $(cursor-tools --version 2>&1 | head -1)"
    else
        echo -e "  ❌ cursor-tools: 설치되지 않음"
    fi

    # MCP 설정 확인
    if [ -f "$HOME/.claude/mcp_config.json" ]; then
        echo -e "  ✅ MCP 설정: 완료"
    else
        echo -e "  ❌ MCP 설정: 미완료"
    fi

    echo ""
}

# 7. 다음 단계 안내
show_next_steps() {
    echo ""
    echo "======================================================================"
    echo "  🎉 설치가 완료되었습니다!"
    echo "======================================================================"
    echo ""
    echo "다음 단계:"
    echo ""
    echo "1. 터미널을 재시작하거나 다음 명령을 실행하세요:"
    echo "   ${GREEN}source ~/.bashrc${NC}  (또는 source ~/.zshrc)"
    echo ""
    echo "2. Gemini API 키 설정:"
    echo "   ${GREEN}cursor-tools install${NC}"
    echo "   - Google AI Studio에서 무료 API 키를 발급받아 입력하세요"
    echo "   - https://aistudio.google.com/"
    echo ""
    echo "3. Claude Code를 재시작하세요"
    echo ""
    echo "4. 설치 테스트:"
    echo "   ${GREEN}cd ~/reviewer-mcp && bun run index.ts${NC}"
    echo ""
    echo "5. Confluence 문서를 참고하세요:"
    echo "   - 설치 가이드: https://markx.atlassian.net/wiki/spaces/MarkX/pages/19562504"
    echo "   - 사용 가이드: https://markx.atlassian.net/wiki/spaces/MarkX/pages/20021249"
    echo ""
    echo "======================================================================"
    echo ""
}

# 메인 실행
main() {
    print_header
    detect_os

    echo ""
    read -p "설치를 시작하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "설치를 취소했습니다."
        exit 0
    fi

    echo ""

    install_bun
    echo ""

    clone_reviewer_mcp
    echo ""

    install_dependencies
    echo ""

    install_cursor_tools
    echo ""

    configure_claude_mcp
    echo ""

    verify_installation
    show_next_steps
}

# 스크립트 실행
main
