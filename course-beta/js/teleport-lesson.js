/* Guided protocol with standard questions for the plan and final checks. The 11 branch is an explicit teaching example,
   while the shared complex-state simulator still calculates the physical state. */
let teleportSceneObserver;
function teleportModel(){return {...entModel('teleport'),preset:'weighted',version:1};}
function teleportScene(m){
 const measured=m.stage>=3,received=m.stage>=4,restored=m.stage===5;
 const records=measured?`<div class="teleport-records" data-teleport-records tabindex="-1" aria-label="${received?'Bob 收到':'Alice 得到'}的经典消息"><span>a = 1</span><span>b = 1</span></div>`:'';
 const held=(id,label)=>{
  const active=id==='B'?m.gates.length>0:!measured&&(m.stage===1||m.stage===2&&id==='Q');
  return `<span class="teleport-held teleport-held-${id.toLowerCase()}${active?' is-active':''}${measured&&id!=='B'?' is-measured':''}${restored&&id==='B'?' is-restored':''}" data-held="${id}" aria-label="${id}，${label}">${id}</span>`;
 };
 const cat=(name,qubits)=>`<div class="teleport-cat teleport-cat-${name.toLowerCase()}"><span class="teleport-art"><img src="assets/illustrations/teleportation-cats-white-ears.png" alt="${name==='Alice'?'白猫 Alice 手持两个量子比特':'灰猫 Bob 手持一个量子比特'}" width="1776" height="888">${qubits}</span></div><h3>${name}</h3>`;
 return `<div class="teleport-scene${received?' has-message':''}" tabindex="-1"><section class="teleport-person">${cat('Alice',held('Q',measured?'已测量':'待传输入')+held('A',measured?'已测量':'共享纠缠的一半'))}${!received?records:''}</section><svg class="teleport-links" aria-label="${measured?'经典消息由 Alice 发给 Bob':'A 与 B 预先共享纠缠'}" role="img"><path class="${measured?'teleport-classical-link':'teleport-entangled-link'}"/><path class="teleport-arrow"/></svg><section class="teleport-person">${cat('Bob',held('B',restored?'已恢复输入态':measured?'等待修正':'共享纠缠的另一半'))}${received?records:''}</section></div>`;
}
// Locate the link endpoints from the actual held qubits at every viewport width.
function teleportConnect(slot,measured){
 const scene=slot.querySelector('.teleport-scene');if(!scene)return;
 const svg=scene.querySelector('.teleport-links'),path=svg.querySelector('path'),arrow=svg.querySelector('.teleport-arrow');
 const update=()=>{
  if(!scene.isConnected){teleportSceneObserver?.disconnect();return;}
  const box=scene.getBoundingClientRect(),a=scene.querySelector('[data-held="A"]').getBoundingClientRect(),b=scene.querySelector('[data-held="B"]').getBoundingClientRect();
  const x1=a.right-box.left,x2=b.left-box.left,y1=a.top+a.height/2-box.top,y2=b.top+b.height/2-box.top;
  svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
  const lift=measured?Math.max(24,box.width*.1):0;
  path.setAttribute('d',`M${x1},${y1} C${x1},${y1-lift} ${x2},${y2-lift} ${x2},${y2}`);
  arrow.setAttribute('d',measured?`M${x2-5},${y2-6} L${x2},${y2} L${x2+3},${y2-7}`:'');
 };
 update();return {scene,update};
}
function teleportCircuit(m){
 const gate=(wire,label,active,extra={})=>({type:'gate',wire,label,active,...extra});
 return entCircuitSVG({
  wires:[{name:'Q',owner:'Alice',input:'|ψ⟩'},{name:'A'},{name:'B',owner:'Bob'}],
  columns:[
   {ops:[{type:'cx',control:0,wire:1,active:m.stage>=1}]},
   {ops:[gate(0,'H',m.stage>=2)]},
   {ops:[{type:'measure',wire:0,active:m.stage>=3},{type:'measure',wire:1,active:m.stage>=3}]},
   {ops:[gate(2,'X',m.gates.includes('X'),{source:1})]},
   {ops:[gate(2,'Z',m.gates.includes('Z'),{source:0})]}
  ],
  output:[m.stage>=3?'a=1':'a',m.stage>=3?'b=1':'b',m.stage===5?'|ψ⟩':''],
  classicalReceived:m.stage>=4,
  title:'传态线路：Q 控制 A 做 CNOT，Q 上做 H，再测量；b 控制 B 上的 X，a 控制 B 上的 Z'
 });
}
function teleportRestored(m){
 if(m.stage!==5)return false;
 const actual=entBloch(entBob(m.preset,m.outcome,m.gates)),target=QB_STATES[m.preset].b;
 return actual.every((value,i)=>Math.abs(value-target[i])<1e-10);
}
COMP.teleportLesson=(slot,p)=>{
 if(S.carry.protocol?.version!==1)S.carry.protocol=teleportModel();
 const m=S.carry.protocol;
 // The preceding question explains these gates; measurement starts after both operations.
 function prepareExample(){
  if(m.stage===0)entAct(m,'next');
  if(m.stage===1)entAct(m,'next');
  if(m.stage===2)entAct(m,'branch','11');
 }
 if(p.kind==='transfer'&&m.stage<3){prepareExample();protocolSave();}
 function draw(focus){
  let html='',ready=false;
  if(p.kind==='resources'){
   html=String.raw`<p>Alice 只有一个处于未知态的量子比特 Q。她不能把 Q 本身送给 Bob，也无法复制或读出它的状态，但两只猫咪已经共享纠缠态：</p><p>$$|\Phi^+\rangle_{AB}=\frac{|00\rangle_{AB}+|11\rangle_{AB}}{\sqrt{2}}$$</p><p>它们还可以互相发送经典消息。</p>`;
   ready=true;
  }else if(p.kind==='derive'){
html=String.raw`<div class="teleport-algebra"><p>测量 Q 的结果记为 a，测量 A 的结果记为 b。</p><p>设输入为 $|\psi\rangle=\alpha|0\rangle+\beta|1\rangle$，其中 $|\alpha|^2+|\beta|^2=1$。按 Q、A、B 的顺序，初态为：</p><p>$$|\psi\rangle_Q\otimes\frac{|00\rangle_{AB}+|11\rangle_{AB}}{\sqrt2}.$$</p><p>以 Q 控制 A 做 CNOT，Q 为 1 时翻转 A。操作后的<strong>完整状态</strong>是：</p><p>$$\begin{aligned}&\frac{\alpha}{\sqrt2}|000\rangle+\frac{\alpha}{\sqrt2}|011\rangle\\&\quad+\frac{\beta}{\sqrt2}|110\rangle+\frac{\beta}{\sqrt2}|101\rangle\end{aligned}.$$</p><p>接着对 Q 做 H。而 $H|0\rangle=(|0\rangle+|1\rangle)/\sqrt2$，$H|1\rangle=(|0\rangle-|1\rangle)/\sqrt2$。因此展开后，完整状态为：</p><p>$$\begin{aligned}&\frac{\alpha}{2}(|000\rangle+|100\rangle)\\&\quad+\frac{\alpha}{2}(|011\rangle+|111\rangle)\\&\quad+\frac{\beta}{2}(|010\rangle-|110\rangle)\\&\quad+\frac{\beta}{2}(|001\rangle-|101\rangle)\end{aligned}.$$</p><p>接下来，试着从完整展开式中找出某个测量结果对应的 Bob 状态。</p></div>`;
   ready=true;
  }else if(p.kind==='transfer'){
   ready=teleportRestored(m);
   html='<p class="teleport-example">本次演示取 <strong>ab=11</strong>：Alice 已测得 a=1、b=1。四种结果各有 1/4 的概率，这里不是随机抽样。</p>';
   html+=teleportScene(m);
   if(m.stage===3){
    html+='<p>Bob 尚未收到结果，不能确定该做什么修正。先把 Alice 的两个经典比特发给他。</p>';
   }else{
    const state=ready?String.raw`\alpha|0\rangle+\beta|1\rangle=|\psi\rangle`:m.gates.length?String.raw`\alpha|0\rangle-\beta|1\rangle`:String.raw`\alpha|1\rangle-\beta|0\rangle`;
    const explanation=ready?'Z 让一态分量变号，恢复了原来的相对符号。Bob 的 B 已恢复完整输入态；Alice 的 Q 已被测量，不再保有原态。':m.gates.length?'X 交换了零态与一态的位置，系数跟随对应分量。现在还差一态分量的符号，再执行 Z。':'Bob 收到 11，知道自己的 B 对应这个状态。先执行 X，交换零态与一态的位置。';
    html+=`<div class="teleport-live-state teleport-algebra" tabindex="-1" role="status"><p><strong>${ready?'已恢复原态':m.gates.length?'执行 X 后':'Bob 收到消息后，对应的状态'}</strong></p><p>$$${state}$$</p><p>${explanation}</p></div>`;
    if(m.stage===4&&!m.gates.length)html+='<p>这一步需要等待经典消息，不能用来超光速传信。Bob 无需知道 α、β 的具体数值。</p>';
   }
   const action=m.stage===3?protocolButton('send','发送经典消息'):m.stage===4?protocolButton(m.gates.length?'z':'x',m.gates.length?'执行 Z':'执行 X'):'';
   html+=`<div class="protocol-actions">${action}<button class="ghost" data-protocol-action="restart">重新开始演示</button></div>`;
   html+=teleportCircuit(m);
  }
  teleportSceneObserver?.disconnect();
  slot.innerHTML=`<section class="protocol-lesson teleport-lesson">${p.kind==='resources'?teleportScene(m):''}${html}</section>`;
  const connection=teleportConnect(slot,m.stage>=3);
  if(connection){teleportSceneObserver=new ResizeObserver(connection.update);teleportSceneObserver.observe(connection.scene);}
  slot.querySelectorAll('[data-protocol-action]').forEach(button=>button.onclick=()=>act(button.dataset.protocolAction));
  typesetMath(slot);S.gateOK=ready;
  go(p.kind==='resources'?'开始传态':p.kind==='transfer'?'进入练习':'继续',ready);hint('');
  if(ready)S.passed[S.i]=true;else delete S.passed[S.i];
  if(focus){
   const target=slot.querySelector(focus)||document.getElementById('go');
   target.focus({preventScroll:true});target.scrollIntoView({block:'nearest'});
  }
 }
 function update(focus){protocolSave();draw(focus);}
 function act(action){
  const from=action==='send'?slot.querySelector('[data-teleport-records]')?.getBoundingClientRect():null;
  if(p.kind!=='transfer')return;
  if(action==='restart'){
   for(const key of Object.keys(m))delete m[key];
   Object.assign(m,teleportModel());prepareExample();protocolInvalidate(S.i);
  }else if(action==='send'&&m.stage===3)entAct(m,'next');
  else if(action==='x'&&m.stage===4&&m.gates.length===0)entAct(m,'X');
  else if(action==='z'&&m.stage===4&&m.gates.length===1)entAct(m,'Z');
  const focus=action==='restart'?'[data-protocol-action="send"]':'.teleport-live-state';
  update(focus);
  if(from&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const records=slot.querySelector('[data-teleport-records]'),to=records.getBoundingClientRect();
   records.animate([{transform:`translate(calc(-50% + ${from.x-to.x}px),${from.y-to.y}px)`},{transform:'translateX(-50%)'}],{duration:650,easing:'ease-in-out'});
  }
 }
 draw();
};
