"""
SA 정산 관련 3개 페이지 테스트
- 출금 현황 (withdrawal)
- 출금 요청 (withdrawal_request)
- 결제 내역 (payment_history)
"""

from playwright.sync_api import sync_playwright
import sys

def test_page(page, url, page_name):
    """페이지를 테스트하고 스크린샷 저장"""
    print(f"\n{'='*60}")
    print(f"테스트 페이지: {page_name}")
    print(f"URL: {url}")
    print(f"{'='*60}")

    try:
        # 페이지 이동
        print(f"페이지 로딩 중...")
        response = page.goto(url, wait_until='networkidle', timeout=30000)

        # 응답 상태 확인
        if response:
            print(f"✅ HTTP 상태: {response.status}")
            if response.status != 200:
                print(f"⚠️  경고: 200이 아닌 상태 코드입니다")

        # 페이지 로드 대기
        page.wait_for_load_state('networkidle')
        print(f"✅ 페이지 로드 완료")

        # 타이틀 확인
        title = page.title()
        print(f"📄 페이지 타이틀: {title}")

        # 스크린샷 저장
        screenshot_path = f"screenshot_{page_name}.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"📸 스크린샷 저장: {screenshot_path}")

        # 콘솔 에러 확인 (있다면)
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        # 페이지에 있는 주요 요소 확인
        print(f"\n📋 페이지 구조 확인:")

        # 테이블 확인
        tables = page.locator('table').count()
        print(f"  - 테이블 개수: {tables}")

        # 헤더 확인
        headers = page.locator('h1, h2, h3').count()
        print(f"  - 헤더 개수: {headers}")

        # 버튼 확인
        buttons = page.locator('button').count()
        print(f"  - 버튼 개수: {buttons}")

        # 에러 메시지 확인
        error_elements = page.locator('[class*="error"]').count()
        if error_elements > 0:
            print(f"  ⚠️  에러 관련 요소: {error_elements}개 발견")

        print(f"\n✅ {page_name} 페이지 테스트 완료!")
        return True

    except Exception as e:
        print(f"\n❌ {page_name} 페이지 테스트 실패!")
        print(f"에러: {str(e)}")

        # 에러 발생 시에도 스크린샷 저장
        try:
            screenshot_path = f"screenshot_{page_name}_error.png"
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"📸 에러 스크린샷 저장: {screenshot_path}")
        except:
            pass

        return False

def main():
    """메인 테스트 함수"""

    # 테스트할 페이지 정의
    pages_to_test = [
        {
            "url": "http://localhost:3002/manager_sa/settlement/withdrawal",
            "name": "withdrawal",
            "description": "출금 현황"
        },
        {
            "url": "http://localhost:3002/manager_sa/settlement/withdrawal_request",
            "name": "withdrawal_request",
            "description": "출금 요청"
        },
        {
            "url": "http://localhost:3002/manager_sa/settlement/payment_history",
            "name": "payment_history",
            "description": "결제 내역"
        }
    ]

    print("🚀 SA 정산 페이지 테스트 시작")
    print(f"총 {len(pages_to_test)}개 페이지 테스트")

    results = []

    with sync_playwright() as p:
        # 브라우저 실행
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1920, 'height': 1080}
        )
        page = context.new_page()

        # 콘솔 로그 수집
        console_logs = []
        page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))

        # 각 페이지 테스트
        for page_info in pages_to_test:
            result = test_page(
                page,
                page_info["url"],
                page_info["name"]
            )
            results.append({
                "name": page_info["name"],
                "description": page_info["description"],
                "success": result
            })

        # 브라우저 종료
        browser.close()

    # 결과 요약
    print(f"\n{'='*60}")
    print("📊 테스트 결과 요약")
    print(f"{'='*60}")

    success_count = sum(1 for r in results if r["success"])
    fail_count = len(results) - success_count

    for result in results:
        status = "✅ 성공" if result["success"] else "❌ 실패"
        print(f"{status} - {result['description']} ({result['name']})")

    print(f"\n총 {len(results)}개 중 성공: {success_count}개, 실패: {fail_count}개")

    # 콘솔 로그가 있으면 출력
    if console_logs:
        print(f"\n📝 콘솔 로그 ({len(console_logs)}개):")
        for log in console_logs[:10]:  # 최대 10개만
            print(f"  {log}")
        if len(console_logs) > 10:
            print(f"  ... 외 {len(console_logs) - 10}개")

    # 종료 코드
    sys.exit(0 if fail_count == 0 else 1)

if __name__ == "__main__":
    main()
