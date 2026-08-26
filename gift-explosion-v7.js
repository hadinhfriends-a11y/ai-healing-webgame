/* AI INNER LAB — Luxury Explosion Gift Reveal v7 */
(function(){
  const STORE='ai-inner-server-prize:';
  const API=()=>window.AI_INNER_BACKEND_URL||'';
  const hasState=()=>typeof state!=='undefined'&&state;

  function currentId(){
    if(hasState()&&state.submissionId)return state.submissionId;
    try{
      const base=(hasState()&&state.shareUrl)?state.shareUrl:location.href;
      return new URL(base,location.href).searchParams.get('result')||'';
    }catch(e){return''}
  }
  function saveLocal(id,p){try{localStorage.setItem(STORE+id,JSON.stringify(p))}catch(e){}}
  function loadLocal(id){try{const p=JSON.parse(localStorage.getItem(STORE+id)||'null');return p&&p.prizeKey?p:null}catch(e){return null}}

  function postHidden(payload){
    const url=API(); if(!url)return false;
    let frame=document.getElementById('aiInnerPostFrame');
    if(!frame){
      frame=document.createElement('iframe');
      frame.id='aiInnerPostFrame'; frame.name='aiInnerPostFrame';
      frame.style.display='none'; document.body.appendChild(frame);
    }
    const form=document.createElement('form');
    form.method='POST'; form.action=url; form.target='aiInnerPostFrame'; form.style.display='none';
    const input=document.createElement('input');
    input.type='hidden'; input.name='payload'; input.value=JSON.stringify(payload);
    form.appendChild(input); document.body.appendChild(form);
    try{form.submit();return true}finally{setTimeout(()=>form.remove(),1200)}
  }

  function jsonpPrize(id,cb){
    const url=API(); if(!url)return;
    const name='__aiGiftCb_'+Date.now()+'_'+Math.random().toString(36).slice(2);
    const s=document.createElement('script');
    let cleaned=false;
    function cleanup(){if(cleaned)return;cleaned=true;try{delete window[name]}catch(e){window[name]=undefined}s.remove()}
    window[name]=function(p){cleanup();cb&&cb(p)};
    s.onerror=cleanup;
    s.src=url+(url.includes('?')?'&':'?')+'action=getPrize&id='+encodeURIComponent(id)+'&callback='+encodeURIComponent(name)+'&_='+Date.now();
    document.head.appendChild(s);
    setTimeout(cleanup,4500);
  }

  function play(el,frames,opts){
    if(!el)return null;
    if(el.animate){try{return el.animate(frames,Object.assign({fill:'forwards'},opts||{}))}catch(e){}}
    const last=frames[frames.length-1]||{}; Object.keys(last).forEach(k=>{try{el.style[k]=last[k]}catch(e){}});
    return null;
  }

  function originOf(el){
    const r=el.getBoundingClientRect();
    return {x:r.left+r.width/2,y:r.top+r.height*.48};
  }

  function createFxRoot(origin,mode){
    const root=document.createElement('div');
    root.className='lux-fx-root '+(mode==='jackpot'?'is-jackpot':'');
    root.style.setProperty('--cx',origin.x+'px');
    root.style.setProperty('--cy',origin.y+'px');
    root.innerHTML='<div class="lux-flash"></div><div class="lux-core"></div><div class="lux-halo h1"></div><div class="lux-halo h2"></div><div class="lux-rays"></div><div class="lux-wave"></div>';
    document.body.appendChild(root);
    setTimeout(()=>root.remove(),2400);
  }

  function sparkBurst(origin,mode){
    const root=document.createElement('div');
    root.className='lux-particles lux-sparks '+(mode==='jackpot'?'is-jackpot':'');
    const count=mode==='jackpot'?58:38;
    for(let i=0;i<count;i++){
      const p=document.createElement('i');
      const a=Math.random()*Math.PI*2;
      const d=(mode==='jackpot'?120:80)+Math.random()*(mode==='jackpot'?300:210);
      p.className='lux-spark s'+(i%4);
      p.style.left=origin.x+'px'; p.style.top=origin.y+'px';
      p.style.setProperty('--tx',Math.cos(a)*d+'px');
      p.style.setProperty('--ty',Math.sin(a)*d+'px');
      p.style.setProperty('--sc',(.65+Math.random()*1.25).toFixed(2));
      p.style.setProperty('--rot',(Math.random()*720-360)+'deg');
      p.style.setProperty('--delay',(Math.random()*.12)+'s');
      p.style.setProperty('--dur',(.95+Math.random()*.7)+'s');
      root.appendChild(p);
    }
    document.body.appendChild(root); setTimeout(()=>root.remove(),2200);
  }

  function glitterRain(mode){
    const root=document.createElement('div'); root.className='lux-glitter-rain '+(mode==='jackpot'?'is-jackpot':'');
    const count=mode==='jackpot'?42:24;
    for(let i=0;i<count;i++){
      const g=document.createElement('i');
      g.textContent=i%3===0?'✦':i%3===1?'✧':'·';
      g.style.left=(4+Math.random()*92)+'vw';
      g.style.setProperty('--delay',(Math.random()*.65)+'s');
      g.style.setProperty('--dur',(1.35+Math.random()*1.1)+'s');
      g.style.setProperty('--drift',(Math.random()*120-60)+'px');
      g.style.fontSize=(9+Math.random()*16)+'px';
      root.appendChild(g);
    }
    document.body.appendChild(root);setTimeout(()=>root.remove(),3200);
  }

  function confettiBurst(origin,mode){
    const root=document.createElement('div');root.className='lux-particles lux-confetti';
    const count=mode==='jackpot'?118:76;
    const symbols=['◆','●','▰','✦','★'];
    for(let i=0;i<count;i++){
      const c=document.createElement('i');
      const a=Math.random()*Math.PI*2;
      const d=(mode==='jackpot'?190:130)+Math.random()*(mode==='jackpot'?500:360);
      c.className='lux-confetti-piece c'+(i%5);c.textContent=symbols[i%symbols.length];
      c.style.left=origin.x+'px';c.style.top=origin.y+'px';
      c.style.setProperty('--tx',Math.cos(a)*d+'px');
      c.style.setProperty('--ty',(Math.sin(a)*d+80+Math.random()*110)+'px');
      c.style.setProperty('--rot',(Math.random()*1200-600)+'deg');
      c.style.setProperty('--delay',(Math.random()*.16)+'s');
      c.style.setProperty('--dur',(1.15+Math.random()*.95)+'s');
      root.appendChild(c);
    }
    document.body.appendChild(root);setTimeout(()=>root.remove(),2800);
  }

  function anticipation(chosen,boxes,status){
    const lid=chosen&&chosen.querySelector('.gift-lid');
    const body=chosen&&chosen.querySelector('.gift-body');
    const aura=chosen&&chosen.querySelector('.gift-aura');
    boxes.forEach(b=>{
      b.disabled=true;b.style.willChange='transform,opacity,filter';
      if(b!==chosen) play(b,[{opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'brightness(1)'},{opacity:.16,transform:'translate3d(0,12px,0) scale(.9)',filter:'brightness(.55) blur(.5px)'}],{duration:650,easing:'cubic-bezier(.22,.8,.26,1)'});
    });
    if(!chosen)return;
    chosen.style.zIndex='20';
    play(chosen,[{transform:'translate3d(0,0,0) scale(1)'},{transform:'translate3d(0,-18px,0) scale(1.07)'},{transform:'translate3d(0,-14px,0) scale(1.055)'}],{duration:700,easing:'cubic-bezier(.16,1,.3,1)'});
    play(aura,[{opacity:.45,transform:'translate(-50%,-50%) scale(1)'},{opacity:.92,transform:'translate(-50%,-50%) scale(1.42)'},{opacity:.65,transform:'translate(-50%,-50%) scale(1.18)'}],{duration:1250,easing:'ease-in-out',iterations:2});
    if(status)status.textContent='Hộp quà đang tích năng lượng…';

    setTimeout(()=>{
      if(status)status.textContent='Sẵn sàng mở điều bất ngờ…';
      play(chosen,[
        {transform:'translate3d(0,-14px,0) scale(1.055) rotate(0deg)'},
        {transform:'translate3d(-4px,-14px,0) scale(1.055) rotate(-1.6deg)'},
        {transform:'translate3d(4px,-14px,0) scale(1.055) rotate(1.6deg)'},
        {transform:'translate3d(-3px,-14px,0) scale(1.055) rotate(-1deg)'},
        {transform:'translate3d(3px,-14px,0) scale(1.055) rotate(1deg)'},
        {transform:'translate3d(0,-14px,0) scale(1.055) rotate(0deg)'}
      ],{duration:850,easing:'ease-in-out'});
    },750);

    setTimeout(()=>{
      if(status)status.textContent='3 · 2 · 1…';
      play(lid,[
        {transform:'translateX(-50%) translate3d(0,0,0) rotate(0deg)',opacity:1},
        {transform:'translateX(-50%) translate3d(0,-22px,0) rotate(-3deg)',opacity:1,offset:.32},
        {transform:'translateX(-50%) translate3d(0,-105px,0) rotate(-20deg)',opacity:.1}
      ],{duration:1050,easing:'cubic-bezier(.16,.85,.24,1)'});
      play(body,[
        {transform:'translateX(-50%) translate3d(0,0,0) scale(1)',filter:'brightness(1)'},
        {transform:'translateX(-50%) translate3d(0,4px,0) scale(.98)',filter:'brightness(1.08)',offset:.32},
        {transform:'translateX(-50%) translate3d(0,-3px,0) scale(1.075)',filter:'brightness(1.35)'}
      ],{duration:1150,easing:'cubic-bezier(.18,.82,.2,1)'});
    },1800);
  }

  function cinematicReveal(prize,chosen,status,origin){
    const mode=prize&&prize.prizeKey==='coaching_month'?'jackpot':'normal';
    if(status)status.textContent=mode==='jackpot'?'💎 JACKPOT!':'✨ MỞ QUÀ!';

    createFxRoot(origin,mode);
    sparkBurst(origin,mode);
    confettiBurst(origin,mode);
    glitterRain(mode);

    if(chosen){
      play(chosen,[{transform:'translate3d(0,-14px,0) scale(1.06)',filter:'brightness(1)'},{transform:'translate3d(0,-18px,0) scale(1.13)',filter:'brightness(1.45)',offset:.35},{transform:'translate3d(0,-12px,0) scale(1.07)',filter:'brightness(1.12)'}],{duration:900,easing:'cubic-bezier(.16,1,.3,1)'});
    }

    setTimeout(()=>{
      const shell=document.querySelector('.gift-shell');
      if(shell)play(shell,[{opacity:1,transform:'scale(1)',filter:'blur(0px)'},{opacity:.6,transform:'scale(.992)',filter:'blur(0px)',offset:.5},{opacity:0,transform:'scale(.975)',filter:'blur(2px)'}],{duration:360,easing:'cubic-bezier(.4,0,.2,1)'});
    },850);

    setTimeout(()=>{
      if(typeof renderGiftPrize==='function')renderGiftPrize(prize,true);
      const reveal=document.querySelector('.gift-reveal-shell')||document.querySelector('.prize-card')||document.querySelector('.content-pad');
      if(reveal){
        reveal.style.willChange='transform,opacity,filter';
        play(reveal,[{opacity:0,transform:'translate3d(0,18px,0) scale(.965)',filter:'brightness(1.3)'},{opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'brightness(1)'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});
      }
      if(mode==='jackpot'){
        const center={x:innerWidth/2,y:innerHeight*.45};
        setTimeout(()=>{sparkBurst(center,'jackpot');glitterRain('jackpot')},180);
      }
    },1180);
  }

  window.openMysteryGift=function(boxNo){
    const id=currentId();
    const input=document.getElementById('giftContact');
    const contact=input?input.value.trim():((hasState()&&state.profile&&state.profile.contact)||'');
    if(!id){alert('Không tìm thấy Submission ID. Vui lòng lưu kết quả trước khi mở quà.');return}
    if(!contact){alert('Vui lòng nhập Zalo hoặc SĐT để nhận quà.');if(input)input.focus();return}
    if(hasState()&&state.profile)state.profile.contact=contact;
    const prior=(hasState()&&state.prize&&state.prize.prizeKey)?state.prize:loadLocal(id);
    if(prior){if(hasState())state.prize=prior;if(typeof renderGiftPrize==='function')renderGiftPrize(prior,true);return}

    const boxes=[...document.querySelectorAll('.mystery-gift')];
    const chosen=boxes.find(b=>Number(b.dataset.box)===Number(boxNo));
    if(!chosen||!boxes.length)return;
    const status=document.getElementById('giftStatus');
    const origin=originOf(chosen);
    const started=performance.now();
    anticipation(chosen,boxes,status);

    let done=false,prize=null,burstStarted=false;
    function accept(p){
      if(done||!p||!p.prizeKey)return;
      prize=p;saveLocal(id,p);if(hasState())state.prize=p;
      const elapsed=performance.now()-started;
      const wait=Math.max(0,4550-elapsed);
      setTimeout(()=>{
        if(done)return;done=true;window.removeEventListener('message',listener);burstStarted=true;cinematicReveal(prize,chosen,status,origin);
      },wait);
    }
    const listener=function(ev){
      if(ev.origin!=='https://script.googleusercontent.com'&&ev.origin!=='https://script.google.com')return;
      const d=ev.data;if(!d||d.type!=='ai-inner-prize'||!d.payload||d.payload.submissionId!==id)return;
      accept(d.payload);
    };
    window.addEventListener('message',listener);
    postHidden({action:'drawPrize',submissionId:id,contact:contact,boxNo:Number(boxNo)});

    setTimeout(()=>jsonpPrize(id,accept),1800);
    setTimeout(()=>jsonpPrize(id,accept),3000);
    setTimeout(()=>jsonpPrize(id,accept),4200);
    setTimeout(()=>{
      if(!done&&!burstStarted&&status)status.textContent='✨ Đang hoàn tất món quà dành cho bạn…';
      jsonpPrize(id,accept);
    },5400);
  };

  const style=document.createElement('style');
  style.id='luxury-explosion-v7-style';
  style.textContent=`
    .gift-stage,.gift-grid,.mystery-gift{overflow:visible!important}
    .lux-fx-root,.lux-particles,.lux-glitter-rain{position:fixed;inset:0;pointer-events:none;z-index:100000;overflow:hidden}
    .lux-flash,.lux-core,.lux-halo,.lux-rays,.lux-wave{position:absolute;left:var(--cx);top:var(--cy);transform:translate(-50%,-50%);border-radius:50%}
    .lux-flash{width:100vw;height:100vh;background:radial-gradient(circle at center,rgba(255,255,255,.95) 0%,rgba(255,231,158,.38) 12%,rgba(195,111,255,.16) 28%,transparent 52%);animation:luxFlash .62s ease-out forwards}
    .lux-core{width:150px;height:150px;background:radial-gradient(circle,#fff 0%,#fff3b8 26%,#ffd56d 46%,rgba(192,101,255,.35) 65%,transparent 78%);filter:blur(1px);animation:luxCore 1.35s ease-out forwards}
    .lux-halo{border:2px solid rgba(255,224,133,.9);box-shadow:0 0 26px rgba(255,207,90,.58),inset 0 0 18px rgba(255,255,255,.25);opacity:0}.lux-halo.h1{width:130px;height:130px;animation:luxRing 1.15s .06s ease-out forwards}.lux-halo.h2{width:180px;height:180px;border-color:rgba(190,125,255,.78);animation:luxRing 1.45s .14s ease-out forwards}
    .lux-rays{width:440px;height:440px;background:repeating-conic-gradient(from 0deg,rgba(255,239,181,.8) 0 2deg,transparent 2deg 13deg,rgba(203,138,255,.55) 13deg 15deg,transparent 15deg 25deg);mask-image:radial-gradient(circle,#000 0 22%,rgba(0,0,0,.82) 42%,transparent 72%);opacity:0;animation:luxRays 1.4s .05s ease-out forwards}
    .lux-wave{width:90px;height:90px;border:5px solid rgba(255,255,255,.75);box-shadow:0 0 30px rgba(255,219,117,.6);opacity:0;animation:luxWave 1.05s ease-out forwards}
    .lux-fx-root.is-jackpot .lux-core{width:220px;height:220px;background:radial-gradient(circle,#fff 0%,#fff7d5 20%,#ffd76d 39%,rgba(255,186,61,.62) 52%,rgba(193,96,255,.44) 67%,transparent 80%)}
    .lux-fx-root.is-jackpot .lux-rays{width:600px;height:600px;opacity:1}.lux-fx-root.is-jackpot .lux-halo{border-width:3px;box-shadow:0 0 38px rgba(255,210,80,.8),inset 0 0 24px rgba(255,255,255,.32)}
    .lux-spark{position:absolute;width:8px;height:8px;margin:-4px;border-radius:50%;background:#fff8cb;box-shadow:0 0 14px #fff,0 0 24px #ffd86f;opacity:0;animation:luxSpark var(--dur) var(--delay) cubic-bezier(.14,.72,.22,1) forwards}.lux-spark.s1{background:#dba3ff;box-shadow:0 0 14px #fff,0 0 26px #ba6dff}.lux-spark.s2{width:4px;height:20px;border-radius:999px;background:linear-gradient(#fff,#ffd66e)}.lux-spark.s3{width:14px;height:14px;clip-path:polygon(50% 0,61% 38%,100% 50%,61% 62%,50% 100%,39% 62%,0 50%,39% 38%);background:#fff}
    .lux-confetti-piece{position:absolute;font-style:normal;font-size:14px;opacity:0;animation:luxConfetti var(--dur) var(--delay) cubic-bezier(.13,.68,.18,1) forwards}.lux-confetti-piece.c0{color:#ffd45f}.lux-confetti-piece.c1{color:#c276ff}.lux-confetti-piece.c2{color:#ff72c8}.lux-confetti-piece.c3{color:#74ddff}.lux-confetti-piece.c4{color:#fff}
    .lux-glitter-rain i{position:absolute;top:-30px;font-style:normal;color:#ffe58d;text-shadow:0 0 12px #fff,0 0 22px #c17aff;opacity:0;animation:luxRain var(--dur) var(--delay) linear forwards}.lux-glitter-rain.is-jackpot i{color:#fff2b5;text-shadow:0 0 16px #fff,0 0 26px #ffcf5c}
    @keyframes luxFlash{0%{opacity:0}8%{opacity:1}100%{opacity:0}}@keyframes luxCore{0%{opacity:0;transform:translate(-50%,-50%) scale(.18)}16%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(2.25)}}
    @keyframes luxRing{0%{opacity:.95;transform:translate(-50%,-50%) scale(.35)}100%{opacity:0;transform:translate(-50%,-50%) scale(3.4)}}@keyframes luxRays{0%{opacity:0;transform:translate(-50%,-50%) scale(.55) rotate(-8deg)}18%{opacity:.9}100%{opacity:0;transform:translate(-50%,-50%) scale(1.3) rotate(22deg)}}@keyframes luxWave{0%{opacity:.9;transform:translate(-50%,-50%) scale(.2)}100%{opacity:0;transform:translate(-50%,-50%) scale(4.2)}}
    @keyframes luxSpark{0%{opacity:0;transform:translate3d(0,0,0) scale(.25) rotate(0)}10%{opacity:1}100%{opacity:0;transform:translate3d(var(--tx),var(--ty),0) scale(var(--sc)) rotate(var(--rot))}}@keyframes luxConfetti{0%{opacity:0;transform:translate3d(0,0,0) rotate(0) scale(.5)}8%{opacity:1}75%{opacity:1}100%{opacity:0;transform:translate3d(var(--tx),var(--ty),0) rotate(var(--rot)) scale(1)}}@keyframes luxRain{0%{opacity:0;transform:translate3d(0,-20px,0) rotate(0)}12%{opacity:1}100%{opacity:0;transform:translate3d(var(--drift),105vh,0) rotate(360deg)}}
    @media(max-width:700px){.lux-rays{width:330px;height:330px}.lux-fx-root.is-jackpot .lux-rays{width:430px;height:430px}.lux-confetti-piece{font-size:11px}}
    @media(prefers-reduced-motion:reduce){.lux-fx-root,.lux-particles,.lux-glitter-rain{display:none!important}}
  `;
  document.head.appendChild(style);
  console.info('AI INNER LAB Luxury Explosion Gift Reveal v7 loaded');
})();
