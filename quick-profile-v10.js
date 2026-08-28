/* AI INNER LAB — Quick Profile v10: one survey -> personality + healing focus -> gift */
(function(){
  const TYPES={
    '1':{name:'Người Cải Tiến',desc:'Bạn thường hướng đến sự đúng đắn, tiêu chuẩn và cải thiện.',strength:'Có tiêu chuẩn, trách nhiệm và khả năng nhìn ra điều cần được cải thiện.',healing:'Tự phán xét & áp lực hoàn hảo',healingDesc:'Bạn có thể dễ đặt chuẩn rất cao cho mình và khó cho phép bản thân sai, nghỉ hoặc làm chưa hoàn hảo.',step:'Trong 7 ngày, mỗi khi nghe tiếng nói “phải làm tốt hơn”, hãy hỏi: “Điều gì là đủ tốt để tôi tiến tiếp mà vẫn tử tế với mình?”'},
    '2':{name:'Người Trợ Giúp',desc:'Bạn dễ kết nối qua việc quan tâm, giúp đỡ và trở nên hữu ích.',strength:'Ấm áp, nhạy với nhu cầu người khác và có khả năng tạo cảm giác được quan tâm.',healing:'Ranh giới & giá trị bản thân',healingDesc:'Bạn có thể vô thức gắn giá trị của mình với việc được cần đến, được yêu quý hoặc được công nhận.',step:'Trước khi nói “được”, hãy hỏi: “Tôi thật sự muốn giúp hay đang sợ người khác thất vọng về mình?”'},
    '3':{name:'Người Thành Tựu',desc:'Bạn có xu hướng định hướng thành tựu, hiệu quả và hình ảnh năng lực.',strength:'Có động lực, thích nghi nhanh và biết biến mục tiêu thành kết quả.',healing:'Giá trị bản thân tách khỏi thành tích',healingDesc:'Bạn có thể dễ cảm thấy mình có giá trị hơn khi đang làm tốt, đạt mục tiêu hoặc được nhìn nhận tích cực.',step:'Mỗi ngày ghi lại một điều khiến bạn có giá trị mà không liên quan đến thành tích, năng suất hay sự công nhận.'},
    '4':{name:'Người Cá Tính',desc:'Bạn nhạy với bản sắc, cảm xúc và nhu cầu được thấu hiểu.',strength:'Tinh tế, giàu cảm xúc, sáng tạo và có khả năng nhìn thấy chiều sâu của trải nghiệm.',healing:'Cảm giác đủ đầy & thuộc về',healingDesc:'Bạn có thể dễ so sánh, cảm thấy mình thiếu một điều gì đó hoặc tin rằng người khác không thật sự hiểu mình.',step:'Khi so sánh xuất hiện, hãy gọi tên 3 điều đang có thật trong đời bạn thay vì tập trung vào điều đang thiếu.'},
    '5':{name:'Người Quan Sát',desc:'Bạn thiên về quan sát, phân tích và bảo vệ không gian riêng.',strength:'Suy nghĩ sâu, độc lập, quan sát tốt và có khả năng hiểu vấn đề phức tạp.',healing:'Tin tưởng & kết nối',healingDesc:'Bạn có thể bảo vệ năng lượng bằng cách rút vào trong, tự xử lý mọi thứ và hạn chế để người khác chạm vào phần dễ tổn thương.',step:'Chọn một người an toàn và chia sẻ một điều bạn thường tự giữ trong lòng — không cần giải thích hay giải quyết ngay.'},
    '6':{name:'Người Trung Thành',desc:'Bạn chú ý rủi ro, sự chắc chắn và lòng tin.',strength:'Cẩn trọng, trung thành, có khả năng nhìn trước rủi ro và bảo vệ điều quan trọng.',healing:'An toàn nội tâm & nỗi lo',healingDesc:'Bạn có thể dành nhiều năng lượng để dự đoán điều xấu, tìm sự chắc chắn hoặc kiểm tra xem mình có đang an toàn không.',step:'Khi lo lắng tăng lên, chia giấy thành 2 cột: “Điều tôi biết là thật” và “Điều tôi đang tưởng tượng có thể xảy ra”.'},
    '7':{name:'Người Nhiệt Huyết',desc:'Bạn tìm tự do, lựa chọn và năng lượng tích cực.',strength:'Lạc quan, nhanh nhạy, nhiều ý tưởng và có khả năng tạo năng lượng cho người khác.',healing:'Ở lại với cảm xúc khó',healingDesc:'Bạn có thể nhanh chóng tìm trải nghiệm, kế hoạch hoặc góc nhìn mới để tránh cảm giác bị mắc kẹt trong đau buồn hay giới hạn.',step:'Khi muốn lập tức chuyển sang thứ mới, hãy cho mình 10 phút ở lại và gọi tên chính xác cảm xúc đang khó chịu.'},
    '8':{name:'Người Thách Thức',desc:'Bạn thiên về sức mạnh, tự chủ và bảo vệ mình/người mình quan tâm.',strength:'Quyết đoán, mạnh mẽ, có khả năng đứng ra bảo vệ và dẫn dắt trong tình huống khó.',healing:'Dễ tổn thương & nhu cầu kiểm soát',healingDesc:'Bạn có thể dùng sức mạnh, sự chủ động hoặc kiểm soát để tránh cảm giác bị yếu thế, lệ thuộc hoặc bị tổn thương.',step:'Trong một tình huống căng thẳng, thử nói một câu bắt đầu bằng “Điều tôi thật sự lo là…” trước khi đưa ra giải pháp hoặc phản ứng mạnh.'},
    '9':{name:'Người Hòa Giải',desc:'Bạn ưu tiên hòa khí, ổn định và giảm xung đột.',strength:'Điềm tĩnh, dễ nhìn nhiều góc độ và có khả năng tạo không gian an toàn cho người khác.',healing:'Tiếng nói cá nhân & nhu cầu bị bỏ quên',healingDesc:'Bạn có thể dễ ưu tiên sự yên ổn đến mức trì hoãn quyết định, nuốt nhu cầu của mình hoặc khó biết điều mình thật sự muốn.',step:'Mỗi ngày chọn một việc nhỏ và nói rõ: “Tôi muốn…” mà không thêm lời xin lỗi hay giải thích quá nhiều.'}
  };

  const Q=[
    {q:'Khi cảm thấy mình “chưa đủ tốt”, phản ứng tự nhiên nhất của bạn là gì?',o:[['Tôi sửa cho đúng hơn và khá khó chịu với lỗi của mình.','1'],['Tôi hướng ra ngoài, giúp đỡ hoặc làm người khác vui.','2'],['Tôi tăng tốc, làm tốt hơn để chứng minh năng lực.','3']]},
    {q:'Khi bên trong không ổn, bạn thường nghiêng về cách nào?',o:[['Tôi đi sâu vào cảm xúc và dễ thấy mình khác biệt hoặc thiếu điều gì đó.','4'],['Tôi rút vào trong, quan sát và tự xử lý trước.','5'],['Tôi nghĩ nhiều kịch bản và tìm điểm chắc chắn để yên tâm.','6']]},
    {q:'Khi căng thẳng kéo dài, điều nào giống bạn hơn?',o:[['Tôi tìm một kế hoạch, trải nghiệm hoặc điều thú vị mới.','7'],['Tôi siết quyền kiểm soát và không muốn ai lấn át mình.','8'],['Tôi nhường hoặc im lặng để mọi thứ đừng căng thêm.','9']]},
    {q:'Khi một kế hoạch quan trọng không như ý, bạn thường…',o:[['Nhìn ngay vào chỗ sai và muốn sửa cho chuẩn.','1'],['Cảm nhận thất vọng rất sâu và dễ thấy “có gì đó thiếu”.','4'],['Nhanh chóng tìm phương án khác để không bị mắc kẹt.','7']]},
    {q:'Khi một người quan trọng làm bạn tổn thương, phản ứng đầu tiên thường là…',o:[['Tôi vẫn quan tâm và mong họ nhận ra những gì tôi đã dành cho họ.','2'],['Tôi rút xa, khóa cảm xúc và cần rất nhiều không gian.','5'],['Tôi dựng ranh giới mạnh hoặc đối diện trực tiếp.','8']]},
    {q:'Khi phải đưa ra một quyết định lớn, điều gì ảnh hưởng bạn nhiều nhất?',o:[['Điều nào cho kết quả tốt và chứng minh mình làm được.','3'],['Điều nào ít rủi ro hơn và có cơ sở để tin tưởng.','6'],['Điều nào ít làm mọi người xung đột hoặc thất vọng.','9']]},
    {q:'Điều nào dưới đây dễ làm bạn mệt nhất về chính mình?',o:[['Tiếng nói bên trong luôn chỉ ra cái chưa đủ tốt.','1'],['Cảm giác bị quá tải khi người khác cần quá nhiều từ mình.','5'],['Khó biết chính xác mình muốn gì khi mọi người đều có nhu cầu.','9']]},
    {q:'Trong mối quan hệ, bạn thường mong nhận được điều gì nhất?',o:[['Cảm giác mình được trân trọng và những gì mình cho đi có ý nghĩa.','2'],['Sự chắc chắn rằng người kia vẫn ở đây và đáng tin.','6'],['Sự tự do, nhẹ nhàng và không bị bó buộc quá nhiều.','7']]},
    {q:'Nếu mất đi một điều, điều nào dễ chạm mạnh nhất vào cảm giác về chính bạn?',o:[['Sự công nhận rằng tôi có năng lực và thành công.','3'],['Cảm giác tôi là một người đặc biệt và được thật sự thấu hiểu.','4'],['Quyền tự chủ và khả năng tự bảo vệ mình.','8']]},
    {q:'Khi bị góp ý hoặc phản đối, điều nào gần bạn nhất?',o:[['Tôi tự xem lại xem điều gì chưa đúng và muốn chỉnh cho chuẩn.','1'],['Tôi bắt đầu nghi ngờ, kiểm tra xem ai đúng và đâu là điều an toàn.','6'],['Tôi phản ứng mạnh nếu cảm thấy người khác đang cố kiểm soát mình.','8']]},
    {q:'Trong các mối quan hệ thân thiết, điều nào hay xảy ra hơn?',o:[['Tôi cho đi khá nhiều rồi đôi lúc thất vọng khi không được đáp lại.','2'],['Tôi dễ thấy mình không được hiểu sâu như mình mong muốn.','4'],['Tôi thường nhường nhu cầu của mình để giữ hòa khí.','9']]},
    {q:'Khi có một khoảng thời gian trống, bạn tự nhiên nghiêng về…',o:[['Làm thêm một việc có ích hoặc tiến gần hơn tới mục tiêu.','3'],['Ở một mình, đọc, tìm hiểu hoặc nạp lại năng lượng.','5'],['Tìm một trải nghiệm mới, ý tưởng mới hoặc điều khiến mình hào hứng.','7']]}
  ];

  const ORIGINAL_HOME=window.renderHome;
  const ORIGINAL_HOW=window.renderHow;
  const ORIGINAL_RESULT=window.renderResult;

  function currentId(shared){
    if(shared&&shared.id)return shared.id;
    if(state.submissionId)return state.submissionId;
    try{return new URL(state.shareUrl||location.href,location.href).searchParams.get('result')||''}catch(e){return''}
  }
  function esc(s){return typeof h==='function'?h(s):String(s||'')}
  function scoreProfile(){
    const counts={},weighted={};Object.keys(TYPES).forEach(k=>{counts[k]=0;weighted[k]=0});
    state.surveyAnswers.forEach((answerIndex,i)=>{
      const opt=Q[i]&&Q[i].o[Number(answerIndex)];if(!opt)return;
      const type=opt[1],w=i<6?1:1.25;counts[type]+=1;weighted[type]+=w;
    });
    const sorted=Object.keys(TYPES).sort((a,b)=>counts[b]-counts[a]||weighted[b]-weighted[a]||Number(a)-Number(b));
    const top=sorted[0],second=sorted[1];
    const ties=sorted.filter(k=>counts[k]===counts[top]&&Math.abs(weighted[k]-weighted[top])<0.001);
    const gap=counts[top]-counts[second];
    const confidence=gap>=2?'Cao':gap>=1?'Khá rõ':'Cần làm rõ thêm';
    return {counts,weighted,sorted,top,second,ties,confidence};
  }
  function buildResult(typeKey,base){
    const m=TYPES[typeKey],second=base.sorted.find(k=>k!==typeKey)||base.second;
    const secondMeta=TYPES[second];
    return {
      version:'quick-profile-v10',testKey:'quick_profile',primaryKey:typeKey,
      primaryTitle:`Type ${typeKey} · ${m.name}`,
      headline:'Xu hướng tính cách nổi bật',description:m.desc,strength:m.strength,
      blindSpot:m.healing,nextStep:m.step,
      healingTitle:m.healing,healingDesc:m.healingDesc,
      secondaryType:second,secondaryHealing:secondMeta?secondMeta.healing:'',
      confidence:base.confidence,
      scores:Object.fromEntries(Object.keys(TYPES).map(k=>['T'+k,base.counts[k]])),
      rawTypeScores:base.counts,
      scoreSummary:base.sorted.slice(0,4).map(k=>`Type ${k} ${base.counts[k]}/4 tín hiệu`).join(' · '),
      tags:['Tính cách','Điểm mù','Vùng cần chăm sóc']
    };
  }

  window.renderHome=function(){
    show(`<section class="home quick-home">
      <div class="hero-copy"><span class="kicker"><span class="spark">✦</span> 2 phút soi bản thân</span>
        <h1><span class="ai">AI</span> có thể<br>chữa lành bạn<br>không?</h1>
        <p class="lead">Một khảo sát nhanh để nhận ra <b>xu hướng tính cách nổi bật</b>, điểm dễ mắc kẹt và vùng đang cần được chăm sóc nhiều hơn — rồi mở quà ngay.</p>
        <div class="lock-note"><span class="shield">♢</span><span>Đây là trải nghiệm tự khám phá, <b>không phải chẩn đoán hay điều trị tâm lý.</b></span></div>
        <div class="btn-row home-actions"><button class="btn-primary large" onclick="startSurvey()">✦ &nbsp;BẮT ĐẦU KHẢO SÁT &nbsp;→</button><button class="btn large" onclick="renderHow()">◉ &nbsp;Xem cách hoạt động</button></div>
        <div class="feature-chips"><div class="feature-chip"><div class="icon-circle">12</div><div><strong>12 câu nhanh</strong><span>Chọn theo phản ứng tự nhiên</span></div></div><div class="feature-chip"><div class="icon-circle">✺</div><div><strong>Xu hướng tính cách</strong><span>Động lực · điểm mạnh · điểm mù</span></div></div><div class="feature-chip"><div class="icon-circle">🎁</div><div><strong>Mở quà ngay</strong><span>Không cần làm thêm mini test</span></div></div></div>
      </div>
      <div class="hero-panel glass quick-hero"><div class="privacy-badge">🔒 &nbsp;<b>Tự khám phá</b><br><span class="tiny">Không thay thế chuyên gia</span></div><div class="hero-top"><div class="hello"><div class="tiny">✦ AI INNER LAB · QUICK PROFILE</div><h2>Hiểu mình trước khi sửa mình.</h2><p>Thay vì làm nhiều bài test, bạn chỉ cần một lượt khảo sát để nhận một bản soi chiếu ngắn gọn.</p><div class="micro-pills"><span class="micro-pill">◷ ~2 phút</span><span class="micro-pill">12 câu</span><span class="micro-pill">1 kết quả</span></div></div><div class="orb-wrap">${orb()}</div></div>
        <div class="quick-preview"><div class="quick-preview-card"><span>01</span><b>Tính cách nổi bật</b><small>Điều gì thường thúc đẩy phản ứng của bạn?</small></div><div class="quick-preview-card"><span>02</span><b>Vùng cần chăm sóc</b><small>Điểm nào đang dễ khiến bạn mắc kẹt?</small></div><div class="quick-preview-card"><span>03</span><b>Bước tiếp theo</b><small>Một hành động nhỏ để bắt đầu thay đổi.</small></div></div>
        <div class="giftbar">🎁 <span>Hoàn thành khảo sát → xem kết quả → <b>mở Hộp Quà Bí Mật ngay.</b></span><span style="margin-left:auto">→</span></div>
      </div>
      <div class="statbar"><div class="stat"><strong>12</strong><span>câu chọn nhanh</span></div><div class="stat"><strong>~2 phút</strong><span>toàn bộ khảo sát</span></div><div class="stat"><strong>2 kết luận</strong><span>tính cách + vùng cần chăm sóc</span></div><div class="stat"><strong>1 bước</strong><span>đi thẳng đến mở quà</span></div></div>
    </section>`);
  };

  window.renderHow=function(){
    show(`<section class="content-pad"><div class="snapshot glass"><div class="snapshot-card"><span class="kicker">CÁCH HOẠT ĐỘNG</span>${orb()}<div class="snapshot-title">Một khảo sát. Một bản soi chiếu. Một món quà.</div><p class="muted">Không phải chatbot chữa trị và không phải chẩn đoán tâm lý.</p></div><div><h2 class="section-title">12 câu → Bản đồ bên trong → Mở quà</h2><div class="snapshot-bars"><div class="insight"><div class="icon-circle">01</div><div><h4>12 câu tình huống nhanh</h4><p>Chọn phản ứng gần với bạn nhất thay vì cố chọn phiên bản lý tưởng.</p></div></div><div class="insight"><div class="icon-circle">02</div><div><h4>Nhận xu hướng tính cách + vùng cần chăm sóc</h4><p>Kết quả là gợi ý tự quan sát, không phải nhãn cố định hay chẩn đoán.</p></div></div><div class="insight"><div class="icon-circle">03</div><div><h4>Mở Hộp Quà Bí Mật</h4><p>Không cần làm thêm mini test. Kết quả được lưu để tạo Submission ID và nhận quà.</p></div></div></div><div class="btn-row" style="margin-top:22px"><button class="btn-primary" onclick="startSurvey()">BẮT ĐẦU →</button><button class="btn" onclick="renderHome()">Quay lại</button></div></div></div></section>`);
  };

  window.startSurvey=function(){state.surveyIndex=0;state.surveyAnswers=[];state.quickProfile=null;state.submissionId='';state.shareUrl='';renderSurvey()};
  window.renderSurvey=function(){
    const i=state.surveyIndex,item=Q[i],progress=Math.round(i/Q.length*100);
    show(`<section class="content-pad"><div class="survey-shell quick-survey"><div class="survey-main glass"><div class="top-progress"><span class="kicker">QUICK PROFILE · ${i+1}/${Q.length}</span><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div><b class="tiny">${progress}%</b></div><div class="question-label">✦ CHỌN PHẢN ỨNG GẦN BẠN NHẤT</div><div class="big-question">${esc(item.q)}</div><div class="quick-options">${item.o.map((o,idx)=>`<button class="quick-option ${state.surveyAnswers[i]===idx?'selected':''}" onclick="answerSurvey(${idx})"><span class="quick-letter">${String.fromCharCode(65+idx)}</span><strong>${esc(o[0])}</strong></button>`).join('')}</div><div class="survey-actions"><button class="btn" onclick="${i?'prevSurvey()':'renderHome()'}">← Quay lại</button><span class="tiny">Chọn phản ứng đầu tiên khiến bạn thấy “đúng là mình”.</span></div></div><aside class="side-card glass"><div class="tiny">✦ AI INNER LAB</div><div class="orb-wrap" style="min-height:125px">${orb()}</div><div class="assistant-msg"><strong>${i<4?'Đừng suy nghĩ quá lâu.':i<8?'Bạn đang chạm tới mô thức sâu hơn.':'Sắp thấy bản đồ của mình rồi.'}</strong><span>Không có đáp án tốt hay xấu. Mục tiêu là nhận diện xu hướng.</span></div><div class="side-stats"><div class="side-stat"><strong>${progress}%</strong><span>Hoàn thành</span></div><div class="side-stat"><strong>${Q.length-i}</strong><span>Câu còn lại</span></div></div><div class="tip-box"><b style="color:#d78aff">Lưu ý</b><br>Kết quả là công cụ tự khám phá, không phải chẩn đoán hay định nghĩa cố định về bạn.</div></aside></div></section>`);
  };
  window.answerSurvey=function(v){state.surveyAnswers[state.surveyIndex]=Number(v);if(state.surveyIndex<Q.length-1){state.surveyIndex++;renderSurvey();return}finishQuickSurvey()};
  window.prevSurvey=function(){if(state.surveyIndex>0){state.surveyIndex--;renderSurvey()}};

  function finishQuickSurvey(){
    const base=scoreProfile();
    if(base.ties.length>1){renderTieBreak(base);return}
    finalizeProfile(base.top,base);
  }
  function renderTieBreak(base){
    const candidates=base.ties.slice(0,4);
    show(`<section class="content-pad"><div class="lead-card glass quick-tie"><span class="kicker">CÂU LÀM RÕ CUỐI</span><h2 class="section-title">Điều nào chạm đúng động lực bên trong của bạn hơn?</h2><p class="muted">Các tín hiệu đang khá sát nhau. Chọn câu gần với phần “tại sao tôi lại như vậy” nhất.</p><div class="tie-grid">${candidates.map(k=>`<button class="tie-card" onclick="chooseQuickTie('${k}')"><span>TYPE ${k}</span><h3>${esc(TYPES[k].name)}</h3><p>${esc(TYPES[k].desc)}</p></button>`).join('')}</div><button class="btn" onclick="state.surveyIndex=Q.length-1;renderSurvey()">← Quay lại câu trước</button></div></section>`);
    state.quickTieBase=base;
  }
  window.chooseQuickTie=function(k){const base=state.quickTieBase||scoreProfile();base.confidence='Đã làm rõ';finalizeProfile(String(k),base)};
  function finalizeProfile(typeKey,base){
    const result=buildResult(typeKey,base);state.quickProfile=result;state.result=result;state.testKey='quick_profile';state.recommended='quick_profile';
    renderQuickResult(result,false);saveQuickProfile(result);
  }

  function surveyPayload(result){
    const answers=state.surveyAnswers.map((idx,i)=>{const o=Q[i].o[Number(idx)];return {question:Q[i].q,answer:o?o[0]:'',type:o?o[1]:''}});
    return {testKey:'quick_profile',testTitle:'Quick Inner Profile',name:'',contact:'',ageGroup:'',recommendedTest:'quick_profile',surveySnapshot:{personalityType:result.primaryKey,personalityName:TYPES[result.primaryKey].name,healingTitle:result.healingTitle,secondaryHealing:result.secondaryHealing,confidence:result.confidence},surveyAnswers:answers,answers:[],resultData:result,utm:state.utm||{}};
  }
  function saveQuickProfile(result){
    state.quickSaving=true;state.quickSaveError='';updateQuickSaveUI();
    google.script.run.withSuccessHandler(res=>{state.quickSaving=false;state.submissionId=res.id||'';state.shareUrl=res.resultUrl||'';updateQuickSaveUI()}).withFailureHandler(err=>{state.quickSaving=false;state.quickSaveError=(err&&err.message)||String(err||'Không lưu được kết quả');updateQuickSaveUI()}).saveResult(surveyPayload(result));
  }
  window.retryQuickSave=function(){if(state.quickProfile)saveQuickProfile(state.quickProfile)};
  function updateQuickSaveUI(){
    const btn=document.getElementById('quickGiftBtn'),status=document.getElementById('quickSaveStatus'),share=document.getElementById('quickShare');
    if(btn){btn.disabled=!state.submissionId;btn.textContent=state.submissionId?'🎁 MỞ HỘP QUÀ NGAY →':'ĐANG TẠO LƯỢT NHẬN QUÀ…'}
    if(status){if(state.quickSaveError)status.innerHTML=`<span style="color:#ff9aa8">Chưa lưu được kết quả.</span> <button class="inline-retry" onclick="retryQuickSave()">Thử lại</button>`;else status.textContent=state.submissionId?'✓ Kết quả đã được lưu. Hộp quà đã sẵn sàng.':'Đang lưu kết quả và tạo Submission ID…'}
    if(share&&state.shareUrl)share.innerHTML=`<span>Link kết quả riêng</span><input readonly value="${esc(state.shareUrl)}"><button class="btn" onclick="navigator.clipboard&&navigator.clipboard.writeText('${esc(state.shareUrl)}')">Copy</button>`;
  }
  window.openGiftAfterQuick=function(){if(!state.submissionId){if(state.quickSaveError)retryQuickSave();return}renderLuckyWheel()};

  function renderQuickResult(r,sharedMode){
    const m=TYPES[r.primaryKey]||TYPES['9'];
    const raw=r.rawTypeScores||{};
    const ranked=Object.keys(TYPES).sort((a,b)=>(Number(raw[b]||0)-Number(raw[a]||0))).slice(0,3);
    const id=currentId();if(sharedMode&&id)state.submissionId=id;
    show(`<section class="content-pad"><div class="quick-result-wrap"><div class="quick-result-hero glass"><span class="kicker">KẾT QUẢ QUICK PROFILE</span><div class="quick-type-badge">TYPE ${esc(r.primaryKey)}</div><h2>${esc(m.name)}</h2><p class="lead">${esc(m.desc)}</p><div class="confidence-pill">Độ rõ của xu hướng: <b>${esc(r.confidence||'Khá rõ')}</b></div></div><div class="quick-healing-card glass"><span class="kicker">♡ VÙNG CẦN ĐƯỢC CHĂM SÓC</span><h3>${esc(r.healingTitle||m.healing)}</h3><p>${esc(r.healingDesc||m.healingDesc)}</p><div class="healing-note">Đây là gợi ý để tự quan sát — không phải chẩn đoán tổn thương tâm lý.</div></div><div class="quick-strength glass"><div class="icon-circle">✦</div><div><h4>Điểm mạnh tự nhiên</h4><p>${esc(r.strength||m.strength)}</p></div></div><div class="quick-strength glass"><div class="icon-circle">↗</div><div><h4>Một bước nhỏ để bắt đầu</h4><p>${esc(r.nextStep||m.step)}</p></div></div><div class="quick-signals glass"><div class="chart-title">3 XU HƯỚNG CÓ NHIỀU TÍN HIỆU NHẤT</div>${ranked.map(k=>`<div class="quick-signal-row"><span>Type ${k} · ${esc(TYPES[k].name)}</span><b>${Number(raw[k]||0)}/4</b></div>`).join('')}</div><div class="quick-gift-cta glass"><div><span class="kicker">🎁 PHẦN TIẾP THEO</span><h3>Không cần làm thêm bài test.</h3><p>Hộp Quà Bí Mật đang chờ bạn.</p><div id="quickSaveStatus" class="tiny">${sharedMode?'✓ Kết quả đã được lưu. Hộp quà đã sẵn sàng.':'Đang lưu kết quả và tạo Submission ID…'}</div></div><button id="quickGiftBtn" class="btn-primary large" onclick="openGiftAfterQuick()" ${sharedMode?'':'disabled'}>${sharedMode?'🎁 MỞ HỘP QUÀ NGAY →':'ĐANG TẠO LƯỢT NHẬN QUÀ…'}</button></div><div id="quickShare" class="quick-share"></div></div></section>`);
    if(sharedMode){state.quickProfile=r;state.result=r;state.testKey='quick_profile';state.quickSaving=false;setTimeout(updateQuickSaveUI,0)}
  }

  window.renderResult=function(shared){
    const r=(shared&&shared.resultData)||state.result;
    if((shared&&shared.testKey==='quick_profile')||(r&&r.version==='quick-profile-v10')){
      if(shared){state.submissionId=shared.id||state.submissionId||'';state.shareUrl=shared.resultUrl||state.shareUrl||'';if(shared.contact)state.profile.contact=shared.contact;if(shared.prize&&shared.prize.prizeKey)state.prize=shared.prize}
      renderQuickResult(r,true);return;
    }
    return ORIGINAL_RESULT(shared);
  };

  const style=document.createElement('style');style.id='quick-profile-v10-style';style.textContent=`
    .quick-preview{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px}.quick-preview-card{padding:16px;border:1px solid var(--line);border-radius:18px;background:rgba(10,18,54,.58);display:grid;gap:6px}.quick-preview-card span{color:#c878ff;font-size:11px;font-weight:900}.quick-preview-card b{font-size:13px}.quick-preview-card small{color:#94a0c5;line-height:1.45}.quick-options{display:grid;gap:12px;max-width:900px;margin:0 auto}.quick-option{border:1px solid rgba(121,146,231,.32);background:linear-gradient(180deg,rgba(20,35,85,.62),rgba(10,17,49,.76));border-radius:19px;color:#fff;cursor:pointer;padding:18px;display:grid;grid-template-columns:46px 1fr;align-items:center;text-align:left;gap:14px;transition:.2s transform,.2s border-color,.2s background}.quick-option:hover,.quick-option.selected{transform:translateY(-2px);border-color:#c471ff;background:linear-gradient(135deg,rgba(133,72,236,.55),rgba(33,64,145,.72));box-shadow:0 10px 30px rgba(120,72,230,.18)}.quick-letter{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:rgba(151,100,255,.18);border:1px solid rgba(180,140,255,.38);font-weight:900}.quick-option strong{font-size:15px;line-height:1.5}.tie-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:22px 0}.tie-card{border:1px solid var(--line);border-radius:20px;padding:20px;text-align:left;color:#fff;background:rgba(18,29,72,.72);cursor:pointer}.tie-card:hover{border-color:#c46fff;transform:translateY(-2px)}.tie-card span{font-size:10px;color:#ca8dff;font-weight:900}.tie-card h3{margin:8px 0}.tie-card p{color:#aeb8d7;line-height:1.55}.quick-result-wrap{display:grid;grid-template-columns:1fr 1fr;gap:16px}.quick-result-hero,.quick-healing-card{border-radius:28px;padding:30px}.quick-type-badge{width:110px;height:110px;border-radius:50%;display:grid;place-items:center;margin:22px 0 16px;background:radial-gradient(circle,rgba(164,85,247,.34),rgba(62,71,188,.18));border:1px solid rgba(184,120,255,.62);font-size:20px;font-weight:900}.quick-result-hero h2{font-size:clamp(34px,4.6vw,58px);margin:0 0 10px}.confidence-pill{display:inline-flex;margin-top:14px;padding:9px 12px;border-radius:999px;border:1px solid var(--line);font-size:12px;color:#cdd5f0}.quick-healing-card{background:linear-gradient(145deg,rgba(69,35,95,.64),rgba(15,25,61,.8));border-color:rgba(236,113,206,.25)}.quick-healing-card h3{font-size:clamp(28px,3.5vw,44px);margin:16px 0 12px}.quick-healing-card p{font-size:16px;color:#dde3f8;line-height:1.65}.healing-note{margin-top:18px;padding:11px 13px;border:1px solid rgba(255,255,255,.1);border-radius:14px;color:#aeb8d7;font-size:11px}.quick-strength{border-radius:22px;padding:18px;display:flex;gap:14px;align-items:flex-start}.quick-strength h4{margin:2px 0 7px}.quick-strength p{margin:0;color:#aeb8d7;line-height:1.55}.quick-signals{grid-column:1/-1;border-radius:22px;padding:20px}.quick-signal-row{display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid var(--line2);font-size:13px}.quick-signal-row:last-child{border-bottom:0}.quick-gift-cta{grid-column:1/-1;border-radius:24px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px;background:linear-gradient(135deg,rgba(92,50,180,.45),rgba(20,54,112,.62))}.quick-gift-cta h3{font-size:25px;margin:10px 0 4px}.quick-gift-cta p{margin:0 0 8px;color:#b7c1df}.quick-share{grid-column:1/-1;display:flex;gap:8px;align-items:center}.quick-share input{flex:1}.inline-retry{border:0;background:none;color:#d889ff;text-decoration:underline;cursor:pointer}@media(max-width:820px){.quick-preview{grid-template-columns:1fr}.quick-result-wrap{grid-template-columns:1fr}.quick-gift-cta{flex-direction:column;align-items:flex-start}.quick-gift-cta .btn-primary{width:100%}.tie-grid{grid-template-columns:1fr}.quick-option{grid-template-columns:40px 1fr;padding:15px}.quick-type-badge{width:88px;height:88px}}
  `;document.head.appendChild(style);
  console.info('AI INNER LAB Quick Profile v10 loaded');
})();