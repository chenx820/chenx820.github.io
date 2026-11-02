/* =========================================================
   组件库：每个组件向壳上报状态，过关判据写在课程数据里
   全课配色统一：pine = |0⟩ / 上路径，ochre = |1⟩ / 下路径
   ========================================================= */
const COMP={};
const put=(k,v)=>{S.carry[k]=v;};
function check(p,st){ if(p.ok&&p.ok(st)) pass(p.pm); }

/* ---------- 复数与单比特 ---------- */
const SQ=Math.SQRT1_2;
const cm=(a,b)=>({re:a.re*b.re-a.im*b.im,im:a.re*b.im+a.im*b.re});
const cadd=(a,b)=>({re:a.re+b.re,im:a.im+b.im});
const G1={
  H:[[{re:SQ,im:0},{re:SQ,im:0}],[{re:SQ,im:0},{re:-SQ,im:0}]],
  X:[[{re:0,im:0},{re:1,im:0}],[{re:1,im:0},{re:0,im:0}]],
  Y:[[{re:0,im:0},{re:0,im:-1}],[{re:0,im:1},{re:0,im:0}]],
  Z:[[{re:1,im:0},{re:0,im:0}],[{re:0,im:0},{re:-1,im:0}]],
  S:[[{re:1,im:0},{re:0,im:0}],[{re:0,im:0},{re:0,im:1}]],
  T:[[{re:1,im:0},{re:0,im:0}],[{re:0,im:0},{re:SQ,im:SQ}]]
};
function rot(axis,th){
  const c={re:Math.cos(th/2),im:0}, s=Math.sin(th/2);
  if(axis==='x')return [[c,{re:0,im:-s}],[{re:0,im:-s},c]];
  if(axis==='y')return [[c,{re:-s,im:0}],[{re:s,im:0},c]];
  return [[{re:Math.cos(-th/2),im:Math.sin(-th/2)},{re:0,im:0}],[{re:0,im:0},{re:Math.cos(th/2),im:Math.sin(th/2)}]];
}
function ap1(M,a){return [cadd(cm(M[0][0],a[0]),cm(M[0][1],a[1])),cadd(cm(M[1][0],a[0]),cm(M[1][1],a[1]))];}
function blochOf(a){
  const x=2*(a[0].re*a[1].re+a[0].im*a[1].im);
  const y=2*(a[0].re*a[1].im-a[0].im*a[1].re);
  const z=(a[0].re**2+a[0].im**2)-(a[1].re**2+a[1].im**2);
  return [x,y,z];
}

/* ---------- C-02 数字爆炸 ---------- */
COMP.c2=(slot,p)=>{
  slot.innerHTML=`<div class="slab"><span>${p.unit||'量子比特数'}</span><span class="num" id="nb">1</span></div>
    <input type="range" id="r" min="1" max="${p.max||300}" value="1" aria-label="${p.unit||'量子比特数'}">
    <div class="combination-result"><p class="cap">${p.stateCount?'直接列表所需的记录项数':'开/关组合数'}</p><div class="bigno" id="big"></div><div class="anchor" id="anc"></div>${p.stateCount?'<p class="cap" id="combinations"></p>':''}</div>${p.note?`<p class="studio-note">${p.note}</p>`:''}`;
  const A=[[7,'上海的常住人口'],
    [18,'地球上所有沙粒的数量'],[19,'全球人口乘以一个人一生的秒数'],
    [25,'一杯水里的水分子数'],[80,'可观测宇宙里的全部原子']];
  const r=slot.querySelector('#r');
  const upd=()=>{
    const n=+r.value,lg=n*Math.log10(2);
    slot.querySelector('#nb').textContent=n;
    const big=slot.querySelector('#big');
    big.innerHTML=lg<6?Math.round(2**n).toLocaleString('zh-CN')
      :String.raw`$${(10**(lg-Math.floor(lg))).toFixed(1)}\times10^{${Math.floor(lg)}}$`;
    const anchor=slot.querySelector('#anc');
    // Start comparisons at the Shanghai population tier, excluding its 1/10 tier.
    anchor.hidden=!p.stateCount&&lg<6.5;
    if(p.stateCount){
      anchor.innerHTML=`${n} 个比特 → $2^{${n}}$ 种组合 → $2^{${n}}$ 项记录`;
      slot.querySelector('#combinations').textContent=n<=3
        ?'组合：'+Array.from({length:2**n},(_,i)=>i.toString(2).padStart(n,'0')).join('、')+'。每种组合对应一项记录。'
        :'每多 1 个比特，原有的每种组合后面都可以再接 0 或 1，因此记录项数翻倍。';
    }else if(anchor.hidden){
      anchor.textContent='';
    }else{
      const a=A.reduce((best,x)=>Math.abs(lg-x[0])<Math.abs(lg-best[0])?x:best,A[0]);
      const gap=Math.round(lg-a[0]);
      anchor.innerHTML=gap===0?'≈ '+a[1]
        :gap>0?`≈ ${a[1]}的 $10^{${gap}}$ 倍`
        :`≈ ${a[1]}的 $10^{${-gap}}$ 分之一`;
    }
    typesetMath(big);typesetMath(anchor);
    put('n',n);put('lg',Math.round(lg));
    check(p,{n:n,lg:lg});
  };
  r.addEventListener('input',upd);upd();
};

/* ---------- C-05 布洛赫球 ---------- */
COMP.c5=(slot,p)=>{
  let amp=p.init?p.init.slice():[{re:1,im:0},{re:0,im:0}],hist=[],dragged=false;
  let firstEquatorAngle=null,equatorCompared=false;
  const seen=new Set();
  const list=p.gates||['H','X','Z','S','T'];
  const hasAngle=p.angle;
  slot.innerHTML=`<div class="bloch-experiment"><svg class="fig bloch-scene" id="bs" aria-label="Bloch 球：拖动改变状态方向" viewBox="0 0 240 236"></svg>
    <div class="bloch-panel">
    <p class="bloch-probability-title">$Z$ 基测量概率</p>
    <div class="readout">
      <div><span>得到 0 的概率</span><span class="num" id="p0">100%</span></div>
      <div><span>得到 1 的概率</span><span class="num" id="p1">0%</span></div>
      ${p.showX?`<div><span>X 基下测得 +</span><span class="num" id="px">50%</span></div>`:''}
    </div>
    <div class="gates">${list.map(g=>`<button class="gate" data-g="${g}">${g}</button>`).join('')}
      <button class="gate" data-g="R" aria-label="恢复初态">${list.length?'↺':'恢复初态'}</button></div>
    ${hasAngle?`<div class="slab bloch-angle-label"><span>旋转角度</span><span class="num" id="an">90°</span></div>
      <input type="range" id="ra" min="0" max="360" value="90">`:''}
    <div class="seq" id="sq"${list.length?'':' hidden'}></div>
    </div></div>`;
  const {az:AZ,el:EL}=BLOCH_VIEW,CX=120,CY=116,R=84;
  const pr=(x,y,z)=>blochProject([x,y,z],CX,CY,R).slice(0,2);
  function draw(){
    const b=blochOf(amp);
    slot.querySelector('#bs').innerHTML=blochScene(b,{cx:CX,cy:CY,r:R,coordinates:false});
    const p0=amp[0].re**2+amp[0].im**2;
    const pxp=(1+b[0])/2;
    slot.querySelector('#p0').textContent=(p0*100).toFixed(1)+'%';
    slot.querySelector('#p1').textContent=((1-p0)*100).toFixed(1)+'%';
    if(p.showX)slot.querySelector('#px').textContent=(pxp*100).toFixed(1)+'%';
    slot.querySelector('#sq').innerHTML='线路：<b>'+(hist.length?hist.join(' → '):'（空）')+'</b>';
    typesetMath(slot);
    put('seq',hist.join(' → ')||'（空）');put('p0',(p0*100).toFixed(0));
    check(p,{p0:p0,px:pxp,b:b,hist:hist,n:hist.length,dragged:dragged,seen:[...seen],equatorCompared:equatorCompared});
  }
  slot.querySelectorAll('.gate').forEach(btn=>btn.onclick=()=>{
    const g=btn.dataset.g;
    if(g==='R'){amp=p.init?p.init.slice():[{re:1,im:0},{re:0,im:0}];hist=[];}
    else if(hasAngle&&(g==='Rx'||g==='Ry'||g==='Rz')){
      const th=(+slot.querySelector('#ra').value)*Math.PI/180;
      amp=ap1(rot(g[1],th),amp);hist.push(g+'('+slot.querySelector('#ra').value+'°)');seen.add(g);
    } else {amp=ap1(G1[g],amp);hist.push(g);seen.add(g);}
    if(hist.length>9)hist.shift();draw();
  });
  if(hasAngle)slot.querySelector('#ra').addEventListener('input',e=>{slot.querySelector('#an').textContent=e.target.value+'°';});
  const svg=slot.querySelector('#bs');let drag=false,pointerId=null;
  function stateAtPointer(e){
    const box=svg.getBoundingClientRect(),scale=box.width/240;
    const sx=(e.clientX-box.left)/scale,sy=(e.clientY-box.top)/scale;
    // Hit-test the same projected geometry that is drawn above. A small
    // screen-space tolerance makes the equator and poles reachable by touch.
    const tolerance=5/scale;
    for(const z of [1,-1]){
      const [px,py]=pr(0,0,z);
      // The labels sit beyond the projected poles. Treat the short axis
      // corridor out through each label as the same endpoint, including
      // overshoot, instead of clamping it to a different sphere state.
      const poleTolerance=10/scale;
      if(Math.abs(sx-px)<=poleTolerance&&z*(py-sy)>=-poleTolerance)return [0,0,z];
    }
    const azimuth=Math.atan2((sy-CY)/Math.sin(EL),sx-CX);
    const phi=azimuth-AZ,eq=[Math.cos(phi),Math.sin(phi),0];
    const [ex,ey]=pr(...eq);
    if(Math.hypot(sx-ex,sy-ey)<=tolerance)return eq;
    // Invert the orthographic projection. Each interior point has two
    // sphere intersections; retain the side closest to the previous state.
    let u=(sx-CX)/R,v=(CY-sy)/R;
    const radius=Math.hypot(u,v);
    if(radius>1){u/=radius;v/=radius;}
    const depth=Math.sqrt(Math.max(0,1-u*u-v*v));
    const candidates=[depth,-depth].map(w=>{
      const yr=-v*Math.sin(EL)+w*Math.cos(EL);
      return [u*Math.cos(AZ)+yr*Math.sin(AZ),-u*Math.sin(AZ)+yr*Math.cos(AZ),v*Math.cos(EL)+w*Math.sin(EL)];
    });
    const previous=blochOf(amp),score=b=>b.reduce((sum,n,i)=>sum+n*previous[i],0);
    return score(candidates[0])>=score(candidates[1])?candidates[0]:candidates[1];
  }
  if(p.drag!==false){
    svg.addEventListener('pointerdown',e=>{if(drag||e.button!==0)return;drag=true;pointerId=e.pointerId;svg.setPointerCapture(e.pointerId);});
    svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==pointerId)return;
      const b=stateAtPointer(e),z=Math.max(-1,Math.min(1,b[2])),ph=Math.atan2(b[1],b[0]);
      const a=Math.sqrt((1+z)/2),r=Math.sqrt((1-z)/2);
      amp=[{re:a,im:0},{re:r*Math.cos(ph),im:r*Math.sin(ph)}];
      if(Math.abs(z)<0.08){
        if(firstEquatorAngle===null)firstEquatorAngle=ph;
        else if(Math.abs(Math.atan2(Math.sin(ph-firstEquatorAngle),Math.cos(ph-firstEquatorAngle)))>0.25)equatorCompared=true;
      }
      hist=[];dragged=true;draw();});
    ['pointerup','pointercancel','lostpointercapture'].forEach(k=>svg.addEventListener(k,e=>{if(e.pointerId===pointerId){drag=false;pointerId=null;}}));
  }
  draw();
};

/* ---------- 双比特模拟内核 ---------- */
function st2(){return [{re:1,im:0},{re:0,im:0},{re:0,im:0},{re:0,im:0}];}
function ap2(st,g){
  const n=st.map(c=>({re:c.re,im:c.im}));
  const one=(q,M)=>{
    const o=n.map(c=>({re:c.re,im:c.im}));
    const bit=q===0?2:1;
    for(let k=0;k<4;k++){
      if(k&bit)continue;
      const k0=k,k1=k|bit;
      o[k0]=cadd(cm(M[0][0],n[k0]),cm(M[0][1],n[k1]));
      o[k1]=cadd(cm(M[1][0],n[k0]),cm(M[1][1],n[k1]));
    }
    return o;};
  if(g==='CNOT'){const o=n.slice();const t=o[2];o[2]=o[3];o[3]=t;return o;}
  if(g==='CZ'){const o=n.slice();o[3]={re:-o[3].re,im:-o[3].im};return o;}
  const q=+g.slice(-1),name=g.slice(0,-1);
  return one(q,G1[name]);
}

/* ---------- 主流硬件路线：实物照片与实验成像 ---------- */
const hardwarePhoto=(file,alt,width,height,caption,kind='')=>`<figure class="hardware-photo ${kind}">
  <img src="assets/illustrations/${file}" alt="${alt}" width="${width}" height="${height}">
  <figcaption>${caption}</figcaption>
</figure>`;
const ROUTE_ART={
  fridgePhoto:()=>`<figure class="hardware-photo">
    <img src="assets/illustrations/ibm-quantum-hardware.jpg" alt="超导量子计算机中的金色多层装置，层间连接着许多线缆。" width="670" height="1023">
    <figcaption><a href="https://www.flickr.com/photos/ibm_research_zurich/26774599148/" target="_blank" rel="noopener noreferrer">IBM Quantum Dilution Refrigerator (interior)</a>。摄影：Graham Carlow for IBM，发布：IBM Research。<a href="https://creativecommons.org/licenses/by-nd/2.0/" target="_blank" rel="noopener noreferrer">CC BY-ND 2.0</a>；原图等比例展示。</figcaption>
  </figure>`,
  ion:()=>hardwarePhoto('nist-ion-trap.webp','NIST 离子阱实物：金色电极和连接线汇聚到中央囚禁区域。',960,666,
    '<a href="https://www.nist.gov/image/ion-trap-1" target="_blank" rel="noopener noreferrer">Ion Trap</a>。图片：Blakestad/NIST。依据 <a href="https://www.nist.gov/copyrights-disclaimers" target="_blank" rel="noopener noreferrer">NIST 公开信息使用政策</a>使用。'),
  atom:()=>hardwarePhoto('cesium-optical-tweezer-array.png','铯原子阵列的真实荧光成像：亮点呈规则网格排列，显示激光光阱中原子的分布；图像经过多次平均和伪彩色处理。',643,644,
    '<a href="https://commons.wikimedia.org/wiki/File:1225_site_cold_cesium_atom_array.png" target="_blank" rel="noopener noreferrer">1225 site cold cesium atom array</a>。作者：Preston Huft。<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>；原图等比例展示，平均与伪彩色处理来自原作者。','hardware-atom-photo'),
  photon:()=>`<figure class="hardware-photo">
    <div class="hardware-photon-detail">
      <img src="assets/illustrations/quix-photonic-processor-figure.jpg" alt="QuiX 光子处理器实物近照：光纤阵列连接中央光子芯片，周围是控制电路与温控组件。原图标有光纤阵列、印刷电路板、驱动器和温控元件。" width="1166" height="773">
    </div>
    <figcaption>QuiX 光子处理器。© 2021 C. Taballione et al.，<a href="https://doi.org/10.1088/2633-4356/ac168c" target="_blank" rel="noopener noreferrer">A universal fully reconfigurable 12-mode quantum photonic processor</a>，Materials for Quantum Technology 1, 035002 (2021)，图 1。<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>；局部视图取自图 1(c)，保留原图标注。</figcaption>
  </figure>`
};
