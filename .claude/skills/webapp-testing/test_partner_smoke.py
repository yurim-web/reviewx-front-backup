"""
Smoke test for partner pages
"""
from playwright.sync_api import sync_playwright

BASE_URL = 'http://localhost:3002'
PAGES = [
    ('/partner/login', '파트너 로그인'),
    ('/partner/find-account', '파트너 계정찾기'),
    ('/partner/mypage', '파트너 마이페이지'),
    ('/partner/mypage/edit', '파트너 내정보 수정'),
    ('/partner/mypage/profile', '파트너 프로필'),
    ('/partner/campaign_management/scheduled', '캠페인관리 예정'),
    ('/partner/campaign_management/progress', '캠페인관리 진행'),
    ('/partner/notification', '파트너 알림'),
]
REACT_ERRORS = ['Unhandled Runtime Error','Application error','TypeError:','ReferenceError:','Cannot read properties']

def run():
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context()
        pg = ctx.new_page()
        pg.goto(BASE_URL)
        pg.wait_for_load_state('networkidle')
        pg.evaluate("""() => {
            localStorage.setItem('reviewx_auth_user', JSON.stringify({id:'partner_test_001',email:'test@partner.com',name:'테스트',role:'partner',business_name:'테스트주식회사'}));
            localStorage.setItem('reviewx_auth_role', 'partner');
            localStorage.setItem('reviewx_auth_token', 'mock_token');
        }""")
        pg.close()

        for path, label in PAGES:
            url = BASE_URL + path
            console_errs = []
            page = ctx.new_page()
            page.on('console', lambda m: console_errs.append(m.text) if m.type == 'error' else None)
            try:
                resp = page.goto(url, wait_until='domcontentloaded', timeout=15000)
                page.wait_for_load_state('networkidle', timeout=10000)
                status = resp.status if resp else 0
                html = page.content()
                rerrs = [e for e in REACT_ERRORS if e.lower() in html.lower()]
                jerrs = [e for e in console_errs if any(x.lower() in e.lower() for x in REACT_ERRORS)]
                ok = status == 200 and not rerrs and not jerrs
                results.append({'label':label,'status':status,'ok':ok,'rerrs':rerrs,'jerrs':jerrs[:2]})
            except Exception as e:
                results.append({'label':label,'status':0,'ok':False,'rerrs':[],'jerrs':[str(e)[:80]]})
            finally:
                page.close()
        browser.close()

    print('
' + '='*55)
    print('  파트너 페이지 스모크 테스트')
    print('='*55)
    for r in results:
        icon = '✅' if r['ok'] else '❌'
        print(f"{icon} [{r['status']}] {r['label']}")
        if r['rerrs']: print(f"    React: {r['rerrs']}")
        if r['jerrs']: print(f"    JS: {r['jerrs']}")
    passed = sum(1 for r in results if r['ok'])
    print('='*55)
    print(f'결과: {passed}/{len(results)} 통과')
    print('='*55)
    return passed == len(results)

if __name__ == '__main__':
    ok = run()
    exit(0 if ok else 1)
