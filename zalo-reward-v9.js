/* AI INNER LAB — Zalo reward handoff v9 */
(function(){
  const ZALO_URL="https://zalo.me/g/zfyd9xgpxhqiscso2a5v";
  const QR_SRC="data:image/png;base64,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";
  const previousRender=window.renderGiftPrize;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function currentId(){
    if(typeof state!=='undefined'&&state&&state.submissionId)return state.submissionId;
    try{
      const base=(typeof state!=='undefined'&&state&&state.shareUrl)?state.shareUrl:location.href;
      return new URL(base,location.href).searchParams.get('result')||'';
    }catch(e){return''}
  }
  function copyText(text,btn){
    const done=()=>{if(btn){const old=btn.textContent;btn.textContent='✓ ĐÃ COPY';setTimeout(()=>btn.textContent=old,1500)}};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(()=>fallback());
    else fallback();
    function fallback(){
      const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();
      try{document.execCommand('copy');done()}catch(e){alert('Submission ID: '+text)}finally{t.remove()}
    }
  }
  function inject(){
    const host=document.querySelector('.gift-reveal-shell .reveal-content')||document.querySelector('.prize-card');
    if(!host)return;
    const old=host.querySelector('.zalo-reward-box');if(old)old.remove();

    const id=currentId();
    const claimed=!!(typeof state!=='undefined'&&state&&state.prize&&state.prize.claimed);
    const panel=document.createElement('section');
    panel.className='zalo-reward-box';
    panel.innerHTML=`
      <div class="zalo-reward-kicker">💬 NHẬN QUÀ QUA ZALO</div>
      <h3>${claimed?'Quà đã xác nhận. Vào nhóm Zalo để nhận quà.':'Bước cuối: vào nhóm Zalo nhận quà'}</h3>
      <p>Quét mã bằng điện thoại, hoặc bấm nút bên dưới nếu bạn đang làm khảo sát trên điện thoại.</p>
      <div class="zalo-reward-main">
        <div class="zalo-qr-frame"><img src="${QR_SRC}" alt="QR nhóm Zalo nhận quà" loading="eager"></div>
        <div class="zalo-reward-info">
          <div class="zalo-step"><b>1</b><span>Vào nhóm Zalo nhận quà.</span></div>
          <div class="zalo-step"><b>2</b><span>Gửi <strong>Submission ID</strong> của bạn để đội ngũ đối chiếu phần quà.</span></div>
          <div class="submission-card"><small>SUBMISSION ID</small><strong>${esc(id||'—')}</strong><button type="button" class="copy-id-btn">COPY ID</button></div>
          <a class="zalo-open-btn" href="${ZALO_URL}" target="_blank" rel="noopener noreferrer">MỞ NHÓM ZALO →</a>
        </div>
      </div>
      <div class="zalo-note">Nếu camera không nhận QR, hãy mở Zalo → biểu tượng QR → quét lại mã phía trên.</div>
    `;

    const back=host.querySelector('.back-result')||host.querySelector('button.btn:last-child');
    if(back&&back.parentNode===host)host.insertBefore(panel,back);else host.appendChild(panel);

    const copy=panel.querySelector('.copy-id-btn');
    if(copy)copy.addEventListener('click',()=>copyText(id,copy));
    panel.animate?.(
      [{opacity:0,transform:'translateY(14px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],
      {duration:520,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}
    );
  }

  if(typeof previousRender==='function'){
    window.renderGiftPrize=function(p,fromExisting){
      previousRender(p,fromExisting);
      requestAnimationFrame(()=>requestAnimationFrame(inject));
    };
  }

  const style=document.createElement('style');
  style.id='zalo-reward-v9-style';
  style.textContent=`
    .zalo-reward-box{margin:28px auto 8px;max-width:720px;padding:24px;border-radius:26px;border:1px solid rgba(91,171,255,.24);background:linear-gradient(145deg,rgba(13,28,69,.88),rgba(12,17,44,.92));box-shadow:0 22px 60px rgba(0,0,0,.24),0 0 40px rgba(56,132,255,.08);text-align:left}
    .zalo-reward-kicker{display:inline-flex;padding:7px 11px;border-radius:999px;border:1px solid rgba(72,162,255,.28);background:rgba(38,112,220,.12);font-size:11px;font-weight:900;letter-spacing:.08em;color:#a9d6ff}
    .zalo-reward-box h3{font-size:clamp(22px,3vw,32px);line-height:1.12;margin:12px 0 8px;letter-spacing:-.025em}
    .zalo-reward-box>p{margin:0 0 18px;color:#bdc9e7;font-size:14px;line-height:1.55}
    .zalo-reward-main{display:grid;grid-template-columns:230px 1fr;gap:22px;align-items:center}
    .zalo-qr-frame{padding:12px;border-radius:22px;background:#fff;box-shadow:0 12px 32px rgba(0,0,0,.22),0 0 0 1px rgba(255,255,255,.7) inset}
    .zalo-qr-frame img{display:block;width:100%;height:auto;border-radius:12px}
    .zalo-reward-info{display:grid;gap:10px}
    .zalo-step{display:flex;gap:10px;align-items:flex-start;color:#dbe4fb;font-size:13px;line-height:1.5}
    .zalo-step>b{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;flex:0 0 auto;background:linear-gradient(135deg,#5ca9ff,#7c69ff);font-size:11px;color:#fff;box-shadow:0 6px 18px rgba(73,120,255,.28)}
    .submission-card{margin-top:2px;padding:12px 13px;border-radius:15px;border:1px solid rgba(157,174,255,.19);background:rgba(255,255,255,.045);display:grid;grid-template-columns:1fr auto;gap:3px 10px;align-items:center}
    .submission-card small{grid-column:1/2;font-size:9px;letter-spacing:.1em;color:#8997bd}
    .submission-card strong{grid-column:1/2;font-size:14px;word-break:break-all;color:#fff}
    .copy-id-btn{grid-column:2;grid-row:1/3;border:1px solid rgba(124,157,255,.28);background:rgba(73,101,198,.13);color:#dbe6ff;border-radius:11px;padding:9px 11px;font-size:10px;font-weight:900;cursor:pointer}
    .copy-id-btn:hover{background:rgba(87,121,228,.22)}
    .zalo-open-btn{display:flex;align-items:center;justify-content:center;text-decoration:none;color:#fff;font-weight:900;border-radius:15px;padding:14px 18px;background:linear-gradient(100deg,#1699ff,#3478ff,#745cff);box-shadow:0 10px 28px rgba(45,116,255,.28),inset 0 0 0 1px rgba(255,255,255,.25);transition:.2s transform,.2s box-shadow}
    .zalo-open-btn:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(45,116,255,.36),inset 0 0 0 1px rgba(255,255,255,.35)}
    .zalo-note{margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.07);color:#8896bd;font-size:11px;line-height:1.45}
    @media(max-width:700px){
      .zalo-reward-box{padding:18px;border-radius:22px;text-align:center}
      .zalo-reward-main{grid-template-columns:1fr;gap:16px}
      .zalo-qr-frame{width:min(230px,76vw);margin:0 auto}
      .zalo-reward-info{text-align:left}
      .zalo-open-btn{width:100%}
    }
  `;
  document.head.appendChild(style);

  if(document.querySelector('.gift-reveal-shell .reveal-content,.prize-card'))requestAnimationFrame(inject);
  console.info('AI INNER LAB Zalo reward handoff v9 loaded');
})();