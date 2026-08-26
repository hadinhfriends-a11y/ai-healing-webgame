/* AI INNER LAB — Clear result conclusions for Direction, Career, Attachment, AI */
(function(){
  if(typeof state==='undefined'||typeof TESTS==='undefined'||typeof computeResult!=='function'||typeof renderResult!=='function') return;

  const BASE_COMPUTE=computeResult;
  const BASE_RENDER=renderResult;

  function rank(scores,asc){
    return Object.entries(scores||{}).sort((a,b)=>asc?a[1]-b[1]:b[1]-a[1]);
  }
  function avg(scores){
    const vals=Object.values(scores||{}).map(Number).filter(Number.isFinite);
    return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;
  }
  function label(k,d){return (TESTS[k]&&TESTS[k].labels&&TESTS[k].labels[d])||d}

  function clarify(k,r){
    if(!r||!r.scores||k==='enneagram') return r;
    const s=r.scores;

    if(k==='direction'){
      const low=rank(s,true), overall=avg(s), first=low[0], second=low[1];
      const names={clarity:'Rõ hướng',energy:'Năng lượng',alignment:'Sống đúng ưu tiên',momentum:'Đà hành động'};
      const states={
        clarity:['Đang tìm lại la bàn','Bạn không thiếu lựa chọn; điều cần nhất là một ưu tiên đủ rõ để lọc nhiễu.'],
        energy:['Cần phục hồi năng lượng','Hướng đi có thể đã có, nhưng mức năng lượng hiện tại đang làm mọi quyết định nặng hơn.'],
        alignment:['Đang lệch khỏi ưu tiên thật','Có khoảng cách giữa điều bạn nói là quan trọng và cách thời gian/năng lượng đang được dùng.'],
        momentum:['Biết hướng nhưng chưa vào guồng','Bạn đã thấy khá rõ mình muốn gì, nhưng nhịp hành động chưa đủ đều để tạo đà.']
      };
      const close=second&&Math.abs(second[1]-first[1])<=0.2;
      r.primaryKey=first[0];
      r.primaryTitle=overall>=4.1?'Đang vào nhịp tốt':states[first[0]][0];
      r.headline='Trạng thái phát triển hiện tại';
      r.description=overall>=4.1
        ?`Bốn trụ cột đang khá cân bằng (${overall.toFixed(1)}/5). Việc quan trọng nhất là giữ nhịp mà không tự quá tải.`
        :states[first[0]][1];
      r.verdictTitle='Ưu tiên tiếp theo';
      r.verdictValue=overall>=4.1?'Giữ nhịp + chọn 1 mục tiêu 90 ngày':close?`${names[first[0]]} + ${names[second[0]]}`:names[first[0]];
      r.verdictNote=close?'Hai trụ cột thấp nhất đang rất gần nhau, nên nên cải thiện song song thay vì chỉ tập trung một điểm.':`Điểm hiện tại: ${first[1].toFixed(1)}/5.`;
      r.confidence=close?'Trung bình':'Cao';
      r.confidenceNote=close?'Hai ưu tiên đang khá sát nhau.':'Ưu tiên chính đang tách tương đối rõ.';
      return r;
    }

    if(k==='career'){
      const top=rank(s,false).slice(0,3), code=top.map(x=>x[0]).join('');
      r.primaryKey=code;
      r.primaryTitle=`Holland Code ${code}`;
      r.headline='Ba thiên hướng nghề nghiệp nổi bật';
      r.description=`Bạn nổi bật nhất ở ${top.map(x=>label('career',x[0])).join(' · ')}. Đây là tổ hợp môi trường công việc có xu hướng cho bạn nhiều năng lượng hơn.`;
      r.verdictTitle='Career DNA';
      r.verdictValue=top.map(x=>`${x[0]} — ${label('career',x[0])}`).join(' · ');
      r.verdictNote=`Điểm: ${top.map(x=>`${x[0]} ${x[1].toFixed(1)}/5`).join(' · ')}. Đây là định hướng môi trường phù hợp, không phải “nghề bắt buộc”.`;
      const gap=top[0][1]-top[2][1];
      r.confidence=gap>=0.7?'Cao':gap>=0.35?'Trung bình':'Khám phá thêm';
      r.confidenceNote=gap<0.35?'Ba nhóm dẫn đầu khá sát nhau; hãy dùng code như bản đồ sở thích nghề nghiệp, không như nhãn cố định.':'Tổ hợp ba nhóm dẫn đầu đã tương đối rõ.';
      return r;
    }

    if(k==='attachment'){
      const anxiety=Number(s.anxious||0), avoidance=Number(s.avoidant||0), cut=3.0;
      let key,title,desc;
      if(anxiety<cut&&avoidance<cut){key='secure';title='Xu hướng gắn bó an toàn';desc='Bạn tương đối thoải mái với cả sự gần gũi và khoảng riêng, đồng thời có khả năng nói nhu cầu và sửa chữa sau xung đột.'}
      else if(anxiety>=cut&&avoidance<cut){key='anxious';title='Xu hướng gắn bó lo âu';desc='Bạn khá mở với sự gần gũi nhưng hệ thống cảnh báo dễ hoạt động mạnh khi cảm thấy khoảng cách, im lặng hoặc tín hiệu không chắc chắn.'}
      else if(anxiety<cut&&avoidance>=cut){key='avoidant';title='Xu hướng gắn bó né tránh';desc='Bạn thường bảo vệ sự tự chủ bằng khoảng cách và có thể ít thoải mái khi phải bộc lộ phần yếu đuối hoặc phụ thuộc cảm xúc.'}
      else {key='fearful';title='Xu hướng vừa muốn gần vừa sợ tổn thương';desc='Cả nhu cầu gần gũi và nhu cầu tự bảo vệ đều khá mạnh, nên đôi khi bạn có thể tiến gần rồi lại lùi ra khi mối quan hệ trở nên quan trọng.'}
      r.primaryKey=key;r.primaryTitle=title;r.headline='Attachment Profile';r.description=desc;
      r.verdictTitle='Hai trục chính';
      r.verdictValue=`Anxiety ${anxiety.toFixed(1)}/5 · Avoidance ${avoidance.toFixed(1)}/5`;
      r.verdictNote='Kết quả phản ánh xu hướng tự báo cáo hiện tại, không phải chẩn đoán tâm lý.';
      const dist=Math.min(Math.abs(anxiety-cut),Math.abs(avoidance-cut));
      r.confidence=dist>=0.7?'Cao':dist>=0.3?'Trung bình':'Khám phá thêm';
      r.confidenceNote=dist<0.3?'Ít nhất một trục đang gần vùng trung tính, nên profile có thể thay đổi theo mối quan hệ/bối cảnh.':'Hai trục đang đủ tách để diễn giải xu hướng chính.';
      return r;
    }

    if(k==='ai'){
      const overall=avg(s), low=rank(s,true)[0];
      const level=overall<2.5?'AI Explorer':overall<3.5?'AI Operator':overall<4.3?'AI Builder':'AI Co-pilot';
      const text={
        'AI Explorer':'Bạn đang ở giai đoạn khám phá. Mục tiêu tốt nhất là biến AI từ công cụ hỏi đáp thành một thói quen có chủ đích.',
        'AI Operator':'Bạn đã biết dùng AI cho nhiều việc; bước nâng cấp lớn nhất là chuẩn hóa quy trình và kiểm chứng đầu ra.',
        'AI Builder':'Bạn đã có tư duy hệ thống khá tốt và đang biến AI thành một lớp năng lực thường trực trong công việc.',
        'AI Co-pilot':'Bạn đang phối hợp với AI theo quy trình khá trưởng thành, đồng thời vẫn giữ quyền phán đoán cuối cùng của con người.'
      };
      r.primaryKey=level;r.primaryTitle=level;r.headline=`Mức sẵn sàng AI: ${overall.toFixed(1)}/5`;r.description=text[level];
      r.verdictTitle='Trụ cột cần nâng tiếp';
      r.verdictValue=`${label('ai',low[0])} — ${low[1].toFixed(1)}/5`;
      r.verdictNote='Nâng trụ cột thấp nhất thường giúp toàn bộ cách dùng AI tiến bộ nhanh hơn.';
      r.confidence='Cao';r.confidenceNote='Cấp độ được tính từ trung bình bốn trụ cột của bài test.';
      return r;
    }
    return r;
  }

  computeResult=function(){
    const r=BASE_COMPUTE();
    return clarify(state.testKey,r);
  };

  function patch(shared){
    const k=(shared&&shared.testKey)||state.testKey;
    if(!k||k==='enneagram')return;
    const r=clarify(k,(shared&&shared.resultData)||state.result||{});
    if(!r)return;
    if(shared&&shared.resultData) shared.resultData=r; else state.result=r;

    const card=document.querySelector('.result-card');
    if(card){
      const h3=card.querySelector('h3'),desc=card.querySelector('.result-desc');
      if(h3)h3.textContent=r.primaryTitle||'';
      if(desc)desc.textContent=r.description||'';
      if(r.verdictTitle&&r.verdictValue&&!card.querySelector('.clear-verdict')){
        const box=document.createElement('div');box.className='clear-verdict';
        box.innerHTML=`<span>${r.verdictTitle}</span><strong>${r.verdictValue}</strong><small>${r.verdictNote||''}</small>`;
        card.appendChild(box);
      }
    }
  }

  renderResult=function(shared){BASE_RENDER(shared);setTimeout(()=>patch(shared),0)};

  const style=document.createElement('style');
  style.textContent=`.clear-verdict{margin-top:14px;padding:13px 14px;border:1px solid rgba(150,128,255,.28);border-radius:15px;background:linear-gradient(135deg,rgba(86,59,178,.22),rgba(30,58,130,.20));text-align:left;display:grid;gap:5px}.clear-verdict span{font-size:9px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#baabff}.clear-verdict strong{font-size:14px;line-height:1.35;color:#fff}.clear-verdict small{font-size:9.5px;line-height:1.45;color:#98a6cb}`;
  document.head.appendChild(style);
  console.info('AI INNER LAB clear result conclusions loaded');
})();