/* AI INNER LAB — Mystery Gift v6.3: smooth compositor animation, ~5s reveal */
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

  function play(el,frames,options){
    if(!el)return null;
    if(typeof el.animate==='function'){
      try{return el.animate(frames,Object.assign({fill:'forwards'},options||{}))}catch(e){}
    }
    const last=frames[frames.length-1]||{};
    Object.keys(last).forEach(k=>{try{el.style[k]=last[k]}catch(e){}});
    return null;
  }

  function beginSmoothOpening(chosen,boxes,status){
    const lid=chosen&&chosen.querySelector('.gift-lid');
    const body=chosen&&chosen.querySelector('.gift-body');
    const aura=chosen&&chosen.querySelector('.gift-aura');
    const shadow=chosen&&chosen.querySelector('.gift-shadow');

    boxes.forEach(b=>{
      b.disabled=true;
      b.style.willChange='transform,opacity,filter';
      if(b!==chosen){
        play(b,[{opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'blur(0px) saturate(1)'},{opacity:.18,transform:'translate3d(0,8px,0) scale(.94)',filter:'blur(.6px) saturate(.65)'}],{duration:520,easing:'cubic-bezier(.22,.8,.26,1)'})
      }
    });
    if(!chosen)return;
    chosen.style.zIndex='8';
    chosen.style.willChange='transform';
    if(lid)lid.style.willChange='transform,opacity';
    if(body)body.style.willChange='transform,filter';
    if(aura)aura.style.willChange='transform,opacity';

    play(chosen,[
      {transform:'translate3d(0,0,0) scale(1)'},
      {transform:'translate3d(0,-14px,0) scale(1.055)'},
      {transform:'translate3d(0,-10px,0) scale(1.045)'}
    ],{duration:650,easing:'cubic-bezier(.22,.85,.25,1)'});

    if(status)status.textContent='Hộp quà đang mở niêm phong…';

    setTimeout(()=>{
      if(status)status.textContent='Đang mở món quà dành cho bạn…';
      play(chosen,[
        {transform:'translate3d(0,-10px,0) scale(1.045) rotate(0deg)'},
        {transform:'translate3d(-3px,-10px,0) scale(1.045) rotate(-1.4deg)'},
        {transform:'translate3d(3px,-10px,0) scale(1.045) rotate(1.4deg)'},
        {transform:'translate3d(-2px,-10px,0) scale(1.045) rotate(-.8deg)'},
        {transform:'translate3d(0,-10px,0) scale(1.045) rotate(0deg)'}
      ],{duration:720,easing:'ease-in-out',iterations:1});
    },720);

    setTimeout(()=>{
      if(status)status.textContent='3 · 2 · 1…';
      play(lid,[
        {transform:'translate3d(-50%,0,0) rotate(0deg)',opacity:1},
        {transform:'translate3d(-50%,-16px,0) rotate(-2deg)',opacity:1,offset:.32},
        {transform:'translate3d(-50%,-72px,0) rotate(-13deg)',opacity:.98}
      ],{duration:900,easing:'cubic-bezier(.18,.82,.2,1)'});
      play(body,[
        {transform:'translate3d(-50%,0,0) scale(1)',filter:'brightness(1)'},
        {transform:'translate3d(-50%,4px,0) scale(.99)',filter:'brightness(1.05)',offset:.35},
        {transform:'translate3d(-50%,-2px,0) scale(1.055)',filter:'brightness(1.16)'}
      ],{duration:1050,easing:'cubic-bezier(.18,.82,.2,1)'});
      play(aura,[
        {transform:'translate3d(-50%,-50%,0) scale(1)',opacity:.55},
        {transform:'translate3d(-50%,-50%,0) scale(1.34)',opacity:.9},
        {transform:'translate3d(-50%,-50%,0) scale(1.18)',opacity:.72}
      ],{duration:1100,easing:'ease-out'});
      play(shadow,[{transform:'translate3d(-50%,0,0) scaleX(1)',opacity:.5},{transform:'translate3d(-50%,0,0) scaleX(.78)',opacity:.32}],{duration:1000,easing:'ease-out'});
    },1750);

    setTimeout(()=>{
      if(status)status.textContent='Sắp mở quà…';
      play(chosen,[
        {transform:'translate3d(0,-10px,0) scale(1.045)'},
        {transform:'translate3d(0,-14px,0) scale(1.075)'},
        {transform:'translate3d(0,-10px,0) scale(1.055)'}
      ],{duration:850,easing:'cubic-bezier(.2,.8,.2,1)'});
    },3300);
  }

  function smoothReveal(prize,status){
    const shell=document.querySelector('.gift-shell');
    if(status)status.textContent='MỞ QUÀ!';
    if(!shell||typeof renderGiftPrize!=='function'){if(typeof renderGiftPrize==='function')renderGiftPrize(prize,false);return}
    play(shell,[
      {opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'blur(0px)'},
      {opacity:.72,transform:'translate3d(0,-3px,0) scale(.992)',filter:'blur(0px)',offset:.55},
      {opacity:0,transform:'translate3d(0,-8px,0) scale(.976)',filter:'blur(2px)'}
    ],{duration:300,easing:'cubic-bezier(.4,0,.2,1)'});
    setTimeout(()=>{
      renderGiftPrize(prize,false);
      const reveal=document.querySelector('.gift-reveal-shell')||document.querySelector('.prize-card')||document.querySelector('.content-pad');
      if(reveal){
        reveal.style.willChange='transform,opacity';
        play(reveal,[{opacity:0,transform:'translate3d(0,12px,0) scale(.985)'},{opacity:1,transform:'translate3d(0,0,0) scale(1)'}],{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});
      }
    },280)
  }

  window.openMysteryGift=function(boxNo){
    const id=currentId(),input=document.getElementById('giftContact');
    const contact=input?input.value.trim():((hasState()&&state.profile&&state.profile.contact)||'');
    if(!id){alert('Không tìm thấy Submission ID. Vui lòng lưu kết quả trước khi mở quà.');return}
    if(!contact){alert('Vui lòng nhập Zalo hoặc SĐT để nhận quà.');if(input)input.focus();return}
    if(hasState()&&state.profile)state.profile.contact=contact;
    const prior=loadLocal(id);if(prior){if(hasState())state.prize=prior;if(typeof renderGiftPrize==='function')renderGiftPrize(prior,true);return}

    const started=performance.now();
    const boxes=[...document.querySelectorAll('.mystery-gift')],chosen=boxes.find(b=>Number(b.dataset.box)===boxNo),status=document.getElementById('giftStatus');
    beginSmoothOpening(chosen,boxes,status);

    let done=false,prize=null;
    function revealWhenReady(p){
      if(done||!p||!p.prizeKey)return;
      done=true;prize=p;window.removeEventListener('message',listener);
      saveLocal(id,p);if(hasState())state.prize=p;
      const elapsed=performance.now()-started;
      const wait=Math.max(0,4700-elapsed);
      setTimeout(()=>smoothReveal(prize,status),wait)
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
    setTimeout(pollPrize,1800);
    setTimeout(pollPrize,2800);
    setTimeout(pollPrize,3800);
    setTimeout(pollPrize,4800);
    setTimeout(()=>{if(!done&&status)status.textContent='Máy chủ đang hoàn tất món quà…'},5600);
  };

  const oldClaim=window.claimPrize;
  window.claimPrize=function(){
    const id=currentId(),p=(hasState()&&state.prize)||loadLocal(id);
    if(!id||!p){if(oldClaim)return oldClaim();return}
    const b=document.getElementById('claimBtn');if(b){b.disabled=true;b.textContent='ĐANG XÁC NHẬN…'}
    postHidden({action:'claimPrize',submissionId:id,contact:(hasState()&&state.profile&&state.profile.contact)||''});
    p.claimed=true;p.claimTime=new Date().toISOString();saveLocal(id,p);if(hasState())state.prize=p;
    setTimeout(()=>{if(typeof renderGiftPrize==='function')renderGiftPrize(p,true)},300)
  };

  const style=document.createElement('style');
  style.textContent=`
    .gift-possible{display:none!important}
    .mystery-gift,.gift-lid,.gift-body,.gift-aura,.gift-shadow,.gift-shell,.gift-reveal-shell{backface-visibility:hidden;-webkit-backface-visibility:hidden;transform-style:preserve-3d}
    .mystery-gift{contain:layout paint;transform:translateZ(0)}
    .gift-lid,.gift-body,.gift-aura,.gift-shadow{transform:translateZ(0)}
    @media (prefers-reduced-motion: reduce){.mystery-gift,.gift-lid,.gift-body,.gift-aura,.gift-shadow{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(style);
  console.info('AI INNER LAB Mystery Gift v6.3 smooth loaded');
})();