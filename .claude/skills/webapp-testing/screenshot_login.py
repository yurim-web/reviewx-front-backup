"""
로그인 화면 스크린샷 캡처
"""
from playwright.sync_api import sync_playwright

def capture_screenshot():
    with sync_playwright() as p:
        # 브라우저 실행 (headless mode)
        browser = p.chromium.launch(headless=True)

        # 새 페이지 생성
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # 로그인 페이지 접속
        print("📍 페이지 접속 중: http://localhost:3002/user/login")
        page.goto('http://localhost:3002/user/login')

        # 페이지 로딩 완료 대기
        page.wait_for_load_state('networkidle')
        print("✅ 페이지 로딩 완료")

        # 스크린샷 캡처 (전체 페이지)
        screenshot_path = 'user-login-screenshot.png'
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"📸 스크린샷 저장: {screenshot_path}")

        # 브라우저 종료
        browser.close()
        print("✅ 완료!")

if __name__ == '__main__':
    capture_screenshot()
