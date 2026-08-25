/* AI INNER LAB — Fast adaptive assessment V2 + Lucky Wheel */
(function(){
  if(typeof TESTS==='undefined'||typeof state==='undefined') return;

  const ORIGINAL_COMPUTE=computeResult;
  const ORIGINAL_RENDER=renderResult;

  const V2={
    enneagram:{time:'~2 phút',core:[
      ['Khi thấy điều gì chưa đúng chuẩn, tôi khó bỏ qua vì cảm giác nó nên được làm tốt hơn.','1'],
      ['Tôi cảm nhận giá trị của mình rõ nhất khi biết mình hữu ích và được người khác cần đến.','2'],
      ['Kết quả và sự công nhận dễ trở thành thước đo khiến tôi biết mình đang làm tốt hay không.','3'],
      ['Tôi cần cảm thấy mình sống đúng bản sắc riêng; việc quá giống số đông khiến tôi không thoải mái.','4'],
      ['Trước tình huống mới, tôi thường muốn hiểu đủ và giữ năng lượng cho mình trước khi bước vào.','5'],
      ['Tôi tự nhiên rà rủi ro và điểm chưa chắc chắn để cảm thấy an toàn hơn.','6'],
      ['Khi cảm xúc nặng xuất hiện, tôi dễ hướng tới ý tưởng hoặc trải nghiệm mới để thấy nhẹ hơn.','7'],
      ['Tôi phản ứng mạnh khi cảm thấy bị kiểm soát, bị ép hoặc bị đặt vào thế yếu.','8'],
      ['Tôi thường ưu tiên sự yên ổn và có thể gác mong muốn của mình lại để tránh căng thẳng.','9']
    ],extra:{
      '1':['Khi mắc lỗi, điều khó chịu nhất thường là cảm giác mình đã không làm điều đúng hoặc đủ chuẩn.','1'],
      '2':['Khi giúp rất nhiều mà không được ghi nhận, tôi dễ cảm thấy mình không còn quan trọng với người kia.','2'],
      '3':['Tôi có xu hướng điều chỉnh cách thể hiện để trở thành phiên bản hiệu quả và đáng ngưỡng mộ hơn.','3'],
      '4':['Tôi thường để ý điều còn thiếu hoặc điều khiến trải nghiệm của mình khác với người khác.','4'],
      '5':['Khi bị đòi hỏi quá nhiều, phản ứng tự nhiên của tôi là rút lại, quan sát và giữ nguồn lực.','5'],
      '6':['Tôi thấy nhẹ hơn khi có kế hoạch dự phòng, người đáng tin hoặc bằng chứng đủ chắc chắn.','6'],
      '7':['Bị kẹt lâu trong cảm xúc nặng hoặc giới hạn khiến tôi rất khó chịu.','7'],
      '8':['Tôi thà đối đầu trực tiếp còn hơn để người khác quyết định thay hoặc thấy mình bất lực.','8'],
      '9':['Tôi có thể trì hoãn việc quan trọng của mình vì giữ mọi thứ êm và ổn định dễ hơn.','9']
    }},
    direction:{time:'~90 giây',core:[
      ['Tôi có thể nói rõ điều quan trọng nhất mình muốn thay đổi trong 90 ngày tới.','clarity'],
      ['Tôi biết điều gì cần nói “không” để bảo vệ ưu tiên hiện tại.','clarity'],
      ['Phần lớn tuần của tôi có đủ năng lượng cho việc thật sự quan trọng.','energy'],
      ['Tôi có cách nghỉ ngơi giúp mình hồi phục chứ không chỉ tạm quên mệt.','energy'],
      ['Cách tôi dùng thời gian khá khớp với điều tôi nói là quan trọng.','alignment'],
      ['Tôi ít phải sống theo một phiên bản chỉ để đáp ứng kỳ vọng của người khác.','alignment'],
      ['Tôi biến mục tiêu thành bước nhỏ có thời điểm thực hiện cụ thể.','momentum'],
      ['Tôi duy trì được nhịp hành động đều thay vì chỉ bùng nổ theo cảm hứng.','momentum']
    ],extra:{
      clarity:['Nếu có nhiều cơ hội cùng xuất hiện, tôi biết tiêu chí nào để chọn và bỏ.','clarity'],
      energy:['Tôi nhận ra sớm dấu hiệu cạn pin và chủ động điều chỉnh trước khi quá tải.','energy'],
      alignment:['Những cam kết hiện tại phản ánh khá đúng giá trị và con người tôi muốn trở thành.','alignment'],
      momentum:['Khi mất động lực, tôi vẫn có một hệ thống nhỏ giúp mình tiếp tục.','momentum']
    }},
    career:{time:'~2 phút',core:[
      ['Tôi thích giải quyết vấn đề bằng hành động trực tiếp, công cụ hoặc thứ có thể vận hành được.','R'],
      ['Tôi có năng lượng khi thấy một sản phẩm hay hệ thống hữu hình hoạt động tốt hơn nhờ mình.','R'],
      ['Một câu hỏi khó có thể khiến tôi tò mò đủ lâu để đào đến nguyên nhân.','I'],
      ['Tôi thích công việc cần logic, bằng chứng hoặc phân tích hơn là chỉ làm theo thói quen.','I'],
      ['Tôi có năng lượng khi được tạo ra cách thể hiện, ý tưởng hoặc giải pháp mới.','A'],
      ['Tôi khó chịu khi công việc quá máy móc và không có khoảng cho sự sáng tạo.','A'],
      ['Tôi thích giúp người khác học, phát triển, hiểu mình hoặc vượt qua khó khăn.','S'],
      ['Công việc tạo tác động tích cực lên con người thường cho tôi nhiều ý nghĩa.','S'],
      ['Tôi thích thuyết phục, dẫn dắt, thương lượng hoặc biến cơ hội thành kết quả.','E'],
      ['Khi nhóm cần người đứng ra quyết định và chịu trách nhiệm, tôi khá sẵn sàng.','E'],
      ['Tôi thích hệ thống rõ ràng, dữ liệu sạch và quy trình có trật tự.','C'],
      ['Tôi thấy thoải mái khi tổ chức thông tin, kế hoạch hoặc chi tiết phức tạp.','C']
    ],extra:{
      R:['Tôi thích học qua làm thử và điều chỉnh hơn là chỉ thảo luận lý thuyết.','R'],
      I:['Tôi thường muốn hiểu “tại sao” trước khi chấp nhận một kết luận.','I'],
      A:['Tôi muốn công việc cho phép tạo dấu ấn cá nhân thay vì chỉ lặp công thức.','A'],
      S:['Tôi thấy hài lòng khi mình giúp một người tiến bộ rõ rệt.','S'],
      E:['Mục tiêu, cơ hội và khả năng tạo ảnh hưởng thường kích hoạt năng lượng của tôi.','E'],
      C:['Tôi dễ nhận ra lỗi chi tiết, thiếu cấu trúc hoặc quy trình chưa chặt.','C']
    }},
    attachment:{time:'~90 giây',core:[
      ['Khi người quan trọng im lặng, tôi dễ nghĩ họ đang xa mình.','anxious'],
      ['Tôi cần khá nhiều tín hiệu xác nhận rằng mối quan hệ vẫn ổn.','anxious'],
      ['Khi người khác muốn quá gần, tôi dễ thấy mất tự do.','avoidant'],
      ['Tôi thường tự xử lý cảm xúc hơn là chia sẻ khi đang yếu lòng.','avoidant'],
      ['Tôi có thể nói nhu cầu của mình mà vẫn tôn trọng nhu cầu của người kia.','secure'],
      ['Khi có xung đột, tôi tin hai bên có thể nói chuyện để sửa chữa.','secure'],
      ['Tôi vừa muốn được gần gũi vừa sợ mình sẽ bị tổn thương.','fearful'],
      ['Khi quan hệ trở nên quan trọng, đôi khi tôi tiến gần rồi lại lùi ra.','fearful']
    ],extra:{
      secure:['Tôi khá thoải mái với cả sự gần gũi lẫn khoảng riêng.','secure'],
      anxious:['Khi chưa nhận phản hồi, đầu óc tôi dễ tạo ra kịch bản tiêu cực về mối quan hệ.','anxious'],
      avoidant:['Việc để người khác nhìn thấy phần yếu đuối của mình khiến tôi không thoải mái.','avoidant'],
      fearful:['Tôi khó tin hoàn toàn rằng người khác sẽ ở đó khi mình thật sự cần.','fearful']
    }},
    ai:{time:'~2 phút',core:[
      ['Tôi chủ động tìm xem AI có thể giúp mình nghĩ tốt hơn ở bước nào, không chỉ làm nhanh hơn.','mindset'],
      ['Tôi sẵn sàng thử cách làm mới với AI rồi đo xem nó thật sự có cải thiện kết quả hay không.','mindset'],
      ['Khi giao việc cho AI, tôi thường nêu bối cảnh, mục tiêu và tiêu chí đầu ra.','prompt'],
      ['Nếu câu trả lời chưa tốt, tôi biết cách bổ sung dữ kiện hoặc yêu cầu AI phản biện và sửa.','prompt'],
      ['Tôi đã có ít nhất một việc lặp lại được chuẩn hóa thành quy trình có AI hỗ trợ.','workflow'],
      ['Tôi lưu template, prompt hoặc bước làm tốt để tái sử dụng.','workflow'],
      ['Tôi kiểm tra thông tin quan trọng thay vì mặc định câu trả lời nghe hợp lý là đúng.','judgment'],
      ['Tôi biết những quyết định nào không nên giao quyền cuối cùng cho AI.','judgment'],
      ['Tôi có thể chia một việc lớn thành các bước để AI hỗ trợ từng phần.','workflow'],
      ['Tôi thường yêu cầu nguồn hoặc kiểm tra lại khi AI đưa ra một con số quan trọng.','judgment']
    ],extra:{
      mindset:['Tôi đánh giá AI bằng chất lượng quyết định cuối cùng chứ không chỉ cảm giác “wow”.','mindset'],
      prompt:['Tôi có thể biến một yêu cầu mơ hồ thành brief đủ rõ để AI tạo đầu ra dùng được.','prompt'],
      workflow:['Tôi biết chỗ nào trong quy trình cần con người duyệt trước khi AI tiếp tục bước sau.','workflow'],
      judgment:['Khi AI và trực giác mâu thuẫn, tôi tìm thêm bằng chứng thay vì chọn bên nghe thuyết phục hơn.','judgment']
    }}
  };

  Object.entries(V2).forEach(([k,v])=>{TESTS[k].time=v.time;TESTS[k].q=v.core.slice();TESTS[k].v2=v});

  function score(qs,answers,dims){const sums={},counts={};dims.forEach(d=>{sums[d]=0;counts[d]=0});qs.forEach((q,i)=>{const d=q[1],v=Number(answers[i]);if(d in sums&&v){sums[d]+=v;counts[d]++}});const out={};dims.forEach(d=>out[d]=counts[d]?sums[d]/counts[d]:0);return out}
  function sorted(avg){return Object.entries(avg).sort((a,b)=>b[1]-a[1])}
  function confidence(avg,mode){const a=mode==='low'?Object.entries(avg).sort((x,y)=>x[1]-y[1]):sorted(avg);const gap=Math.abs(a[0][1]-a[1][1]);return gap>=.8?['Cao','Kết quả dẫn đầu đang tách khá rõ.']:gap>=.4?['Trung bình','Có một hướng nổi bật nhưng hướng thứ hai vẫn khá gần.']:['Khám phá thêm','Hai hướng đang khá sát nhau; xem kết quả như giả thuyết để quan sát thêm.']}
  function adaptive(k,avg){const v=V2[k],out=[];if(k==='direction') Object.entries(avg).sort((a,b)=>a[1]-b[1]).slice(0,2).forEach(([d])=>out.push(v.extra[d]));else if(k==='ai') Object.entries(avg).sort((a,b)=>a[1]-b[1]).slice(0,2).forEach(([d])=>out.push(v.extra[d]));else sorted(avg).slice(0,k==='career'||k==='enneagram'?3:2).forEach(([d])=>out.push(v.extra[d]));return out.filter(Boolean)}

  startTest=function(k){state.testKey=k;state.qIndex=0;state.answers=[];state.questionSet=V2[k].core.slice();state.coreCount=state.questionSet.length;state.adaptiveStart=null;state.adaptiveAdded=false;TESTS[k].q=state.questionSet;renderQuestion()};

  renderQuestion=function(){const t=TESTS[state.testKey],i=state.qIndex,q=state.questionSet[i],adapt=state.adaptiveStart!==null&&i>=state.adaptiveStart,progress=Math.round(i/state.questionSet.length*100);show(`<section class="content-pad"><div class="quiz-shell"><div class="quiz-main glass"><div class="top-progress"><span style="font-weight:900">${adapt?`Câu làm rõ ${i-state.adaptiveStart+1}/${state.questionSet.length-state.adaptiveStart}`:`Câu ${i+1}/${state.coreCount}`}</span><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div><b>${progress}%</b><span class="badge">◷ ${t.time}</span></div><div class="quiz-card"><div class="question-label">✦ ${adapt?'CÂU LÀM RÕ':'CÂU HỎI'}</div><div class="quiz-big">${h(q[0])}</div><div class="helper">✦ Chọn điều đúng với bạn hiện tại, không phải phiên bản lý tưởng.</div><div class="quiz-scale">${[['1','Rất không giống tôi'],['2','Không giống'],['3','Trung lập'],['4','Giống'],['5','Rất giống tôi']].map(([v,l])=>`<button class="quiz-option ${state.answers[i]==v?'selected':''}" onclick="answerTest(${v})"><span class="answer-num">${v}</span><strong>${l}</strong></button>`).join('')}</div></div><div class="quiz-footer"><button class="btn" onclick="${i?'prevQuestion()':'renderTestGallery()'}">← Quay lại</button><span class="tiny">V2 chỉ thêm câu khi cần phân biệt kết quả.</span></div></div><aside class="quiz-side side-card glass"><div class="tiny">✦ ${h(t.title)}</div><div class="orb-wrap" style="min-height:125px">${orb()}</div><div class="assistant-msg"><strong>${adapt?'Sắp xong rồi!':'Trả lời thật nhanh.'}</strong><span>${adapt?'Câu này giúp phân biệt các hướng đang khá sát nhau.':'Phản ứng đầu tiên thường gần với thói quen thật hơn.'}</span></div></aside></div></section>`)};

  answerTest=function(v){state.answers[state.qIndex]=Number(v);if(state.qIndex<state.questionSet.length-1){state.qIndex++;renderQuestion();return}if(!state.adaptiveAdded){const avg=score(state.questionSet,state.answers,TESTS[state.testKey].dims),extra=adaptive(state.testKey,avg);state.adaptiveAdded=true;if(extra.length){state.adaptiveStart=state.questionSet.length;state.questionSet=state.questionSet.concat(extra);TESTS[state.testKey].q=state.questionSet;state.qIndex++;renderQuestion();return}}TESTS[state.testKey].q=state.questionSet;state.result=computeResult();renderLead()};
  prevQuestion=function(){if(state.qIndex>0){state.qIndex--;renderQuestion()}};

  computeResult=function(){const r=ORIGINAL_COMPUTE(),avg=r.scores||{},mode=state.testKey==='direction'?'low':'high',cf=confidence(avg,mode);r.confidence=cf[0];r.confidenceNote=cf[1];r.version='v2-adaptive';if(state.testKey==='career'){const top=sorted(avg).slice(0,3);r.primaryKey=top.map(x=>x[0]).join('');r.primaryTitle=`Career DNA ${r.primaryKey} · ${top.map(x=>TESTS.career.labels[x[0]]).join(' + ')}`;r.scoreSummary=sorted(avg).map(([d,v])=>`${d} ${v.toFixed(1)}/5`).join(' · ')}else r.scoreSummary=sorted(avg).map(([d,v])=>`${TESTS[state.testKey].labels[d]||d} ${v.toFixed(1)}/5`).join(' · ');return r};

  saveAndReveal=function(){state.profile.name=document.getElementById('name').value.trim();state.profile.contact=document.getElementById('contact').value.trim();state.profile.ageGroup=document.getElementById('age').value;const b=document.getElementById('saveBtn');b.disabled=true;b.innerHTML='<span class="spinner"></span>Đang tạo link';const payload={testKey:state.testKey,testTitle:TESTS[state.testKey].title,name:state.profile.name,contact:state.profile.contact,ageGroup:state.profile.ageGroup,recommendedTest:state.recommended,surveySnapshot:state.surveySnapshot,surveyAnswers:state.surveyAnswers,answers:state.answers,resultData:state.result,utm:state.utm};google.script.run.withSuccessHandler(res=>{state.shareUrl=res.resultUrl||'';state.submissionId=res.id||'';renderResult()}).withFailureHandler(err=>{alert('Không lưu được vào Google Sheet: '+(err.message||err));b.disabled=false;b.textContent='LƯU & XEM KẾT QUẢ →'}).saveResult(payload)};

  function currentId(shared){if(shared&&shared.id)return shared.id;if(state.submissionId)return state.submissionId;try{return new URL(state.shareUrl||location.href,location.href).searchParams.get('result')||''}catch(e){return''}}
  function enhanceResult(shared){const r=shared?.resultData||state.result||{},rows=[...document.querySelectorAll('.score-row b')];sorted(r.scores||{}).slice(0,rows.length).forEach(([,v],i)=>rows[i].textContent=Number(v).toFixed(1)+'/5');const card=document.querySelector('.result-card');if(card&&r.confidence){const x=document.createElement('div');x.className='v2-confidence';x.innerHTML=`<b>Độ chắc chắn: ${h(r.confidence)}</b><span>${h(r.confidenceNote||'')}</span>`;card.appendChild(x)}const layout=document.querySelector('.result-layout');if(layout){const id=currentId(shared),p=(shared&&shared.prize)||state.prize,g=document.createElement('div');g.className='lucky-entry glass';g.innerHTML=p&&p.prizeTitle?`<div><span class="kicker">🎁 QUÀ CỦA BẠN</span><h3>${h(p.prizeTitle)}</h3><p>Phần quà đã được khóa theo Submission ID.</p></div><button class="btn-primary" onclick="renderLuckyWheel()">XEM QUÀ →</button>`:id?`<div><span class="kicker">🎁 PHẦN THƯỞNG SAU BÀI TEST</span><h3>Mở Vòng Quay Nâng Cấp</h3><p>100% lượt quay có quà · mỗi Submission ID chỉ quay một lần.</p></div><button class="btn-primary" onclick="renderLuckyWheel()">QUAY NHẬN QUÀ →</button>`:`<div><span class="kicker">🎁 PHẦN THƯỞNG</span><h3>Lưu kết quả để mở vòng quay</h3><p>Vòng quay cần Submission ID để khóa một lượt quay duy nhất.</p></div><button class="btn" onclick="renderLead()">LƯU KẾT QUẢ →</button>`;layout.appendChild(g)}}
  renderResult=function(shared){if(shared){state.submissionId=shared.id||state.submissionId||'';if(shared.contact)state.profile.contact=shared.contact;if(shared.prize&&shared.prize.prizeKey)state.prize=shared.prize}ORIGINAL_RENDER(shared);enhanceResult(shared)};

  const PRIZE={voucher:['🎟️','Voucher khóa học trị giá 1.000.000đ','Áp dụng theo thể lệ chương trình.'],expert_session:['🧠','01 buổi giải thích kết quả với chuyên gia tâm lý','Buổi trao đổi giúp hiểu sâu hơn kết quả tự khám phá; không thay thế chẩn đoán hay điều trị tâm lý.'],coaching_month:['💎','01 tháng Coaching phát triển bản thân 1:1','Jackpot: hành trình đồng hành cá nhân hóa trong 1 tháng.']};

  renderLuckyWheel=function(){const id=currentId();if(!id){renderLead();return}const p=state.prize&&state.prize.prizeKey?state.prize:null;show(`<section class="content-pad"><div class="wheel-shell glass"><div><span class="kicker">🎁 VÒNG QUAY NÂNG CẤP</span><h2>${p?'Quà của bạn đã được mở':'Hoàn thành bài test. Giờ là lúc mở quà.'}</h2><p class="lead">100% lượt quay có quà · mỗi Submission ID chỉ quay một lần.</p><div class="odds"><span>🎟️ Voucher 1.000.000đ · 90%</span><span>🧠 Phiên chuyên gia · 9%</span><span>💎 Coaching 1 tháng · 1%</span></div>${p?'':`<div class="field"><label>Zalo / SĐT để nhận quà</label><input id="wheelContact" value="${h(state.profile.contact||'')}" placeholder="Nhập Zalo hoặc số điện thoại"></div>`}</div><div class="wheel-zone"><div class="wheel-pointer">▼</div><div id="luckyWheel" class="lucky-wheel"><div class="wheel-center">AI<br>INNER<br>LAB</div></div><button id="spinBtn" class="btn-primary large" onclick="${p?'showPrizeResult()':'spinWheel()'}">${p?'XEM QUÀ CỦA TÔI':'QUAY NGAY →'}</button><div id="wheelStatus" class="tiny"></div></div></div></section>`)};
  spinWheel=function(){const id=currentId(),input=document.getElementById('wheelContact'),contact=(input?input.value.trim():state.profile.contact||'');if(!contact){alert('Vui lòng nhập Zalo hoặc SĐT để nhận quà.');input&&input.focus();return}state.profile.contact=contact;const b=document.getElementById('spinBtn');if(b){b.disabled=true;b.textContent='ĐANG QUAY…'}google.script.run.withSuccessHandler(p=>{state.prize=p;const wheel=document.getElementById('luckyWheel'),center={voucher:162,expert_session:340.2,coaching_month:358.2}[p.prizeKey]||162;if(wheel)wheel.style.transform=`rotate(${360*7+360-center}deg)`;setTimeout(showPrizeResult,4200)}).withFailureHandler(err=>{alert('Không mở được quà: '+(err.message||err));if(b){b.disabled=false;b.textContent='THỬ LẠI →'}}).drawPrize({submissionId:id,contact})};
  showPrizeResult=function(){const p=state.prize;if(!p||!p.prizeKey){renderLuckyWheel();return}const m=PRIZE[p.prizeKey]||['🎁',p.prizeTitle||'Phần quà',''];show(`<section class="content-pad"><div class="prize-card glass"><div class="prize-icon">${m[0]}</div><span class="kicker">${p.prizeKey==='coaching_month'?'💎 JACKPOT UNLOCKED':'🎉 CHÚC MỪNG'}</span><h2>${h(m[1])}</h2><p class="lead">${h(m[2])}</p><div class="prize-meta">Submission ID: <b>${h(currentId())}</b></div>${p.claimed?'<div class="claimed">✓ Đã xác nhận nhận quà</div>':'<button id="claimBtn" class="btn-primary large" onclick="claimPrize()">XÁC NHẬN NHẬN QUÀ →</button>'}<button class="btn" style="margin-top:10px" onclick="loadShared(currentId())">← Quay lại kết quả</button></div></section>`)};
  claimPrize=function(){const b=document.getElementById('claimBtn');if(b){b.disabled=true;b.textContent='ĐANG XÁC NHẬN…'}google.script.run.withSuccessHandler(p=>{state.prize=p;showPrizeResult()}).withFailureHandler(err=>{alert('Chưa xác nhận được quà: '+(err.message||err));if(b){b.disabled=false;b.textContent='XÁC NHẬN NHẬN QUÀ →'}}).claimPrize({submissionId:currentId(),contact:state.profile.contact||''})};

  const style=document.createElement('style');style.textContent=`.v2-confidence{margin:14px auto 0;padding:10px 12px;border:1px solid var(--line);border-radius:14px;background:rgba(74,62,154,.18);display:grid;gap:4px;text-align:left}.v2-confidence b{font-size:11px;color:#e3c7ff}.v2-confidence span{font-size:9.5px;color:#9faccc}.lucky-entry{grid-column:1/-1;border-radius:22px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:18px;background:linear-gradient(135deg,rgba(90,54,184,.38),rgba(20,45,100,.55))}.lucky-entry h3{margin:9px 0 4px;font-size:21px}.lucky-entry p{margin:0;color:#aeb8d7;font-size:11px}.wheel-shell{border-radius:30px;padding:28px;display:grid;grid-template-columns:.9fr 1.1fr;gap:28px;align-items:center;max-width:1050px;margin:20px auto}.wheel-shell h2{font-size:clamp(34px,4.5vw,62px);line-height:1.05}.odds{display:grid;gap:7px;margin:18px 0}.odds span{border:1px solid var(--line);border-radius:12px;padding:9px 11px;font-size:11px}.wheel-zone{display:grid;place-items:center;position:relative;min-height:520px}.wheel-pointer{font-size:34px;position:absolute;top:10px;z-index:4}.lucky-wheel{width:min(430px,78vw);height:min(430px,78vw);border-radius:50%;position:relative;background:conic-gradient(#7047ff 0deg 324deg,#ec5fbd 324deg 356.4deg,#ffbf4d 356.4deg 360deg);border:8px solid rgba(255,255,255,.16);box-shadow:0 0 55px rgba(108,75,255,.35);transition:transform 4s cubic-bezier(.12,.72,.12,1)}.wheel-center{position:absolute;inset:36%;border-radius:50%;display:grid;place-items:center;text-align:center;font-size:12px;font-weight:900;background:#09112a;border:3px solid rgba(255,255,255,.32)}.wheel-zone .btn-primary{margin-top:24px}.prize-card{max-width:720px;margin:28px auto;border-radius:30px;padding:38px;text-align:center}.prize-icon{font-size:76px}.prize-card h2{font-size:clamp(34px,5vw,62px);line-height:1.04}.prize-meta{margin:18px auto;padding:10px;border:1px solid var(--line);border-radius:12px;width:max-content;max-width:100%;font-size:10px}.claimed{display:inline-block;margin:12px;padding:12px 16px;border-radius:14px;background:rgba(38,198,141,.12);border:1px solid rgba(67,225,164,.35)}@media(max-width:820px){.wheel-shell{grid-template-columns:1fr;padding:18px}.wheel-zone{min-height:460px}.lucky-entry{flex-direction:column;align-items:flex-start}}`;document.head.appendChild(style);
  console.info('AI INNER LAB V2 adaptive tests + Lucky Wheel loaded');
})();