/* AI INNER LAB — Lucky Wheel motion fix v4: Brave-safe */
(function(){
  function hasState(){ return typeof state!=='undefined'&&state; }
  function currentSubmissionId(){
    if(hasState()&&state.submissionId) return state.submissionId;
    try{
      const base=(hasState()&&state.shareUrl)?state.shareUrl:location.href;
      return new URL(base,location.href).searchParams.get('result')||'';
    }catch(e){ return ''; }
  }

  // Same deterministic draw is implemented in Code.gs.
  // One Submission ID always maps to one prize: 90% / 9% / 1%.
  function hash32(s){
    let h=2166136261>>>0;
    for(let i=0;i<s.length;i++){
      h^=s.charCodeAt(i);
      h=Math.imul(h,16777619)>>>0;
    }
    return h>>>0;
  }
  function prizeForId(id){
    const n=hash32(String(id))%10000;
    if(n<9000) return {prizeKey:'voucher',prizeTitle:'Voucher khóa học trị giá 1.000.000đ'};
    if(n<9900) return {prizeKey:'expert_session',prizeTitle:'01 buổi giải thích kết quả với chuyên gia tâm lý'};
    return {prizeKey:'coaching_month',prizeTitle:'01 tháng Coaching phát triển bản thân 1:1'};
  }

  function applyAngle(wheel,deg){
    wheel.style.transition='none';
    wheel.style.transform='rotate('+deg+'deg)';
    const center=wheel.querySelector('.wheel-center');
    if(center) center.style.transform='rotate('+(-deg)+'deg)';
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
    finally{ setTimeout(()=>form.remove(),1000); }
  }

  function spinConstant(wheel){
    const holder={running:true,angle:0,last:performance.now(),raf:0};
    function tick(now){
      if(!holder.running) return;
      const dt=Math.min(50,now-holder.last);
      holder.last=now;
      // ~1.35 turns/second, obvious motion even on high-refresh screens.
      holder.angle=(holder.angle+dt*0.486)%360;
      applyAngle(wheel,holder.angle);
      holder.raf=requestAnimationFrame(tick);
    }
    holder.raf=requestAnimationFrame(tick);
    return holder;
  }

  function stopConstant(holder){
    if(!holder) return 0;
    holder.running=false;
    if(holder.raf) cancelAnimationFrame(holder.raf);
    return Number(holder.angle||0);
  }

  function settle(wheel,start,prizeKey,done){
    const centers={voucher:162,expert_session:340.2,coaching_month:358.2};
    const center=centers[prizeKey]!==undefined?centers[prizeKey]:162;
    const desired=(360-center)%360;
    const startNorm=((start%360)+360)%360;
    const delta=(desired-startNorm+360)%360;
    const finish=start+7*360+delta;
    const duration=4300;
    const t0=performance.now();
    function easeOutQuint(x){ return 1-Math.pow(1-x,5); }
    function tick(now){
      const p=Math.min(1,(now-t0)/duration);
      const a=start+(finish-start)*easeOutQuint(p);
      applyAngle(wheel,a);
      if(p<1) requestAnimationFrame(tick);
      else { applyAngle(wheel,desired); done(); }
    }
    requestAnimationFrame(tick);
  }

  window.spinWheel=function(){
    const id=currentSubmissionId();
    const input=document.getElementById('wheelContact');
    const contact=input?input.value.trim():((hasState()&&state.profile&&state.profile.contact)||'');
    if(!id){ alert('Không tìm thấy Submission ID. Vui lòng lưu kết quả trước khi quay.'); return; }
    if(!contact){ alert('Vui lòng nhập Zalo hoặc SĐT để nhận quà.'); if(input)input.focus(); return; }
    if(hasState()&&state.profile) state.profile.contact=contact;

    const wheel=document.getElementById('luckyWheel');
    const btn=document.getElementById('spinBtn');
    const status=document.getElementById('wheelStatus');
    if(!wheel) return;
    if(btn){btn.disabled=true;btn.textContent='ĐANG QUAY…'}
    if(status) status.textContent='Vòng quay đang chạy…';

    // Guaranteed visible movement: raw requestAnimationFrame, independent of Google/Brave callbacks.
    applyAngle(wheel,0);
    const fast=spinConstant(wheel);
    const prize=prizeForId(id);

    // Persist asynchronously. No CORS/JSONP response is required.
    postHidden({action:'drawPrize',submissionId:id,contact:contact,prizeKey:prize.prizeKey});

    // Keep fast spin visible for at least 1.6s, then decelerate for ~4.3s.
    setTimeout(function(){
      const start=stopConstant(fast);
      if(hasState()) state.prize={ok:true,submissionId:id,prizeKey:prize.prizeKey,prizeTitle:prize.prizeTitle,claimed:false};
      if(status) status.textContent='Phần quà đã được khóa · vòng quay đang chậm dần…';
      settle(wheel,start,prize.prizeKey,function(){
        if(typeof showPrizeResult==='function') showPrizeResult();
      });
    },1600);
  };

  // Claim also uses a hidden form POST, so Brave does not need to load a Google script callback.
  window.claimPrize=function(){
    const id=currentSubmissionId();
    if(!id||!hasState()||!state.prize){ alert('Không tìm thấy phần quà.'); return; }
    const b=document.getElementById('claimBtn');
    if(b){b.disabled=true;b.textContent='ĐANG XÁC NHẬN…'}
    postHidden({action:'claimPrize',submissionId:id,contact:(state.profile&&state.profile.contact)||''});
    state.prize.claimed=true;
    state.prize.claimTime=new Date().toISOString();
    setTimeout(function(){ if(typeof showPrizeResult==='function')showPrizeResult(); },350);
  };

  const style=document.createElement('style');
  style.textContent=`
    .lucky-wheel{
      will-change:transform;transform-origin:50% 50%;
      background:
        repeating-conic-gradient(from 0deg,rgba(255,255,255,.16) 0deg 1.2deg,transparent 1.2deg 30deg),
        conic-gradient(#7047ff 0deg 324deg,#ec5fbd 324deg 356.4deg,#ffbf4d 356.4deg 360deg)!important;
    }
    .lucky-wheel .wheel-center{will-change:transform;transform-origin:50% 50%;}
    .wheel-pointer{filter:drop-shadow(0 3px 8px rgba(0,0,0,.55));z-index:10;}
  `;
  document.head.appendChild(style);
  console.info('AI INNER LAB Lucky Wheel motion fix v4 loaded');
})();