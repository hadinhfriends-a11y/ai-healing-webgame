/* AI INNER LAB — Mystery Gift v6: random prize, hidden options */
(function(){
  const PRIZES={
    voucher:{prizeKey:'voucher',prizeTitle:'Voucher khóa học trị giá 1.000.000đ'},
    expert_session:{prizeKey:'expert_session',prizeTitle:'01 buổi giải thích kết quả với chuyên gia tâm lý'},
    coaching_month:{prizeKey:'coaching_month',prizeTitle:'01 tháng Coaching phát triển bản thân 1:1'}
  };
  const STORE='ai-inner-random-prize:';

  function hasState(){return typeof state!=='undefined'&&state}
  function currentId(){
    if(hasState()&&state.submissionId)return state.submissionId;
    try{const base=(hasState()&&state.shareUrl)?state.shareUrl:location.href;return new URL(base,location.href).searchParams.get('result')||''}catch(e){return''}
  }
  function esc(v){
    if(typeof h==='function')return h(v==null?'':String(v));
    return String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function storageKey(id){return STORE+id}
  function loadLocal(id){
    try{const x=JSON.parse(localStorage.getItem(storageKey(id))||'null');return x&&x.prizeKey?x:null}catch(e){return null}
  }
  function saveLocal(id,p){try{localStorage.setItem(storageKey(id),JSON.stringify(p))}catch(e){}}
  function secureRandom100(){
    try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296*100}catch(e){return Math.random()*100}
  }
  function drawRandom(){
    const r=secureRandom100();
    if(r<82)return Object.assign({},PRIZES.voucher);
    if(r<97)return Object.assign({},PRIZES.expert_session);
    return Object.assign({},PRIZES.coaching_month);
  }
  function postHidden(payload){
    const url=window.AI_INNER_BACKEND_URL;if(!url)return false;
    let frame=document.getElementById('aiInnerPostFrame');
    if(!frame){frame=document.createElement('iframe');frame.id='aiInnerPostFrame';frame.name='aiInnerPostFrame';frame.style.display='none';document.body.appendChild(frame)}
    const form=document.createElement('form');form.method='POST';form.action=url;form.target='aiInnerPostFrame';form.style.display='none';
    const input=document.createElement('input');input.type='hidden';input.name='payload';input.value=JSON.stringify(payload);form.appendChild(input);document.body.appendChild(form);
    try{form.submit();return true}finally{setTimeout(()=>form.remove(),1000)}
  }
  function box(i){
    const roman=['I','II','III'][i-1];
    return `<button class="mystery-gift" data-box="${i}" onclick="openMysteryGift(${i})" aria-label="Mở hộp quà ${i}">
      <span class="gift-aura"></span><span class="gift-shadow"></span>
      <span class="gift-lid"><span class="lid-ribbon"></span><span class="gift-bow"><i></i><i></i></span></span>
      <span class="gift-body"><span class="body-ribbon"></span><span class="gift-mark">✦</span></span>
      <span class="gift-number">HỘP ${roman}</span><span class="gift-hint">Chạm để mở</span>
    </button>`;
  }
  function confetti(n){
    const layer=document.createElement('div');layer.className='celebration-layer';
    const chars=['✦','◆','●','★','▰'];
    for(let i=0;i<n;i++){
      const c=document.createElement('i'),a=Math.random()*Math.PI*2,d=120+Math.random()*430;
      c.textContent=chars[Math.floor(Math.random()*chars.length)];c.className='confetti c'+(i%5);
      c.style.setProperty('--x',Math.cos(a)*d+'px');c.style.setProperty('--y',Math.sin(a)*d-80+'px');c.style.setProperty('--r',(Math.random()*900-450)+'deg');c.style.setProperty('--d',(.8+Math.random()*1.1)+'s');c.style.setProperty('--delay',(Math.random()*.18)+'s');c.style.left=(47+Math.random()*6)+'%';c.style.top=(42+Math.random()*8)+'%';layer.appendChild(c)
    }
    document.body.appendChild(layer);setTimeout(()=>layer.remove(),2700)
  }

  function patchResultCard(){
    document.querySelectorAll('.lucky-entry').forEach(card=>{
      const k=card.querySelector('.kicker'),h3=card.querySelector('h3'),p=card.querySelector('p'),b=card.querySelector('button');
      if(k)k.textContent='🎁 PHẦN QUÀ SAU BÀI TEST';
      if(h3)h3.textContent='Mở Hộp Quà Bí Mật';
      if(p)p.textContent='Bạn có một phần quà bí mật đang chờ. Chọn một hộp để khám phá.';
      if(b)b.textContent='MỞ HỘP QUÀ →';
    })
  }
  if(typeof window.renderResult==='function'){
    const old=window.renderResult;window.renderResult=function(shared){old(shared);setTimeout(patchResultCard,0)}
  }

  window.renderLuckyWheel=function(){
    const id=currentId();if(!id){if(typeof renderLead==='function')renderLead();return}
    const existing=(hasState()&&state.prize&&state.prize.prizeKey)?state.prize:loadLocal(id);
    if(existing){if(hasState())state.prize=existing;if(typeof renderGiftPrize==='function')renderGiftPrize(existing,true);return}
    const contact=(hasState()&&state.profile&&state.profile.contact)||'';
    show(`<section class="content-pad gift-screen"><div class="gift-shell glass">
      <div class="gift-copy">
        <span class="kicker">🎁 HỘP QUÀ BÍ MẬT</span>
        <h2>Chọn một hộp.<br><span class="grad-text">Mở điều bất ngờ.</span></h2>
        <p class="lead">Bạn đã hoàn thành bài test. Một phần quà bí mật đang chờ bạn — hãy chọn chiếc hộp khiến bạn muốn mở nhất.</p>
        <div class="field gift-contact"><label>Zalo / SĐT để nhận quà</label><input id="giftContact" value="${esc(contact)}" placeholder="Nhập Zalo hoặc số điện thoại"></div>
        <div class="gift-rule">✦ Mỗi Submission ID chỉ mở một lần.</div>
      </div>
      <div class="gift-stage"><div class="stage-glow"></div>
        <div class="gift-instruction">CHỌN 1 TRONG 3 HỘP QUÀ</div>
        <div class="gift-grid">${box(1)}${box(2)}${box(3)}</div>
        <div class="gift-status" id="giftStatus">Biết đâu hộp bạn chọn là món quà đặc biệt ✦</div>
      </div>
    </div></section>`)
  };

  window.openMysteryGift=function(boxNo){
    const id=currentId(),input=document.getElementById('giftContact');
    const contact=input?input.value.trim():((hasState()&&state.profile&&state.profile.contact)||'');
    if(!id){alert('Không tìm thấy Submission ID. Vui lòng lưu kết quả trước khi mở quà.');return}
    if(!contact){alert('Vui lòng nhập Zalo hoặc SĐT để nhận quà.');if(input)input.focus();return}
    if(hasState()&&state.profile)state.profile.contact=contact;

    const prior=loadLocal(id);if(prior){if(hasState())state.prize=prior;if(typeof renderGiftPrize==='function')renderGiftPrize(prior,true);return}
    const boxes=[...document.querySelectorAll('.mystery-gift')],chosen=boxes.find(b=>Number(b.dataset.box)===boxNo),status=document.getElementById('giftStatus');
    boxes.forEach(b=>{b.disabled=true;b.classList.add(Number(b.dataset.box)===boxNo?'chosen':'unchosen')});
    const prize=Object.assign({ok:true,submissionId:id,claimed:false,boxNo},drawRandom());
    saveLocal(id,prize);if(hasState())state.prize=prize;
    postHidden({action:'drawPrize',submissionId:id,contact,boxNo,prizeKey:prize.prizeKey});
    if(status)status.textContent='Hộp quà đang mở niêm phong…';
    setTimeout(()=>{if(chosen)chosen.classList.add('shaking');if(status)status.textContent='Sẵn sàng…'},280);
    setTimeout(()=>{if(chosen){chosen.classList.remove('shaking');chosen.classList.add('opening')}if(status)status.textContent='3 · 2 · 1 · MỞ QUÀ!'},1050);
    setTimeout(()=>{if(chosen)chosen.classList.add('opened');confetti(prize.prizeKey==='coaching_month'?120:82);document.body.classList.add('gift-flash');setTimeout(()=>document.body.classList.remove('gift-flash'),650)},1750);
    setTimeout(()=>{if(typeof renderGiftPrize==='function')renderGiftPrize(prize,false)},2450)
  };

  const previousClaim=window.claimPrize;
  window.claimPrize=function(){
    const id=currentId(),p=(hasState()&&state.prize)||loadLocal(id);
    if(!id||!p){if(previousClaim)return previousClaim();return}
    postHidden({action:'claimPrize',submissionId:id,contact:(hasState()&&state.profile&&state.profile.contact)||'',prizeKey:p.prizeKey});
    p.claimed=true;p.claimTime=new Date().toISOString();saveLocal(id,p);if(hasState())state.prize=p;
    confetti(44);setTimeout(()=>{if(typeof renderGiftPrize==='function')renderGiftPrize(p,true)},420)
  };

  const style=document.createElement('style');
  style.textContent='.gift-possible{display:none!important}';document.head.appendChild(style);
  console.info('AI INNER LAB Mystery Gift v6 loaded');
})();