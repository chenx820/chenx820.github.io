/* =========================================================
   静态图示
   ========================================================= */
const ART={};
// Perspective slabs show the software-to-hardware hierarchy as one illustration.
ART.quantumStack=(p={})=>{
 const layers=[
  {name:'应用与算法',x:114,y:53,w:260,tone:'software',icon:'<circle cx="0" cy="0" r="5"/><circle cx="22" cy="-9" r="4"/><circle cx="23" cy="12" r="4"/><path d="M5-2l13-5M5 3l14 7"/>'},
  {name:'量子线路',x:92,y:136,w:304,tone:'software',icon:'<path d="M-4-9h36M-4 10h36M22-9v19"/><rect x="2" y="-16" width="12" height="14"/><circle cx="22" cy="-9" r="2"/><circle cx="22" cy="10" r="5"/>'},
  {name:'编译',x:70,y:219,w:348,tone:'compiler',icon:'<path d="M-4-12h11l10 12-10 12H-4M17 0h16m-5-5 5 5-5 5"/>'},
  {name:'控制与读出',x:48,y:302,w:392,tone:'control',icon:'<path d="M-5 9h7V-9h9V9h9V-9h9V9h6"/>'},
  {name:'物理硬件',x:26,y:385,w:436,tone:'hardware',icon:'<path d="M0-11h24M0 11h24M0-11v22M12-11v22M24-11v22"/><circle cx="0" cy="-11" r="3"/><circle cx="12" cy="-11" r="3"/><circle cx="24" cy="-11" r="3"/><circle cx="0" cy="11" r="3"/><circle cx="12" cy="11" r="3"/><circle cx="24" cy="11" r="3"/>'}
 ];
 return `<figure class="quantum-stack">
  <svg class="quantum-stack-art" viewBox="0 0 520 462" role="img" aria-labelledby="quantum-stack-title quantum-stack-description">
   <title id="quantum-stack-title">量子计算机的五层立体堆叠图</title>
   <desc id="quantum-stack-description">自上而下：应用与算法、量子线路、编译、控制与读出、物理硬件。各层逐渐加宽，编译层与硬件层突出显示，是本章关注的内容。</desc>
   <ellipse class="quantum-stack-shadow" cx="258" cy="447" rx="221" ry="9"/>
   ${layers.map(({name,x,y,w,tone,icon})=>`<g class="quantum-stack-slab quantum-stack-slab--${tone}">
    <path class="quantum-stack-top" d="M${x} ${y}l28-24h${w}l-28 24Z"/>
    <path class="quantum-stack-side" d="M${x+w} ${y}l28-24v52l-28 24Z"/>
    <path class="quantum-stack-front" d="M${x} ${y}h${w}v52H${x}Z"/>
    <g class="quantum-stack-icon" transform="translate(${x+27} ${y+26})">${icon}</g>
    <text class="quantum-stack-label" x="${x+w/2+21}" y="${y+34}" text-anchor="middle">${name}</text>
   </g>`).join('')}
  </svg>
  <figcaption class="quantum-stack-focus">${p.recap?'线路 → 编译安排 → 控制信号 → 硬件执行':'本章重点：物理硬件，以及连接线路与硬件的编译'}</figcaption>
 </figure>`;
};
ART.interferenceSums=()=>`<section aria-label="H 门后的概率幅合成">
 ${[
  ['$|+\\rangle$经过 H',[['0','+1/2 + 1/2 = 1','100%'],['1','+1/2 − 1/2 = 0','0%']]],
  ['$|-\\rangle$经过 H',[['0','+1/2 − 1/2 = 0','0%'],['1','+1/2 + 1/2 = 1','100%']]]
 ].map(([title,rows])=>`<table class="compile-probabilities"><caption>${title}</caption><thead><tr><th scope="col">最终结果</th><th scope="col">概率幅合成</th><th scope="col">概率</th></tr></thead><tbody>${rows.map(([out,sum,prob])=>`<tr><th scope="row">${out}</th><td>${sum}</td><td>${prob}</td></tr>`).join('')}</tbody></table>`).join('')}
 </section>`;
ART.shorPeriod=()=>`<table class="compile-probabilities"><caption>2 的幂除以 15 的余数</caption><thead><tr><th scope="col">指数 x</th><th scope="col">2 的 x 次方</th><th scope="col">除以 15 的余数</th></tr></thead><tbody>${Array.from({length:8},(_,x)=>`<tr class="${x%4===0?'has-probability':''}"><th scope="row">${x}</th><td>${2**x}</td><td>${2**x%15}</td></tr>`).join('')}</tbody></table>`;
ART.timeline=(p={})=>{
  const milestones=p.milestones||[
    ['1981','费曼：用量子系统模拟自然','经典计算机难以高效模拟许多复杂的量子系统。费曼在 1981 年的演讲中提出：能否用可控的量子系统来模拟量子物理？相关论文于 1982 年发表。'],
    ['1985','从模拟自然，到通用计算','Deutsch 提出通用量子计算模型，让量子计算有了更一般的理论框架。'],
    ['1994','算法展示加速的可能','Shor 提出量子因数分解算法，展示解决特定问题的加速潜力。'],
    ['1995','量子信息也能受到保护','Shor 提出量子纠错方案：用多个量子比特共同保护信息，为应对计算中的错误提供方法。'],
    ['2019','在特定任务上检验优势','Google 团队用超导处理器完成随机线路采样，并与当时采用的经典模拟方法比较计算用时。这是检验计算能力的专门任务，不能据此推断日常应用也已获得加速；比较结果还取决于经典算法和计算资源。'],
    ['2024','纠错让量子信息存得更可靠','Google 团队在超导处理器上实现了低于纠错阈值的量子存储：当底层错误率足够低时，在实验测试的编码规模内，用更多量子比特共同保护信息，能降低存储信息的错误率。这是迈向可靠计算的一步，还不等于实现完整的大规模容错计算。','present'],
    ['未来目标','走向大规模容错量子计算','在纠错保护下完成长时间的计算，解决有实际价值的问题。这仍是研究目标，没有确定的实现年份。','future']
  ];
  const sources=p.sources||{
  "1981": {
    "url": "https://authors.library.caltech.edu/records/a1kgk-xyk45",
    "label": "Feynman | 模拟物理的设想（1981 年演讲，1982 年论文）"
  },
  "1985": {
    "url": "https://www.cs.princeton.edu/courses/archive/fall06/cos576/papers/deutsch85.pdf",
    "label": "Deutsch | 通用量子计算模型（1985）"
  },
  "1994": {
    "url": "https://math.mit.edu/~shor/elecpubs.html",
    "label": "Shor | 因数分解算法（1994）"
  },
  "1995": {
    "url": "https://doi.org/10.1103/PhysRevA.52.R2493",
    "label": "Shor | 量子纠错（1995）"
  },
  "2019": {
    "url": "https://www.nature.com/articles/s41586-019-1666-5",
    "label": "Google | 随机线路采样实验（2019）"
  },
  "2024": {
    "url": "https://www.nature.com/articles/s41586-024-08449-y",
    "label": "Google | 低于阈值的量子纠错实验（2024 年在线发表）"
  }
};
  return `<figure class="quantum-history" aria-label="${p.timelineLabel||'量子计算发展的代表性节点'}">
    <figcaption class="history-intro">${p.timelineIntro||'从“怎样模拟量子世界”出发，沿着几个代表性节点，看看量子计算怎样发展。'}</figcaption>
    <ol class="history-list">${milestones.map(([year,title,description,state=''],i)=>`
      <li class="history-stop${state?' history-stop--'+state:''}">
        ${i<milestones.length-1?`<svg class="history-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M ${i%2?85:15} 0 C ${i%2?85:15} 50, ${i%2?15:85} 50, ${i%2?15:85} 100" vector-effect="non-scaling-stroke"/></svg>`:''}
        <details class="history-event" name="quantum-history"${i===0?' open':''}>
          <summary><span class="history-node" aria-hidden="true"></span><span class="history-year">${year}</span><span class="history-title">${title}</span><span class="history-expand" aria-hidden="true">+</span></summary>
          <p>${description}</p>
          ${(sources[title]||sources[year])?`<p class="history-reference"><a href="${(sources[title]||sources[year]).url}" target="_blank" rel="noopener noreferrer">${(sources[title]||sources[year]).label}</a></p>`:''}
        </details>
      </li>`).join('')}
    </ol>
  </figure>`;
};
ART.algorithmOverview=()=>`<table class="compile-probabilities algorithm-overview"><caption>从任务认识代表性量子算法</caption><thead><tr><th scope="col">想做什么</th><th scope="col">代表方法</th><th scope="col">能帮助做什么</th></tr></thead><tbody>
 ${[
  ['寻找目标','Grover','在没有排序等线索时，减少寻找目标所需的检查次数。'],
  ['分解整数','Shor','利用周期信息，找到整数的因数。'],
  ['研究分子与材料','量子模拟<br>VQE','模拟量子系统的演化，或寻找低能量状态。'],
  ['寻找较好的方案','QAOA','针对组合优化问题，结合量子线路与经典调参寻找候选方案；不保证得到最优解。']
 ].map(([task,name,description])=>`<tr><th scope="row">${task}</th><td>${name}</td><td>${description}</td></tr>`).join('')}
 </tbody></table>`;

// Career exploration is an interest choice, never a scored question.
const CAREER_PATHS=[
 {id:'hardware',title:'硬件与实验',work:'制备、控制和读出量子比特，校准设备并分析误差。',basis:'物理、电子或光学，以及实验与数据分析。不同硬件路线需要的具体知识不同。',task:'选择一种硬件路线，画出准备、控制、读出的过程。',steps:['从本课介绍的硬件路线中选一种。','标出量子比特由什么承载，以及怎样准备、控制和读出。','圈出一个你还想进一步了解的实验环节。'],result:'一张流程图，以及一个想继续研究的问题。'},
 {id:'software',title:'软件与系统',work:'开发编程工具、编译器与运行系统，让量子程序能够表达、转换和执行。',basis:'编程、数据结构、软件工程，以及量子线路与硬件约束的基础知识。',task:'修改刚才的 FatQat 代码，对照线路解释变化。',steps:['从刚才的单比特实验开始，在准备 |0⟩ 后连续施加两个 H 门。','先预测测量结果，再在配置好的 FatQat 环境中运行。','对照线路，解释两个 H 的整体作用，并与只施加一个 H 时比较。'],result:'一段修改后的代码，以及对预测和计数结果的解释。'},
 {id:'theory',title:'算法与理论',work:'研究量子算法、纠错方法，以及量子计算能解决哪些问题、需要多少资源。',basis:'线性代数、概率、算法与量子信息，随具体问题逐步深入。',task:'改变 Grover 的迭代次数，记录目标概率怎样变化。',steps:['回到 Grover 实验，保持搜索目标不变。','比较不同迭代次数下的目标概率。','记录概率是否一直增加，解释为什么不能只靠增加迭代次数。'],result:'一份迭代次数与目标概率的记录，以及你的解释。'},
 {id:'application',title:'应用与交叉研究',work:'把领域问题转成计算任务，比较量子与经典方法的效果和成本。',basis:'领域知识、数学建模、计算与验证，以及对量子算法适用条件的理解。',task:'选一个熟悉的问题，写清输入、希望得到的结果，以及现有解决方法。',steps:['选一个你能具体描述的问题，例如一项排班任务。','列出输入、限制条件，以及怎样判断结果好不好。','写出一种现有解决方法，再列出判断量子方法是否适用还缺少的信息。'],result:'一张问题说明卡。无需预设量子方法一定更好。'}
];
ART.careerFlow=()=>`<div class="career-flow"><h2 class="career-heading">有哪些人在做？</h2><p class="say">刚才，你完成了编写与运行程序的入门练习。从问题到真实设备上的结果，还需要这些工作：</p><ol class="career-workflow">${[
 ['应用与算法','把问题转成计算任务，设计求解方法与量子线路。'],
 ['软件与编译','用工具表达线路，把它转换成设备支持的操作。'],
 ['控制与硬件','准备量子比特，用控制信号执行操作，再读出结果。'],
 ['分析与反馈','解释结果和误差，把发现反馈给算法、软件与实验团队。']
].map(([title,body])=>`<li><strong>${title}</strong><p>${body}</p></li>`).join('')}</ol><p class="say">你刚才看到的 FatQat 代码，是进入软件与量子实验的一扇窗口。</p></div>`;
ART.careerDirections=()=>`<h2 class="career-heading">这些工作需要什么基础？</h2><div class="career-directions">
 <div class="hw-route-buttons" role="group" aria-label="选择职业方向">${CAREER_PATHS.map((path,i)=>`<button type="button" class="hw-route-button" data-career-direction="${path.id}" aria-pressed="${i===0}" aria-controls="career-direction-${path.id}">${path.title}</button>`).join('')}</div>
 ${CAREER_PATHS.map((path,i)=>`<section class="hw-route-panel career-direction-body" id="career-direction-${path.id}" aria-label="${path.title}" ${i===0?'':'hidden'}><h3>具体做什么</h3><p>${path.work}</p><h3>相关基础</h3><p>${path.basis}</p></section>`).join('')}
 </div>`;
ART.careerNext=()=>`<h2 class="career-heading">下一步可以尝试什么？</h2><fieldset class="career-picker"><legend>我想先探索的方向</legend><p>选一个方向，看看可以从什么小任务开始。</p><div class="career-options">${CAREER_PATHS.map(path=>`<label><input type="radio" name="career-interest" value="${path.id}" aria-controls="career-task"><span>${path.title}</span></label>`).join('')}</div></fieldset><div id="career-task" class="career-task" aria-live="polite"><p>不必现在决定职业。先从好奇的问题开始，也可以稍后再作选择。</p></div>`;
function bindCareerExploration(root,p){
 const step=S.i,answers=S.answers;
 if(p.art==='careerDirections'){
  const buttons=[...root.querySelectorAll('[data-career-direction]')];
  const panels=[...root.querySelectorAll('.career-direction-body')];
  const select=(id,save=false)=>{
   buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.careerDirection===id)));
   panels.forEach(panel=>panel.hidden=panel.id!=='career-direction-'+id);
   if(save){answers[step]={careerDirection:id};rememberStep();}
  };
  const saved=answers[step]?.careerDirection||answers[step]?.careerOpen?.[0];
  select(CAREER_PATHS.some(path=>path.id===saved)?saved:CAREER_PATHS[0].id);
  buttons.forEach(button=>button.addEventListener('click',()=>select(button.dataset.careerDirection,true)));
 }
 if(p.art==='careerNext'){
  const render=id=>{
   const path=CAREER_PATHS.find(item=>item.id===id);if(!path)return;
   root.querySelector('#career-task').innerHTML=`<h3>${path.task}</h3><ol>${path.steps.map(text=>`<li>${text}</li>`).join('')}</ol><p><strong>留下一个小成果：</strong>${path.result}</p>`;
  };
  const saved=answers[step]?.careerInterest;
  root.querySelectorAll('[name="career-interest"]').forEach(input=>{
   input.checked=input.value===saved;
   input.addEventListener('change',()=>{
    answers[step]={careerInterest:input.value};render(input.value);rememberStep();
    root.querySelector('#career-task').scrollIntoView({block:'nearest'});
   });
  });
  render(saved);
 }
}
