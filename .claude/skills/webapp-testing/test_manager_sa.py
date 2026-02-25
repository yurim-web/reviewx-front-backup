from playwright.sync_api import sync_playwright
import os

BASE_URL = "http://localhost:3002"

PAGES = [
    ("/manager_sa", "대시보드"),
    ("/manager_sa/campaign/progress", "캠페인 진행 현황"),
    ("/manager_sa/member/admins", "관리자 목록"),
    ("/manager_sa/member/blacklist", "차단 이력"),
    ("/manager_sa/member/partners", "파트너 목록"),
    ("/manager_sa/member/reviewers", "리뷰어 목록"),
    ("/manager_sa/settlement/withdrawal", "출금 현황"),
    ("/manager_sa/settlement/withdrawal_request", "출금 요청"),
    ("/manager_sa/settlement/payment_history", "결제 내역"),
]

SCREENSHOT_DIR = "/tmp/manager_sa_screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

results = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    for path, name in PAGES:
        url = BASE_URL + path
        print(f"\n[테스트] {name} ({url})")

        try:
            response = page.goto(url, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=15000)

            # 오류 텍스트 감지
            body_text = page.inner_text("body")
            has_error = any(kw in body_text for kw in [
                "Application error",
                "Error:",
                "Unhandled Runtime Error",
                "404",
                "500",
            ])

            # 스크린샷
            safe_name = name.replace(" ", "_").replace("/", "_")
            shot_path = f"{SCREENSHOT_DIR}/{safe_name}.png"
            page.screenshot(path=shot_path, full_page=False)

            status = "❌ ERROR" if has_error else "✅ OK"
            results.append((name, status, shot_path))
            print(f"  {status} - 스크린샷: {shot_path}")

            if has_error:
                # 에러 내용 일부 출력
                lines = [l.strip() for l in body_text.splitlines() if l.strip()]
                print(f"  오류 내용: {' | '.join(lines[:5])}")

        except Exception as e:
            results.append((name, f"❌ EXCEPTION: {e}", ""))
            print(f"  ❌ EXCEPTION: {e}")

    browser.close()

print("\n\n========== 결과 요약 ==========")
for name, status, shot in results:
    print(f"  {status}  {name}")
print("================================")
