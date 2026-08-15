/**
 * AI INNER LAB — backend Google Apps Script
 * Đã gắn trực tiếp với Google Sheet nhận kết quả của dự án.
 */

const CONFIG = Object.freeze({
  SPREADSHEET_ID: '19UFOvKJJBzt73KKUXaO67WHukCNMPOU_V2dIJ7B18_M',
  SHEET_NAME: 'Kết quả',
  BRAND_NAME: 'AI INNER LAB',
  COURSE_NAME: 'Nâng Cấp Bản Thân Trong Thời Đại AI',
  // Thay bằng landing page khóa học thật khi có.
  COURSE_URL: 'https://example.com/khoa-hoc'
});

const HEADERS = [
  'Thời gian',
  'Submission ID',
  'Họ tên',
  'Zalo / SĐT',
  'Nhóm tuổi',
  'Kết quả khảo sát chính',
  'Bản soi chiếu AI',
  'Bài test được đề xuất',
  'Test Key',
  'Kết quả mini test',
  'Điểm số / Top results',
  'Link kết quả riêng',
  'Câu trả lời khảo sát JSON',
  'Câu trả lời mini test JSON',
  'Result JSON',
  'Nguồn / UTM',
  'Đã bấm xem khóa học?'
];

const TEST_TITLES = Object.freeze({
  enneagram: 'Enneagram Mini',
  direction: 'Life Direction',
  career: 'Career DNA',
  attachment: 'Attachment Style',
  ai: 'AI Readiness'
});

function doGet(e) {
  const template = HtmlService.createTemplateFromFile('Index');
  template.resultId = cleanText_(e && e.parameter && e.parameter.result, 80);
  template.appConfig = JSON.stringify({
    brandName: CONFIG.BRAND_NAME,
    courseName: CONFIG.COURSE_NAME,
    courseUrl: CONFIG.COURSE_URL
  });

  return template.evaluate()
    .setTitle('AI có thể chữa lành bạn không?')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Lưu một lượt làm test và trả về link kết quả riêng.
 */
function saveResult(payload) {
  payload = payload || {};
  const sheet = getSheet_();
  const id = makeSubmissionId_();
  const resultUrl = buildResultUrl_(id);

  const surveySnapshot = safeObject_(payload.surveySnapshot);
  const surveyAnswers = safeArray_(payload.surveyAnswers);
  const testAnswers = safeArray_(payload.answers);
  const resultData = safeObject_(payload.resultData);
  const testKey = cleanText_(payload.testKey, 40);
  const recommendedKey = cleanText_(payload.recommendedTest, 40);

  const row = [
    new Date(),
    id,
    cleanText_(payload.name, 120),
    cleanText_(payload.contact, 120),
    cleanText_(payload.ageGroup, 60),
    surveySummary_(surveySnapshot),
    surveyReflection_(surveySnapshot),
    TEST_TITLES[recommendedKey] || recommendedKey,
    testKey,
    cleanText_(resultData.primaryTitle || resultData.headline, 300),
    cleanText_(resultData.scoreSummary || scoreSummaryFromResult_(resultData), 1000),
    resultUrl,
    jsonString_(surveyAnswers),
    jsonString_(testAnswers),
    jsonString_(resultData),
    jsonString_(safeObject_(payload.utm)),
    'Chưa ghi nhận'
  ];

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  return { ok: true, id: id, resultUrl: resultUrl };
}

/**
 * Đọc kết quả qua mã riêng. Cố ý KHÔNG trả Zalo/SĐT hay dữ liệu raw nhạy cảm.
 */
function getResult(id) {
  id = cleanText_(id, 80);
  if (!id) return null;

  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const match = sheet.getRange(2, 2, lastRow - 1, 1)
    .createTextFinder(id)
    .matchEntireCell(true)
    .findNext();

  if (!match) return null;
  const row = sheet.getRange(match.getRow(), 1, 1, HEADERS.length).getValues()[0];

  let resultData = {};
  try { resultData = JSON.parse(row[14] || '{}'); } catch (err) { resultData = {}; }

  return {
    id: row[1],
    name: row[2] || '',
    testKey: row[8] || '',
    testTitle: TEST_TITLES[row[8]] || '',
    resultData: resultData,
    resultUrl: row[11] || buildResultUrl_(row[1])
  };
}

/**
 * Có thể chạy thủ công một lần nếu muốn tái đồng bộ header.
 */
function setupSheet() {
  const sheet = getSheet_();
  const current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const needsHeader = HEADERS.some((h, i) => current[i] !== h);
  if (needsHeader) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);
  return { ok: true, spreadsheetId: CONFIG.SPREADSHEET_ID, sheetName: CONFIG.SHEET_NAME };
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) throw new Error('Không tìm thấy sheet "' + CONFIG.SHEET_NAME + '".');
  return sheet;
}

function buildResultUrl_(id) {
  const base = ScriptApp.getService().getUrl();
  if (!base) return '?result=' + encodeURIComponent(id);
  return base + '?result=' + encodeURIComponent(id);
}

function makeSubmissionId_() {
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh', 'yyMMdd');
  const token = Utilities.getUuid().replace(/-/g, '').slice(0, 10);
  return stamp + '-' + token;
}

function surveySummary_(s) {
  const keys = ['self', 'patterns', 'agency', 'ai'];
  const labels = { self: 'Hiểu mình', patterns: 'Nhìn ra mô thức', agency: 'Sẵn sàng hành động', ai: 'Dùng AI có chủ đích' };
  const parts = keys.filter(k => s[k] !== undefined && s[k] !== null)
    .map(k => labels[k] + ' ' + Number(s[k]) + '%');
  if (!parts.length) return '';
  const avg = keys.reduce((sum, k) => sum + Number(s[k] || 0), 0) / keys.length;
  const band = avg >= 76 ? 'Nền tảng phản tư tốt' : avg >= 56 ? 'Có nền tảng, cần dùng AI đúng vai trò' : 'Nên bắt đầu từ gọi tên và sắp xếp suy nghĩ';
  return band + ' · ' + parts.join(' · ');
}

function surveyReflection_(s) {
  const keys = ['self', 'patterns', 'agency', 'ai'];
  if (!keys.some(k => s[k] !== undefined && s[k] !== null)) return '';
  const avg = keys.reduce((sum, k) => sum + Number(s[k] || 0), 0) / keys.length;
  if (avg >= 76) return 'AI có thể trở thành một chiếc gương hữu ích: bạn đã có nền tảng khá tốt để phản tư, kiểm chứng và biến insight thành hành động.';
  if (avg >= 56) return 'AI có thể giúp bạn nhìn rõ hơn nếu được dùng đúng vai trò: hỗ trợ đặt câu hỏi và soi chiếu, không quyết định thay bạn.';
  return 'AI nên bắt đầu bằng việc giúp bạn gọi tên và sắp xếp suy nghĩ. Những quyết định quan trọng và hỗ trợ chuyên môn vẫn cần con người phù hợp.';
}

function scoreSummaryFromResult_(r) {
  const scores = safeObject_(r.scores);
  return Object.keys(scores).map(k => k + ': ' + scores[k]).join(' · ');
}

function safeObject_(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
}

function safeArray_(v) {
  return Array.isArray(v) ? v : [];
}

function cleanText_(v, maxLen) {
  if (v === null || v === undefined) return '';
  const s = String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
  return s.slice(0, maxLen || 500);
}

function jsonString_(v) {
  try {
    const s = JSON.stringify(v === undefined ? null : v);
    // Google Sheets cell limit is ~50k chars; keep headroom.
    return s.length > 45000 ? s.slice(0, 45000) : s;
  } catch (err) {
    return '';
  }
}
