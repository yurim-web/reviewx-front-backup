/**
 * Confluence 페이지 29753424 (10.3 완료 탭)
 * - 스크린샷 5장 업로드
 * - 🖥️ 화면 캡처 섹션 아래에 실제 이미지(mediaSingle) 노드 추가
 *
 * 사용 전 준비:
 * 1) 루트(.env.atlassian)에 아래 환경변수 설정
 *    ATLASSIAN_EMAIL=...
 *    ATLASSIAN_TOKEN=...
 * 2) 레포 루트에 PNG 파일 5개 생성 (1920x1080)
 *    - tmp_10_3_base.png      // 1. 일반 완료 카드
 *    - tmp_10_3_late.png      // 2. 지각 등록 카드
 *    - tmp_10_3_modal.png     // 3. 이미지 확인 모달
 *    - tmp_10_3_report.png    // 4. 신고 사유 선택 모달
 *    - tmp_10_3_empty.png     // 5. 빈 탭 화면
 *
 * 실행:
 *    node scripts/add_screenshots_29753424.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const env_path = path.join(__dirname, '../.env.atlassian');
if (fs.existsSync(env_path)) {
  fs
    .readFileSync(env_path, 'utf8')
    .split('\n')
    .forEach(line => {
      const [k, ...v] = line.split('=');
      if (k && v.length) process.env[k.trim()] = v.join('=').trim();
    });
}

const email = process.env.ATLASSIAN_EMAIL;
const token = process.env.ATLASSIAN_TOKEN;
const cloud_id = 'b096e988-8f8a-4064-b5d5-9c6f9c3f96dd';
const page_id = '29753424';
const base_url = `https://api.atlassian.com/ex/confluence/${cloud_id}/wiki`;
const auth = Buffer.from(`${email}:${token}`).toString('base64');

function request(method, url_path, body, headers) {
  return new Promise((resolve, reject) => {
    const url = new URL(base_url + url_path);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
        ...headers,
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function upload_file(filename) {
  return new Promise((resolve, reject) => {
    const file_path = path.join(__dirname, '..', filename);
    const file_data = fs.readFileSync(file_path);
    const boundary = '----FormBoundary' + Date.now();
    const crlf = '\r\n';

    const header =
      `--${boundary}${crlf}` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"${crlf}` +
      `Content-Type: image/png${crlf}${crlf}`;
    const footer = `${crlf}--${boundary}--${crlf}`;

    const body = Buffer.concat([Buffer.from(header), file_data, Buffer.from(footer)]);

    const url = new URL(
      `${base_url}/rest/api/content/${page_id}/child/attachment`,
    );
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
        'X-Atlassian-Token': 'no-check',
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.results && parsed.results[0]) {
            resolve({
              id: parsed.results[0].id,
              title: parsed.results[0].title,
            });
          } else {
            resolve({ raw: data.substring(0, 300), status: res.statusCode });
          }
        } catch {
          resolve({ raw: data.substring(0, 200), status: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function get_block_text(node) {
  if (!node || !node.content) return '';
  return node.content
    .flatMap(block =>
      (block.content || []).map(child => (typeof child.text === 'string' ? child.text : '')),
    )
    .join('');
}

function create_media_single(attachment_id) {
  return {
    type: 'mediaSingle',
    attrs: {
      layout: 'center',
      width: 760,
      widthType: 'pixel',
    },
    content: [
      {
        type: 'media',
        attrs: {
          type: 'file',
          id: attachment_id,
          collection: `contentId-${page_id}`,
          width: 1920,
          height: 1080,
        },
      },
    ],
  };
}

async function main() {
  console.log('📸 29753424 — 스크린샷 업로드 + 화면 캡처 섹션 업데이트 시작\n');

  // 1. 스크린샷 업로드
  console.log('1️⃣  tmp_10_3_base.png 업로드...');
  const shot_base = await upload_file('tmp_10_3_base.png');
  console.log('   ✅ ID:', shot_base.id, '/ 이름:', shot_base.title);

  console.log('2️⃣  tmp_10_3_late.png 업로드...');
  const shot_late = await upload_file('tmp_10_3_late.png');
  console.log('   ✅ ID:', shot_late.id, '/ 이름:', shot_late.title);

  console.log('3️⃣  tmp_10_3_modal.png 업로드...');
  const shot_modal = await upload_file('tmp_10_3_modal.png');
  console.log('   ✅ ID:', shot_modal.id, '/ 이름:', shot_modal.title);

  console.log('4️⃣  tmp_10_3_report.png 업로드...');
  const shot_report = await upload_file('tmp_10_3_report.png');
  console.log('   ✅ ID:', shot_report.id, '/ 이름:', shot_report.title);

  console.log('5️⃣  tmp_10_3_empty.png 업로드...');
  const shot_empty = await upload_file('tmp_10_3_empty.png');
  console.log('   ✅ ID:', shot_empty.id, '/ 이름:', shot_empty.title);

  // 2. 현재 페이지 ADF 가져오기
  console.log('\n6️⃣  ADF 가져오는 중...');
  const page_res = await request(
    'GET',
    `/api/v2/pages/${page_id}?body-format=atlas_doc_format`,
    null,
    {},
  );
  if (page_res.status !== 200) {
    console.error('❌ GET 실패:', page_res.status);
    process.exit(1);
  }
  const page = page_res.body;
  console.log(`   버전 ${page.version.number}`);

  const adf = JSON.parse(page.body.atlas_doc_format.value);

  // 3. 화면 캡처 섹션 찾아서 이미지 노드 삽입
  const blocks = adf.content || [];
  const heading_index = blocks.findIndex(
    block =>
      block.type === 'heading' &&
      get_block_text(block).includes('화면 캡처'),
  );

  if (heading_index === -1) {
    console.error('❌ "화면 캡처" 섹션을 찾지 못했습니다.');
    process.exit(1);
  }

  let insert_count = 0;

  function insert_after_paragraph(label_text, media_node) {
    for (let i = heading_index + 1; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.type !== 'paragraph') continue;
      const text = get_block_text(block);
      if (text.startsWith(label_text)) {
        blocks.splice(i + 1, 0, media_node);
        insert_count++;
        console.log(`   ✅ "${label_text}" 아래에 이미지 노드 추가`);
        return;
      }
    }
    console.warn(`   ⚠️ "${label_text}" 문단을 찾지 못했습니다. (이미지 미삽입)`);
  }

  insert_after_paragraph(
    '1. 일반 완료 카드',
    create_media_single(shot_base.id),
  );
  insert_after_paragraph(
    '2. 지각 등록 카드',
    create_media_single(shot_late.id),
  );
  insert_after_paragraph(
    '3. 이미지 확인 모달',
    create_media_single(shot_modal.id),
  );
  insert_after_paragraph(
    '4. 신고 사유 선택 모달',
    create_media_single(shot_report.id),
  );
  insert_after_paragraph(
    '5. 빈 탭 화면',
    create_media_single(shot_empty.id),
  );

  console.log(`\n   총 ${insert_count}건 이미지 노드 삽입`);

  // 4. 페이지 업데이트
  console.log('\n7️⃣  페이지 업데이트 중...');
  const update_res = await request(
    'PUT',
    `/api/v2/pages/${page_id}`,
    JSON.stringify({
      id: page_id,
      status: 'current',
      title: page.title,
      version: { number: page.version.number + 1 },
      body: {
        representation: 'atlas_doc_format',
        value: JSON.stringify(adf),
      },
    }),
    { 'Content-Type': 'application/json' },
  );

  if (update_res.status === 200) {
    console.log('\n✅ 완료!');
    console.log(
      '🔗 https://markx.atlassian.net/wiki/spaces/MarkX/pages/29753424',
    );
  } else {
    console.error(
      '\n❌ 업데이트 실패:',
      update_res.status,
      JSON.stringify(update_res.body).substring(0, 500),
    );
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

/**
 * Confluence 페이지 29753424 — 10.3 완료 탭 화면 캡처 5장 추가
 * 1. 완료 탭 기본 화면 (콘텐츠 카드 1~3)
 * 2. 완료 탭 카드 상세 (배송형 카드 hover/액션)
 * 3. 완료 탭 카드 상세 (구매평 카드)
 * 4. 완료 탭 모달 (영수증 미리보기)
 * 5. 빈 상태 (콘텐츠 없음)
 */

const https = require('https');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

const EMAIL = process.env.ATLASSIAN_EMAIL;
const TOKEN = process.env.ATLASSIAN_TOKEN;
const CLOUD_ID = 'b096e988-8f8a-4064-b5d5-9c6f9c3f96dd';
const PAGE_ID = '29753424';
const AUTH = Buffer.from(`${EMAIL}:${TOKEN}`).toString('base64');
const BASE = `https://api.atlassian.com/ex/confluence/${CLOUD_ID}/wiki`;

function request(method, path, body, extraHeaders) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Authorization': `Basic ${AUTH}`,
        'Accept': 'application/json',
        ...extraHeaders,
      },
    };
    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

/** 기존 첨부파일 ID 조회 */
async function getExistingAttachmentId(fileName) {
  const res = await request('GET', `/rest/api/content/${PAGE_ID}/child/attachment?filename=${encodeURIComponent(fileName)}`, null, {});
  if (res.status === 200 && res.body.results && res.body.results.length > 0) {
    return res.body.results[0].id;
  }
  return null;
}

/** 이미지 파일을 Confluence 첨부파일로 업로드 */
async function uploadAttachment(filePath, fileName) {
  const fileContent = fs.readFileSync(filePath);
  const boundary = `----Boundary${Date.now()}`;

  const formData = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`),
    fileContent,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);

  const headers = {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': formData.length,
    'X-Atlassian-Token': 'no-check',
  };

  const existingId = await getExistingAttachmentId(fileName);
  const apiPath = existingId
    ? `/rest/api/content/${PAGE_ID}/child/attachment/${existingId}/data`
    : `/rest/api/content/${PAGE_ID}/child/attachment`;

  const res = await request('POST', apiPath, formData, headers);

  if (res.status !== 200 && res.status !== 201) {
    console.error(`❌ 업로드 실패 (${fileName}):`, res.status, JSON.stringify(res.body).substring(0, 300));
    return null;
  }

  const attachment = Array.isArray(res.body.results) ? res.body.results[0] : res.body;
  const fileId = attachment?.extensions?.fileId;
  const collection = attachment?.extensions?.collectionName || `contentId-${PAGE_ID}`;
  console.log(`  ✅ ${existingId ? '업데이트' : '신규 업로드'} 완료: ${fileName} → fileId: ${fileId}`);
  return { fileId, collection };
}

/** mediaSingle 이미지 노드 생성 */
function makeMediaSingle(fileId, collection) {
  return {
    type: 'mediaSingle',
    attrs: { layout: 'center', width: 760, widthType: 'pixel' },
    content: [{
      type: 'media',
      attrs: {
        id: fileId,
        type: 'file',
        collection,
        width: 1920,
        height: 1080,
      },
    }],
  };
}

function uid() {
  return `sc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function makeCaption(text) {
  return {
    type: 'paragraph',
    attrs: { localId: uid() },
    content: [{ type: 'text', text, marks: [{ type: 'strong' }] }],
  };
}

/** 기존 이미지 width 고정 */
function fixImg(node) {
  if (!node) return node;
  if (node.type === 'mediaSingle') node.attrs = { ...node.attrs, layout: 'center', width: 760, widthType: 'pixel' };
  if (node.content) node.content = node.content.map(fixImg);
  return node;
}

/** Playwright 스크린샷 캡처 */
function captureScreenshots() {
  return new Promise((resolve, reject) => {
    const scriptContent = `
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  // 로컬 Mock 데이터 사용 (실제 URL은 환경에 맞게)
  // 완료 탭 페이지 접속 (현재는 FUNCTIONAL_SPEC.md 스크린샷 정보 기반)

  // 1. 완료 탭 기본 화면
  await page.goto('http://localhost:3002/partner/campaign_contents/delivery?tab=완료');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp_completed_basic.png', fullPage: false });

  // 2. 배송형 카드 상세
  await page.click('[data-testid="content-card-0"]');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tmp_completed_card_delivery.png', fullPage: false });

  // 3. 구매평 탭 전환
  await page.goto('http://localhost:3002/partner/campaign_contents/purchase?tab=완료');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp_completed_card_purchase.png', fullPage: false });

  // 4. 영수증 미리보기 모달 (테스트 버튼이 있다면)
  const receiptBtn = await page.$('[data-testid="preview-receipt"]');
  if (receiptBtn) {
    await receiptBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tmp_completed_modal_receipt.png', fullPage: false });
    await page.press('Escape');
  }

  // 5. 빈 상태 (콘텐츠 없는 탭)
  await page.goto('http://localhost:3002/partner/campaign_contents/reporter?tab=완료');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp_completed_empty.png', fullPage: false });

  await browser.close();
  console.log('✅ Playwright 스크린샷 캡처 완료');
})();
`;

    const tempScript = path.join(process.cwd(), 'tmp_capture.js');
    fs.writeFileSync(tempScript, scriptContent);

    const proc = spawn('npx', ['playwright', 'install', 'chromium']);
    proc.on('close', (code) => {
      if (code === 0) {
        const captureProc = spawn('node', [tempScript]);
        captureProc.stdout.on('data', (data) => console.log(data.toString()));
        captureProc.stderr.on('data', (data) => console.error(data.toString()));
        captureProc.on('close', (code) => {
          fs.unlinkSync(tempScript);
          resolve(code === 0);
        });
      } else {
        reject(new Error('Playwright 설치 실패'));
      }
    });
  });
}

async function main() {
  console.log('📸 완료 탭 스크린샷 5장 Confluence 업로드 시작...\n');

  // 1. Playwright 캡처
  console.log('  1️⃣ Playwright 스크린샷 캡처 중...');
  try {
    await captureScreenshots();
  } catch (e) {
    console.error('  ⚠️ 스크린샷 캡처 스킵 (수동 캡처 필요)');
  }

  // 2. 파일 업로드
  const files = [
    { path: 'tmp_completed_basic.png', name: 'partner_completed_basic.png', caption: '1. 완료 탭 기본 화면 — 승인 완료된 콘텐츠 카드 (배송형, 방문형 등)' },
    { path: 'tmp_completed_card_delivery.png', name: 'partner_completed_card_delivery.png', caption: '2. 배송형 카드 상세 — 승인 완료 상태, 콘텐츠 정보 및 승인일시' },
    { path: 'tmp_completed_card_purchase.png', name: 'partner_completed_card_purchase.png', caption: '3. 구매평 카드 상세 — 승인 완료 상태, 별점 및 리뷰 미리보기' },
    { path: 'tmp_completed_modal_receipt.png', name: 'partner_completed_modal_receipt.png', caption: '4. 영수증 미리보기 모달 — 고해상도 이미지 미리보기' },
    { path: 'tmp_completed_empty.png', name: 'partner_completed_empty.png', caption: '5. 빈 상태 — "승인 완료된 콘텐츠가 없습니다."' },
  ];

  const uploaded = [];
  for (const f of files) {
    if (!fs.existsSync(f.path)) {
      console.log(`  ⚠️ 파일 없음 (수동 캡처 후 재실행): ${f.path}`);
      continue;
    }
    console.log(`  업로드 중: ${f.name}`);
    const result = await uploadAttachment(f.path, f.name);
    if (result) uploaded.push({ ...f, ...result });
  }

  if (uploaded.length === 0) {
    console.error('❌ 업로드된 파일 없음. 종료.');
    process.exit(1);
  }

  // 3. 페이지 ADF 가져오기
  const pageRes = await request('GET', `/api/v2/pages/${PAGE_ID}?body-format=atlas_doc_format`, null, {});
  if (pageRes.status !== 200) { console.error('❌ 페이지 GET 실패:', pageRes.status); process.exit(1); }

  const page = pageRes.body;
  console.log(`\n✅ 페이지 버전 ${page.version.number} 가져옴`);

  let adf = JSON.parse(page.body.atlas_doc_format.value);

  // 4. 화면 캡처 섹션 찾기
  let captureIdx = -1;
  for (let i = 0; i < adf.content.length; i++) {
    const n = adf.content[i];
    if (n.type === 'heading') {
      const txt = (n.content || []).map(x => x.text || '').join('');
      if (txt.includes('화면 캡처')) captureIdx = i;
    }
  }

  if (captureIdx === -1) { console.error('❌ 화면 캡처 섹션 없음'); process.exit(1); }
  console.log(`\n✅ 화면 캡처 섹션 발견 (root.${captureIdx})`);

  // 5. 캡처 섹션 이후 내용 교체
  const beforeCapture = adf.content.slice(0, captureIdx + 1);

  const newImageNodes = [];
  for (const f of uploaded) {
    newImageNodes.push(makeCaption(f.caption));
    newImageNodes.push(makeMediaSingle(f.fileId, f.collection));
  }

  adf.content = [...beforeCapture, ...newImageNodes];

  // 6. 기존 이미지 width 고정
  adf = fixImg(adf);

  // 7. 페이지 업데이트
  const updateRes = await request('PUT', `/api/v2/pages/${PAGE_ID}`, JSON.stringify({
    id: PAGE_ID,
    status: 'current',
    title: page.title,
    version: { number: page.version.number + 1 },
    body: {
      representation: 'atlas_doc_format',
      value: JSON.stringify(adf),
    },
  }), { 'Content-Type': 'application/json' });

  if (updateRes.status === 200) {
    console.log('\n✅ 페이지 업데이트 완료!');
    console.log('🔗 https://markx.atlassian.net/wiki/spaces/MarkX/pages/29753424');
  } else {
    console.error('\n❌ 업데이트 실패:', updateRes.status, JSON.stringify(updateRes.body).substring(0, 400));
  }
}

main().catch(console.error);
