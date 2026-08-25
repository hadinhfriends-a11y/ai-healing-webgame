/* AI INNER LAB — Lucky Wheel motion fix v3 */
(function(){
  function hasState(){ return typeof state!=='undefined'&&state; }

  function currentSubmissionId(){
    if(hasState()&&state.submissionId) return state.submissionId;
    try{
      const base=(hasState()&&state.shareUrl)?state.shareUrl:location.href;
      const u=new URL(base,location.href);
      return u.searchParams.get('result')||'';
    }catch(e){ return ''; }
  }

  function setRotation(wheel,deg){
    wheel.style.transition='none';
    wheel.style.transform='rotate('+deg+'deg)';
  }

  function startFastSpin(wheel){
    // Prefer the browser's Web Animations API. It is not affected by CSS animation overrides.
    if(typeof wheel.animate==='function'){
      const anim=wheel.animate(
        [{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}],
        {duration:650,iterations:Infinity,easing:'linear'}
      );
      return {type:'waapi',anim:anim,duration:650};
    }

    // Fallback: raw requestAnimationFrame rotation.
    const start=performance.now();
    const holder={type:'raf',raf:0,stopped:false,start:start,duration:650,current:0};
    const tick=function(now){
      if(holder.stopped) return;
      holder.current=((now-start)%holder.duration)/holder.duration*360;
      setRotation(wheel,holder.current);
      holder.raf=requestAnimationFrame(tick);
    };
    holder.raf=requestAnimationFrame(tick);
    return holder;
  }

  function stopFastSpin(wheel,spin){
    let angle=0;
    if(!spin) return angle;
    if(spin.type==='waapi'){
      const t=Number(spin.anim.currentTime||0);
      angle=((t%spin.duration)/spin.duration)*360;
      try{spin.anim.cancel()}catch(e){}
    }else{
      spin.stopped=true;
      if(spin.raf) cancelAnimationFrame(spin.raf);
      angle=Number(spin.current||0);
    }
    setRotation(wheel,angle);
    void wheel.offsetWidth;
    return angle;
  }

  function settleToPrize(wheel,start,prizeKey,onDone){
    const centers={voucher:162,expert_session:340.2,coaching_month:358.2};
    const center=centers[prizeKey]!==undefined?centers[prizeKey]:162;
    const desired=(360-center)%360;
    const startNorm=((start%360)+360)%360;
    const delta=(desired-startNorm+360)%360;
    const finalAngle=start+(6*360)+delta;

    if(typeof wheel.animate==='function'){
      const settle=wheel.animate(
        [{transform:'rotate('+start+'deg)'},{transform:'rotate('+finalAngle+'deg)'}],
        {duration:4800,easing:'cubic-bezier(.08,.72,.08,1)',fill:'forwards'}
      );
      let done=false;
      const finish=function(){
        if(done) return; done=true;
        setRotation(wheel,finalAngle);
        try{settle.cancel()}catch(e){}
        onDone();
      };
      settle.finished.then(finish).catch(function(){setTimeout(finish,0)});
      setTimeout(finish,5100);
      return;
    }

    // Fallback settle animation using requestAnimationFrame.
    const started=performance.now(),duration=4800;
    const ease=function(x){return 1-Math.pow(1-x,4)};
    const tick=function(now){
      const p=Math.min(1,(now-started)/duration),v=start+(finalAngle-start)*ease(p);
      setRotation(wheel,v);
      if(p<1) requestAnimationFrame(tick); else onDone();
    };
    requestAnimationFrame(tick);
  }

  window.spinWheel=function(){
    const id=currentSubmissionId();
    const input=document.getElementById('wheelContact');
    const contact=input?input.value.trim():((hasState()&&state.profile&&state.profile.contact)||'');
    if(!id){ alert('Không tìm thấy Submission ID. Vui lòng lưu kết quả trước khi quay.'); return; }
    if(!contact){
      alert('Vui lòng nhập Zalo hoặc SĐT để nhận quà.');
      if(input) input.focus();
      return;
    }
    if(hasState()&&state.profile) state.profile.contact=contact;

    const wheel=document.getElementById('luckyWheel');
    const btn=document.getElementById('spinBtn');
    const status=document.getElementById('wheelStatus');
    if(!wheel) return;

    if(btn){ btn.disabled=true; btn.textContent='ĐANG QUAY…'; }
    if(status) status.textContent='Vòng quay đang chạy · đang mở phần quà dành cho bạn…';

    // Remove old CSS animation classes and start motion immediately via JavaScript.
    wheel.classList.remove('ai-wheel-spinning','ai-wheel-settling');
    setRotation(wheel,0);
    const spin=startFastSpin(wheel);

    google.script.run
      .withSuccessHandler(function(p){
        if(hasState()) state.prize=p;
        const start=stopFastSpin(wheel,spin);
        if(status) status.textContent='Phần quà đã được khóa · vòng quay đang chậm dần…';
        settleToPrize(wheel,start,p.prizeKey,function(){
          if(typeof showPrizeResult==='function') showPrizeResult();
        });
      })
      .withFailureHandler(function(err){
        stopFastSpin(wheel,spin);
        if(status) status.textContent='Chưa mở được quà. Bạn có thể thử lại.';
        alert('Không mở được quà: '+((err&&err.message)||err));
        if(btn){ btn.disabled=false; btn.textContent='THỬ LẠI →'; }
      })
      .drawPrize({submissionId:id,contact:contact});
  };

  const style=document.createElement('style');
  style.textContent=`
    .lucky-wheel{will-change:transform;transform-origin:50% 50%;}
    .wheel-pointer{filter:drop-shadow(0 3px 8px rgba(0,0,0,.5));z-index:10;}
  `;
  document.head.appendChild(style);
  console.info('AI INNER LAB Lucky Wheel motion fix v3 loaded');
})();
