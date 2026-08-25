/* AI INNER LAB — Gift Box Experience v5 */
(function(){
  function hasState(){ return typeof state!=='undefined'&&state; }
  function hSafe(s){
    if(typeof h==='function') return h(s==null?'':String(s));
    return String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function currentSubmissionId(){
    if(hasState()&&state.submissionId) return state.submissionId;
    try{
      const base=(hasState()&&state.shareUrl)?state.shareUrl:location.href;
      return new URL(base,location.href).searchParams.get('result')||'';
    }catch(e){ return ''; }
  }

  const PRIZES={
    voucher:{icon:'🎟️',eyebrow:'QUÀ TẶNG DÀNH CHO BẠN',title:'Voucher khóa học trị giá 1.000.000đ',desc:'Một bước khởi đầu để bạn tiếp tục hành trình nâng cấp bản thân.',tone:'violet'},
    expert_session:{icon:'🧠',eyebrow:'SPECIAL GIFT UNLOCKED',title:'01 buổi giải thích kết quả với chuyên gia tâm lý',desc:'Một phiên trao đổi 1:1 để hiểu sâu hơn kết quả tự khám phá của bạn. Không thay thế chẩn đoán hoặc điều trị tâm lý.',tone:'pink'},
    coaching_month:{icon:'💎',eyebrow:'JACKPOT UNLOCKED',title:'01 tháng Coaching phát triển bản thân 1:1',desc:'Phần quà đặc biệt: một tháng đồng hành cá nhân hóa để biến insight thành thay đổi thực tế.',tone:'gold'}
  };

  function hash32(s){
    let v=2166136261>>>0;
    for(let i=0;i<s.length;i++){
      v^=s.charCodeAt(i);
      v=Math.imul(v,16777619)>>>0;
    }
    return v>>>0;
  }
  function prizeForId(id){
    const n=hash32(String(id))%10000;
    if(n<9000) return Object.assign({prizeKey:'voucher'},PRIZES.voucher);
    if(n<9900) return Object.assign({prizeKey:'expert_session'},PRIZES.expert_session);
    return Object.assign({prizeKey:'coaching_month'},PRIZES.coaching_month);
  }

  function postHidden(payload){
    const url=window.AI_INNER_BACKEND_URL;
    if(!url) return false;
    let frame=document.getElementById('aiInnerPostFrame');
    if(!frame){
      frame=document.createElement('iframe');
      frame.id='aiInnerPostFrame';
      frame.name='aiInnerPostFrame';
      frame.style.display='none';
      document.body.appendChild(frame);
    }
    const form=document.createElement('form');
    form.method='POST';
    form.action=url;
    form.target='aiInnerPostFrame';
    form.style.display='none';
    const input=document.createElement('input');
    input.type='hidden';
    input.name='payload';
    input.value=JSON.stringify(payload);
    form.appendChild(input);
    document.body.appendChild(form);
    try{ form.submit(); return true; }
    finally{ setTimeout(()=>form.remove(),1200); }
  }

  function patchGiftCopy(){
    document.querySelectorAll('.lucky-entry').forEach(card=>{
      const h3=card.querySelector('h3');
      const p=card.querySelector('p');
      const b=card.querySelector('button');
      const kicker=card.querySelector('.kicker');
      if(kicker) kicker.textContent='🎁 PHẦN QUÀ SAU BÀI TEST';
      if(h3 && /Vòng Quay|vòng quay/i.test(h3.textContent)) h3.textContent='Mở Hộp Quà Nâng Cấp';
      if(p && /vòng quay/i.test(p.textContent)) p.textContent='Bạn có 1 phần quà đang chờ. Hãy chọn một hộp để mở.';
      if(b && /QUAY/i.test(b.textContent)) b.textContent='CHỌN HỘP QUÀ →';
    });
  }

  if(typeof window.renderResult==='function'){
    const previousRenderResult=window.renderResult;
    window.renderResult=function(shared){
      previousRenderResult(shared);
      setTimeout(patchGiftCopy,0);
    };
  }

  function giftBoxMarkup(i){
    const roman=['I','II','III'][i-1];
    return `<button class="mystery-gift" data-box="${i}" onclick="openGiftBox(${i})" aria-label="Mở hộp quà ${i}">
      <span class="gift-aura"></span>
      <span class="gift-shadow"></span>
      <span class="gift-lid"><span class="lid-ribbon"></span><span class="gift-bow"><i></i><i></i></span></span>
      <span class="gift-body"><span class="body-ribbon"></span><span class="gift-mark">✦</span></span>
      <span class="gift-number">HỘP ${roman}</span>
      <span class="gift-hint">Chạm để mở</span>
    </button>`;
  }

  window.renderLuckyWheel=function(){
    const id=currentSubmissionId();
    if(!id){ if(typeof renderLead==='function')renderLead(); return; }
    const existing=hasState()&&state.prize&&state.prize.prizeKey?state.prize:null;
    if(existing){ renderGiftPrize(existing,true); return; }

    const contact=(hasState()&&state.profile&&state.profile.contact)||'';
    show(`<section class="content-pad gift-screen"><div class="gift-shell glass">
      <div class="gift-copy">
        <span class="kicker">🎁 HỘP QUÀ NÂNG CẤP</span>
        <h2>Chọn một hộp.<br><span class="grad-text">Mở điều bất ngờ.</span></h2>
        <p class="lead">Bạn đã hoàn thành bài test. Một phần quà đang được dành cho bạn — hãy chọn hộp khiến bạn có cảm giác muốn mở nhất.</p>
        <div class="gift-possible">
          <span>🎟️ Voucher 1.000.000đ</span>
          <span>🧠 Phiên giải thích kết quả 1:1</span>
          <span>💎 Coaching 1 tháng</span>
        </div>
        <div class="field gift-contact"><label>Zalo / SĐT để nhận quà</label><input id="giftContact" value="${hSafe(contact)}" placeholder="Nhập Zalo hoặc số điện thoại"></div>
        <div class="gift-rule">✦ 100% có quà · mỗi Submission ID chỉ mở một lần.</div>
      </div>
      <div class="gift-stage" id="giftStage">
        <div class="stage-glow"></div>
        <div class="gift-instruction">CHỌN 1 TRONG 3 HỘP QUÀ</div>
        <div class="gift-grid">${giftBoxMarkup(1)}${giftBoxMarkup(2)}${giftBoxMarkup(3)}</div>
        <div class="gift-status" id="giftStatus">Hãy tin vào lựa chọn đầu tiên của bạn ✦</div>
      </div>
    </div></section>`);
  };

  function burstConfetti(count){
    const layer=document.createElement('div');
    layer.className='celebration-layer';
    const symbols=['✦','◆','●','★','▰'];
    for(let i=0;i<count;i++){
      const c=document.createElement('i');
      const a=Math.random()*Math.PI*2;
      const distance=130+Math.random()*430;
      const x=Math.cos(a)*distance;
      const y=Math.sin(a)*distance-80;
      c.textContent=symbols[Math.floor(Math.random()*symbols.length)];
      c.style.setProperty('--x',x+'px');
      c.style.setProperty('--y',y+'px');
      c.style.setProperty('--r',(Math.random()*900-450)+'deg');
      c.style.setProperty('--d',(0.8+Math.random()*1.1)+'s');
      c.style.setProperty('--delay',(Math.random()*.18)+'s');
      c.style.left=(47+Math.random()*6)+'%';
      c.style.top=(42+Math.random()*8)+'%';
      c.className='confetti c'+(i%5);
      layer.appendChild(c);
    }
    document.body.appendChild(layer);
    setTimeout(()=>layer.remove(),2600);
  }

  window.openGiftBox=function(boxNo){
    const id=currentSubmissionId();
    const input=document.getElementById('giftContact');
    const contact=input?input.value.trim():((hasState()&&state.profile&&state.profile.contact)||'');
    if(!id){ alert('Không tìm thấy Submission ID. Vui lòng lưu kết quả trước khi mở quà.'); return; }
    if(!contact){ alert('Vui lòng nhập Zalo hoặc SĐT để nhận quà.'); if(input)input.focus(); return; }
    if(hasState()&&state.profile) state.profile.contact=contact;

    const boxes=[...document.querySelectorAll('.mystery-gift')];
    if(!boxes.length) return;
    boxes.forEach(b=>{b.disabled=true;b.classList.add(Number(b.dataset.box)===boxNo?'chosen':'unchosen')});
    const chosen=boxes.find(b=>Number(b.dataset.box)===boxNo);
    const status=document.getElementById('giftStatus');
    if(status) status.textContent='Hộp quà đang mở niêm phong…';

    const prize=prizeForId(id);
    if(hasState()) state.prize={ok:true,submissionId:id,prizeKey:prize.prizeKey,prizeTitle:prize.title,claimed:false,boxNo:boxNo};

    // Persist independently of browser CORS / JSONP. Backend calculates the same prize from Submission ID.
    postHidden({action:'drawPrize',submissionId:id,contact:contact,boxNo:boxNo,prizeKey:prize.prizeKey});

    setTimeout(()=>{
      if(chosen) chosen.classList.add('shaking');
      if(status) status.textContent='Sẵn sàng…';
    },280);
    setTimeout(()=>{
      if(chosen){chosen.classList.remove('shaking');chosen.classList.add('opening')}
      if(status) status.textContent='3 · 2 · 1 · MỞ QUÀ!';
    },1050);
    setTimeout(()=>{
      if(chosen) chosen.classList.add('opened');
      burstConfetti(prize.prizeKey==='coaching_month'?110:80);
      document.body.classList.add('gift-flash');
      setTimeout(()=>document.body.classList.remove('gift-flash'),650);
    },1750);
    setTimeout(()=>renderGiftPrize(state.prize,false),2450);
  };

  function prizeData(p){
    const base=PRIZES[p&&p.prizeKey]||{icon:'🎁',eyebrow:'CHÚC MỪNG',title:(p&&p.prizeTitle)||'Phần quà của bạn',desc:'Cảm ơn bạn đã hoàn thành hành trình khám phá.',tone:'violet'};
    return Object.assign({},base,p||{});
  }

  window.renderGiftPrize=function(p,fromExisting){
    const id=currentSubmissionId();
    const m=prizeData(p);
    const claimed=!!(p&&p.claimed);
    show(`<section class="content-pad"><div class="gift-reveal-shell tone-${m.tone}">
      <div class="reveal-rays"></div><div class="reveal-orbit o1"></div><div class="reveal-orbit o2"></div>
      <div class="reveal-content">
        <div class="reveal-icon">${m.icon}</div>
        <span class="reveal-eyebrow">${hSafe(m.eyebrow)}</span>
        <h2>${hSafe(m.title)}</h2>
        <p>${hSafe(m.desc)}</p>
        ${m.prizeKey==='coaching_month'?'<div class="jackpot-strip">✦ JACKPOT · PHẦN QUÀ ĐẶC BIỆT ✦</div>':''}
        <div class="reveal-id">Submission ID · <b>${hSafe(id)}</b></div>
        ${claimed?'<div class="claimed grand">✓ ĐÃ XÁC NHẬN NHẬN QUÀ</div>':`<button id="claimBtn" class="btn-primary claim-grand" onclick="claimPrize()">NHẬN PHẦN QUÀ NÀY →</button>`}
        <button class="btn back-result" onclick="loadShared('${hSafe(id)}')">← Quay lại kết quả bài test</button>
      </div>
    </div></section>`);
    if(!fromExisting) setTimeout(()=>burstConfetti(m.prizeKey==='coaching_month'?90:48),120);
  };

  // Keep compatibility with the original V2 function name.
  window.showPrizeResult=function(){
    if(hasState()&&state.prize) renderGiftPrize(state.prize,true);
    else renderLuckyWheel();
  };

  window.claimPrize=function(){
    const id=currentSubmissionId();
    if(!id||!hasState()||!state.prize){ alert('Không tìm thấy phần quà.'); return; }
    const b=document.getElementById('claimBtn');
    if(b){b.disabled=true;b.textContent='ĐANG XÁC NHẬN…'}
    postHidden({action:'claimPrize',submissionId:id,contact:(state.profile&&state.profile.contact)||''});
    state.prize.claimed=true;
    state.prize.claimTime=new Date().toISOString();
    burstConfetti(44);
    setTimeout(()=>renderGiftPrize(state.prize,true),520);
  };

  const style=document.createElement('style');
  style.textContent=`
    .gift-shell{border-radius:32px;padding:32px;display:grid;grid-template-columns:.82fr 1.18fr;gap:28px;align-items:center;max-width:1180px;margin:10px auto;overflow:hidden;position:relative}
    .gift-copy h2{font-size:clamp(40px,5vw,70px);line-height:1.02;letter-spacing:-.05em;margin:18px 0}.gift-copy .lead{max-width:520px}.gift-possible{display:grid;gap:8px;margin:20px 0}.gift-possible span{border:1px solid var(--line);border-radius:13px;padding:10px 12px;background:rgba(9,17,47,.55);font-size:11px;color:#d2d9f3}.gift-contact{margin-top:18px}.gift-rule{margin-top:13px;color:#8d9ac0;font-size:11px}
    .gift-stage{position:relative;min-height:590px;display:flex;flex-direction:column;align-items:center;justify-content:center;isolation:isolate}.stage-glow{position:absolute;width:78%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(132,73,255,.26),rgba(65,99,255,.11) 42%,transparent 70%);filter:blur(10px);z-index:-1;animation:stagePulse 2.8s ease-in-out infinite}.gift-instruction{font-weight:900;letter-spacing:.12em;color:#c9c0ff;font-size:12px;margin-bottom:36px}.gift-grid{width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:end}.mystery-gift{height:330px;border:0;background:transparent;position:relative;cursor:pointer;color:white;perspective:900px;transition:filter .45s,opacity .45s,transform .45s;outline:none}.mystery-gift:hover:not(:disabled){transform:translateY(-12px) scale(1.035)}.mystery-gift:hover:not(:disabled) .gift-aura{opacity:1;transform:translate(-50%,-50%) scale(1.12)}.gift-aura{position:absolute;left:50%;top:52%;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(195,95,255,.40),rgba(93,91,255,.18) 43%,transparent 70%);filter:blur(10px);transform:translate(-50%,-50%);opacity:.55;transition:.3s}.gift-shadow{position:absolute;left:50%;bottom:44px;width:150px;height:30px;border-radius:50%;background:rgba(0,0,0,.48);filter:blur(9px);transform:translateX(-50%)}
    .gift-body,.gift-lid{position:absolute;left:50%;display:block;background:linear-gradient(135deg,#8d55ff,#7048ec 52%,#5136bd);box-shadow:inset 0 0 0 1px rgba(255,255,255,.24),0 22px 38px rgba(31,12,90,.38)}.gift-body{width:150px;height:142px;bottom:70px;transform:translateX(-50%);border-radius:10px 10px 18px 18px;overflow:hidden}.gift-lid{width:174px;height:48px;bottom:202px;transform:translateX(-50%);border-radius:12px;z-index:3;transform-origin:50% 100%}.body-ribbon,.lid-ribbon{position:absolute;left:50%;top:0;width:31px;height:100%;transform:translateX(-50%);background:linear-gradient(90deg,#ffc957,#ffe4a1,#f5b638);box-shadow:0 0 18px rgba(255,199,73,.22)}.gift-lid .lid-ribbon{height:100%}.gift-bow{position:absolute;left:50%;top:-28px;transform:translateX(-50%);width:80px;height:46px}.gift-bow i{position:absolute;top:6px;width:43px;height:30px;border:9px solid #ffd66c;background:rgba(255,211,100,.12)}.gift-bow i:first-child{right:36px;border-radius:65% 28% 60% 25%;transform:rotate(24deg)}.gift-bow i:last-child{left:36px;border-radius:28% 65% 25% 60%;transform:rotate(-24deg)}.gift-mark{position:absolute;left:50%;top:55%;transform:translate(-50%,-50%);font-size:28px;color:#fff5cf;text-shadow:0 0 18px rgba(255,221,123,.9)}.gift-number{position:absolute;left:0;right:0;bottom:23px;font-size:13px;font-weight:950;letter-spacing:.13em;color:#e6e5ff}.gift-hint{position:absolute;left:0;right:0;bottom:2px;font-size:10px;color:#8f9cc4}.mystery-gift.unchosen{opacity:.18;filter:blur(1.2px) saturate(.45);transform:scale(.86)}.mystery-gift.chosen{transform:translateY(-18px) scale(1.12);z-index:5}.mystery-gift.shaking{animation:giftShake .13s linear infinite}.mystery-gift.opening .gift-lid{animation:lidLaunch .72s cubic-bezier(.2,.8,.2,1) forwards}.mystery-gift.opening .gift-body{animation:boxPop .72s ease forwards}.mystery-gift.opened .gift-aura{opacity:1;animation:auraBurst .8s ease forwards}.mystery-gift.opened .gift-body:after{content:'✦';position:absolute;left:50%;top:-10px;transform:translateX(-50%);font-size:85px;color:#fff;filter:drop-shadow(0 0 30px #ffd86f);animation:lightRise 1s ease forwards}.gift-status{margin-top:22px;color:#9fadd0;font-size:11px;min-height:18px}
    .gift-reveal-shell{position:relative;max-width:900px;min-height:650px;margin:12px auto;border:1px solid rgba(192,171,255,.34);border-radius:36px;display:grid;place-items:center;overflow:hidden;background:radial-gradient(circle at 50% 45%,rgba(113,61,215,.35),rgba(10,15,42,.92) 53%,rgba(5,9,27,.98));box-shadow:0 38px 100px rgba(0,0,0,.5),0 0 80px rgba(114,72,255,.16)}.gift-reveal-shell.tone-pink{background:radial-gradient(circle at 50% 44%,rgba(223,73,185,.32),rgba(39,19,65,.94) 48%,rgba(7,8,26,.98))}.gift-reveal-shell.tone-gold{background:radial-gradient(circle at 50% 42%,rgba(255,184,55,.34),rgba(68,38,21,.88) 44%,rgba(8,9,23,.99))}.reveal-content{position:relative;z-index:4;text-align:center;padding:58px 45px;max-width:720px}.reveal-icon{font-size:92px;filter:drop-shadow(0 0 32px rgba(210,164,255,.55));animation:revealFloat 2.4s ease-in-out infinite}.reveal-eyebrow{display:block;margin:16px 0 8px;color:#d9c7ff;font-weight:950;font-size:12px;letter-spacing:.14em}.tone-gold .reveal-eyebrow{color:#ffe2a2}.reveal-content h2{font-size:clamp(38px,6vw,72px);line-height:1.02;letter-spacing:-.045em;margin:14px 0;background:linear-gradient(110deg,#fff,#d7c9ff,#fff);-webkit-background-clip:text;background-clip:text;color:transparent}.tone-gold .reveal-content h2{background:linear-gradient(110deg,#fff7dc,#ffc451,#fff8e6);-webkit-background-clip:text;background-clip:text;color:transparent}.reveal-content p{font-size:16px;line-height:1.7;color:#c6cee8;max-width:620px;margin:0 auto 22px}.reveal-id{display:inline-block;margin:14px auto 23px;padding:9px 13px;border:1px solid var(--line);border-radius:999px;font-size:10px;color:#9eabd0;background:rgba(8,13,39,.5)}.claim-grand{display:block;margin:8px auto 10px;min-width:260px}.back-result{margin-top:4px}.jackpot-strip{margin:15px auto;padding:11px 18px;border-radius:999px;width:max-content;max-width:100%;border:1px solid rgba(255,205,94,.5);background:rgba(255,182,45,.1);color:#ffd875;font-weight:900;font-size:11px;letter-spacing:.09em}.claimed.grand{font-size:13px;padding:14px 20px}.reveal-rays{position:absolute;left:50%;top:45%;width:700px;height:700px;transform:translate(-50%,-50%);background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.08) 0deg 3deg,transparent 3deg 18deg);mask-image:radial-gradient(circle,#000 0 35%,transparent 72%);animation:raysSpin 18s linear infinite}.reveal-orbit{position:absolute;left:50%;top:45%;border:1px solid rgba(189,158,255,.25);border-radius:50%;transform:translate(-50%,-50%);animation:orbitPulse 3s ease-in-out infinite}.o1{width:420px;height:420px}.o2{width:570px;height:570px;animation-delay:1.1s}
    .celebration-layer{position:fixed;inset:0;z-index:99999;pointer-events:none;overflow:hidden}.confetti{position:absolute;font-style:normal;font-size:18px;opacity:0;animation:confettiBurst var(--d) cubic-bezier(.12,.65,.2,1) var(--delay) forwards}.c0{color:#ffcf58}.c1{color:#bd6aff}.c2{color:#ff65c8}.c3{color:#61d7ff}.c4{color:#fff}.gift-flash:after{content:'';position:fixed;inset:0;z-index:99990;pointer-events:none;background:white;animation:screenFlash .65s ease-out forwards}
    @keyframes stagePulse{50%{transform:scale(1.08);opacity:.68}}@keyframes giftShake{0%,100%{transform:translateY(-18px) scale(1.12) rotate(-1.8deg)}50%{transform:translateY(-18px) scale(1.12) rotate(1.8deg)}}@keyframes lidLaunch{0%{transform:translateX(-50%) rotate(0)}45%{transform:translate(-50%,-20px) rotate(-5deg)}100%{transform:translate(-50%,-92px) rotate(-23deg);opacity:.2}}@keyframes boxPop{50%{transform:translateX(-50%) scale(1.08)}100%{transform:translateX(-50%) scale(.98)}}@keyframes auraBurst{0%{transform:translate(-50%,-50%) scale(1);opacity:.5}100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}}@keyframes lightRise{0%{transform:translate(-50%,50px) scale(.2);opacity:0}55%{opacity:1}100%{transform:translate(-50%,-70px) scale(1.3);opacity:0}}@keyframes revealFloat{50%{transform:translateY(-10px) scale(1.04)}}@keyframes raysSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes orbitPulse{50%{transform:translate(-50%,-50%) scale(1.08);opacity:.4}}@keyframes confettiBurst{0%{opacity:0;transform:translate(0,0) rotate(0) scale(.4)}10%{opacity:1}100%{opacity:0;transform:translate(var(--x),var(--y)) rotate(var(--r)) scale(1)}}@keyframes screenFlash{0%{opacity:.75}100%{opacity:0}}
    @media(max-width:900px){.gift-shell{grid-template-columns:1fr;padding:22px}.gift-stage{min-height:520px}.gift-grid{gap:6px}.mystery-gift{height:285px}.gift-body{width:112px;height:118px;bottom:66px}.gift-lid{width:132px;height:42px;bottom:175px}.gift-bow{transform:translateX(-50%) scale(.8)}.gift-copy h2{text-align:center}.gift-copy .lead{text-align:center;margin-left:auto;margin-right:auto}.gift-reveal-shell{min-height:570px}.reveal-content{padding:40px 22px}}
    @media(max-width:520px){.gift-shell{padding:18px}.gift-grid{gap:0}.mystery-gift{height:245px}.gift-body{width:88px;height:97px;bottom:59px}.gift-lid{width:104px;height:36px;bottom:148px}.body-ribbon,.lid-ribbon{width:22px}.gift-bow{top:-24px;transform:translateX(-50%) scale(.62)}.gift-number{font-size:10px}.gift-hint{font-size:8.5px}.gift-stage{min-height:430px}.gift-instruction{margin-bottom:18px}.reveal-icon{font-size:72px}}
  `;
  document.head.appendChild(style);
  console.info('AI INNER LAB Gift Box Experience v5 loaded');
})();