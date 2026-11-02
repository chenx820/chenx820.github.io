/* C3-1: one experiment page that runs both classical preparations and compares their joint counts.
   Batches live in carry so back/forward and reload keep the same evidence. */
function jointBatch(shared,random=Math.random){
 return Array.from({length:100},()=>{const a=random()<.5?0:1,b=shared?a:random()<.5?0:1;return `${a}${b}`;});
}
function jointCounts(records){return ['00','01','10','11'].map(bits=>records.filter(x=>x===bits).length);}
function jointChart(records,label){
 const counts=jointCounts(records||[]);
 return `<figure class="joint-chart"><figcaption>${label}</figcaption><div class="joint-columns">${counts.map((n,i)=>`<div class="joint-column"><strong>${records?n:'—'}</strong><div class="joint-track"><span style="--joint-count:${n}%"></span></div><span>${['00','01','10','11'][i]}</span></div>`).join('')}</div></figure>`;
}
COMP.jointLesson=(slot,p)=>{
 const validBatch=x=>Array.isArray(x)&&x.length===100&&x.every(v=>/^[01]{2}$/.test(v));
 for(const key of ['jointA','jointB'])if(!validBatch(S.carry[key]))delete S.carry[key];
 function draw(focus){
  const a=S.carry.jointA,b=S.carry.jointB,ready=!!(a&&b);
  slot.innerHTML=`<section class="joint-lesson"><div class="joint-comparison">${jointChart(a,'A 组：两位各自随机')}${jointChart(b,'B 组：先选定 00 或 11')}</div><div class="ent-actions"><button type="button" class="primary" data-joint-run>${ready?'再运行一次':'各运行 100 次'}</button></div></section>`;
  slot.querySelector('[data-joint-run]').addEventListener('click',()=>{S.carry.jointA=jointBatch(false);S.carry.jointB=jointBatch(true);update('[data-joint-run]');});
  S.gateOK=ready;go('继续',ready);hint(ready?'':'运行一次实验，再继续。');
  if(ready)S.passed[S.i]=true;else delete S.passed[S.i];
  if(focus)slot.querySelector(focus)?.focus({preventScroll:true});
 }
 function update(focus){
  for(const snapshot of Object.values(S.carrySnapshots))for(const key of ['jointA','jointB']){
   if(key in S.carry)snapshot[key]=S.carry[key];else delete snapshot[key];
  }
  draw(focus);rememberStep();
 }
 draw();
};
