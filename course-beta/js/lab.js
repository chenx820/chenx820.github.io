/* 编程与实践：线路、代码和采样共用实验状态；不执行 Python 或提交硬件任务。 */
const LAB={sessions:{},latest:{}};
const labEscape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function labProbabilities(n,seq){
  let state=n===2?st2():[{re:1,im:0},{re:0,im:0}];
  for(const gate of seq)state=n===2?ap2(state,gate):ap1(G1[gate],state);
  const values=state.map(z=>z.re*z.re+z.im*z.im).map(v=>v<1e-14?0:v);
  const total=values.reduce((a,b)=>a+b,0);
  return values.map(v=>v/total);
}
function labDistribution(n,seq,noisy=false){
  const ideal=labProbabilities(n,seq);
  // A deliberately narrow readout model: flip each recorded bit independently with p=0.05.
  if(!noisy)return ideal;
  return ideal.map((_,out)=>ideal.reduce((sum,prob,input)=>{
    let weight=1;
    for(let bit=0;bit<n;bit++)weight*=((input^out)&(1<<bit))?0.05:0.95;
    return sum+prob*weight;
  },0));
}
function labSample(distribution,shots,random=Math.random){
  const counts=distribution.map(()=>0);
  for(let k=0;k<shots;k++){
    const u=random();let sum=0,index=distribution.length-1;
    for(let j=0;j<distribution.length;j++){sum+=distribution[j];if(u<sum){index=j;break;}}
    counts[index]++;
  }
  return counts;
}
function labLabels(n){return Array.from({length:2**n},(_,i)=>i.toString(2).padStart(n,'0'));}
function labCounts(n,counts){return '{'+labLabels(n).flatMap((label,i)=>counts[i]?[`'${label}': ${counts[i]}`]:[]).join(', ')+'}';}
function labCodeRows(model){
  const rows=[['prepare','import fatqat as fq'],['prepare','import fatqat.operations as ops'],['prepare',''],['prepare',`program = fq.Program(${model.n}, ${model.n})`]];
  model.seq.forEach(g=>{
    const command=g==='CNOT'?'ops.CX, (0, 1)':g==='CZ'?'ops.CZ, (0, 1)':`ops.${model.n===2?g.slice(0,-1):g}, ${model.n===2?g.slice(-1):0}`;
    rows.push(['gates',`program.add(${command})`]);
  });
  if(model.measured){
    rows.push(['measure','program.measure_all()'],['execute',''],['execute','backend = fq.simulator.Simulator()'],['execute',`job = backend.run(program, shots=${model.shots})`],['result','result = job.result()'],['result','counts = result.get_counts()'],['result','print(counts)']);
  }
  return rows;
}
function labCode(model){return labCodeRows(model).map(row=>row[1]).join('\n');}
function labLinkedCode(model,active){
  const lines=labCodeRows(model).map(([part,line])=>`<span data-code-part="${part}" class="${line&&part===active?'is-selected':''}">${labEscape(line)}</span>`).join('\n');
  return codeBlock(labCode(model)).replace(/<code>[\s\S]*?<\/code>/,`<code class="lab-linked-code">${lines}</code>`);
}
function labCircuit(model,active=''){
  const step=48,start=98,row=58,top=28;
  const end=start+step*model.seq.length+(model.measured?step:0)+12;
  const width=end+(model.measured?42:8),height=top*2+(model.n-1)*row;
  const line=(x1,y1,x2,y2,cls='')=>`<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const symbol=content=>`<svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">${content}</svg>`;
  const control=symbol('<circle cx="18" cy="18" r="4" fill="currentColor"/>');
  const target=symbol('<circle cx="18" cy="18" r="11" fill="var(--circuit-gate)" stroke="currentColor" stroke-width="1.4"/><path d="M18 7v22M7 18h22" stroke="currentColor" stroke-width="1.4"/>');
  const meter=symbol('<rect x="2" y="2" width="32" height="32" rx="7" fill="var(--circuit-measure)" stroke="currentColor" stroke-width="1.2"/><path d="M8 26a10 10 0 0 1 20 0M18 26l4.9-11.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M25 10 20.5 13.75 25.3 15.85Z" fill="currentColor"/>');
  const node=(part,content,label,x,y,kind='gate')=>{
    const tag=model.static?'span':'button';
    return `<${tag}${model.static?'':' type="button"'} class="lab-node lab-symbol lab-symbol-${kind}${part==='prepare'?' lab-initial':''}${kind==='meter'?' lab-meter':''}${active===part?' is-selected':''}"${model.static?'':` data-part="${part}"`} aria-label="${labEscape(label)}" style="--node-x:${x-20}px;--node-y:${y-20}px">${content}</${tag}>`;
  };
  let wires='',nodes='';
  for(let q=0;q<model.n;q++){
    const y=top+q*row,mx=start+step*model.seq.length;
    wires+=line(76,y,model.measured?mx:end,y);
    if(model.measured)wires+=line(mx,y-2,end,y-2,'lab-classical-wire')+line(mx,y+2,end,y+2,'lab-classical-wire');
    nodes+=`<span class="lab-qubit-label" style="--label-y:${y-12}px">q<sub>${q}</sub></span>`;
    if(!model.abstract)nodes+=node('prepare',labEscape(model.initialLabel||'|0⟩'),`初态：q${q}，${model.initialLabel||'|0⟩'}`,55,y,'initial');
    model.seq.forEach((g,i)=>{
      const pair=g==='CNOT'||g==='CZ',x=start+i*step;
      if(pair){
        if(q===0)wires+=line(x,y,x,top+row,'lab-control-wire');
        nodes+=node('gates',q===0||g==='CZ'?control:target,`${g} 门，q${q} ${q===0?'控制位':g==='CNOT'?'目标位':'相位作用位'}`,x,y,'control');
      }else if(model.n===1||+g.slice(-1)===q){
        nodes+=node('gates',labEscape(model.n===1?g:g.slice(0,-1)),`${g} 门，q${q}`,x,y);
      }
    });
    if(model.measured){
      nodes+=node('measure',meter,`测量 q${q}，保存到 c${q}`,mx,y,'meter');
      nodes+=`<span class="lab-classical-label" style="--label-x:${end+5}px;--label-y:${y-12}px">c<sub>${q}</sub></span>`;
    }
  }
  return `<div class="lab-circuit" role="group" aria-label="线路图，按时间从左到右执行"><div class="lab-canvas" style="--circuit-width:${width}px;--circuit-height:${height}px"><svg class="lab-connections" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true">${wires}</svg>${nodes}</div></div>`;
}
const LAB_PARTS=[['prepare','准备'],['gates','加门'],['measure','测量'],['execute','执行'],['result','读计数']];
function labExplanation(part,model){
  return {
    prepare:`import 把工具导入，as 给它一个简写。Program(${model.n}, ${model.n}) 建立 ${model.n} 个量子比特和 ${model.n} 个经典位；经典位保存测量得到的 0 或 1。编号从 0 开始。`,
    gates:'program.add 把一个门加入线路。逗号后面指定它作用在哪个比特；代码从上往下，线路从左往右。'+(model.n===2?'CNOT 在 FatQat 中写作 CX，(0, 1) 表示 q0 控制、q1 为目标。':''),
    measure:'measure_all() 测量全部量子比特，并把结果保存到经典位。',
    execute:'backend 选择理想模拟器。run 执行线路，shots 是重复次数；每次都重新从初态准备，再加门、测量。job 是这次执行返回的任务对象。',
    result:'job.result() 取回结果，get_counts() 读取计数字典，print 显示它。例如「\'0\': 49」表示测到 0 共 49 次。所有计数之和等于 shots；未出现的结果可以省略。'
  }[part];
}
function labResults(model,showCounts=false){
  const ideal=labDistribution(model.n,model.seq),noisy=labDistribution(model.n,model.seq,true),labels=labLabels(model.n);
  const runs=model.runs;
  const column=(run,i)=>run?`${run.counts[i]} <small>(${(100*run.counts[i]/run.shots).toFixed(1)}%)</small>`:'—';
  return `<div class="lab-result-wrap"><table class="lab-results"><caption>理论概率与演示计数${model.compare?'，同一线路、相同次数':''}</caption><thead><tr><th scope="col">结果</th><th scope="col">理想概率</th>${model.compare?'<th scope="col">含噪概率</th>':''}<th scope="col">理想采样</th>${model.compare?'<th scope="col">含噪采样</th>':''}</tr></thead><tbody>${labels.map((l,i)=>`<tr><th scope="row">${l}</th><td>${(ideal[i]*100).toFixed(ideal[i]===0||ideal[i]===1?0:1)}%</td>${model.compare?`<td>${(noisy[i]*100).toFixed(2)}%</td>`:''}<td>${column(runs.ideal,i)}</td>${model.compare?`<td>${column(runs.noisy,i)}</td>`:''}</tr>`).join('')}</tbody></table></div>${runs.ideal?`<p class="lab-run-caption">本次理想采样：${runs.ideal.shots} 次。${model.compare?`含噪采样：${runs.noisy.shots} 次。`:''}</p>${showCounts?`<div class="lab-output"><span>模拟结果：每种测量结果出现的次数</span><code>${labCounts(model.n,runs.ideal.counts)}</code></div>`:''}`:'<p class="cap">采样后显示计数。</p>'}`;
}
function labCompactOutput(model,empty='尚未采样。'){
  const run=model.runs.ideal;
  return run?`<div class="lab-output" aria-live="polite"><span>本次 ${run.shots} 次采样</span><code>${labCounts(model.n,run.counts)}</code></div><div class="lab-count-bars" aria-label="采样计数">${labLabels(model.n).map((label,i)=>`<div class="lab-count-row"><span>${label}</span><span class="lab-count-track" aria-hidden="true"><span style="--frequency:${100*run.counts[i]/run.shots}%"></span></span><span>${run.counts[i]} 次</span></div>`).join('')}</div>`:`<p class="lab-empty" role="status">${labEscape(empty)}</p>`;
}
// One teaching page per stage; previous circuit elements remain as context.
function labCodeStage(model,p){
  const part=p.codeStage;
  const code=labCodeRows(model).filter(([id,line])=>(id===part||(part==='execute'&&id==='result'))&&line).map(([,line])=>line).join('\n');
  const sampling=part==='execute'?`<div class="lab-sampling"><label>重复次数 <select aria-label="重复次数">${[8,100,1000].map(n=>`<option value="${n}"${model.shots===n?' selected':''}>${n} 次</option>`).join('')}</select></label><button class="primary" type="button" data-action="run">采样当前线路</button></div>`:'';
  const output=part==='execute'?`<div class="lab-stage-output">${labCompactOutput(model,'尚未采样。')}</div>`:'';
  const explanation=part==='execute'?'':labExplanation(part,model);
  return `<section class="lab lab-guided lab-stage" data-stage="${part}" aria-label="FatQat 分步实验"><div class="lab-stage-circuit">${labCircuit(model,part)}</div><section class="lab-code-step is-selected" data-step="${part}" data-code-copy-scope><div class="lab-step-pair"><div class="lab-code-container">${codeToolbar('复制本段代码')}<button type="button" class="lab-code-fragment" data-part="${part}" data-code-part="${part}" aria-label="查看本页代码对应关系" aria-pressed="true"><code>${labEscape(code)}</code></button></div><div class="lab-step-demo"><p class="lab-step-explanation">${explanation}</p></div></div></section>${sampling}${output}${part==='execute'?`<details class="lab-full-code"><summary>查看与复制完整 Python 代码</summary>${codeBlock(labCode(model))}</details><details class="lab-probability-details"><summary>查看理论概率与采样对照</summary>${labResults(model)}</details>`:''}</section>`;
}
// Pair short code fragments with their explanations and live experiment controls.
function labGuidedExperiment(model,p){
  if(p.codeStage)return labCodeStage(model,p);
  const explanations={
    prepare:`导入工具，创建 ${model.n} 个量子比特和 ${model.n} 个经典位。量子比特从 |0⟩ 开始；经典位保存测量结果。`,
    gates:'add 添加量子门，逗号后是比特编号。代码从上往下，线路从左往右。',
    measure:'测量全部量子比特，把得到的 0 或 1 保存到经典位。',
    execute:'选择模拟器，再重复执行线路。shots 是重复次数；每次都重新准备初态。',
    result:'取回结果，读取并显示计数。例如「\'0\': 49」表示测到 0 共 49 次。'
  };
  const controls=p.edit?`<div class="lab-controls" role="group" aria-label="编辑线路">${p.gates.map(g=>`<button class="chip" type="button" data-gate="${g}"${model.seq.length>=6?' disabled':''}>${g}</button>`).join('')}<button class="chip" type="button" data-action="undo"${!model.seq.length?' disabled':''}>撤销上一步</button><button class="chip" type="button" data-action="clear">清空线路</button></div>`:'';
  const run=model.runs.ideal;
  const output=labCompactOutput(model);
  const visuals={
    prepare:labCircuit({...model,seq:[],measured:false},model.part),
    gates:labCircuit({...model,measured:false},model.part)+controls,
    measure:labCircuit(model,model.part),
    execute:`<div class="lab-sampling"><label>重复次数 <select aria-label="重复次数">${[8,100,1000].map(n=>`<option value="${n}"${model.shots===n?' selected':''}>${n} 次</option>`).join('')}</select></label><button class="primary" type="button" data-action="run"${!model.measured?' disabled':''}>采样当前线路</button></div><p class="lab-run-status" role="status">${run?'采样完成，计数见下一段。':'尚未采样。'}</p>`,
    result:output
  };
  const titles={prepare:'准备比特',gates:'添加量子门',measure:'测量',execute:'重复采样',result:'读取计数'};
  const rows=labCodeRows(model);
  const steps=LAB_PARTS.map(([part],i)=>{
    const code=rows.filter(([id,line])=>id===part&&line).map(([,line])=>line).join('\n');
    return `<section class="lab-code-step${model.part===part?' is-selected':''}" data-step="${part}" data-code-copy-scope><div class="lab-step-heading"><h2><span>${i+1}</span>${titles[part]}</h2></div><div class="lab-step-pair"><div class="lab-code-container">${codeToolbar('复制本段代码').replace('class="code-copy"','class="code-copy"'+(code?'':' disabled'))}<button type="button" class="lab-code-fragment" data-part="${part}" data-code-part="${part}" aria-label="查看${titles[part]}对应关系" aria-pressed="${model.part===part}"><code>${labEscape(code||'# 尚未添加量子门')}</code></button></div><div class="lab-step-demo"><p class="lab-step-explanation">${explanations[part]}</p>${visuals[part]}</div></div></section>`;
  });
  return `<section class="lab lab-guided" aria-label="FatQat 代码与实验对照"><div class="lab-build-group"><div class="lab-shared-circuit">${labCircuit(model,model.part)}</div>${steps.slice(0,3).join('')}</div>${steps.slice(3).join('')}<details class="lab-probability-details"><summary>查看理论概率与采样对照</summary>${labResults(model)}</details><details class="lab-full-code"><summary>查看与复制完整 Python 代码</summary>${codeBlock(labCode(model))}<p class="cap">在已安装 FatQat 的 Python 环境运行。网页中的采样不执行这段 Python。</p></details></section>`;
}
COMP.lab=(slot,p)=>{
  const base=(S.lesson?.id||'extension')+':'+p.labKey;
  const step=S.lesson?S.i:0,key=base+':'+step;
  let preceding=null;
  if(S.lesson)for(let i=step-1;i>=0;i--){
    if(S.lesson.pages[i].labKey===p.labKey){preceding=LAB.sessions[base+':'+i];break;}
  }
  const candidate=LAB.latest[p.from];
  const source=candidate?.n===(p.n||1)&&candidate.seq.join(',')===(p.seed||[]).join(',')?candidate:null;
  const fresh={n:p.n||1,seq:[...(source?.seq||p.seed||[])],measured:!!(source?.measured||p.measured),shots:p.shots||8,runs:{},seen:[],part:'prepare',visited:[],compare:!!p.compare};
  const model=LAB.sessions[key]||JSON.parse(JSON.stringify(preceding||fresh));
  if(p.codeStage){
    // A stage adds its authored operations, while sampling/result pages retain
    // the same run. Earlier page snapshots stay independent when revisited.
    if(model.seq.join(',')!==(p.seed||[]).join(',')||model.measured!==!!p.measured){
      model.runs={};model.seen=[];
    }
    model.seq=[...(p.seed||[])];model.measured=!!p.measured;model.part=p.codeStage;
  }
  const persist=()=>{LAB.sessions[key]=model;LAB.latest[base]=model;};
  // Earlier steps retain their own circuit and counts. Editing or resampling them
  // invalidates later work, which will be derived again from the updated experiment.
  const invalidateFollowing=()=>{
    if(!S.lesson)return;
    for(let i=step+1;i<S.lesson.pages.length;i++){
      const later=S.lesson.pages[i];
      if(later.labKey)delete LAB.sessions[S.lesson.id+':'+later.labKey+':'+i];
      delete S.answers[i];delete S.passed[i];delete S.carrySnapshots[i];
    }
  };
  const evaluate=()=>{
    if(!p.ok)return;
    const valid=p.ok({...model,result:model.runs.ideal,seq:model.seq});
    S.gateOK=!!valid;S.passed[S.i]=!!valid;go('继续',!!valid);hint(valid?(p.pm||''):p.gh);
  };
  const invalidate=()=>{invalidateFollowing();model.runs={};model.seen=[];persist();};
  function draw(){
    const focused=slot.contains(document.activeElement)?document.activeElement:null;
    const focusKey=focused?.dataset.gate?['data-gate',focused.dataset.gate]:focused?.dataset.action?['data-action',focused.dataset.action]:focused?.dataset.codePart?['data-code-part',focused.dataset.codePart]:focused?.dataset.part?['data-part',focused.dataset.part]:focused?.tagName==='SELECT'?['select','']:null;
    const openDetails=[...slot.querySelectorAll('details[open]')].map(el=>el.className);
    const guided=p.codeFirst&&p.explain;
    slot.innerHTML=guided?labGuidedExperiment(model,p):`<section class="lab" aria-label="网页量子实验">${p.codeFirst?labLinkedCode(model,p.explain?model.part:''):''}${labCircuit(model,p.explain?model.part:'')}
    ${p.edit?`<div class="lab-controls" role="group" aria-label="编辑线路">${p.gates.map(g=>`<button class="chip" type="button" data-gate="${g}"${model.seq.length>=6?' disabled':''}>${g}</button>`).join('')}<button class="chip" type="button" data-action="undo"${!model.seq.length?' disabled':''}>撤销上一步</button><button class="chip" type="button" data-action="clear">清空线路</button></div>`:''}
    ${p.addMeasure?`<button class="secondary lab-measure" type="button" data-action="measure"${model.measured?' disabled':''}>${model.measured?'已添加测量':'添加测量'}</button>`:''}
    <p class="lab-circuit-note">${model.n===2?'结果按 q0、q1 从左到右读；CNOT 的 ● 是控制位，⊕ 是目标位。':'初态为 |0⟩。'}${p.edit?'修改的是测量之前的门。':''}</p>
    ${p.explain?(p.codeFirst?`<div class="lab-parts" role="group" aria-label="查看代码说明">${LAB_PARTS.map(([id,label])=>`<button type="button" class="chip" data-part="${id}" aria-pressed="${model.part===id}">${label}</button>`).join('')}</div><p class="lab-explanation" aria-live="polite">${labExplanation(model.part,model)}</p>`:`<div class="lab-code-guide" aria-label="线路与代码对应关系">${LAB_PARTS.map(([id,label])=>`<section class="${model.part===id?'is-selected':''}"><h3>${label}</h3><pre class="lab-code-lines">${labCodeRows(model).filter(([part,line])=>part===id&&line).map(([,line])=>labEscape(line)).join('\n')}</pre><p>${labExplanation(id,model)}</p></section>`).join('')}</div>`):''}
    <div class="lab-sampling"><label>重复次数 <select aria-label="重复次数">${[8,100,1000].map(n=>`<option value="${n}"${model.shots===n?' selected':''}>${n} 次</option>`).join('')}</select></label><button class="primary" type="button" data-action="run"${!model.measured?' disabled':''}>${model.compare?'同时采样两组':'采样当前线路'}</button></div>
    <p class="lab-run-status" role="status">${model.runs.ideal?'采样完成':model.measured?'每次重复都会重新准备初态，再执行门与测量。':'先添加测量，再进行采样。'}</p>
    ${model.compare?'<p class="lab-noise-note">含噪演示：只模拟读出错误，每个经典位独立有 5% 的概率被记反；不代表真实设备的全部噪声，也不是硬件实测。</p>':''}
    ${labResults(model,p.showCode)}
    ${p.showCode&&!p.codeFirst?`<details class="lab-full-code"><summary>完整 Python 代码</summary>${codeBlock(labCode(model))}<p class="cap">含导入语句。在已安装 FatQat 的 Python 环境运行；网页中的采样不执行这段 Python。</p></details>`:''}</section>`;
    slot.querySelectorAll('[data-gate]').forEach(b=>b.onclick=()=>{if(model.seq.length<6)model.seq.push(b.dataset.gate);if(guided)model.part='gates';invalidate();draw();});
    slot.querySelector('[data-action="undo"]')?.addEventListener('click',()=>{model.seq.pop();if(guided)model.part='gates';invalidate();draw();});
    slot.querySelector('[data-action="clear"]')?.addEventListener('click',()=>{model.seq=[];if(guided)model.part='gates';invalidate();draw();});
    slot.querySelector('[data-action="measure"]')?.addEventListener('click',()=>{model.measured=true;invalidate();draw();});
    slot.querySelector('select')?.addEventListener('change',e=>{invalidateFollowing();model.shots=+e.target.value;model.runs={};if(guided)model.part='execute';persist();draw();});
    slot.querySelector('[data-action="run"]')?.addEventListener('click',()=>{
      if(!model.measured)return;
      invalidateFollowing();
      const drawRun=noisy=>({shots:model.shots,counts:labSample(labDistribution(model.n,model.seq,noisy),model.shots)});
      model.runs={ideal:drawRun(false)};
      if(model.compare)model.runs.noisy=drawRun(true);
      if(!model.seen.includes(model.shots))model.seen.push(model.shots);
      if(guided)model.part=p.codeStage||'result';
      persist();draw();
      if(p.codeStage==='execute')slot.querySelector('.lab-stage-output').scrollIntoView({block:'nearest'});
      else if(guided&&!p.codeStage)slot.querySelector('[data-step="result"]').scrollIntoView({block:'nearest'});
    });
    slot.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>{
      if(!p.explain)return;
      model.part=b.dataset.part;if(!model.visited.includes(model.part))model.visited.push(model.part);persist();
      if(guided){
        slot.querySelectorAll('[data-step]').forEach(el=>el.classList.toggle('is-selected',el.dataset.step===model.part));
        slot.querySelectorAll('[data-part]').forEach(el=>{
          el.classList.toggle('is-selected',el.dataset.part===model.part);
          if(el.hasAttribute('aria-pressed'))el.setAttribute('aria-pressed',String(el.dataset.part===model.part));
        });
        if(b.closest('.lab-shared-circuit'))slot.querySelector(`[data-step="${model.part}"]`).scrollIntoView({block:'nearest'});
      }else draw();
    });
    slot.querySelectorAll('[data-part]').forEach(b=>{if(!p.explain||(p.codeStage&&b.dataset.part!==p.codeStage))b.disabled=true;});
    typesetMath(slot);
    slot.querySelectorAll('details').forEach(el=>{el.open=openDetails.includes(el.className);});
    persist();evaluate();
    if(focusKey){const target=focusKey[0]==='select'?slot.querySelector('select'):slot.querySelector(`[${focusKey[0]}="${focusKey[1]}"]`);if(target&&!target.disabled)target.focus({preventScroll:true});}
  }
  draw();
};