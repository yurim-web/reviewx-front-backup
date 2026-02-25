"""
manager_ga 영역 스모크 테스트
- 7개 주요 페이지 렌더링 확인
- 콘솔 에러 수집
- 스크린샷 저장
"""

import os
from playwright.sync_api import sync_playwright

PAGES = [
    ("대시보드",       "http://localhost:3002/manager_ga"),
    ("리뷰어 목록",    "http://localhost:3002/manager_ga/member/reviewers"),
    ("파트너 목록",    "http://localhost:3002/manager_ga/member/partners"),
    ("블랙리스트",     "http://localhost:3002/manager_ga/member/blacklist"),
    ("게시글",         "http://localhost:3002/manager_ga/community/posts"),
    ("캠페인 현황",    "http://localhost:3002/manager_ga/campaign/progress"),
    ("알림",           "http://localhost:3002/manager_ga/notification"),
]

SCREENSHOT_DIR = "/tmp/manager_ga_screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

results = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900})

    for name, url in PAGES:
        page = context.new_page()
        console_errors = []

        # 콘솔 에러 캡처
        page.on("console", lambda msg: console_errors.append(msg.text)
                if msg.type == "error" else None)

        try:
            response = page.goto(url, wait_until="domcontentloaded", timeout=15000)
            page.wait_for_load_state("networkidle", timeout=10000)

            status = response.status if response else 0
            title = page.title()
            body_text = page.locator("body").inner_text()
            is_empty = len(body_text.strip()) < 50

            # 스크린샷
            safe_name = name.replace(" ", "_")
            shot_path = f"{SCREENSHOT_DIR}/{safe_name}.png"
            page.screenshot(path=shot_path, full_page=True)

            results.append({
                "name": name,
                "url": url,
                "status": status,
                "title": title,
                "is_empty": is_empty,
                "console_errors": console_errors[:5],  # 최대 5개만
                "screenshot": shot_path,
                "ok": status < 400 and not is_empty and len(console_errors) == 0,
            })

        except Exception as e:
            results.append({
                "name": name,
                "url": url,
                "status": -1,
                "error": str(e),
                "console_errors": console_errors,
                "ok": False,
            })
        finally:
            page.close()

    browser.close()

# 결과 출력
print("\n" + "=" * 60)
print("  manager_ga 스모크 테스트 결과")
print("=" * 60)

all_ok = True
for r in results:
    icon = "✅" if r.get("ok") else "❌"
    print(f"\n{icon} [{r['name']}]  {r['url']}")
    if r.get("status") != -1:
        print(f"   HTTP 상태: {r.get('status')}")
        print(f"   빈 화면:   {'YES ⚠' if r.get('is_empty') else 'No'}")
        errs = r.get("console_errors", [])
        if errs:
            print(f"   콘솔 에러: {len(errs)}개")
            for e in errs:
                print(f"     - {e[:120]}")
        else:
            print("   콘솔 에러: 없음")
        print(f"   스크린샷:  {r.get('screenshot')}")
    else:
        print(f"   오류:      {r.get('error')}")

    if not r.get("ok"):
        all_ok = False

print("\n" + "=" * 60)
if all_ok:
    print("  🎉 모든 페이지 정상 (7/7)")
else:
    fail_count = sum(1 for r in results if not r.get("ok"))
    print(f"  ⚠  {fail_count}개 페이지 문제 발생")
print("=" * 60 + "\n")
