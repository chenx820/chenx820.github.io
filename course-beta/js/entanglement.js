/* Chapter 3 experiments. q0 is always the most significant bit.
   Teleportation evolves a three-qubit complex state, then conditions on Alice's outcome. */
const ENT={sessions:{}};
function entGate(state,gate,target,control=null){
 const mask=1<<(Math.log2(state.length)-1-target),out=state.map(a=>a.slice());
 for(let i=0;i<state.length;i++){
  if(i&mask)continue;
  if(control!==null&&!(i&(1<<(Math.log2(state.length)-1-control))))continue;
  const j=i|mask,a=state[i],b=state[j];
  if(gate==='H'){out[i]=a.map((x,k)=>(x+b[k])*Math.SQRT1_2);out[j]=a.map((x,k)=>(x-b[k])*Math.SQRT1_2);}
  if(gate==='X'){out[i]=b.slice();out[j]=a.slice();}
  if(gate==='Z')out[j]=b.map(x=>-x);
 }
 return out;
}
function entInput(name){
 const [x,y,z]=QB_STATES[name].b,a=Math.sqrt((1+z)/2);
 return a<1e-10?[[0,0],[1,0]]:[[a,0],[x/(2*a),y/(2*a)]];
}
function entTeleportState(name,step=2){
 const input=entInput(name),state=Array.from({length:8},()=>[0,0]);
 for(let q=0;q<2;q++)for(const pair of [0,3])state[4*q+pair]=input[q].map(x=>x*Math.SQRT1_2);
 let out=state;
 if(step>=1)out=entGate(out,'X',1,0);
 if(step>=2)out=entGate(out,'H',0);
 return out;
}
function entBranches(state){return Array.from({length:4},(_,i)=>state.slice(2*i,2*i+2).flat().reduce((s,x)=>s+x*x,0));}
function entBob(name,outcome,gates=[]){
 const state=entTeleportState(name),prob=entBranches(state)[outcome];
 let b=state.slice(outcome*2,outcome*2+2).map(a=>a.map(x=>x/Math.sqrt(prob)));
 for(const gate of gates)b=entGate(b,gate,0);
 return b;
}
function entBloch([a,b]){return [2*(a[0]*b[0]+a[1]*b[1]),2*(a[0]*b[1]-a[1]*b[0]),a[0]**2+a[1]**2-b[0]**2-b[1]**2];}
function entCorrections(outcome){return [...(outcome&1?['X']:[]),...(outcome&2?['Z']:[])];}
function entChoose(probs,random=Math.random){let r=random();for(let i=0;i<probs.length;i++){r-=probs[i];if(r<0)return i;}return probs.length-1;}
function entButtons(items,attribute='action',selected=null){return `<div class="ent-actions">${items.map(([value,label,disabled])=>`<button type="button" class="secondary" data-ent-${attribute}="${value}"${disabled?' disabled':''}${selected!==null?` aria-pressed="${value===selected}"`:''}>${label}</button>`).join('')}</div>`;}
const ENT_BELL_GATES=['H0','H1','X0','X1','Z0','Z1','CNOT'];
function entBellState(gates){
 return gates.reduce((state,g)=>g==='CNOT'?entGate(state,'X',1,0):entGate(state,g[0],Number(g[1])),[[1,0],[0,0],[0,0],[0,0]]);
}
function entBellTarget(state){
 // State overlap includes the relative phase and ignores an unobservable global phase.
 return Math.abs((state[0][0]+state[3][0])**2/2+(state[0][1]+state[3][1])**2/2-1)<1e-10;
}
function entBellStateFormula(state){
 // H, X, Z and CNOT keep this builder's amplitudes real and equal in magnitude.
 const terms=state.map((a,i)=>({value:a[0],bits:i.toString(2).padStart(2,'0')})).filter(a=>Math.abs(a.value)>1e-10);
 const sum=terms.map((a,i)=>`${a.value<0?'-':i?'+':''}|${a.bits}\\rangle`).join('');
 const factor=terms.length===2?'\\frac{1}{\\sqrt{2}}':terms.length===4?'\\frac{1}{2}':'';
 return `|\\psi\\rangle = ${factor?`${factor}\\left(${sum}\\right)`:sum}`;
}
function entModel(kind){return {kind,stage:0,input:'00',preset:'plus',basis:'Z',expanded:false,filter:false,seen:[],runs:0,counts:null,last:null,outcome:null,gates:[],finished:[],mode:'random'};}
function entView(m){
 let html='',ready=false,message='';
 if(m.kind==='cnot'){
  const a=Number(m.input[0]),b=Number(m.input[1])^(m.stage%2?a:0),output=`${a}${b}`;
  html=`<p>q0 控制 q1；先选择输入，再执行门。</p>${entButtons(['00','01','10','11'].map(x=>[x,x]),'input',m.input)}<div class="ent-machine"><strong>|${m.input}⟩</strong><span>→</span><div>CNOT × ${m.stage}</div><span>→</span><strong>|${output}⟩</strong></div>${labCircuit({n:2,seq:[...(a?['X0']:[]),...(Number(m.input[1])?['X1']:[]),...Array(m.stage).fill('CNOT')],static:true})}${entButtons([['next','执行 CNOT',m.stage===2],['reset','恢复当前输入']])}<p>${m.stage===2?'连续两次 CNOT 回到输入状态。':m.stage?`控制位为 ${a}，目标位${a?'翻转':'保持不变'}。`:'此处观察状态变换，不进行测量。'}</p>`;
  ready=['00','01','10','11'].every(x=>m.seen.includes(x))&&m.seen.includes('twice');message=`已执行 ${m.seen.filter(x=>/^[01]{2}$/.test(x)).length} / 4 种输入；再观察连续两次 CNOT。`;
 }else if(m.kind==='bell-build'){
  const state=entBellState(m.gates),target=entBellTarget(state);
  html=`${labCircuit({n:2,seq:m.gates,static:true,measured:false})}<p class="cap">点击组件，按顺序加到线路末尾。CNOT 由 q0 控制 q1；最多添加 6 个门。</p>${entButtons(ENT_BELL_GATES.map(g=>[g,g==='CNOT'?'CNOT：q0 → q1':`${g[0]} q${g[1]}`,m.gates.length>=6]),'gate')}${entButtons([['undo','撤销上一步',!m.gates.length],['reset','恢复初态']])}<p class="ent-label">当前预期量子态</p><div class="math-line">$$${entBellStateFormula(state)}$$</div><p class="ent-result">${target?'已得到目标贝尔态：00 与 11 等幅、同相位叠加。':'还未得到目标态。目标是 00 与 11 等幅、同相位叠加，01 与 10 的概率幅为 0。'}</p><details><summary>查看制备提示</summary><p>先试 H q0，再加 CNOT。H 产生 00 与 10 的叠加；CNOT 保留 00，把 10 变为 11，并保留相干关系。也可以交换门的顺序，对照结果。</p></details>`;
  ready=target;message='自由尝试不同组件，制备出目标贝尔态。';
 }
 return {html,ready,message};
}
function entAct(m,action,value){
 const remember=x=>{if(!m.seen.includes(x))m.seen.push(x);};
 if(action==='reset'){
  const keep={input:m.input,preset:m.preset,seen:m.seen,finished:m.finished};Object.assign(m,entModel(m.kind),keep);return;
 }
 if(action==='input'){m.input=value;m.stage=0;return;}
 if(action==='branch'){
  m.mode='demo';m.outcome=parseInt(value,2);m.stage=3;m.gates=[];return;
 }
 if(m.kind==='bell-build'){
  if((action==='gate'&&ENT_BELL_GATES.includes(value)&&m.gates.length<6)||(action==='undo'&&m.gates.length)){
   if(action==='gate')m.gates.push(value);else m.gates.pop();
   m.last=null;m.counts=null;
  }
 }else if(m.kind==='cnot'){
  if(action==='next'&&m.stage<2){m.stage++;remember(m.input);if(m.stage===2)remember('twice');}
 }else if(m.kind==='teleport'){
  if(action==='next'&&m.stage<4){
   if(m.stage===2)m.outcome=entChoose(entBranches(entTeleportState(m.preset)));
   m.stage++;
  }else if(m.stage===4){
   const needed=entCorrections(m.outcome);
   if(action===needed[m.gates.length])m.gates.push(action);
   if((needed.length&&m.gates.length===needed.length)||(!needed.length&&action==='finish')){
    m.stage=5;if(m.mode==='random'&&!m.finished.includes(m.preset))m.finished.push(m.preset);
   }
  }
 }
}
COMP.entanglement=(slot,p)=>{
 const key=S.lesson.id+':'+p.key,m=ENT.sessions[key]||(ENT.sessions[key]=entModel(p.kind));
 function draw(focus){
  const view=entView(m);
  slot.innerHTML=`<section class="ent-experiment" aria-label="${p.task}"><div class="ent-content" aria-live="polite">${view.html}</div></section>`;
  slot.querySelectorAll('[data-ent-action],[data-ent-input],[data-ent-basis],[data-ent-preset],[data-ent-branch],[data-ent-gate]').forEach(el=>{
   const action=['action','input','basis','preset','branch','gate'].find(k=>el.hasAttribute('data-ent-'+k));
   const handle=()=>{const value=el.tagName==='SELECT'?el.value:el.getAttribute('data-ent-'+action);entAct(m,action==='action'?value:action,value);draw(`[data-ent-${action}]${el.tagName==='SELECT'?'':`[data-ent-${action}="${value}"]`}`);};
   el.addEventListener(el.tagName==='SELECT'?'change':'click',handle);
  });
  typesetMath(slot);
  slot.querySelectorAll('.lab-node').forEach(el=>el.disabled=true);
  S.gateOK=view.ready;go('继续',view.ready);
  if(view.ready)S.passed[S.i]=true;else delete S.passed[S.i];
  hint(view.ready?'':view.message);
  if(focus){const target=slot.querySelector(focus);(target&&!target.disabled?target:slot.querySelector('.ent-actions button:not(:disabled)'))?.focus({preventScroll:true});}
 }
 draw();
};
