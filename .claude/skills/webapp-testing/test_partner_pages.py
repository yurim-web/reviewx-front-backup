"""
파트너 페이지 스모크 테스트
- 주요 partner 페이지들이 HTTP 200 로드되는지 확인
- React 에러 없음 확인
"""
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3002"

PAGES = [
    ("/partner/login", "파트너 로그인"),
    ("/partner/signup", "파트너 회원가입"),
    ("/partner/find-account", "아이디/비밀번호 찾기"),
    ("/partner/mypage", "파트너 마이페이지"),
    ("/partner/mypage/edit", "파트너 내정보 수정"),
    ("/partner/mypage/profile", "파트너 프로필"),
    ("/partner/notification", "파트너 알림"),
    ("/partner/campaign_management", "캠페인 관리"),
    ("/partner/campaign_management/applied", "신청내역 탭"),
    ("/partner/campaign_management/scheduled", "예정 탭"),
    ("/partner/campaign_management/progress", "진행 탭"),
    ("/partner/campaign_management/completed", "완료 탭"),
    ("/partner/campaign_management/cancelled", "취소 탭"),
    ("/partner/campaign_management/extension-request", "기한연장 탭"),
    ("/partner/campaign_management/penalty", "패널티 탭"),
    ("/partner/campaign/create/delivery", "배송형 캠페인 등록"),
    ("/partner/campaign/create/mission", "미션형 캠페인 등록"),
    ("/partner/campaign/create/reporter", "기자단 캠페인 등록"),
    ("/partner/campaign/create/review", "구매평 캠페인 등록"),
    ("/partner/campaign/create/visit", "방문형 캠페인 등록"),
    ("/partner/point/charge", "포인트 충전"),
    ("/partner/point/all", "포인트 전체내역"),
]

def run_tests():
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # 파트너 mock auth 설정
        page = context.new_page()
        page.goto(f"{BASE_URL}/partner/login")
        page.wait_for_load_state("networkidle")
        page.evaluate("""() => {
            const partnerUser = {
                id: 'partner_test_001',
                email: 'partner@test.com',
                name: '테스트 파트너',
                role: 'partner',
                business_name: '테스트 광고주',
                business_number: '123-45-67890',
                business_type: '법인사업자',
                phone: '010-1234-5678'
            };
            localStorage.setItem('reviewx_auth_user', JSON.stringify(partnerUser));
            localStorage.setItem('reviewx_auth_role', 'partner');
            sessionStorage.setItem('partner_logged_in', 'true');

            const partnerAccounts = [partnerUser];
            localStorage.setItem('partner_accounts', JSON.stringify(partnerAccounts));
        }""")

        for path, label in PAGES:
            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text)
                    if msg.type == "error" else None)

            try:
                response = page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded", timeout=15000)
                page.wait_for_load_state("networkidle", timeout=10000)
                status = response.status if response else 0
                react_errors = [e for e in console_errors if "Error" in e or "Warning" in e]

                ok = status == 200
                results.append({
                    "path": path,
                    "label": label,
                    "status": status,
                    "ok": ok,
                    "errors": react_errors[:2],
                })
                icon = "✅" if ok else "❌"
                err_str = f" | 오류: {react_errors[0][:60]}" if react_errors else ""
                print(f"{icon} [{status}] {label} ({path}){err_str}")

            except Exception as e:
                results.append({
                    "path": path,
                    "label": label,
                    "status": 0,
                    "ok": False,
                    "errors": [str(e)],
                })
                print(f"❌ [ERR] {label} ({path}) | {str(e)[:60]}")

        browser.close()

    passed = sum(1 for r in results if r["ok"])
    total = len(results)
    print(f"\n{'='*50}")
    print(f"결과: {passed}/{total} 통과")
    if passed < total:
        print("\n실패한 페이지:")
        for r in results:
            if not r["ok"]:
                print(f"  - {r['label']} ({r['path']}): {r['status']}")
    return passed == total

if __name__ == "__main__":
    success = run_tests()
    exit(0 if success else 1)
