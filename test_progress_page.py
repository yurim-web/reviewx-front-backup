"""캠페인 진행현황 페이지 디버깅 스크립트"""
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    # 브라우저 실행 (헤드리스 모드)
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()

    # 콘솔 로그 캡처
    console_logs = []
    page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))

    # 에러 캡처
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))

    print("🔍 캠페인 진행현황 페이지 접속 중...")
    page.goto('http://localhost:3002/manager_ga/campaign/progress')

    # 페이지 로딩 대기
    page.wait_for_load_state('networkidle')
    time.sleep(2)

    # 스크린샷 저장
    page.screenshot(path='progress_page_screenshot.png', full_page=True)
    print("✅ 스크린샷 저장: progress_page_screenshot.png")

    # 페이지 제목 확인
    title = page.locator('h1').first.text_content() if page.locator('h1').count() > 0 else "제목 없음"
    print(f"📄 페이지 제목: {title}")

    # 에러 메시지 확인
    error_elements = page.locator('text=/error|오류|에러/i').all()
    if error_elements:
        print(f"\n⚠️ 발견된 에러 메시지:")
        for elem in error_elements[:5]:  # 처음 5개만
            print(f"  - {elem.text_content()}")

    # 콘솔 로그 출력
    if console_logs:
        print(f"\n📝 콘솔 로그 ({len(console_logs)}개):")
        for log in console_logs[-10:]:  # 마지막 10개만
            print(f"  {log}")

    # JavaScript 에러 출력
    if errors:
        print(f"\n❌ JavaScript 에러 ({len(errors)}개):")
        for error in errors:
            print(f"  {error}")

    # 통계 카드 확인
    stat_cards = page.locator('[class*="stat_card"]').all()
    print(f"\n📊 통계 카드: {len(stat_cards)}개 발견")
    for i, card in enumerate(stat_cards[:6]):
        card_text = card.text_content()
        print(f"  카드 {i+1}: {card_text[:50]}")

    # 테이블 확인
    table_rows = page.locator('table tbody tr').all()
    print(f"\n📋 테이블 행: {len(table_rows)}개")

    # 필터 섹션 확인
    filter_section = page.locator('[class*="filter"]').first
    if filter_section.is_visible():
        print(f"✅ 필터 섹션 표시됨")
    else:
        print(f"❌ 필터 섹션 없음")

    print("\n🔍 페이지 분석 완료!")

    # 5초 대기 (수동 확인용)
    time.sleep(5)

    browser.close()
