"""
파트너 캠페인 등록 페이지 리팩토링 테스트
Phase 1 + Phase 2 검증
"""
from playwright.sync_api import sync_playwright, Page
import json
import sys

def test_campaign_create_page(page: Page, url: str, campaign_type: str):
    """캠페인 등록 페이지 테스트"""
    print(f"\n{'='*60}")
    print(f"🧪 테스트: {campaign_type} 캠페인 등록 페이지")
    print(f"{'='*60}")

    errors = []
    console_errors = []

    # 콘솔 에러 캡처
    page.on("console", lambda msg:
        console_errors.append(f"{msg.type()}: {msg.text()}")
        if msg.type() in ["error", "warning"]
    )

    try:
        # 1. 페이지 접속
        print(f"📍 접속: {url}")
        page.goto(url, wait_until='networkidle', timeout=30000)
        print("✅ 페이지 로딩 완료")

        # 2. 페이지 타이틀 확인
        title = page.title()
        print(f"📄 페이지 타이틀: {title}")

        # 3. 콘솔 에러 확인
        if console_errors:
            print(f"⚠️ 콘솔 메시지 ({len(console_errors)}개):")
            for err in console_errors[:5]:  # 처음 5개만
                print(f"  - {err}")
        else:
            print("✅ 콘솔 에러 없음")

        # 4. 주요 요소 존재 확인
        print("\n🔍 주요 요소 확인:")

        # 헤더 확인
        header = page.locator('header').first
        if header.is_visible():
            print("  ✅ 헤더 존재")
        else:
            errors.append("헤더 없음")
            print("  ❌ 헤더 없음")

        # 페이지 제목 확인
        page_title = page.locator('h1, h2').first
        if page_title.is_visible():
            title_text = page_title.text_content()
            print(f"  ✅ 페이지 제목: {title_text}")
        else:
            print("  ⚠️ 페이지 제목 없음")

        # 폼 존재 확인
        form = page.locator('form').first
        if form.is_visible():
            print("  ✅ 폼 존재")
        else:
            errors.append("폼 없음")
            print("  ❌ 폼 없음")

        # 5. localStorage 확인
        print("\n💾 localStorage 확인:")
        local_storage = page.evaluate("() => Object.keys(localStorage)")
        print(f"  저장된 키: {local_storage}")

        # 파트너 계정 정보 확인
        partner_accounts = page.evaluate("() => localStorage.getItem('partner_accounts')")
        if partner_accounts:
            print("  ✅ partner_accounts 존재")
        else:
            print("  ⚠️ partner_accounts 없음 (로그인 필요)")

        # 6. 스크린샷 캡처
        screenshot_path = f'test-screenshots/{campaign_type}-campaign-create.png'
        page.screenshot(path=screenshot_path, full_page=False)
        print(f"\n📸 스크린샷 저장: {screenshot_path}")

        # 7. 결과 요약
        print(f"\n{'='*60}")
        if errors:
            print(f"❌ 테스트 실패 ({len(errors)}개 오류)")
            for err in errors:
                print(f"  - {err}")
            return False
        else:
            print("✅ 테스트 통과")
            return True

    except Exception as e:
        print(f"\n❌ 예외 발생: {str(e)}")
        return False

def main():
    """메인 테스트 실행"""
    print("\n" + "="*60)
    print("🚀 파트너 캠페인 등록 페이지 리팩토링 테스트")
    print("   Phase 1 + Phase 2 검증")
    print("="*60)

    # 테스트할 페이지 목록
    test_pages = [
        ("delivery", "http://localhost:3002/partner/campaign/create/delivery"),
        ("visit", "http://localhost:3002/partner/campaign/create/visit"),
        ("review", "http://localhost:3002/partner/campaign/create/review"),
        ("reporter", "http://localhost:3002/partner/campaign/create/reporter"),
        ("mission", "http://localhost:3002/partner/campaign/create/mission"),
    ]

    results = {}

    with sync_playwright() as p:
        # 브라우저 실행
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1366, 'height': 768})
        page = context.new_page()

        # 각 페이지 테스트
        for campaign_type, url in test_pages:
            results[campaign_type] = test_campaign_create_page(page, url, campaign_type)

        browser.close()

    # 전체 결과 요약
    print("\n" + "="*60)
    print("📊 전체 테스트 결과")
    print("="*60)

    passed = sum(1 for r in results.values() if r)
    total = len(results)

    for campaign_type, passed_test in results.items():
        status = "✅ 통과" if passed_test else "❌ 실패"
        print(f"{campaign_type:10s}: {status}")

    print(f"\n총 {total}개 중 {passed}개 통과 ({passed/total*100:.0f}%)")

    if passed == total:
        print("\n🎉 모든 테스트 통과!")
        sys.exit(0)
    else:
        print(f"\n⚠️ {total - passed}개 테스트 실패")
        sys.exit(1)

if __name__ == '__main__':
    main()
