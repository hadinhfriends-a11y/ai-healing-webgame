/* AI INNER LAB — GitHub Pages ↔ Google Apps Script bridge */
(function(){
  const BACKEND='https://script.google.com/macros/s/AKfycbw9qLBLLtLl-xuVS5qyYbxxz0dkt6EBxE-3Mb_dipviTqDpTGK4GWT9YkwukERw8nvg/exec';
  const PUBLIC_APP='https://hadinhfriends-a11y.github.io/ai-healing-webgame/';

  function makeId(){
    const d=new Date();
    const yy=String(d.getFullYear()).slice(-2), mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0');
    let token='';
    if(window.crypto&&crypto.getRandomValues){
      const a=new Uint32Array(3); crypto.getRandomValues(a); token=Array.from(a).map(x=>x.toString(36)).join('').slice(0,10);
    } else token=Math.random().toString(36).slice(2,12);
    return yy+mm+dd+'-'+token;
  }

  function jsonp(params, timeoutMs){
    return new Promise((resolve,reject)=>{
      const cb='__aiInnerCb_'+Date.now()+'_'+Math.random().toString(36).slice(2);
      const q=new URLSearchParams(params||{}); q.set('callback',cb);
      const sc=document.createElement('script');
      let done=false;
      const finish=(fn,val)=>{ if(done)return; done=true; clearTimeout(timer); try{delete window[cb]}catch(e){}; sc.remove(); fn(val); };
      window[cb]=(data)=>finish(resolve,data);
      sc.onerror=()=>finish(reject,new Error('Không thể kết nối máy chủ kết quả.'));
      sc.src=BACKEND+'?'+q.toString();
      document.head.appendChild(sc);
      const timer=setTimeout(()=>finish(reject,new Error('Máy chủ phản hồi quá lâu.')),timeoutMs||8000);
    });
  }

  async function verify(id){
    let lastErr=null;
    for(let i=0;i<10;i++){
      try{
        const data=await jsonp({action:'getResult',id},5000);
        if(data&&data.id) return data;
      }catch(e){lastErr=e}
      await new Promise(r=>setTimeout(r,450+i*120));
    }
    throw lastErr||new Error('Chưa xác nhận được dữ liệu trong Google Sheet.');
  }

  function postPayload(payload){
    const text=JSON.stringify(payload);
    try{
      if(navigator.sendBeacon){
        const ok=navigator.sendBeacon(BACKEND,new Blob([text],{type:'text/plain;charset=UTF-8'}));
        if(ok) return Promise.resolve(true);
      }
    }catch(e){}
    return fetch(BACKEND,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:text,keepalive:true}).then(()=>true);
  }

  function runner(){
    return {
      _ok:null,_fail:null,
      withSuccessHandler(fn){this._ok=fn;return this},
      withFailureHandler(fn){this._fail=fn;return this},
      async saveResult(payload){
        const ok=this._ok, fail=this._fail;
        try{
          const id=makeId();
          payload=Object.assign({},payload,{submissionId:id});
          await postPayload(payload);
          const saved=await verify(id);
          const resultUrl=PUBLIC_APP+'?result='+encodeURIComponent(id);
          ok&&ok({ok:true,id,resultUrl});
        }catch(e){fail&&fail(e)}
      },
      async getResult(id){
        const ok=this._ok, fail=this._fail;
        try{ const data=await jsonp({action:'getResult',id},8000); ok&&ok(data||null); }
        catch(e){ fail&&fail(e); }
      }
    };
  }

  window.google={script:{get run(){return runner()}}};
  window.AI_INNER_BACKEND_URL=BACKEND;
  console.info('AI INNER LAB backend connected');
})();
