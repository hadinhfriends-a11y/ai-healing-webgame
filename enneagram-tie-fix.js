/* AI INNER LAB — Enneagram tie-safe scoring v1 */
(function(){
  if(typeof state==='undefined'||typeof TESTS==='undefined'||typeof computeResult!=='function'||typeof renderResult!=='function') return;

  const BASE_COMPUTE=computeResult;
  const BASE_RENDER=renderResult;
  const BASE_ANSWER=answerTest;

  const TIE_EXTRA={
    '1':['Ngay cả khi không ai biết, tôi vẫn khó chịu nếu mình làm điều mà bản thân cho là sai hoặc chưa đủ chuẩn.','1'],
    '2':['Điều chạm sâu vào tôi là cảm giác mình có ý nghĩa khi được người khác cần đến và trân trọng sự giúp đỡ của mình.','2'],
    '3':['Tôi dễ cảm thấy giá trị của mình tăng lên khi đạt kết quả rõ ràng và được nhìn nhận là người có năng lực.','3'],
    '4':['Tôi sợ đánh mất bản sắc riêng và sống một cuộc đời không thật với mình hơn là chỉ thất bại về thành tích.','4'],
    '5':['Khi bị đòi hỏi quá nhiều, nhu cầu mạnh nhất của tôi là giữ lại thời gian, năng lượng và không gian riêng để tự chủ.','5'],
    '6':['Khi bất an, điều giúp tôi yên tâm nhất là biết mình có chỗ dựa đáng tin và một phương án đủ chắc chắn.','6'],
    '7':['Điều tôi khó chịu nhất là cảm giác bị mắc kẹt quá lâu trong đau đớn, giới hạn hoặc một tình huống không còn lựa chọn.','7'],
    '8':['Điều kích hoạt tôi mạnh nhất là cảm giác bị kiểm soát, bị áp đặt hoặc phải ở thế phụ thuộc mà mình không lựa chọn.','8'],
    '9':['Tôi có thể gác ý muốn của mình sang một bên để giữ mọi thứ yên ổn, rồi sau đó mới nhận ra mình đã bỏ quên nhu cầu của chính mình.','9']
  };

  function scores(){
    const dims=TESTS.enneagram.dims||['1','2','3','4','5','6','7','8','9'];
    const sums={},counts={};dims.forEach(d=>{sums[d]=0;counts[d]=0});
    (state.questionSet||TESTS.enneagram.q||[]).forEach((q,i)=>{
      const d=q&&q[1],v=Number(state.answers&&state.answers[i]);
      if(d in sums&&v){sums[d]+=v;counts[d]++}
    });
    const out={};dims.forEach(d=>out[d]=counts[d]?sums[d]/counts[d]:0);return out;
  }
  function ranked(s){return Object.entries(s||{}).sort((a,b)=>b[1]-a[1])}
  function tiedCandidates(s,tolerance){
    const r=ranked(s);if(!r.length)return[];const top=r[0][1];
    return r.filter(x=>top-x[1]<=tolerance).map(x=>x[0]);
  }
  function normalizeTieResult(r){
    if(!r||!r.scores)return r;
    const list=ranked(r.scores),top=list[0]?.[1]??0;
    const ties=list.filter(x=>top-x[1]<=0.20).map(x=>x[0]);
    if(ties.length>1){
      r.tieKeys=ties;
      r.primaryTitle='Nhóm nổi bật: '+ties.map(k=>'Type '+k).join(' · ');
      r.description='Các Type '+ties.join(', ')+' đang có mức điểm gần như không thể phân biệt bằng bài test ngắn này. Kết quả trung thực nhất lúc này là giữ nhiều giả thuyết thay vì ép bạn vào một Type duy nhất.';
      r.strength='Bạn đang thể hiện đồng thời nhiều động lực nổi bật: '+ties.map(k=>TESTS.enneagram.labels[k]).join(' · ')+'.';
      r.blindSpot='Chốt một nhãn quá sớm có thể khiến bạn diễn giải bản thân theo kết quả thay vì quan sát động lực thật phía sau hành vi.';
      r.nextStep='Trong 7 ngày tới, khi phản ứng mạnh, hãy hỏi: “Điều mình đang cố bảo vệ là được cần đến, quyền tự chủ, hay sự yên ổn?” Động lực lặp lại thường phân biệt Type tốt hơn một hành vi đơn lẻ.';
      r.tags=ties.map(k=>'Type '+k);
      r.confidence='Chưa đủ để chốt 1 Type';
      r.confidenceNote='Các Type dẫn đầu vẫn đang đồng điểm hoặc quá sát sau câu làm rõ.';
    }else{
      r.tieKeys=[];
    }
    return r;
  }

  answerTest=function(v){
    if(state.testKey!=='enneagram'){return BASE_ANSWER(v)}
    const isLast=state.qIndex===(state.questionSet||[]).length-1;
    if(isLast&&state.adaptiveAdded&&!state.enneaTieBreakAdded){
      state.answers[state.qIndex]=Number(v);
      const s=scores(),r=ranked(s),gap=r.length>1?r[0][1]-r[1][1]:99;
      if(gap<0.34){
        const top=tiedCandidates(s,0.34).slice(0,3),extra=top.map(k=>TIE_EXTRA[k]).filter(Boolean);
        state.enneaTieBreakAdded=true;
        if(extra.length){
          state.questionSet=state.questionSet.concat(extra);
          TESTS.enneagram.q=state.questionSet;
          state.qIndex++;
          renderQuestion();
          return;
        }
      }
      state.enneaTieBreakAdded=true;
    }
    return BASE_ANSWER(v)
  };

  computeResult=function(){
    const r=BASE_COMPUTE();
    if(state.testKey!=='enneagram')return r;
    return normalizeTieResult(r);
  };

  function patchTieCard(shared){
    const r=(shared&&shared.resultData)||state.result||{};
    const k=(shared&&shared.testKey)||state.testKey;
    if(k!=='enneagram'||!r.tieKeys||r.tieKeys.length<2)return;
    const card=document.querySelector('.result-card');if(!card)return;
    const tiny=card.querySelector('.tiny'),symbol=card.querySelector('.ennea-symbol'),h3=card.querySelector('h3'),name=card.querySelector('.result-name'),desc=card.querySelector('.result-desc');
    if(tiny)tiny.textContent='CÁC TYPE ĐANG ĐỒNG ĐIỂM';
    if(symbol){symbol.textContent=r.tieKeys.join('·');symbol.style.fontSize=r.tieKeys.length>=3?'48px':'62px'}
    if(h3)h3.textContent=r.tieKeys.map(x=>'Type '+x).join(' · ');
    if(name)name.textContent=r.tieKeys.map(x=>TESTS.enneagram.labels[x]).join(' · ');
    if(desc)desc.textContent=r.description||'';
  }

  renderResult=function(shared){
    const k=(shared&&shared.testKey)||state.testKey;
    if(k==='enneagram'){
      if(shared&&shared.resultData)normalizeTieResult(shared.resultData);
      else if(state.result)normalizeTieResult(state.result);
    }
    BASE_RENDER(shared);
    setTimeout(()=>patchTieCard(shared),0)
  };
  console.info('AI INNER LAB Enneagram tie-safe scoring loaded');
})();