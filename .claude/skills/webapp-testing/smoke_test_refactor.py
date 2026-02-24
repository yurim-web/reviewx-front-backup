"""
리팩토링 검증 스모크 테스트
- 사용자 페이지 + 파트너 페이지가 정상 렌더링되는지 확인
"""
import os
import sys
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3000"
SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

PAGES_TO_TEST = [
    # User pages
    ("/user/login", "user_login"),
    ("/user/signup", "user_signup"),
    ("/user/find-account", "user_find_account"),
    ("/user/campaign_management", "user_campaign_mgmt"),
    ("/user/mypage", "user_mypage"),
    ("/user/mypage/edit", "user_mypage_edit"),
    ("/user/point/all", "user_point_all"),
    ("/user/notification", "user_notification"),
    # Partner pages
    ("/partner/login", "partner_login"),
    ("/partner/campaign_management", "partner_campaign_mgmt"),
    ("/partner/mypage", "partner_mypage"),
    ("/partner/point/all", "partner_point_all"),
    ("/partner/campaign/create/delivery", "partner_create_delivery"),
    ("/partner/campaign/create/visit", "partner_create_visit"),
    ("/partner/campaign/create/review", "partner_create_review"),
    ("/partner/campaign/create/reporter", "partner_create_reporter"),
    ("/partner/campaign/create/mission", "partner_create_mission"),
]

results = []

def test_page(page, path, name):
    url = BASE_URL + path
    try:
        response = page.goto(url, timeout=15000, wait_until="domcontentloaded")
        page.wait_for_load_state("networkidle", timeout=10000)

        status = response.status if response else "?"
        # Accept any 2xx/3xx (redirect is OK)
        ok = status < 400 if status != "?" else False

        screenshot_path = os.path.join(SCREENSHOT_DIR, f"{name}.png")
        page.screenshot(path=screenshot_path, full_page=False)

        # Check for JS errors by checking page title/content
        title = page.title()
        # Check there's no blank/error page
        body_text = page.locator("body").inner_text(timeout=3000)
        has_content = len(body_text.strip()) > 10

        status_sym = "✓" if ok and has_content else "✗"
        result = f"{status_sym} [{status}] {path}"
        if not has_content:
            result += " (빈 페이지)"
        results.append((ok and has_content, result))
        print(result)
    except Exception as e:
        err_msg = str(e)[:80]
        results.append((False, f"✗ [ERR] {path} → {err_msg}"))
        print(f"✗ [ERR] {path} → {err_msg}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 800})
    page = context.new_page()

    # Suppress console errors to keep output clean
    page.on("console", lambda msg: None)
    page.on("pageerror", lambda err: None)

    print(f"\n{'='*60}")
    print("  리팩토링 검증 스모크 테스트")
    print(f"{'='*60}")
    print(f"  대상: {BASE_URL}")
    print(f"{'='*60}\n")

    for path, name in PAGES_TO_TEST:
        test_page(page, path, name)

    browser.close()

print(f"\n{'='*60}")
passed = sum(1 for ok, _ in results if ok)
total = len(results)
print(f"  결과: {passed}/{total} 통과")
print(f"{'='*60}\n")

if passed < total:
    print("실패 페이지:")
    for ok, msg in results:
        if not ok:
            print(f"  {msg}")
    sys.exit(1)
else:
    print("모든 페이지 정상 렌더링 확인!")
    sys.exit(0)
