/* AI INNER LAB — Fast Luxury Gift Timing v8: 3.2s normal / 3.8s jackpot */
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
    const url=API();if(!url)return false;
    let frame=document.getElementById('aiInnerPostFrame');
    if(!frame){frame=document.createElement('iframe');frame.id='aiInnerPostFrame';frame.name='aiInnerPostFrame';frame.style.display='none';document.body.appendChild(frame)}
    const form=document.createElement('form');form.method='POST';form.action=url;form.target='aiInnerPostFrame';form.style.display='none';
    const input=document.createElement('input');input.type='hidden';input.name='payload';input.value=JSON.stringify(payload);form.appendChild(input);document.body.appendChild(form);
    try{form.submit();return true}finally{setTimeout(()=>form.remove(),1200)}
  }

  function jsonpPrize(id,cb){
    const url=API();if(!url)return;
    const name='__aiGiftFast_'+Date.now()+'_'+Math.random().toString(36).slice(2);
    const s=document.createElement('script');let cleaned=false;
    function cleanup(){if(cleaned)return;cleaned=true;try{delete window[name]}catch(e){window[name]=undefined}s.remove()}
    window[name]=p=>{cleanup();cb&&cb(p)};
    s.onerror=cleanup;
    s.src=url+(url.includes('?')?'&':'?')+'action=getPrize&id='+encodeURIComponent(id)+'&callback='+encodeURIComponent(name)+'&_='+Date.now();
    document.head.appendChild(s);setTimeout(cleanup,4200);
  }

  function play(el,frames,opts){
    if(!el)return null;
    if(typeof el.animate==='function'){
      try{return el.animate(frames,Object.assign({fill:'forwards'},opts||{}))}catch(e){}
    }
    const last=frames[frames.length-1]||{};Object.keys(last).forEach(k=>{try{el.style[k]=last[k]}catch(e){}});
    return null;
  }
  function originOf(el){const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height*.48}}

  function createFxRoot(origin,mode){
    const root=document.createElement('div');root.className='lux-fx-root '+(mode==='jackpot'?'is-jackpot':'');
    root.style.setProperty('--cx',origin.x+'px');root.style.setProperty('--cy',origin.y+'px');
    root.innerHTML='<div class="lux-flash"></div><div class="lux-core"></div><div class="lux-halo h1"></div><div class="lux-halo h2"></div><div class="lux-rays"></div><div class="lux-wave"></div>';
    document.body.appendChild(root);setTimeout(()=>root.remove(),2200);
  }
  function sparkBurst(origin,mode){
    const root=document.createElement('div');root.className='lux-particles lux-sparks '+(mode==='jackpot'?'is-jackpot':'');
    const count=mode==='jackpot'?58:38;
    for(let i=0;i<count;i++){
      const p=document.createElement('i'),a=Math.random()*Math.PI*2,d=(mode==='jackpot'?120:80)+Math.random()*(mode==='jackpot'?300:210);
      p.className='lux-spark s'+(i%4);p.style.left=origin.x+'px';p.style.top=origin.y+'px';
      p.style.setProperty('--tx',Math.cos(a)*d+'px');p.style.setProperty('--ty',Math.sin(a)*d+'px');p.style.setProperty('--sc',(.65+Math.random()*1.25).toFixed(2));p.style.setProperty('--rot',(Math.random()*720-360)+'deg');p.style.setProperty('--delay',(Math.random()*.08)+'s');p.style.setProperty('--dur',(.8+Math.random()*.55)+'s');root.appendChild(p)
    }
    document.body.appendChild(root);setTimeout(()=>root.remove(),1900)
  }
  function confettiBurst(origin,mode){
    const root=document.createElement('div');root.className='lux-particles lux-confetti';
    const count=mode==='jackpot'?110:70,symbols=['◆','●','▰','✦','★'];
    for(let i=0;i<count;i++){
      const c=document.createElement('i'),a=Math.random()*Math.PI*2,d=(mode==='jackpot'?180:125)+Math.random()*(mode==='jackpot'?480:340);
      c.className='lux-confetti-piece c'+(i%5);c.textContent=symbols[i%symbols.length];c.style.left=origin.x+'px';c.style.top=origin.y+'px';
      c.style.setProperty('--tx',Math.cos(a)*d+'px');c.style.setProperty('--ty',(Math.sin(a)*d+70+Math.random()*100)+'px');c.style.setProperty('--rot',(Math.random()*1100-550)+'deg');c.style.setProperty('--delay',(Math.random()*.12)+'s');c.style.setProperty('--dur',(1+Math.random()*.8)+'s');root.appendChild(c)
    }
    document.body.appendChild(root);setTimeout(()=>root.remove(),2400)
  }
  function glitterRain(mode){
    const root=document.createElement('div');root.className='lux-glitter-rain '+(mode==='jackpot'?'is-jackpot':'');
    const count=mode==='jackpot'?38:22;
    for(let i=0;i<count;i++){
      const g=document.createElement('i');g.textContent=i%3===0?'✦':i%3===1?'✧':'·';g.style.left=(4+Math.random()*92)+'vw';g.style.setProperty('--delay',(Math.random()*.45)+'s');g.style.setProperty('--dur',(1.15+Math.random()*.85)+'s');g.style.setProperty('--drift',(Math.random()*110-55)+'px');g.style.fontSize=(9+Math.random()*15)+'px';root.appendChild(g)
    }
    document.body.appendChild(root);setTimeout(()=>root.remove(),2600)
  }

  function fastAnticipation(chosen,boxes,status){
    const lid=chosen&&chosen.querySelector('.gift-lid'),body=chosen&&chosen.querySelector('.gift-body'),aura=chosen&&chosen.querySelector('.gift-aura');
    boxes.forEach(b=>{
      b.disabled=true;b.style.willChange='transform,opacity,filter';
      if(b!==chosen)play(b,[{opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'brightness(1)'},{opacity:.16,transform:'translate3d(0,10px,0) scale(.91)',filter:'brightness(.58) blur(.4px)'}],{duration:420,easing:'cubic-bezier(.22,.8,.26,1)'})
    });
    if(!chosen)return;
    chosen.style.zIndex='20';
    play(chosen,[{transform:'translate3d(0,0,0) scale(1)'},{transform:'translate3d(0,-16px,0) scale(1.065)'},{transform:'translate3d(0,-12px,0) scale(1.05)'}],{duration:470,easing:'cubic-bezier(.16,1,.3,1)'});
    play(aura,[{opacity:.45,transform:'translate(-50%,-50%) scale(1)'},{opacity:.9,transform:'translate(-50%,-50%) scale(1.35)'},{opacity:.68,transform:'translate(-50%,-50%) scale(1.18)'}],{duration:720,easing:'ease-in-out'});
    if(status)status.textContent='Hộp quà đang tích năng lượng…';

    setTimeout(()=>{
      if(status)status.textContent='Sẵn sàng…';
      play(chosen,[
        {transform:'translate3d(0,-12px,0) scale(1.05) rotate(0deg)'},{transform:'translate3d(-3px,-12px,0) scale(1.05) rotate(-1.5deg)'},{transform:'translate3d(3px,-12px,0) scale(1.05) rotate(1.5deg)'},{transform:'translate3d(-2px,-12px,0) scale(1.05) rotate(-.8deg)'},{transform:'translate3d(2px,-12px,0) scale(1.05) rotate(.8deg)'},{transform:'translate3d(0,-12px,0) scale(1.05) rotate(0deg)'}
      ],{duration:520,easing:'ease-in-out'})
    },430);

    setTimeout(()=>{
      if(status)status.textContent='3 · 2 · 1…';
      play(lid,[{transform:'translateX(-50%) translate3d(0,0,0) rotate(0deg)',opacity:1},{transform:'translateX(-50%) translate3d(0,-18px,0) rotate(-3deg)',opacity:1,offset:.32},{transform:'translateX(-50%) translate3d(0,-98px,0) rotate(-20deg)',opacity:.08}],{duration:720,easing:'cubic-bezier(.16,.85,.24,1)'});
      play(body,[{transform:'translateX(-50%) translate3d(0,0,0) scale(1)',filter:'brightness(1)'},{transform:'translateX(-50%) translate3d(0,3px,0) scale(.985)',filter:'brightness(1.08)',offset:.3},{transform:'translateX(-50%) translate3d(0,-3px,0) scale(1.07)',filter:'brightness(1.3)'}],{duration:780,easing:'cubic-bezier(.18,.82,.2,1)'})
    },1050)
  }

  function fastReveal(prize,chosen,status,origin){
    const mode=prize&&prize.prizeKey==='coaching_month'?'jackpot':'normal';
    if(status)status.textContent=mode==='jackpot'?'💎 JACKPOT!':'✨ MỞ QUÀ!';
    createFxRoot(origin,mode);sparkBurst(origin,mode);confettiBurst(origin,mode);glitterRain(mode);
    if(chosen)play(chosen,[{transform:'translate3d(0,-12px,0) scale(1.06)',filter:'brightness(1)'},{transform:'translate3d(0,-17px,0) scale(1.12)',filter:'brightness(1.45)',offset:.35},{transform:'translate3d(0,-11px,0) scale(1.07)',filter:'brightness(1.12)'}],{duration:620,easing:'cubic-bezier(.16,1,.3,1)'});

    setTimeout(()=>{
      const shell=document.querySelector('.gift-shell');
      if(shell)play(shell,[{opacity:1,transform:'scale(1)',filter:'blur(0px)'},{opacity:.62,transform:'scale(.992)',filter:'blur(0px)',offset:.5},{opacity:0,transform:'scale(.976)',filter:'blur(1.5px)'}],{duration:240,easing:'cubic-bezier(.4,0,.2,1)'})
    },390);

    setTimeout(()=>{
      if(typeof renderGiftPrize==='function')renderGiftPrize(prize,true);
      const reveal=document.querySelector('.gift-reveal-shell')||document.querySelector('.prize-card')||document.querySelector('.content-pad');
      if(reveal)play(reveal,[{opacity:0,transform:'translate3d(0,14px,0) scale(.972)',filter:'brightness(1.25)'},{opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'brightness(1)'}],{duration:430,easing:'cubic-bezier(.16,1,.3,1)'});
      if(mode==='jackpot'){
        const center={x:innerWidth/2,y:innerHeight*.45};
        setTimeout(()=>{sparkBurst(center,'jackpot');glitterRain('jackpot')},110)
      }
    },760)
  }

  window.openMysteryGift=function(boxNo){
    const id=currentId(),input=document.getElementById('giftContact');
    const contact=input?input.value.trim():((hasState()&&state.profile&&state.profile.contact)||'');
    if(!id){alert('Không tìm thấy Submission ID. Vui lòng lưu kết quả trước khi mở quà.');return}
    if(!contact){alert('Vui lòng nhập Zalo hoặc SĐT để nhận quà.');if(input)input.focus();return}
    if(hasState()&&state.profile)state.profile.contact=contact;
    const prior=(hasState()&&state.prize&&state.prize.prizeKey)?state.prize:loadLocal(id);
    if(prior){if(hasState())state.prize=prior;if(typeof renderGiftPrize==='function')renderGiftPrize(prior,true);return}

    const boxes=[...document.querySelectorAll('.mystery-gift')],chosen=boxes.find(b=>Number(b.dataset.box)===Number(boxNo));
    if(!chosen||!boxes.length)return;
    const status=document.getElementById('giftStatus'),origin=originOf(chosen),started=performance.now();
    fastAnticipation(chosen,boxes,status);

    let done=false,scheduled=false;
    function accept(p){
      if(done||scheduled||!p||!p.prizeKey)return;
      scheduled=true;saveLocal(id,p);if(hasState())state.prize=p;
      const isJackpot=p.prizeKey==='coaching_month';
      const revealStartTarget=isJackpot?3040:2440;
      const elapsed=performance.now()-started;
      setTimeout(()=>{
        if(done)return;done=true;window.removeEventListener('message',listener);fastReveal(p,chosen,status,origin)
      },Math.max(0,revealStartTarget-elapsed))
    }
    const listener=function(ev){
      if(ev.origin!=='https://script.googleusercontent.com'&&ev.origin!=='https://script.google.com')return;
      const d=ev.data;if(!d||d.type!=='ai-inner-prize'||!d.payload||d.payload.submissionId!==id)return;accept(d.payload)
    };
    window.addEventListener('message',listener);
    postHidden({action:'drawPrize',submissionId:id,contact:contact,boxNo:Number(boxNo)});

    setTimeout(()=>jsonpPrize(id,accept),650);
    setTimeout(()=>jsonpPrize(id,accept),1250);
    setTimeout(()=>jsonpPrize(id,accept),1900);
    setTimeout(()=>jsonpPrize(id,accept),2600);
    setTimeout(()=>jsonpPrize(id,accept),3400);
    setTimeout(()=>{if(!done&&!scheduled&&status)status.textContent='✨ Đang hoàn tất món quà…'},4200)
  };

  console.info('AI INNER LAB Fast Luxury Gift Timing v8 loaded — normal 3.2s / jackpot 3.8s');
})();
