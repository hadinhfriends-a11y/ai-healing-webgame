/* AI INNER LAB — GitHub Pages ↔ Google Apps Script bridge */
(function(){
  const BACKEND='https://script.google.com/macros/s/AKfycbw9qLBLLtLl-xuVS5qyYbxxz0dkt6EBxE-3Mb_dipviTqDpTGK4GWT9YkwukERw8nvg/exec';
  const PUBLIC_APP='https://hadinhfriends-a11y.github.io/ai-healing-webgame/';

  function makeId(){const d=new Date(),yy=String(d.getFullYear()).slice(-2),mm=String(d.getMonth()+1).padStart(2,'0'),dd=String(d.getDate()).padStart(2,'0');let token='';if(window.crypto&&crypto.getRandomValues){const a=new Uint32Array(3);crypto.getRandomValues(a);token=Array.from(a).map(x=>x.toString(36)).join('').slice(0,10)}else token=Math.random().toString(36).slice(2,12);return yy+mm+dd+'-'+token}
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  function jsonp(params,timeoutMs){return new Promise((resolve,reject)=>{const cb='__aiInnerCb_'+Date.now()+'_'+Math.random().toString(36).slice(2),q=new URLSearchParams(params||{}),sc=document.createElement('script');let done=false;q.set('callback',cb);q.set('_t',Date.now());const finish=(fn,val)=>{if(done)return;done=true;clearTimeout(timer);try{delete window[cb]}catch(e){}sc.remove();fn(val)},timer=setTimeout(()=>finish(reject,new Error('Máy chủ phản hồi quá lâu.')),timeoutMs||8000);window[cb]=data=>finish(resolve,data);sc.onerror=()=>finish(reject,new Error('Không thể kết nối máy chủ.'));sc.src=BACKEND+'?'+q.toString();document.head.appendChild(sc)})}
  async function postPayload(payload){await fetch(BACKEND,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(payload)});return true}

  async function verifyResult(id){let lastErr=null;for(let i=0;i<18;i++){try{const data=await jsonp({action:'getResult',id},6000);if(data&&data.id)return data}catch(e){lastErr=e}await sleep(650+i*140)}throw lastErr||new Error('Chưa xác nhận được dữ liệu trong Google Sheet.')}
  async function verifyPrize(id,wantClaimed){let lastErr=null;for(let i=0;i<18;i++){try{const data=await jsonp({action:'getPrize',id},6000);if(data&&data.prizeKey&&(!wantClaimed||data.claimed))return data}catch(e){lastErr=e}await sleep(500+i*120)}throw lastErr||new Error('Chưa xác nhận được phần quà.')}

  function runner(){return{
    _ok:null,_fail:null,
    withSuccessHandler(fn){this._ok=fn;return this},withFailureHandler(fn){this._fail=fn;return this},
    async saveResult(payload){const ok=this._ok,fail=this._fail;try{const id=makeId();payload=Object.assign({},payload,{submissionId:id});await postPayload(payload);await verifyResult(id);ok&&ok({ok:true,id,resultUrl:PUBLIC_APP+'?result='+encodeURIComponent(id)})}catch(e){fail&&fail(e)}},
    async getResult(id){const ok=this._ok,fail=this._fail;try{ok&&ok(await jsonp({action:'getResult',id},9000)||null)}catch(e){fail&&fail(e)}},
    async drawPrize(payload){const ok=this._ok,fail=this._fail;try{const id=payload&&payload.submissionId;if(!id)throw new Error('Thiếu Submission ID.');await postPayload(Object.assign({},payload,{action:'drawPrize'}));ok&&ok(await verifyPrize(id,false))}catch(e){fail&&fail(e)}},
    async getPrize(id){const ok=this._ok,fail=this._fail;try{ok&&ok(await jsonp({action:'getPrize',id},9000)||null)}catch(e){fail&&fail(e)}},
    async claimPrize(payload){const ok=this._ok,fail=this._fail;try{const id=payload&&payload.submissionId;if(!id)throw new Error('Thiếu Submission ID.');await postPayload(Object.assign({},payload,{action:'claimPrize'}));ok&&ok(await verifyPrize(id,true))}catch(e){fail&&fail(e)}}
  }}

  window.google={script:{get run(){return runner()}}};
  window.AI_INNER_BACKEND_URL=BACKEND;
  console.info('AI INNER LAB backend connected (bridge v6 + Lucky Wheel)');
})();