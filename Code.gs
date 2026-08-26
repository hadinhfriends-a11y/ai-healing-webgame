/** AI INNER LAB — Google Apps Script backend */
const CONFIG=Object.freeze({
  SPREADSHEET_ID:'19UFOvKJJBzt73KKUXaO67WHukCNMPOU_V2dIJ7B18_M',
  SHEET_NAME:'Kết quả',
  PUBLIC_APP_URL:'https://hadinhfriends-a11y.github.io/ai-healing-webgame/'
});

const HEADERS=[
  'Thời gian','Submission ID','Họ tên','Zalo / SĐT','Nhóm tuổi',
  'Kết quả khảo sát chính','Bản soi chiếu AI','Bài test được đề xuất','Test Key',
  'Kết quả mini test','Điểm số / Top results','Link kết quả riêng',
  'Câu trả lời khảo sát JSON','Câu trả lời mini test JSON','Result JSON',
  'Nguồn / UTM','Đã bấm xem khóa học?',
  'Prize Key','Phần quà bí mật','Thời gian quay','Đã nhận quà?','Thời gian nhận quà'
];

const TEST_TITLES=Object.freeze({enneagram:'Enneagram Mini',direction:'Life Direction',career:'Career DNA',attachment:'Attachment Style',ai:'AI Readiness'});
const PRIZES=Object.freeze({
  voucher:{key:'voucher',title:'Voucher khóa học trị giá 1.000.000đ'},
  expert_session:{key:'expert_session',title:'01 buổi giải thích kết quả với chuyên gia tâm lý'},
  coaching_month:{key:'coaching_month',title:'01 tháng Coaching phát triển bản thân 1:1'}
});

function doGet(e){
  const p=(e&&e.parameter)||{};
  let data={ok:true,service:'AI INNER LAB'};
  if(p.action==='getResult') data=getResult(p.id);
  else if(p.action==='getPrize') data=getPrize(p.id);
  const callback=cleanCallback_(p.callback),body=JSON.stringify(data||null);
  if(callback) return ContentService.createTextOutput(callback+'('+body+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  try{
    let payload=null;
    const raw=((e&&e.postData&&e.postData.contents)||'').trim();
    if(raw&&raw.charAt(0)==='{') try{payload=JSON.parse(raw)}catch(ignore){}
    if(!payload&&e&&e.parameter&&e.parameter.payload) payload=JSON.parse(e.parameter.payload);
    if(!payload) throw new Error('Payload không hợp lệ.');
    const action=cleanText_(payload.action,40);
    if(action==='drawPrize') return messageResponse_('ai-inner-prize',drawPrize(payload));
    if(action==='claimPrize') return messageResponse_('ai-inner-claim',claimPrize(payload));
    return ContentService.createTextOutput(JSON.stringify(saveResult(payload))).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    const data={ok:false,error:String(err&&err.message||err)};
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  }
}

function messageResponse_(type,data){
  const payload=JSON.stringify({type:type,payload:data}).replace(/</g,'\\u003c');
  return HtmlService.createHtmlOutput('<!doctype html><meta charset="utf-8"><script>parent.postMessage('+payload+',"https://hadinhfriends-a11y.github.io");</script>');
}

function saveResult(payload){
  payload=payload||{};
  const sheet=getSheet_();ensureHeaders_(sheet);
  const id=cleanText_(payload.submissionId,80)||makeSubmissionId_(),resultUrl=buildResultUrl_(id);
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try{
    const existing=findRowById_(sheet,id);
    if(existing) return {ok:true,id:id,resultUrl:resultUrl,duplicate:true};
    const surveySnapshot=safeObject_(payload.surveySnapshot),surveyAnswers=safeArray_(payload.surveyAnswers),testAnswers=safeArray_(payload.answers),resultData=safeObject_(payload.resultData),testKey=cleanText_(payload.testKey,40),recommendedKey=cleanText_(payload.recommendedTest,40);
    sheet.appendRow([
      new Date(),id,cleanText_(payload.name,120),cleanText_(payload.contact,120),cleanText_(payload.ageGroup,60),
      surveySummary_(surveySnapshot),surveyReflection_(surveySnapshot),TEST_TITLES[recommendedKey]||recommendedKey,testKey,
      cleanText_(resultData.primaryTitle||resultData.headline,300),cleanText_(resultData.scoreSummary||scoreSummaryFromResult_(resultData),1000),
      resultUrl,jsonString_(surveyAnswers),jsonString_(testAnswers),jsonString_(resultData),jsonString_(safeObject_(payload.utm)),'Chưa ghi nhận',
      '','','','Chưa xác nhận',''
    ]);
  }finally{lock.releaseLock()}
  return {ok:true,id:id,resultUrl:resultUrl};
}

function getResult(id){
  id=cleanText_(id,80);if(!id)return null;
  const sheet=getSheet_();ensureHeaders_(sheet);const rowNum=findRowById_(sheet,id);if(!rowNum)return null;
  const row=sheet.getRange(rowNum,1,1,HEADERS.length).getValues()[0];let resultData={};try{resultData=JSON.parse(row[14]||'{}')}catch(ignore){}
  return {id:row[1],name:row[2]||'',contact:row[3]||'',testKey:row[8]||'',testTitle:TEST_TITLES[row[8]]||'',resultData:resultData,resultUrl:row[11]||buildResultUrl_(row[1]),prize:prizeFromRow_(row)};
}

function drawPrize(payload){
  const id=cleanText_(payload&&payload.submissionId,80);if(!id)throw new Error('Thiếu Submission ID.');
  const sheet=getSheet_();ensureHeaders_(sheet);const lock=LockService.getScriptLock();lock.waitLock(15000);
  try{
    const rowNum=findRowById_(sheet,id);if(!rowNum)throw new Error('Không tìm thấy kết quả để mở quà.');
    const row=sheet.getRange(rowNum,1,1,HEADERS.length).getValues()[0];
    const contact=cleanText_(payload.contact,120);if(contact&&!row[3])sheet.getRange(rowNum,4).setValue(contact);
    const existing=prizeFromRow_(row);
    if(existing) return Object.assign({ok:true,submissionId:id},existing);
    const prize=randomPrize_();
    sheet.getRange(rowNum,18,1,5).setValues([[prize.key,prize.title,new Date(),'Chưa xác nhận','']]);
    SpreadsheetApp.flush();
    return {ok:true,submissionId:id,prizeKey:prize.key,prizeTitle:prize.title,claimed:false};
  }finally{lock.releaseLock()}
}

function getPrize(id){
  id=cleanText_(id,80);if(!id)return null;
  const sheet=getSheet_();ensureHeaders_(sheet);const rowNum=findRowById_(sheet,id);if(!rowNum)return null;
  const row=sheet.getRange(rowNum,1,1,HEADERS.length).getValues()[0];
  if(!row[17])return null;
  return prizeFromRow_(row);
}

function claimPrize(payload){
  const id=cleanText_(payload&&payload.submissionId,80);if(!id)throw new Error('Thiếu Submission ID.');
  const sheet=getSheet_();ensureHeaders_(sheet);const lock=LockService.getScriptLock();lock.waitLock(15000);
  try{
    const rowNum=findRowById_(sheet,id);if(!rowNum)throw new Error('Không tìm thấy kết quả.');
    let row=sheet.getRange(rowNum,1,1,HEADERS.length).getValues()[0];
    if(!row[17]){
      const prize=randomPrize_();
      sheet.getRange(rowNum,18,1,5).setValues([[prize.key,prize.title,new Date(),'Chưa xác nhận','']]);
      row=sheet.getRange(rowNum,1,1,HEADERS.length).getValues()[0];
    }
    const contact=cleanText_(payload.contact,120);if(contact&&!row[3])sheet.getRange(rowNum,4).setValue(contact);
    if(String(row[20]||'')!=='Đã xác nhận')sheet.getRange(rowNum,21,1,2).setValues([['Đã xác nhận',new Date()]]);
    SpreadsheetApp.flush();
    const fresh=sheet.getRange(rowNum,1,1,HEADERS.length).getValues()[0];return Object.assign({ok:true},prizeFromRow_(fresh));
  }finally{lock.releaseLock()}
}

function randomPrize_(){
  const n=Math.random()*100;
  if(n<82) return PRIZES.voucher;
  if(n<97) return PRIZES.expert_session;
  return PRIZES.coaching_month;
}
function prizeFromRow_(row){if(!row||!row[17])return null;return {submissionId:row[1],prizeKey:row[17],prizeTitle:row[18],spinTime:row[19]||'',claimed:String(row[20]||'')==='Đã xác nhận',claimTime:row[21]||''}}
function findRowById_(sheet,id){const last=sheet.getLastRow();if(last<2)return 0;const found=sheet.getRange(2,2,last-1,1).createTextFinder(id).matchEntireCell(true).findNext();return found?found.getRow():0}
function ensureHeaders_(sheet){const current=sheet.getRange(1,1,1,HEADERS.length).getValues()[0];if(HEADERS.some((v,i)=>current[i]!==v))sheet.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);sheet.setFrozenRows(1)}
function setupSheet(){const sheet=getSheet_();ensureHeaders_(sheet);return {ok:true,spreadsheetId:CONFIG.SPREADSHEET_ID,sheetName:CONFIG.SHEET_NAME}}
function getSheet_(){const ss=SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID),sheet=ss.getSheetByName(CONFIG.SHEET_NAME);if(!sheet)throw new Error('Không tìm thấy sheet "'+CONFIG.SHEET_NAME+'".');return sheet}
function buildResultUrl_(id){return (CONFIG.PUBLIC_APP_URL||'').replace(/\/?$/,'/')+'?result='+encodeURIComponent(id)}
function cleanCallback_(v){const s=cleanText_(v,120);return /^[A-Za-z_$][0-9A-Za-z_$]*(?:\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(s)?s:''}
function makeSubmissionId_(){const stamp=Utilities.formatDate(new Date(),Session.getScriptTimeZone()||'Asia/Ho_Chi_Minh','yyMMdd');return stamp+'-'+Utilities.getUuid().replace(/-/g,'').slice(0,10)}
function surveySummary_(s){const vals=['self','patterns','agency','ai'].map(k=>Number(s[k]||0)),avg=vals.reduce((a,b)=>a+b,0)/4,band=avg>=76?'Nền tảng phản tư tốt':avg>=56?'Đang xây nền tảng phản tư':'Nên bắt đầu từ việc gọi tên';return band+' · Hiểu mình '+vals[0]+'% · Nhìn ra mô thức '+vals[1]+'% · Sẵn sàng hành động '+vals[2]+'% · Dùng AI có chủ đích '+vals[3]+'%'}
function surveyReflection_(s){const vals=['self','patterns','agency','ai'].map(k=>Number(s[k]||0)),avg=vals.reduce((a,b)=>a+b,0)/4;if(avg>=76)return'AI có thể trở thành một chiếc gương hữu ích: bạn đã có nền tảng khá tốt để phản tư, kiểm chứng và biến insight thành hành động.';if(avg>=56)return'AI có thể giúp bạn nhìn rõ hơn nếu bạn dùng nó để đặt câu hỏi, kiểm chứng và chuyển insight thành hành động.';return'AI nên bắt đầu bằng việc giúp bạn gọi tên điều đang diễn ra, thay vì cố đưa ra câu trả lời thay bạn.'}
function scoreSummaryFromResult_(r){if(!r||!r.scores)return'';return Object.keys(r.scores).map(k=>k+' '+r.scores[k]).join(' · ')}
function cleanText_(v,max){const s=v==null?'':String(v).replace(/[\u0000-\u001F\u007F]/g,' ').trim();return s.slice(0,max||5000)}
function safeObject_(v){return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}
function safeArray_(v){return Array.isArray(v)?v:[]}
function jsonString_(v){try{return JSON.stringify(v==null?null:v)}catch(e){return'{}'}}
