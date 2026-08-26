/* AI INNER LAB — Mystery Gift v6.2: server-random prize, ~5s reveal */
(function(){
  const STORE='ai-inner-server-prize:';
  function hasState(){return typeof state!=='undefined'&&state}
  function currentId(){
    if(hasState()&&state.submissionId)return state.submissionId;
    try{const base=(hasState()&&state.shareUrl)?state.shareUrl:location.href;return new URL(base,location.href).searchParams.get('result')||''}catch(e){return''}
  }
  function esc(v){
    if(typeof h==='function')return h(v==null?'':String(v));
    return String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function saveLocal(id,p){try{localStorage.setItem(STORE+id,JSON.stringify(p))}catch(e){}}
  function loadLocal(id){try{const p=JSON.parse(localStorage.getItem(STORE+id)||'null');return p&&p.prizeKey?p:null}catch(e){return null}}
  function postHidden(payload){
    const url=window.AI_INNER_BACKEND_URL;if(!url)return false;
    let frame=document.getElementById('aiInnerPostFrame');
    if(!frame){frame=document.createElement('iframe');frame.id='aiInnerPostFrame';frame.name='aiInnerPostFrame';frame.style.display='none';document.body.appendChild(frame)}
    const form=document.createElement('form');form.method='POST';form.action=url;form.target='aiInnerPostFrame';form.style.display='none';
    const input=document.createElement('input');input.type='hidden';input.name='payload';input.value=JSON.stringify(payload);form.appendChild(input);document.body.appendChild(form);
    try{form.submit();return true}finally{setTimeout(()=>form.remove(),1200)}
  }
  function box(i){const roman=['I','II','III'][i-1];return `<button class="mystery-gift" data-box="${i}" onclick="openMysteryGift(${i})" aria-label="Mở hộp quà ${i}"><span class="gift-aura"></span><span class="gift-shadow"></span><span class="gift-lid"><span class="lid-ribbon"></span><span class="gift-bow"><i></i><i></i></span></span><span class="gift-body"><span class="body-ribbon"></span><span class="gift-mark">✦</span></span><span class="gift-number">HỘP ${roman}</span><span class="gift-hint">Chạm để mở</span></button>`}
  function patchResultCard(){document.querySelectorAll('.lucky-entry').forEach(card=>{const k=card.querySelector('.kicker'),h3=card.querySelector('h3'),p=card.querySelector('p'),b=card.querySelector('button');if(k)k.textContent='🎁 PHẦN QUÀ SAU BÀI TEST';if(h3)h3.textContent='Mở Hộp Quà Bí Mật';if(p)p.textContent='Bạn có một phần quà bí mật đang chờ. Chọn một hộp để khám phá.';if(b)b.textContent='MỞ HỘP QUÀ →'})}
  if(typeof window.renderResult==='function'){const old=window.renderResult;window.renderResult=function(shared){old(shared);setTimeout(patchResultCard,0)}}

  window.renderLuckyWheel=function(){
    const id=currentId();if(!id){if(typeof renderLead==='function')renderLead();return}
    const existing=(hasState()&&state.prize&&state.prize.prizeKey)?state.prize:loadLocal(id);
    if(existing){if(hasState())state.prize=existing;if(typeof renderGiftPrize==='function')renderGiftPrize(existing,true);return}
    const contact=(hasState()&&state.profile&&state.profile.contact)||'';
    show(`<section class="content-pad gift-screen"><div class="gift-shell glass"><div class="gift-copy"><span class="kicker">🎁 HỘP QUÀ BÍ MẬT</span><h2>Chọn một hộp.<br><span class="grad-text">Mở điều bất ngờ.</span></h2><p class="lead">Bạn đã hoàn thành bài test. Một phần quà bí mật đang chờ bạn — hãy chọn chiếc hộp khiến bạn muốn mở nhất.</p><div class="field gift-contact"><label>Zalo / SĐT để nhận quà</label><input id="giftContact" value="${esc(contact)}" placeholder="Nhập Zalo hoặc số điện thoại"></div><div class="gift-rule">✦ Mỗi Submission ID chỉ mở một lần.</div></div><div class="gift-stage"><div class="stage-glow"></div><div class="gift-instruction">CHỌN 1 TRONG 3 HỘP QUÀ</div><div class="gift-grid">${box(1)}${box(2)}${box(3)}</div><div class="gift-status" id="giftStatus">Biết đâu hộp bạn chọn là món quà đặc biệt ✦</div></div></div></section>`)
  };

  window.openMysteryGift=function(boxNo){
    const id=currentId(),input=document.getElementById('giftContact');
    const contact=input?input.value.trim():((hasState()&&state.profile&&state.profile.contact)||'');
    if(!id){alert('Không tìm thấy Submission ID. Vui lòng lưu kết quả trước khi mở quà.');return}
    if(!contact){alert('Vui lòng nhập Zalo hoặc SĐT để nhận quà.');if(input)input.focus();return}
    if(hasState()&&state.profile)state.profile.contact=contact;
    const prior=loadLocal(id);if(prior){if(hasState())state.prize=prior;if(typeof renderGiftPrize==='function')renderGiftPrize(prior,true);return}

    const started=Date.now();
    const boxes=[...document.querySelectorAll('.mystery-gift')],chosen=boxes.find(b=>Number(b.dataset.box)===boxNo),status=document.getElementById('giftStatus');
    boxes.forEach(b=>{b.disabled=true;b.classList.add(Number(b.dataset.box)===boxNo?'chosen':'unchosen')});
    if(status)status.textContent='Hộp quà đang mở niêm phong…';

    setTimeout(()=>{if(chosen)chosen.classList.add('shaking');if(status)status.textContent='Đang mở món quà dành cho bạn…'},180);
    setTimeout(()=>{if(chosen){chosen.classList.remove('shaking');chosen.classList.add('opening')}if(status)status.textContent='3 · 2 · 1…'},1550);
    setTimeout(()=>{if(chosen)chosen.classList.add('opened');document.body.classList.add('gift-flash');setTimeout(()=>document.body.classList.remove('gift-flash'),650);if(status)status.textContent='Sắp mở quà…'},3650);

    let done=false,prize=null,revealTimer=null;
    function revealWhenReady(p){
      if(done||!p||!p.prizeKey)return;
      done=true;prize=p;window.removeEventListener('message',listener);
      saveLocal(id,p);if(hasState())state.prize=p;
      const elapsed=Date.now()-started;
      const wait=Math.max(0,4800-elapsed);
      revealTimer=setTimeout(()=>{if(status)status.textContent='MỞ QUÀ!';if(typeof renderGiftPrize==='function')renderGiftPrize(prize,false)},wait);
    }

    const listener=function(ev){
      if(ev.origin!=='https://script.googleusercontent.com'&&ev.origin!=='https://script.google.com')return;
      const d=ev.data;if(!d||d.type!=='ai-inner-prize'||!d.payload||d.payload.submissionId!==id)return;
      revealWhenReady(d.payload)
    };
    window.addEventListener('message',listener);
    postHidden({action:'drawPrize',submissionId:id,contact:contact,boxNo:boxNo});

    function pollPrize(){
      if(done)return;
      if(typeof google!=='undefined'&&google.script&&google.script.run){
        google.script.run.withSuccessHandler(function(p){revealWhenReady(p)}).withFailureHandler(function(){}).getPrize(id)
      }
    }
    setTimeout(pollPrize,2200);
    setTimeout(pollPrize,3300);
    setTimeout(pollPrize,4400);
    setTimeout(()=>{if(!done&&status)status.textContent='Máy chủ đang chậm hơn bình thường, đang hoàn tất quà…'},5600);
  };

  const oldClaim=window.claimPrize;
  window.claimPrize=function(){
    const id=currentId(),p=(hasState()&&state.prize)||loadLocal(id);
    if(!id||!p){if(oldClaim)return oldClaim();return}
    const b=document.getElementById('claimBtn');if(b){b.disabled=true;b.textContent='ĐANG XÁC NHẬN…'}
    postHidden({action:'claimPrize',submissionId:id,contact:(hasState()&&state.profile&&state.profile.contact)||''});
    p.claimed=true;p.claimTime=new Date().toISOString();saveLocal(id,p);if(hasState())state.prize=p;
    setTimeout(()=>{if(typeof renderGiftPrize==='function')renderGiftPrize(p,true)},350)
  };

  const style=document.createElement('style');style.textContent='.gift-possible{display:none!important}';document.head.appendChild(style);
  console.info('AI INNER LAB Mystery Gift v6.2 loaded');
})();