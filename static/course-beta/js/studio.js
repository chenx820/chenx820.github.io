/* Required-course experiments. Pure models below are also checked outside the browser. */
const STUDIO={sessions:{}};
const studioPct=x=>(100*x).toFixed(Math.abs(x*100-Math.round(x*100))<1e-8?0:1)+'%';
function studioGrover(target,stage){
 let a=[.5,.5,.5,.5];
 for(let step=0;step<stage;step++){
  if(step%2===0)a[target]*=-1;
  else {const mean=a.reduce((x,y)=>x+y,0)/4;a=a.map(x=>2*mean-x);}
 }
 return {amplitudes:a,probabilities:a.map(x=>x*x)};
}
// The same four passwords stay in place throughout the short lesson.
// Only probabilities come from the model; phase marks are explanatory annotations.
function groverLockCards(stage,revealed){
 const probabilities=studioGrover(2,stage).probabilities;
 return `<div class="grover-passwords" role="group" aria-label="四个候选密码">${['00','01','10','11'].map((label,i)=>`<div class="grover-password${stage>0&&i===2?' is-target':''}">
  <strong class="grover-code">${label}</strong><span class="grover-mark">${stage===1&&i===2?'− 相位标记':stage>0&&i===2?'正确密码':'候选密码'}</span>
  <span class="grover-meter" aria-hidden="true"><i style="--probability:${revealed?probabilities[i]*100:0}%"></i></span>
  <span class="grover-probability" aria-label="密码 ${label} 的测量概率 ${revealed?studioPct(probabilities[i]):'待观察'}">${revealed?studioPct(probabilities[i]):'待观察'}</span>
 </div>`).join('')}</div>`;
}
COMP.groverLock=(slot,p)=>{
 const step=S.i,key='grover-lock-'+step;
 let acted=S.carry[key]===true;
 let prediction=Number.isInteger(S.answers[step])&&S.answers[step]>=0&&S.answers[step]<p.o?.length?S.answers[step]:null;
 // Never restore an action without the prediction that was required to unlock it.
 if(p.o&&prediction===null)acted=false;
 function persist(){
  S.carry={...S.carry,[key]:acted};
  S.carrySnapshots[step]={...S.carry};
  rememberStep();
 }
 function draw(focus){
  const answered=prediction!==null,finished=p.action?acted:answered;
  const stage=acted?p.nextStage:p.stage;
  const revealed=p.phase!=='task'&&(p.phase!=='prepare'||answered);
  const caption=p.phase==='task'?'四选一教学模型':p.phase==='recap'?'回顾：一轮标记＋放大后的理论概率':!revealed?'先作预测，再查看概率':stage===0?'均匀准备后的理论概率':stage===1?'标记后的理论概率':stage===2?'一轮标记＋放大后的理论概率':'两轮标记＋放大后的理论概率';
  slot.innerHTML=`<section class="grover-lock" aria-label="密码锁实验">
   ${p.before&&!finished?`<p class="grover-context">${p.before}</p>`:''}
   <p class="grover-caption">${caption}</p>
   ${groverLockCards(stage,revealed)}
   ${p.o?`<div class="grover-prediction" role="group" aria-label="${p.phase==='recap'?'选择你的理解':'选择你的预测'}">${p.o.map((option,i)=>`<button type="button" class="ghost" data-grover-predict="${i}" aria-pressed="${prediction===i}"${answered?' disabled':''}>${option}</button>`).join('')}</div>`:''}
   <div class="grover-actions">${p.action?`<button type="button" class="primary" data-grover-action${acted||(p.o&&!answered)?' disabled':''}>${acted?'已完成'+p.action:p.action}</button>`:''}${finished?'<button type="button" class="ghost" data-grover-reset>重试本步</button>':''}</div>
   <div class="grover-result" role="status" tabindex="-1">${finished?`${p.o?`<strong>${prediction===p.a?'与你的判断一致。':'看看实验告诉了我们什么。'}</strong>`:''}<p>${p.after}</p>`:p.action&&answered?'<p>预测已记录。点击“再做一轮”查看结果。</p>':''}</div>
   ${p.detail&&(finished||p.phase==='task')?`<p class="grover-detail">${p.detail}</p>`:''}
  </section>`;
  const ready=p.phase==='task'||finished;
  S.gateOK=ready;
  if(ready)S.passed[step]=true;else delete S.passed[step];
  const lastPage=S.i>=S.lesson.pages.length-1,completesCourse=p.phase==='recap'&&lastPage&&!courseIsComplete()&&allIds().every(id=>id===S.lesson.id||S.done[id]);
  go(p.phase==='task'?'开始实验':p.phase==='recap'&&lastPage?(completesCourse?'完成学习，查看旅程':'进入下一章'):'继续',ready);
  hint(ready?'':p.o&&!answered?'先选一个想法，猜错也没关系。':`点击“${p.action}”，观察变化。`);
  slot.querySelectorAll('[data-grover-predict]').forEach(button=>button.onclick=()=>{
   prediction=Number(button.dataset.groverPredict);S.answers[step]=prediction;
   persist();draw(p.action?'[data-grover-action]':'.grover-result');
  });
  slot.querySelector('[data-grover-action]')?.addEventListener('click',()=>{acted=true;persist();draw('.grover-result');});
  slot.querySelector('[data-grover-reset]')?.addEventListener('click',()=>{
   acted=false;prediction=null;delete S.answers[step];persist();draw(p.o?'[data-grover-predict]':'[data-grover-action]');
  });
  if(focus)slot.querySelector(focus)?.focus({preventScroll:true});
 }
 draw();
};
function studioPair(preparation,basis='Z',alice='Z'){
 const starts=preparation==='mixed'?[[1,0,0,0],[0,0,0,1]]:preparation==='bell'?[[Math.SQRT1_2,0,0,Math.SQRT1_2]]:[[.5,.5,.5,.5]];
 return starts.reduce((out,a)=>{
  let state=a.map(re=>({re,im:0}));
  if(alice==='X'||basis==='X')state=ap2(state,'H0');
  if(basis==='X')state=ap2(state,'H1');
  return out.map((v,i)=>v+(state[i].re**2+state[i].im**2)/starts.length);
 },[0,0,0,0]);
}
function studioSyndrome(mask){
 const bits=[(mask>>2)&1,(mask>>1)&1,mask&1],syndrome=[bits[0]^bits[1],bits[1]^bits[2]];
 const correction={'00':0,'10':4,'11':2,'01':1}[syndrome.join('')];
 return {bits,syndrome,correction,residual:mask^correction};
}
function studioLogicalError(p,n){
 let sum=0;
 for(let k=(n+1)/2;k<=n;k++){
  let choose=1;for(let j=1;j<=k;j++)choose*=((n-j+1)/j);
  sum+=choose*p**k*(1-p)**(n-k);
 }
 return sum;
}
function studioPulse(angle){return Math.sin(angle*Math.PI/360)**2;}
function studioSingle(prep,analysis){
 if(prep==='mixed')return [.5,.5];
 let seq=prep==='one'?['X']:prep==='plus'?['H']:prep==='minus'?['H','Z']:[];
 if(analysis==='H')seq.push('H');
 return labProbabilities(1,seq);
}
function studioBars(labels,values,counts){
 return `<div class="studio-bars" role="group" aria-label="${counts?'理论概率与模拟计数':'理论概率'}">${labels.map((l,i)=>`<div class="studio-bar"><span>${l}</span><span class="studio-meter"><i style="--probability:${100*values[i]}%"></i></span><strong>${studioPct(values[i])}</strong>${counts?`<small>${counts[i]} 次</small>`:''}</div>`).join('')}</div>`;
}
const STUDIO_CONTROLS={
 cnot:[['input','输入状态',[['00','00'],['01','01'],['10','10'],['11','11']]]],
 single:[['prep','准备方式',[['zero','准备 0'],['one','准备 1'],['plus','同相叠加'],['minus','反相叠加'],['mixed','随机准备 0 或 1']]],['analysis','读出之前',[['none','直接测量'],['H','先 H 再测量']]],['shots','重复次数',[[1,'1 次'],[32,'32 次'],[512,'512 次']]]],
 pair:[['prep','准备方式',[['independent','两个独立叠加态'],['bell','贝尔态'],['mixed','随机准备 00 或 11']]],['basis','双方测量设置',[['Z','Z：直接测量'],['X','X：各加 H 再测量']]]],
 signal:[['alice','A 的测量设置',[['Z','A 直接测量'],['X','A 先 H 再测量']]]],
 pulse:[['angle','控制脉冲：理想旋转角度',[[0,'不加脉冲'],[90,'半程脉冲'],[180,'完整翻转'],[360,'双倍脉冲']]]],
 readout:[['state','准备的状态',[[0,'状态 0'],[1,'状态 1']]],['quality','读出条件',[['clear','较易区分'],['overlap','较难区分']]]],
 array:[['layout','原子位置',[['holes','有空位'],['filled','重排补齐']]],['internal','内部状态',[[0,'准备 0'],[1,'准备 1']]]],
 blockade:[['first','第一个原子',[['ground','未激发'],['rydberg','里德堡激发']]],['distance','相互作用条件',[['near','强相互作用'],['far','弱相互作用']]]],
 loss:[['logical','编码状态',[[0,'逻辑 0'],[1,'逻辑 1']]],['efficiency','探测到的概率',[[1,'100%'],[.8,'80%'],[.4,'40%']]]],
 syndrome:[['mask','选择翻转错误的位置',[[0,'无错误'],[4,'第 1 位'],[2,'第 2 位'],[1,'第 3 位'],[3,'第 2、3 位']]]],
 protection:[['p','每位独立翻转概率',[[.01,'1%'],[.1,'10%'],[.4,'40%'],[.6,'60%']]],['n','编码使用的位数',[[1,'1 位'],[3,'3 位'],[5,'5 位']]]],
 grover:[['target','演示中的目标',[[0,'00'],[1,'01'],[2,'10'],[3,'11']]],['stage','算法步骤',[[0,'均匀准备'],[1,'只做标记'],[2,'一次放大'],[4,'再做一轮']]]],
 compile:[['input','输入准备',[['zero','00'],['one','10'],['bell','q0 先做 H']]]]
};
function studioView(kind,m,p){
 let html='',probs=null,labels=['0','1'],note='',caption='理想模型的理论概率';
 if(kind==='single'){
  probs=studioSingle(m.prep,m.analysis);
  html=`<p class="experiment-context">${m.analysis==='H'?'准备后施加 H，再测量。':'准备后直接测量。'}每次采样都重新准备同一个初态。</p>`;
  note=m.prep==='mixed'?'每次随机准备确定的 0 或 1。即使先做 H，整体统计仍是各半。':m.prep==='zero'||m.prep==='one'?'直接测量可以区分准备好的 0 和 1；加上 H 后，两种结果的概率都变为各半。':'同相与反相叠加直接测量都是各半；先做 H 后，两者可产生不同结果。测量设置同样参与决定结果。';
 }else if(kind==='cnot'){
  const control=Number(m.input[0]),target=Number(m.input[1]),output=`${control}${target^control}`;
  const preparation=[...(control?['X0']:[]),...(target?['X1']:[])];
  html=`<div class="qb-state-flow" aria-label="输入 ${m.input}，经过 CNOT，输出 ${output}"><span>输入<br><strong>|${m.input}⟩</strong></span><span>→ CNOT →</span><span>输出<br><strong>|${output}⟩</strong></span></div>${labCircuit({n:2,seq:[...preparation,'CNOT'],static:true})}<p class="cap">从 |00⟩ 出发，用 X 门准备所选输入，再执行 CNOT。</p>`;
  note=`左边是控制位 q0，右边是目标位 q1。控制位为 ${control}，所以目标位${control?'从 '+target+' 翻转为 '+(target^control):'保持 '+target+' 不变'}；控制位本身不变。`;
 }else if(kind==='pair'||kind==='signal'){
  probs=studioPair(kind==='signal'?'bell':m.prep,kind==='signal'?'Z':m.basis,kind==='signal'?m.alice:'Z');labels=['00','01','10','11'];
  const b0=probs[0]+probs[2];
  html=`<p class="studio-callout">B 独自看到：0 为 ${studioPct(b0)}，1 为 ${studioPct(1-b0)}。</p>`;
  note=kind==='signal'?'两人的联合统计会改变，但 B 的本地分布仍然各半。只有交换记录后，才能比较关联；A 不能靠选择测量设置把消息写进 B 的本地统计。':'随机准备 00 或 11 与贝尔态在 Z 设置下相同；在双方 X 设置下，这两个特定准备会表现不同。这是对已知候选准备的比较，不是任意未知态的通用认证。';
 }else if(kind==='pulse'){
  const v=studioPulse(m.angle);
  const superposed=v>1e-8&&v<1-1e-8;
  const state=superposed?'α|0⟩ + β|1⟩':v>.5?'|1⟩':'|0⟩';
  html=`<svg viewBox="0 0 360 165" class="studio-svg" role="img" aria-label="两个基态的能级示意：下方为基态 0，上方为基态 1；控制脉冲耦合两个基态，不表示脉冲后的量子态"><path d="M70 125H280M70 35H280" stroke="currentColor" stroke-width="0.5"/><path d="M175 110V50m-5 8 5-8 5 8M175 110l-5-8m5 8 5-8" stroke="var(--course-accent-11)" stroke-width="0.5" fill="none"/><text x="12" y="130">|0⟩</text><text x="12" y="40">|1⟩</text><text x="195" y="85">控制脉冲</text></svg><p class="cap">两条线表示两个基态的能级，叠加态不是它们之间的第三个能级。</p><p class="studio-callout">脉冲后的状态：${state}</p><p class="experiment-context">${superposed?'α、β 是两个基态分量的概率幅。半程脉冲后，两者的大小均为 1/√2；相对相位由控制脉冲决定。':'此时处于 '+(v>.5?'|1⟩':'|0⟩')+'。'}</p>`;
  note=(p.route==='ion'?'离子内部态可由合适的激光或微波操控。':'超导电路可由合适的微波信号操控。')+'这里从 |0⟩ 开始，使用理想两能级旋转模型，状态表示省略整体相位。此模型没有使用真实设备脉冲参数。';
 }else if(kind==='readout'){
  const error=m.quality==='clear'?.04:.25;probs=m.state?[error,1-error]:[1-error,error];
  const ion=p.route==='ion';
  html=`<div class="studio-detector"><span>${ion?'收集荧光':'测量读出信号'}</span><strong>${ion?(m.state?'较亮':'较暗'):(m.state?'信号区域 B':'信号区域 A')}</strong><small>${m.quality==='clear'?'两类信号较容易区分':'两类信号有更多重叠'}</small></div>`;
  caption='模型中的记录概率';note=(ion?'在此示例中用亮／暗区分两种内部态。':'在此示例中通过与读出装置耦合产生的信号区分两种状态。')+'设定的 4%／25% 误判概率仅用于教学，并非设备指标；一次记录仍可能记错。';
 }else if(kind==='array'){
  html=`<div class="studio-array" aria-label="六个光镊位置">${[0,1,2,3,4,5].map(i=>`<span class="${m.layout==='holes'&&[1,4].includes(i)?'empty':''}">${m.layout==='holes'&&[1,4].includes(i)?'空位':m.internal}</span>`).join('')}</div>`;
  note='重排改变原子占据的位置，内部态准备改变已有原子承载的逻辑状态。这里“补齐”表示从未画出的储备位置移入原子，不是凭空产生原子；数字不是直接成像读出的未知态。';
 }else if(kind==='blockade'){
  const blocked=m.first==='rydberg'&&m.distance==='near';
  html=`<svg viewBox="0 0 420 230" class="studio-svg" role="img" aria-label="${blocked?'原子 A 激发后，B 的激发能量发生偏移，同一激光难以激发 B':'B 的目标能级与激光匹配，未出现本例的阻塞'}"><circle cx="65" cy="108" r="${m.first==='rydberg'?30:13}" fill="var(--course-accent-9)" stroke="currentColor" stroke-width="0.5"/><text x="65" y="168" text-anchor="middle">原子 A</text><path d="M220 180H365M220 ${blocked?35:85}H365" stroke="currentColor" stroke-width="0.5"/><path d="M220 85H365" stroke="var(--course-neutral-9)" stroke-dasharray="5 5"/><path d="M290 168V94m0 0-6 10m6-10 6 10" stroke="var(--course-accent-11)" stroke-width="0.5" fill="none"/><text x="290" y="211" text-anchor="middle">原子 B</text><text x="205" y="78" text-anchor="end">激光匹配位置</text>${blocked?'<path d="M375 80V40m0 0-5 8m5-8 5 8" stroke="var(--red-11)" stroke-width="0.5"/><text x="290" y="23" text-anchor="middle">能量偏移</text>':''}</svg><p class="experiment-context">${blocked?'A 的里德堡激发使 B 的激发条件偏离激光，第二次激发受到抑制。':'B 的激发仍与激光匹配，没有受到本例的阻塞。'}</p>`;
  note='里德堡态之间的强相互作用会改变双激发的能量条件，使同样的激光不再容易激发第二个原子。这是理想化阻塞示意；利用它实现门还需要完整控制序列，相互作用也不是由一个距离开关突然出现。';
 }else if(kind==='loss'){
  probs=m.logical?[0,m.efficiency,1-m.efficiency]:[m.efficiency,0,1-m.efficiency];labels=['记录 0','记录 1','未探测到'];caption='探测概率（教学模型）';
  html='';
  note=p.route==='atom'?'本简化模型把“未探测到”独立列出，可能来自丢失或探测失败。具体读出协议还需区分内部态与占据情况；空位不能不加判断就记成逻辑 0。':'即使准备的是逻辑 1，探测器也可能没有响应。没有响应并不表示读出了 0；这里合并了传播损失和探测失败，不模拟所有光子噪声。';
 }else if(kind==='syndrome'){
  const x=studioSyndrome(m.mask);
  html=`<div class="studio-array three">${x.bits.map((e,i)=>`<span class="${e?'error':''}">第 ${i+1} 位<br>${e?'有翻转':'无翻转'}</span>`).join('')}</div><p class="experiment-context">第 1、2 位${x.syndrome[0]?'不同':'相同'}；第 2、3 位${x.syndrome[1]?'不同':'相同'}。<br>${x.correction?'假设最多一位出错，因此尝试纠正第 '+(x.correction===4?1:x.correction===2?2:3)+' 位。':'没有检测到差异，不作纠正。'}</p><p class="studio-callout">${x.residual?'本次恢复失败：多个错误可伪装成另一个单错。':'本例恢复成功。'}</p>`;
  note='图中显示人为注入的错误位置，而不是读出未知的逻辑答案。比较结果是错误信息；在量子版本中通过辅助比特提取这类信息。此模型只处理比特翻转，不能保护任意相位错误；编码也不是复制未知量子态。';
 }else if(kind==='protection'){
  probs=[m.p,studioLogicalError(m.p,m.n)];labels=['单个物理位错误','编码后逻辑错误'];
  html=`<p class="studio-callout">用 ${m.n} 个物理位保护 1 个逻辑位。</p>`;
  note='这个演示只考虑各个比特独立发生的翻转错误，并假设编码和纠错过程不会出错。我们按多数表决计算恢复结果：单个比特的翻转概率低于 50% 时，多用几个比特才有帮助。这个 50% 只属于当前模型。真实量子纠错还要应对相位错误、多个比特一起出错，以及纠错操作自身的错误；要实现容错计算，还需要反复纠错，并可靠地执行逻辑门。';
 }else if(kind==='grover'){
  const g=studioGrover(m.target,m.stage);probs=g.probabilities;labels=['00','01','10','11'];
  html=`<div class="studio-amplitudes">${g.amplitudes.map((a,i)=>`<div><span>${labels[i]}${i===m.target?'（目标）':''}</span><strong>${a>0?'+':''}${a.toFixed(2)}</strong><span class="studio-signed ${a<0?'negative':''}" style="--size:${Math.abs(a)*100}%"></span></div>`).join('')}</div><p class="cap">带方向的概率幅：正负表示相对相位；下方概率是其平方。</p>`;
  note='这里用四个候选密码、一个正确密码演示理想 Grover 算法。你选择的密码用于设置标记操作；图中的“目标”标签方便你观察结果。只做标记时，概率不变；再通过干涉，正确密码的概率才可能提高。';
 }else if(kind==='compile'){
   const prefix=m.input==='one'?['X0']:m.input==='bell'?['H0']:[];
   const before=labProbabilities(2,[...prefix,'CNOT']),after=labProbabilities(2,[...prefix,'H1','CZ','H1']);
   const preparation=m.input==='one'?'从 10 开始':m.input==='bell'?'从 00 开始，先对 q0 做 H':'从 00 开始';
   html=`<p class="compile-context">${preparation}，再分别执行 CNOT 与 H → CZ → H。</p><table class="compile-probabilities"><caption>理想输出概率（按 q0、q1 排列）</caption><thead><tr><th scope="col">测量结果</th><th scope="col">CNOT</th><th scope="col">H → CZ → H</th></tr></thead><tbody>${['00','01','10','11'].map((label,i)=>`<tr${before[i]>1e-12?' class="has-probability"':''}><th scope="row">${label}</th><td>${studioPct(before[i])}</td><td>${studioPct(after[i])}</td></tr>`).join('')}</tbody></table>`;
   note='这些输入帮助我们观察结果；所有输入都等价，需要数学推导来保证。';
 }
 if(p.note)note=p.note;
 if(probs)html+=`<p class="studio-label">${caption}</p>${studioBars(labels,probs,m.counts)}`;
 return {html,note,probs};
}
COMP.studio=(slot,p)=>{
 const key=S.lesson.id+':'+(p.key||S.i),controls=p.controls||STUDIO_CONTROLS[p.kind];
 const defaults=Object.fromEntries(controls.map(([id,,options])=>[id,options[0][0]]));
 const m=STUDIO.sessions[key]||(STUDIO.sessions[key]={...defaults,...p.initial,visited:[],observed:[],runs:0,counts:null});
 const remember=()=>{const signature=JSON.stringify(controls.map(([id])=>m[id]));if(!m.visited.includes(signature))m.visited.push(signature);m.observed.push(Object.fromEntries(controls.map(([id])=>[id,m[id]])));};
 function draw(){
  const view=studioView(p.kind,m,p),canSample=view.probs&&p.kind!=='protection'&&p.sample!==false;
  slot.innerHTML=`<section class="studio${p.kind==='compile'?' studio-compile':''}" aria-label="互动实验"><div class="studio-controls">${controls.map(([id,label,options])=>p.buttons?`<fieldset class="studio-options"><legend>${label}</legend>${options.map(([v,text])=>`<button type="button" data-choice="${id}" data-value="${v}" aria-pressed="${m[id]===v}">${text}</button>`).join('')}</fieldset>`:`<label class="studio-setting"><span>${label}</span><select data-control="${id}" aria-label="${label}">${options.map(([v,text])=>`<option value="${v}"${m[id]===v?' selected':''}>${text}</option>`).join('')}</select></label>`).join('')}</div><div class="studio-output" aria-live="polite">${view.html}<p class="studio-note">${view.note}</p></div>${canSample?`<button type="button" class="secondary" data-studio-run>重新准备并模拟 ${m.shots||128} 次</button><p class="cap">${m.counts?'改变条件后需重新采样。':'计数来自模拟采样。'}</p>`:''}</section>`;
  slot.querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>{
   const id=button.dataset.choice,options=controls.find(c=>c[0]===id)[2];
   m[id]=options.find(([v])=>String(v)===button.dataset.value)[0];
   m.counts=null;remember();draw();
   slot.querySelector(`[data-choice="${id}"][data-value="${button.dataset.value}"]`)?.focus({preventScroll:true});
  });
  slot.querySelectorAll('[data-control]').forEach(control=>control.onchange=()=>{
   const id=control.dataset.control,options=controls.find(c=>c[0]===id)[2];
   m[id]=options.find(([v])=>String(v)===control.value)[0];
   m.counts=null;remember();draw();
   slot.querySelector(`[data-control="${id}"]`)?.focus({preventScroll:true});
  });
  slot.querySelector('[data-studio-run]')?.addEventListener('click',()=>{m.counts=labSample(view.probs,m.shots||128);m.runs++;remember();draw();slot.querySelector('[data-studio-run]')?.focus({preventScroll:true});});
  typesetMath(slot);
  slot.querySelectorAll('.lab-node').forEach(b=>b.disabled=true);
  const observed=(p.observe||[]).filter(rule=>m.observed.some(state=>Object.entries(rule).every(([k,v])=>state[k]===v))).length;
  const ready=(!p.sample||m.runs>0)&&observed===(p.observe||[]).length&&m.visited.length>=(p.minSettings||0);
  if(!ready){
   const remaining=[];
   if(m.visited.length<(p.minSettings||0))remaining.push('请查看至少 '+p.minSettings+' 种设置');
   if(p.observe&&observed<p.observe.length)remaining.push(`已查看 ${observed} / ${p.observe.length} 种设置`);
   if(p.sample&&!m.runs)remaining.push('请运行一次模拟');
   hint(remaining.join('；')+'。');
  }
  if(ready)pass(p.pm||'');
 }
 remember();draw();
};
ART.compileDevices=()=>`<section class="studio-compile compile-devices" aria-label="两种设备实现同一个 CNOT"><p class="compile-context">我们要完成的操作：用 q0 控制，对 q1 做 CNOT。</p><div class="compile-circuits"><div><h3>设备支持 CNOT</h3><div class="lab-circuit compile-fatqat"><img src="assets/circuits/fatqat-cnot.svg" alt="FatQat 线路图：上方 q0 为控制位，下方 q1 为目标位，执行一个 CNOT。"></div><p>直接执行 1 个 CNOT。</p></div><div><h3>设备支持 H 和 CZ</h3><div class="lab-circuit compile-fatqat"><img src="assets/circuits/fatqat-h-cz-h.svg" alt="FatQat 线路图：在下方 q1 上执行 H，然后在 q0、q1 之间执行 CZ，最后在 q1 上执行 H。"></div><p>在 q1 上先做 H，再做 CZ，最后再在 q1 上做 H。</p></div></div></section>`;
// Existing real-device photos keep their source captions.
ART.hardwareRoute=p=>ROUTE_ART[p.route]();
