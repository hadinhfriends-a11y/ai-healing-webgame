/* AI INNER LAB — Gift layout fix v1 */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    /* v6.3 accidentally replaced the centering transforms with translateZ(0).
       Restore centering and remove paint containment that clipped half the gift. */
    .gift-stage,
    .gift-grid{
      overflow:visible!important;
      min-width:0!important;
    }

    .gift-grid{
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
      align-items:end!important;
      justify-items:stretch!important;
    }

    .mystery-gift{
      contain:none!important;
      overflow:visible!important;
      min-width:0!important;
      width:100%!important;
      background:transparent!important;
      isolation:isolate;
    }

    .mystery-gift .gift-body,
    .mystery-gift .gift-lid{
      transform:translate3d(-50%,0,0);
    }

    .mystery-gift .gift-aura{
      transform:translate3d(-50%,-50%,0);
    }

    .mystery-gift .gift-shadow{
      transform:translate3d(-50%,0,0);
    }

    .mystery-gift .gift-body,
    .mystery-gift .gift-lid,
    .mystery-gift .gift-aura,
    .mystery-gift .gift-shadow{
      backface-visibility:hidden;
      -webkit-backface-visibility:hidden;
    }

    @media(max-width:900px){
      .gift-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;}
    }
  `;
  document.head.appendChild(style);
  console.info('AI INNER LAB Gift layout fix v1 loaded');
})();
