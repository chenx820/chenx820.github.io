/* L02 guided experiments. Pure-state Bloch vectors; all samples are browser simulations.
   Sessions are per lesson and experiment, so moving between prompts never resamples. */
const QUBIT={sessions:{},epoch:0};
const QB_STATES={
 zero:{ket:'|0⟩',b:[0,0,1],name:'|0⟩，确定态',formula:String.raw`|0\rangle`},
 one:{ket:'|1⟩',b:[0,0,-1],name:'|1⟩，确定态',formula:String.raw`|1\rangle`},
 plus:{ket:'|+⟩',b:[1,0,0],name:'+x，叠加态',formula:String.raw`\frac{|0\rangle+|1\rangle}{\sqrt2}`},
 minus:{ket:'|−⟩',b:[-1,0,0],name:'−x，叠加态',formula:String.raw`\frac{|0\rangle-|1\rangle}{\sqrt2}`},
 yplus:{ket:'|+i⟩',b:[0,1,0],name:'+y，叠加态',formula:String.raw`\frac{|0\rangle+i|1\rangle}{\sqrt2}`},
 weighted:{b:[.96,0,-.28],name:'偏向 1，36% / 64%',formula:String.raw`\frac35|0\rangle+\frac45|1\rangle`},
 tilted:{b:[Math.sqrt(3)/2,0,.5],name:'北半球，75% / 25%',formula:String.raw`\frac{\sqrt3}{2}|0\rangle+\frac12|1\rangle`}
};
const QB_AXES={X:[1,0,0],Y:[0,1,0],Z:[0,0,1],H:[Math.SQRT1_2,0,Math.SQRT1_2]};
const QB_GATE_LABELS={X:'X 门：绕 x 轴转半圈',Y:'Y 门：绕 y 轴转半圈',Z:'Z 门：绕 z 轴转半圈',H:'H 门：绕 x、z 正方向之间的斜轴转半圈'};
function qbRotate(b,axis,angle=Math.PI){
 const c=Math.cos(angle),s=Math.sin(angle),d=b.reduce((v,x,i)=>v+x*axis[i],0);
 const cross=[axis[1]*b[2]-axis[2]*b[1],axis[2]*b[0]-axis[0]*b[2],axis[0]*b[1]-axis[1]*b[0]];
 return b.map((v,i)=>v*c+cross[i]*s+axis[i]*d*(1-c)).map(v=>Math.abs(v)<1e-12?0:v);
}
function qbProbability(b){return Math.max(0,Math.min(1,(1+b[2])/2));}
function qbMeasure(b,random=Math.random){const value=random()<qbProbability(b)?0:1;return {value,b:[0,0,value===0?1:-1]};}
function qbSample(b,n=32,random=Math.random){const counts=[0,0];for(let i=0;i<n;i++)counts[qbMeasure(b,random).value]++;return counts;}
function qbMeasureSeries(initial,reprepare,n=12,random=Math.random){
 let b=initial.slice();const values=[];
 for(let i=0;i<n;i++){const r=qbMeasure(reprepare?initial:b,random);values.push(r.value);b=r.b;}
 return {values,b};
}
function qbNewModel(p){
 const b=QB_STATES[p.init||'zero'].b.slice();
 return {b,prepared:p.init||'zero',seq:[],counts:null,first:null,values:[],runs:0,axis:p.axis||null,trace:null,
  pair:p.phasePreparation?[[1,0,0],[1,0,0]]:p.pair==='phase'?[[1,0,0],[-1,0,0]]:[[0,0,1],[0,0,1]],pairCounts:null,stage:0,shots:p.shots||32};
}
function qbUndoGate(m,p){
 if(!m.seq.length)return false;
 m.seq.pop();m.b=QB_STATES[m.prepared].b.slice();m.axis=p.axis||null;m.trace=null;
 for(const gate of m.seq){
  const initial=m.b,axis=QB_AXES[gate];
  m.b=qbRotate(initial,axis);m.axis=gate;
  m.trace=Array.from({length:49},(_,i)=>qbRotate(initial,axis,i*Math.PI/48));
 }
 m.counts=null;m.first=null;m.runs=Math.max(0,m.runs-1);
 return true;
}
function qbProject(b){return blochProject(b).slice(0,2);}
function qbPath(points){return points.map((b,i)=>`${i?'L':'M'}${qbProject(b).map(v=>v.toFixed(2)).join(' ')}`).join(' ');}
function qbSphere(b,axisName=null,trace=null,angles=false,showMeasurement=true){
 return `<svg class="qb-sphere bloch-scene" viewBox="0 0 300 286" role="img" aria-label="Bloch 球${showMeasurement?'，当前 Z 基测得 0 的概率 '+(qbProbability(b)*100).toFixed(1)+'%':'，箭头表示当前量子态'}${axisName?'，高亮 '+axisName+' 门旋转轴':''}">
 ${blochScene(b,{axis:QB_AXES[axisName],trace,overlay:angles?qbAngleArcs(b):''})}</svg>`;
}
function qbAngleArcs(b){
 const theta=Math.acos(Math.max(-1,Math.min(1,b[2]))),phi=Math.atan2(b[1],b[0]);
 if(Math.abs(Math.sin(theta))<1e-8)return '';
 const polar=Array.from({length:33},(_,i)=>{const t=theta*i/32;return [.62*Math.sin(t)*Math.cos(phi),.62*Math.sin(t)*Math.sin(phi),.62*Math.cos(t)];});
 const azimuth=Array.from({length:33},(_,i)=>{const t=phi*i/32;return [.72*Math.cos(t),.72*Math.sin(t),0];});
 const tag=(point,label)=>{const [x,y]=qbProject(point);return `<text class="qb-angle-label" x="${x+7}" y="${y-7}">${label}</text>`;};
 return `<path class="qb-angle-polar" d="${qbPath(polar)}"/>${tag(polar[16],'θ')}<path class="qb-angle-azimuth" d="${qbPath(azimuth)}"/>${Math.abs(phi)>.01?tag(azimuth[16],'φ'):''}`;
}
function qbStateFormula(b){
 const match=Object.values(QB_STATES).find(s=>s.b.every((v,i)=>Math.abs(v-b[i])<1e-9));
 if(match)return match.formula;
 const p=qbProbability(b),phi=Math.atan2(b[1],b[0]);
 return String.raw`${Math.sqrt(p).toFixed(3)}|0\rangle+e^{i(${phi.toFixed(3)})}${Math.sqrt(1-p).toFixed(3)}|1\rangle`;
}
function qbReadout(b,counts,basis="直接测量 0/1（Z 基测量）",showSamples=true,first=null,shots=32){
 const p=qbProbability(b),pct=v=>(100*v).toFixed(v===0||v===1?0:1)+'%';
 return `<div class="qb-probabilities"><p class="qb-label">${basis}的理论概率</p>${[p,1-p].map((v,i)=>`<div class="qb-prob"><span>结果 ${i}</span><strong>${pct(v)}</strong><span class="qb-meter"><span style="--probability:${v*100}%"></span></span></div>`).join('')}</div>
 ${showSamples?`<div class="qb-counts"><span>模拟测量结果</span><strong>${counts?`0：${counts[0]} 次　1：${counts[1]} 次`:'尚未抽样'}</strong>${first!==null?`<small>本批第 1 次结果：${first}</small>`:''}${counts?`<small>每次恢复图中初态后测量，共 ${shots} 次</small>`:''}</div>`:''}`;
}
function qbMath(m,details){
 const b=m.b,theta=Math.acos(Math.max(-1,Math.min(1,b[2])))*180/Math.PI;
 const pole=Math.abs(b[2])>1-1e-10,phi=(Math.atan2(b[1],b[0])*180/Math.PI+360)%360;
 return (details?String.raw`<div class="qb-formula-map"><p><strong>同一个物理状态，两种写法</strong></p><div>$$|\psi\rangle=a|0\rangle+b|1\rangle$$</div><div>$$|\psi\rangle=\cos\frac{\theta}{2}|0\rangle+e^{i\phi}\sin\frac{\theta}{2}|1\rangle$$</div><p>$|a|=\cos(\theta/2)$，$|b|=\sin(\theta/2)$。两式都满足 $|a|^2+|b|^2=1$。</p><p>θ 从北极量起，决定南北位置与直接测量概率；φ 绕南北轴量起，表示两个非零概率幅的相对相位。</p><p>当前 θ = ${theta.toFixed(1)}°；${pole?'位于极点，一个概率幅为零，φ 不再区分状态。':'φ = '+phi.toFixed(1)+'°。'}</p><p>$P(0)=\cos^2(\theta/2)$，$P(1)=\sin^2(\theta/2)$。</p><p>$e^{i\phi}$ 的模为 1，只改变相位，不改变概率幅的大小。$i$ 是虚数单位，满足 $i^2=-1$。</p><p class="qb-caption">这里省略了不影响测量结果的整体相位。</p></div>`:'');
}
// Reusable experiment component inside the same R.add/play shell as other chapters.
COMP.qubit=(slot,p)=>{
 const lesson=S.lesson,step=S.i,epoch=++QUBIT.epoch;
 const showMeasurement=p.showMeasurement!==false;
 const showSamples=showMeasurement&&p.sample!==false&&p.kind!=='formula';
 const session=QUBIT.sessions[lesson.id]||(QUBIT.sessions[lesson.id]={models:{},performed:{}});
 let m=session.models[p.key]||(session.models[p.key]=qbNewModel(p)),busy=false,busyTarget='';
 slot.innerHTML='<section class="qb-experiment"><div id="qb-workspace" aria-label="实验区"></div><div id="qb-feedback" aria-live="polite"></div></section>';
 const work=slot.querySelector('#qb-workspace'),feedback=slot.querySelector('#qb-feedback');
 const valid=()=>epoch===QUBIT.epoch&&slot.isConnected&&S.lesson===lesson&&S.i===step;
 const update=()=>{
  const performed=!!session.performed[step]&&(!p.minGates||m.seq.length>=p.minGates)&&(!p.requiredSequence||p.requiredSequence.every((g,i)=>m.seq[i]===g));
  const ready=!p.required||performed;
  work.querySelectorAll('button,select').forEach(b=>b.disabled=busy);
  if(busy&&busyTarget){
   const button=work.querySelector(busyTarget);
   if(button)CourseUI.beginButtonBusy(button,'正在施加量子门',{iconOnly:true});
  }
  const undo=work.querySelector('[data-undo]');if(undo)undo.disabled=busy||!m.seq.length;
  document.getElementById('back').disabled=busy;
  go('继续',ready&&!busy);
  S.gateOK=ready&&!busy;
  if(S.gateOK)S.passed[step]=true;else delete S.passed[step];
  const pending=p.phasePreparation?'只给 B 施加 Z，比较相位符号与概率。':p.requiredSequence?'从初态按 '+p.requiredSequence.join(' → ')+' 操作；顺序不符时可恢复初态。':p.minGates?'连续操作 '+p.minGates+' 次，再观察结果。':p.kind==='compare'&&!showSamples?'给两组状态施加 H，观察变化。':showSamples?'运行一次实验，观察结果。':'施加量子门，观察状态变化。';
  hint(busy?'正在施加量子门…':ready?'':pending);
  feedback.innerHTML=p.explain&&ready?`<p>${p.explain}</p>`:'';
  typesetMath(feedback);
 };
 function performed(){session.performed[step]=true;m.runs++;}
 function liveReadout(panel,b){
  const p0=qbProbability(b);
  panel.querySelectorAll('.qb-prob').forEach((row,i)=>{const v=i?1-p0:p0;row.querySelector('strong').textContent=(100*v).toFixed(v===0||v===1?0:1)+'%';row.querySelector('.qb-meter>span').style.setProperty('--probability',(100*v)+'%');});
 }
 function drawFigures(vectors,axis,trace){
  if(p.probabilityOnly)work.querySelectorAll('.qb-pair').forEach((panel,i)=>liveReadout(panel,vectors[i]));
  const panels=work.querySelectorAll('[data-figure]');
  panels.forEach((node,i)=>{const b=vectors[i]||vectors[0];node.innerHTML=qbSphere(b,axis,Array.isArray(trace?.[0]?.[0])?trace[i]:trace,false,showMeasurement);typesetMath(node);liveReadout(node.closest('.qb-pair')||work,b);});
 }
 async function animate(vectors,gate){
  work.querySelectorAll('.qb-formula').forEach(node=>node.hidden=true);
  const axis=QB_AXES[gate],reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const final=vectors.map(v=>qbRotate(v,axis)),paths=vectors.map(v=>Array.from({length:49},(_,j)=>qbRotate(v,axis,j*Math.PI/48)));
  if(reduced){drawFigures(final,gate,paths);return valid();}
  return new Promise(resolve=>{let start=null;function frame(now){
   if(!valid()){resolve(false);return;}
   if(start===null)start=now;
   const fraction=Math.min(1,(now-start)/750),angle=Math.PI*(.5-.5*Math.cos(Math.PI*fraction));
   const samples=Math.max(2,Math.ceil(48*angle/Math.PI)+1);
   const trails=vectors.map(v=>Array.from({length:samples},(_,j)=>qbRotate(v,axis,angle*j/(samples-1))));
   drawFigures(vectors.map(v=>qbRotate(v,axis,angle)),gate,trails);
   if(fraction<1)requestAnimationFrame(frame);else resolve(true);
  }requestAnimationFrame(frame);});
 }
 function paint(){
  const openDetails=[...work.querySelectorAll('.qb-details')].map(d=>d.open);
  const sphere=['sphere','gates','formula'].includes(p.kind),compare=p.kind==='compare';
  const presetLabels={zero:'|0⟩',one:'|1⟩',plus:'$|+\\rangle$',minus:'$|-\\rangle$',yplus:'φ = 90°',weighted:'3/5 与 4/5',tilted:'北半球'};
  const presets=p.presets?`<div class="qb-presets" role="group" aria-label="准备预设态">${p.presets.map(s=>`<button data-preset="${s}" aria-pressed="${s===m.prepared}">${presetLabels[s]}</button>`).join('')}</div>`:'';
  const inlineReset=!!p.gates?.length&&!showSamples;
  const reset=`<button class="${inlineReset?'qb-action qb-secondary qb-reset':'text-button'}" data-reset${inlineReset?' title="恢复初态" aria-label="重置：恢复初态"':''}>${inlineReset?'重置':p.kind==='formula'?'恢复默认状态':showSamples?'重新开始本实验':'恢复初态'}</button>`;
  const undo=inlineReset?'<button class="qb-action qb-secondary qb-reset" data-undo title="撤销上一步" aria-label="撤销上一步">撤销</button>':'';
  const gates=p.gates?.length?`<p class="qb-caption qb-gate-help">${p.gates.map(g=>QB_GATE_LABELS[g]).join('；')}</p><div class="qb-gates${inlineReset&&p.gates.length===1?' qb-gates-single':''}">${p.gates.map(g=>`<button class="qb-action" data-gate="${g}">${g} 门</button>`).join('')}${undo}${inlineReset?reset:''}</div>`:'';
  let body='';
  if(compare){
   const labels=p.phasePreparation?['A 当前：$|+\\rangle$',m.stage?'B 当前：$|-\\rangle$':'B 当前：$|+\\rangle$']:p.probabilityOnly?['A 初态：$|+\\rangle$','B 初态：$|-\\rangle$']:p.pair==='phase'?['A：$|+\\rangle$（+x）','B：$|-\\rangle$（−x）']:['A：H → H','B：H → Z → H'];
   const progress=p.phasePreparation?(m.stage?'B 已施加 Z；A 保持原态':'两组都处于同相叠加态'):p.pair==='phase'?(m.stage?'已施加 H':'尚未施加 H'):['尚未加门','两组都完成第一个 H','A 保持原态，B 完成 Z','两组都完成最后一个 H'][m.stage];
   body=`<p class="qb-experiment-name">${p.phasePreparation?'先制造相位差':'同样的后续操作，比较两个结果'}</p><div class="qb-comparison">${m.pair.map((b,i)=>`<div class="qb-pair"><h2>${labels[i]}</h2>${p.probabilityOnly?'':`<div data-figure="${i}">${qbSphere(b,p.pair==='circuit'&&m.stage===2&&i===0?null:m.axis)}</div>`}${p.phasePreparation?`<p class="qb-phase-signs">|0⟩ 分量：＋<br>|1⟩ 分量：${b[0]<0?'−':'＋'}</p>`:''}${qbMath({b},false)}${qbReadout(b,m.pairCounts?.[i],p.pair==='phase'?'直接测量':'直接测量 0/1（Z 基测量）',showSamples)}</div>`).join('')}</div><p class="qb-sequence">${progress}</p>`;
  }else if(p.kind==='formula'){
   body=qbSphere(m.b,m.axis,m.trace,p.mathDetails,showMeasurement);
  }else if(p.kind==='measurement'){
   const same=p.mode==='consecutive';
   body=`<p class="qb-experiment-name">${same?'只准备一次 → 连续测量 12 次':'每次准备 → 测量，重复 12 次'}</p><div class="qb-state-flow"><span>初态<br><strong>叠加态</strong></span><span aria-hidden="true">→</span><span>最后一次测量后<br><strong>${m.values.length?'|'+m.values.at(-1)+'⟩':'尚未测量'}</strong></span></div><div class="qb-state-grid"><div>${qbSphere(m.b)}</div><div>${qbMath(m,false)}${qbReadout(m.b,null,'下一次直接测量',false)}</div></div><ol class="qb-outcomes" aria-label="按时间排列的 12 次测量结果">${m.values.length?m.values.map((v,i)=>`<li aria-label="第 ${i+1} 次：${v}">${v}</li>`).join(''):'<li class="qb-empty">等待实验</li>'}</ol><p class="qb-caption">${same?'首次结果随机；此后不加操作，沿用测后的状态。':'每次都恢复相同叠加态，然后独立抽样。'}</p>`;
  }else{
   const simple=QB_STATES[m.prepared].name.split('，');
   const details=(p.showFormula?qbMath(m,false):'')+(showMeasurement?qbReadout(m.b,m.counts,'直接测量 0/1',showSamples,m.first,m.shots):'');
   body=`<div class="qb-state-grid${details?'':' qb-state-grid-solo'}"><div${p.kind==='gates'?' class="qb-gate-visual"':''}>${sphere?`<div data-figure="0">${qbSphere(m.b,m.axis,m.trace,p.mathDetails,showMeasurement)}</div>`:`<div class="qb-state-name"><strong>${simple[1]==='叠加态'?'叠加态':simple[0]}</strong><span>${simple[1]==='叠加态'?'0/1 测量各半':'0/1 测量结果确定'}</span></div>`}${p.kind==='gates'?gates:''}</div>${details?`<div>${details}</div>`:''}</div>`;
  }
  const runLabel=p.phasePreparation?'只给 B 施加 Z':compare?(showSamples?'运行两组实验':'给两组状态施加 H'):p.kind==='measurement'?'运行 12 次测量':`恢复初态并测量 ${m.shots} 次`;
  const shots=showSamples&&p.shotOptions?`<label class="qb-shots">重复次数 <select data-shots>${p.shotOptions.map(n=>`<option value="${n}"${m.shots===n?' selected':''}>${n} 次</option>`).join('')}</select></label>`:'';
  const circuit=p.kind==='gates'?labCircuit({n:1,seq:m.seq,static:true,initialLabel:QB_STATES[m.prepared].ket||'初态'}):'';
  work.innerHTML=body+presets+shots+(p.kind==='gates'?'':gates)+(compare||showSamples||!inlineReset?`<div class="qb-controls">${compare||showSamples?`<button class="qb-action${p.kind==='gates'?' qb-secondary':''}" data-run>${runLabel}</button>`:''}${inlineReset?'':reset}</div>`:'')+circuit+(p.kind==='formula'?qbMath(m,p.mathDetails):'');
  typesetMath(work);
  work.querySelectorAll('.qb-details').forEach((d,i)=>d.open=!!openDetails[i]);
  const shotSelect=work.querySelector('[data-shots]');if(shotSelect)shotSelect.onchange=()=>{m.shots=Number(shotSelect.value);m.counts=null;m.first=null;paint();work.querySelector('[data-shots]').focus();};
  work.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{
   m.prepared=b.dataset.preset;m.b=QB_STATES[m.prepared].b.slice();m.counts=null;m.first=null;m.trace=null;m.seq=[];paint();
  });
  work.querySelector('[data-reset]').onclick=()=>{
   m=session.models[p.key]=qbNewModel(p);
   lesson.pages.forEach((step,i)=>{if(step.key===p.key){delete session.performed[i];delete S.passed[i];}});
   COMP.qubit(slot,p);
  };
  const undoButton=work.querySelector('[data-undo]');
  if(undoButton)undoButton.onclick=()=>{
   if(busy||!qbUndoGate(m,p))return;
   lesson.pages.forEach((page,i)=>{if(page.key===p.key){delete S.passed[i];if(!m.seq.length)delete session.performed[i];}});
   paint();
   work.querySelector(m.seq.length?'[data-undo]':'[data-gate]').focus();
  };
  work.querySelectorAll('[data-gate]').forEach(b=>b.onclick=async()=>{
   if(busy)return;
   busyTarget=`[data-gate="${b.dataset.gate}"]`;
   busy=true;update();const gate=b.dataset.gate,initial=m.b.slice();m.counts=null;m.first=null;m.axis=gate;paint();
   if(!await animate([initial],gate))return;
   m.b=qbRotate(initial,QB_AXES[gate]);m.axis=gate;m.trace=Array.from({length:49},(_,i)=>qbRotate(initial,QB_AXES[gate],i*Math.PI/48));
   m.seq.push(gate);m.counts=null;performed();busy=false;paint();
  });
  const run=work.querySelector('[data-run]');
  if(run)run.onclick=async()=>{
   if(busy)return;
   busyTarget='[data-run]';
   busy=true;update();
   if(p.phasePreparation){
    m.pair=[[1,0,0],qbRotate([1,0,0],QB_AXES.Z)];m.stage=1;m.axis='Z';
   }else if(compare){
    m.pair=p.pair==='phase'?[[1,0,0],[-1,0,0]]:[[0,0,1],[0,0,1]];m.pairCounts=null;m.stage=0;m.axis=null;paint();
    if(!await animate(m.pair,'H'))return;
    m.pair=m.pair.map(b=>qbRotate(b,QB_AXES.H));m.stage=1;m.axis='H';paint();
    if(p.pair==='circuit'){
     // Only B receives Z. Keep A fixed while B follows its physical rotation.
     const initial=m.pair[1].slice(),axis=QB_AXES.Z;
     const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
     if(!reduced){const start=performance.now();await new Promise(resolve=>{function frame(now){
      if(!valid()){resolve();return;}
      const t=Math.min(1,(now-start)/750);
      work.querySelector('[data-figure="1"]').innerHTML=qbSphere(qbRotate(initial,axis,Math.PI*t),'Z',Array.from({length:49},(_,i)=>qbRotate(initial,axis,i*Math.PI*t/48)));
      typesetMath(work.querySelector('[data-figure="1"]'));
      liveReadout(work.querySelectorAll('.qb-pair')[1],qbRotate(initial,axis,Math.PI*t));
      if(t<1)requestAnimationFrame(frame);else resolve();
     }requestAnimationFrame(frame);});}
     if(!valid())return;
     m.pair[1]=qbRotate(initial,axis);m.stage=2;m.axis='Z';paint();
     if(!await animate(m.pair,'H'))return;
     m.pair=m.pair.map(b=>qbRotate(b,QB_AXES.H));m.stage=3;m.axis='H';
    }
    if(showSamples)m.pairCounts=m.pair.map(b=>qbSample(b));
   }else if(p.kind==='measurement'){
    const result=qbMeasureSeries(QB_STATES[p.init].b,p.mode==='reprepare');m.b=result.b;m.values=result.values;
   }else {m.first=qbMeasure(m.b).value;m.counts=qbSample(m.b,m.shots-1);m.counts[m.first]++;}
   if(p.kind!=='gates')performed();busy=false;paint();
  };
  update();
 }
 paint();
};


