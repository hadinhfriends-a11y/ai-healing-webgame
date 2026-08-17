/**
 * AI INNER LAB — backend Google Apps Script
 * Đã gắn trực tiếp với Google Sheet nhận kết quả của dự án.
 */

const CONFIG = Object.freeze({
  SPREADSHEET_ID: '19UFOvKJJBzt73KKUXaO67WHukCNMPOU_V2dIJ7B18_M',
  SHEET_NAME: 'Kết quả',
  BRAND_NAME: 'AI INNER LAB',
  COURSE_NAME: 'Nâng Cấp Bản Thân Trong Thời Đại AI',
  COURSE_URL: 'https://example.com/khoa-hoc',
  PUBLIC_APP_URL: 'https://hadinhfriends-a11y.github.io/ai-healing-webgame/'
});

const HEADERS = [
  'Thời gian','Submission ID','Họ tên','Zalo / SĐT','Nhóm tuổi',
  'Kết quả khảo sát chính','Bản soi chiếu AI','Bài test được đề xuất','Test Key',
  'Kết quả mini test','Điểm số / Top results','Link kết quả riêng',
  'Câu trả lời khảo sát JSON','Câu trả lời mini test JSON','Result JSON',
  'Nguồn / UTM','Đã bấm xem khóa học?'
];

const TEST_TITLES = Object.freeze({
  enneagram:'Enneagram Mini',direction:'Life Direction',career:'Career DNA',
  attachment:'Attachment Style',ai:'AI Readiness'
});

function doGet(e) {
  const p=(e&&e.parameter)||{};
  if(p.action==='getResult'){
    const data=getResult(p.id);
    const callback=cleanCallback_(p.callback);
    const body=JSON.stringify(data||null);
    if(callback){
      return ContentService.createTextOutput(callback+'('+body+');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
  }
  if(p.action==='ping'){
    return ContentService.createTextOutput(JSON.stringify({ok:true,service:'AI INNER LAB'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ok:true,service:'AI INNER LAB'}))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Nhận cả JSON thô lẫn form field `payload`.
 * Form POST đáng tin cậy hơn khi gọi Apps Script từ GitHub Pages vì không phụ thuộc CORS.
 */
function doPost(e) {
  try {
    let payload=null;
    const raw=(e&&e.postData&&e.postData.contents)||'';
    if(raw){
      try { payload=JSON.parse(raw); } catch(ignore) {}
    }
    if(!payload && e && e.parameter && e.parameter.payload){
      payload=JSON.parse(e.parameter.payload);
    }
    if(!payload) throw new Error('Payload không hợp lệ.');
    const result=saveResult(payload);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err&&err.message||err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveResult(payload) {
  payload=payload||{};
  const sheet=getSheet_();
  const id=cleanText_(payload.submissionId,80)||makeSubmissionId_();
  const resultUrl=buildResultUrl_(id);

  const lock=LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    // Chống ghi trùng khi frontend retry cùng Submission ID.
    const lastRow=sheet.getLastRow();
    if(lastRow>=2){
      const found=sheet.getRange(2,2,lastRow-1,1).createTextFinder(id).matchEntireCell(true).findNext();
      if(found) return {ok:true,id:id,resultUrl:resultUrl,duplicate:true};
    }

    const surveySnapshot=safeObject_(payload.surveySnapshot);
    const surveyAnswers=safeArray_(payload.surveyAnswers);
    const testAnswers=safeArray_(payload.answers);
    const resultData=safeObject_(payload.resultData);
    const testKey=cleanText_(payload.testKey,40);
    const recommendedKey=cleanText_(payload.recommendedTest,40);

    const row=[
      new Date(),id,cleanText_(payload.name,120),cleanText_(payload.contact,120),
      cleanText_(payload.ageGroup,60),surveySummary_(surveySnapshot),surveyReflection_(surveySnapshot),
      TEST_TITLES[recommendedKey]||recommendedKey,testKey,
      cleanText_(resultData.primaryTitle||resultData.headline,300),
      cleanText_(resultData.scoreSummary||scoreSummaryFromResult_(resultData),1000),
      resultUrl,jsonString_(surveyAnswers),jsonString_(testAnswers),jsonString_(resultData),
      jsonString_(safeObject_(payload.utm)),'Chưa ghi nhận'
    ];
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return {ok:true,id:id,resultUrl:resultUrl};
}

function getResult(id) {
  id=cleanText_(id,80);
  if(!id) return null;
  const sheet=getSheet_();
  const lastRow=sheet.getLastRow();
  if(lastRow<2) return null;
  const match=sheet.getRange(2,2,lastRow-1,1).createTextFinder(id).matchEntireCell(true).findNext();
  if(!match) return null;
  const row=sheet.getRange(match.getRow(),1,1,HEADERS.length).getValues()[0];
  let resultData={};
  try { resultData=JSON.parse(row[14]||'{}'); } catch(ignore) {}
  return {id:row[1],name:row[2]||'',testKey:row[8]||'',testTitle:TEST_TITLES[row[8]]||'',resultData:resultData,resultUrl:row[11]||buildResultUrl_(row[1])};
}

function setupSheet(){
  const sheet=getSheet_();
  const current=sheet.getRange(1,1,1,HEADERS.length).getValues()[0];
  if(HEADERS.some((v,i)=>current[i]!==v)) sheet.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  return {ok:true,spreadsheetId:CONFIG.SPREADSHEET_ID,sheetName:CONFIG.SHEET_NAME};
}

function getSheet_(){
  const ss=SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet=ss.getSheetByName(CONFIG.SHEET_NAME);
  if(!sheet) throw new Error('Không tìm thấy sheet "'+CONFIG.SHEET_NAME+'".');
  return sheet;
}

function buildResultUrl_(id){
  const base=(CONFIG.PUBLIC_APP_URL||'').replace(/\/?$/,'/');
  return base+'?result='+encodeURIComponent(id);
}
function cleanCallback_(v){
  const s=cleanText_(v,120);
  return /^[A-Za-z_$][0-9A-Za-z_$]*(?:\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(s)?s:'';
}
function makeSubmissionId_(){
  const stamp=Utilities.formatDate(new Date(),Session.getScriptTimeZone()||'Asia/Ho_Chi_Minh','yyMMdd');
  return stamp+'-'+Utilities.getUuid().replace(/-/g,'').slice(0,10);
}
function surveySummary_(s){
  const vals=['self','patterns','agency','ai'].map(k=>Number(s[k]||0));
  const avg=vals.reduce((a,b)=>a+b,0)/4;
  const band=avg>=76?'Nền tảng phản tư tốt':avg>=56?'Đang xây nền tảng phản tư':'Nên bắt đầu từ việc gọi tên';
  return band+' · Hiểu mình '+vals[0]+'% · Nhìn ra mô thức '+vals[1]+'% · Sẵn sàng hành động '+vals[2]+'% · Dùng AI có chủ đích '+vals[3]+'%';
}
function surveyReflection_(s){
  const vals=['self','patterns','agency','ai'].map(k=>Number(s[k]||0));
  const avg=vals.reduce((a,b)=>a+b,0)/4;
  if(avg>=76) return 'AI có thể trở thành một chiếc gương hữu ích: bạn đã có nền tảng khá tốt để phản tư, kiểm chứng và biến insight thành hành động.';
  if(avg>=56) return 'AI có thể giúp bạn nhìn rõ hơn nếu bạn dùng nó để đặt câu hỏi, kiểm chứng và chuyển insight thành hành động.';
  return 'AI nên bắt đầu bằng việc giúp bạn gọi tên điều đang diễn ra, thay vì cố đưa ra câu trả lời thay bạn.';
}
function scoreSummaryFromResult_(r){
  if(!r||!r.scores) return '';
  return Object.keys(r.scores).map(k=>k+' '+r.scores[k]).join(' · ');
}
function cleanText_(v,max){
  const s=v==null?'':String(v).replace(/[\u0000-\u001F\u007F]/g,' ').trim();
  return s.slice(0,max||5000);
}
function safeObject_(v){ return v&&typeof v==='object'&&!Array.isArray(v)?v:{}; }
function safeArray_(v){ return Array.isArray(v)?v:[]; }
function jsonString_(v){ try{return JSON.stringify(v==null?null:v);}catch(e){return '{}';} }
