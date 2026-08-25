/* AI INNER LAB — Lucky Wheel motion fix */
(function(){
  function currentSubmissionId(){
    if(window.state&&state.submissionId) return state.submissionId;
    try{
      const u=new URL((window.state&&state.shareUrl)||location.href,location.href);
      return u.searchParams.get('result')||'';
    }catch(e){ return ''; }
  }

  function visualAngle(el){
    try{
      const t=getComputedStyle(el).transform;
      if(!t||t==='none') return 0;
      const m=new DOMMatrixReadOnly(t);
      let deg=Math.atan2(m.b,m.a)*180/Math.PI;
      if(deg<0) deg+=360;
      return deg;
    }catch(e){ return 0; }
  }

  function freezeWheel(wheel){
    const a=visualAngle(wheel);
    wheel.classList.remove('ai-wheel-spinning','ai-wheel-settling');
    wheel.style.transition='none';
    wheel.style.transform='rotate('+a+'deg)';
    void wheel.offsetWidth;
    return a;
  }

  window.spinWheel=function(){
    const id=currentSubmissionId();
    const input=document.getElementById('wheelContact');
    const contact=(input?input.value.trim():(window.state&&state.profile&&state.profile.contact)||'');
    if(!id){ alert('Không tìm thấy Submission ID. Vui lòng lưu kết quả trước khi quay.'); return; }
    if(!contact){
      alert('Vui lòng nhập Zalo hoặc SĐT để nhận quà.');
      if(input) input.focus();
      return;
    }
    if(window.state&&state.profile) state.profile.contact=contact;

    const wheel=document.getElementById('luckyWheel');
    const btn=document.getElementById('spinBtn');
    const status=document.getElementById('wheelStatus');
    if(!wheel) return;

    if(btn){ btn.disabled=true; btn.textContent='ĐANG QUAY…'; }
    if(status) status.textContent='Đang mở phần quà dành cho bạn…';

    // Start moving immediately so the interaction never feels frozen.
    wheel.classList.remove('ai-wheel-settling');
    wheel.style.transition='none';
    wheel.style.transform='rotate(0deg)';
    void wheel.offsetWidth;
    wheel.classList.add('ai-wheel-spinning');

    google.script.run
      .withSuccessHandler(function(p){
        if(window.state) state.prize=p;

        // Capture the visible rotation, stop the infinite spin at exactly that point,
        // then ease through several more turns to the server-selected prize.
        const start=freezeWheel(wheel);
        const centers={voucher:162,expert_session:340.2,coaching_month:358.2};
        const center=centers[p.prizeKey]!==undefined?centers[p.prizeKey]:162;
        const desired=(360-center)%360;
        const startNorm=((start%360)+360)%360;
        const delta=(desired-startNorm+360)%360;
        const finalAngle=start+(6*360)+delta;

        if(status) status.textContent='Phần quà đã được khóa · đang dừng vòng quay…';
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){
            wheel.classList.add('ai-wheel-settling');
            wheel.style.transform='rotate('+finalAngle+'deg)';
          });
        });

        setTimeout(function(){
          if(typeof showPrizeResult==='function') showPrizeResult();
        },5000);
      })
      .withFailureHandler(function(err){
        freezeWheel(wheel);
        if(status) status.textContent='Chưa mở được quà. Bạn có thể thử lại.';
        alert('Không mở được quà: '+((err&&err.message)||err));
        if(btn){ btn.disabled=false; btn.textContent='THỬ LẠI →'; }
      })
      .drawPrize({submissionId:id,contact:contact});
  };

  const style=document.createElement('style');
  style.textContent=`
    @keyframes aiWheelSpinFast{
      from{transform:rotate(0deg)}
      to{transform:rotate(360deg)}
    }
    .lucky-wheel.ai-wheel-spinning{
      animation:aiWheelSpinFast .68s linear infinite !important;
      transition:none !important;
      will-change:transform;
    }
    .lucky-wheel.ai-wheel-settling{
      animation:none !important;
      transition:transform 4.7s cubic-bezier(.08,.72,.08,1) !important;
      will-change:transform;
    }
    .wheel-pointer{filter:drop-shadow(0 3px 8px rgba(0,0,0,.5));}
    .lucky-wheel.ai-wheel-spinning + .wheel-center{pointer-events:none}
  `;
  document.head.appendChild(style);
  console.info('AI INNER LAB Lucky Wheel motion fix loaded');
})();
