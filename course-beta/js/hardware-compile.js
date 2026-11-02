/* Built-in teaching sequences for the same three-qubit circuit. Positions are schematic. */
const HARDWARE_FIXED=[
 {map:[0,1,2],text:'初始对应：q0、q1、q2 分别放在 p0、p1、p2。只有相邻器件直接连接。'},
 {map:[0,1,2],text:'先对三个量子比特分别执行 H。',h:true},
 {map:[1,0,2],text:'交换 p0、p1 承载的量子态。q0 现在由 p1 承载，可以与 p2 上的 q2 作用。',swap:[0,1]},
 {map:[1,0,2],text:'在 p1、p2 上执行 CZ，完成线路中的 CZ(q0, q2)。',gate:[1,2],completed:1},
 {map:[0,1,2],text:'再次交换 p0、p1 的量子态，让 q1 回到 p1，与 q2 相邻。',swap:[0,1],completed:1},
 {map:[0,1,2],text:'在 p1、p2 上执行 CZ，完成 CZ(q1, q2)。器件一直留在原位。',gate:[1,2],completed:2}
];
// Each movement and gate is a separate teaching step; coordinates are SVG units.
const HARDWARE_RECONFIGURABLE=[
 {positions:[[150,230],[270,230],[390,230]],text:'初始布局：q0、q1、q2 位于存储区。标签跟随各自的原子。'},
 {positions:[[150,230],[270,230],[390,230]],text:'先对三个量子比特分别执行 H。'},
 {positions:[[230,52],[270,230],[310,52]],text:'把 q0、q2 移入纠缠区。移动只安排位置，还没有执行 CZ。'},
 {positions:[[230,52],[270,230],[310,52]],gate:[0,2],completed:1,text:'对 q0、q2 执行 CZ，完成线路中的第一个双比特门。'},
 {positions:[[150,230],[270,230],[310,52]],completed:1,text:'把 q0 移回存储区，q2 留在纠缠区，为下一次操作腾出位置。'},
 {positions:[[150,230],[230,52],[310,52]],completed:1,text:'把 q1 移入纠缠区，与 q2 配对。此时第二个 CZ 还没有执行。'},
 {positions:[[150,230],[230,52],[310,52]],gate:[1,2],completed:2,text:'对 q1、q2 执行 CZ，完成线路中的第二个双比特门。'}
];
function hardwareAtomPositions(mode,frame){
 return mode==='fixed'?Object.fromEntries(frame.map.map((q,p)=>[q,{x:100+p*170,y:112}])):Object.fromEntries(frame.positions.map(([x,y],q)=>[q,{x,y}]));
}
function hardwareCircuit(completed=0,h=false){
 return `<svg class="hw-circuit" viewBox="0 0 460 142" role="img" aria-label="三比特输入线路：各做 H，然后 CZ q0 q2，再 CZ q1 q2">
 ${[0,1,2].map((q)=>`<text x="12" y="${30+q*48}">q${q}</text><path d="M54 ${25+q*48}H440"/><g class="${h?'is-active':''}"><rect x="90" y="${10+q*48}" width="30" height="30" rx="3"/><text x="105" y="${30+q*48}" text-anchor="middle">H</text></g>`).join('')}
 ${[[240,0,2],[350,1,2]].map(([x,a,b],i)=>`<g class="${completed>i?'is-active':''}"><path d="M${x} ${25+a*48}V${25+b*48}"/><circle cx="${x}" cy="${25+a*48}" r="5"/><circle cx="${x}" cy="${25+b*48}" r="5"/></g>`).join('')}</svg>`;
}
function hardwareDeviceSVG(mode,frame){
 const fixed=mode==='fixed',pos=hardwareAtomPositions(mode,frame);
 const gate=fixed?frame.gate?.map(p=>frame.map[p]):frame.gate;
 return `<svg class="hw-device" viewBox="0 0 540 ${fixed?210:300}" role="img" aria-label="${fixed?'固定器件与量子态对应关系':'可重排阵列的原子位置：上方纠缠区，下方存储区'}">
 ${fixed?`<path class="hw-link" d="M100 112H440"/>${[0,1,2].map(p=>`<rect class="hw-site" x="${76+p*170}" y="88" width="48" height="48" rx="8"/><text x="${100+p*170}" y="172" text-anchor="middle">器件 p${p}</text>`).join('')}`:`<rect class="hw-zone hw-ent" x="8" y="8" width="524" height="70" rx="12"/><rect class="hw-zone" x="8" y="84" width="524" height="206" rx="12"/><text x="22" y="36">纠缠区</text><text x="22" y="111">存储区</text>`}
 ${gate?`<path class="hw-gate" d="M${pos[gate[0]].x} ${pos[gate[0]].y}L${pos[gate[1]].x} ${pos[gate[1]].y}"/><text class="hw-gate-label" x="${(pos[gate[0]].x+pos[gate[1]].x)/2}" y="${pos[gate[0]].y-25}" text-anchor="middle">CZ</text>`:''}
 ${Object.entries(pos).map(([id,p])=>`<g class="hw-atom" data-atom="${id}" transform="translate(${p.x} ${p.y})"><circle r="17"/><text text-anchor="middle" y="5">q${id}</text></g>`).join('')}</svg>`;
}
const HARDWARE_ROUTES=[
 ['超导','fridgePhoto','超导电路的两个能级'],['离子阱','ion','带电原子的两个内部态'],['中性原子','atom','中性原子的两个内部态'],['光量子','photon','光子的路径或偏振']
];
ART.hardwareOverview=()=>`<div class="hw-overview">
 <div class="hw-route-buttons" role="group" aria-label="选择硬件路线">${HARDWARE_ROUTES.map(([title],i)=>`<button type="button" class="hw-route-button" data-hw-route="${i}" aria-pressed="${i===0}" aria-controls="hw-route-panel-${i}">${title}</button>`).join('')}</div>
 ${HARDWARE_ROUTES.map(([title,route,description],i)=>`<section class="hw-route-panel" id="hw-route-panel-${i}" aria-label="${title}" ${i===0?'':'hidden'}>${ROUTE_ART[route]()}<p class="hw-route-description">${description}</p></section>`).join('')}
 </div>`;
function bindHardwareOverview(slot){
 const step=S.i,buttons=[...slot.querySelectorAll('[data-hw-route]')],panels=[...slot.querySelectorAll('.hw-route-panel')];
 function select(index,save=false){
  buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  panels.forEach((panel,i)=>panel.hidden=i!==index);
  if(save){S.answers[step]={routeIndex:index};rememberStep();}
 }
 const saved=S.answers[step]?.routeIndex;
 select(Number.isInteger(saved)&&saved>=0&&saved<buttons.length?saved:0);
 buttons.forEach((button,i)=>button.addEventListener('click',()=>select(i,true)));
}
ART.fixedArchitecture=()=>`<div class="hw-architecture-single">${hardwareDeviceSVG('fixed',HARDWARE_FIXED[0])}</div>`;
ART.reconfigurableArchitecture=()=>'<div class="hw-architecture-animation"></div>';
COMP.hardwareCompile=(slot,p)=>{
 const frames=p.mode==='reconfigurable'?HARDWARE_RECONFIGURABLE:HARDWARE_FIXED,key='hardware-'+p.mode+(p.overview?'-overview':'');
 const saved=S.carry[key];
 let index=Number.isInteger(saved)?Math.min(Math.max(0,saved),frames.length-1):0,playing=false,timer;
 const step=S.i,lesson=S.lesson;
 const alive=()=>slot.isConnected&&S.lesson===lesson&&S.i===step;
 function draw(previous){
  const frame=frames[index],fixed=p.mode==='fixed';
  const complete=frame.completed||0;
  slot.innerHTML=`<section class="hw-playback${p.overview?' hw-playback-overview':''}" aria-label="${fixed?'固定连接演示':'可重排原子阵列演示'}">
   ${p.overview?'':`<div class="hw-input">${hardwareCircuit(complete,index>0)}</div>`}
   <div class="hw-scene">${hardwareDeviceSVG(p.mode,frame)}</div>
   <p class="hw-step" role="status" aria-live="polite">${frame.text}</p>
   <div class="hw-controls"><button type="button" class="ghost" data-hw="reset">恢复初态</button>${p.overview?'':`<button type="button" class="secondary" data-hw="previous" ${index===0?'disabled':''}>上一步</button><button type="button" class="secondary" data-hw="next" ${index===frames.length-1?'disabled':''}>下一步</button>`}${fixed?'':`<button type="button" class="secondary" data-hw="play">${playing?'暂停':index===frames.length-1?'重新播放':p.overview?'播放动画':'播放'}</button>`}</div>
  </section>`;
  // Redraws replace the SVG labels and prose; reapply the initial math notation.
  typesetCourseMath(slot);
  if(previous!==undefined&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   const old=frames[previous];
   slot.querySelectorAll('[data-atom]').forEach(atom=>{
    const id=Number(atom.dataset.atom),a=hardwareAtomPositions(p.mode,old)[id],b=hardwareAtomPositions(p.mode,frame)[id];
    if(a.x!==b.x||a.y!==b.y)atom.animate([{transform:`translate(${a.x}px,${a.y}px)`},{transform:`translate(${b.x}px,${b.y}px)`}],{duration:650,easing:'ease-in-out'});
   });
  }
  slot.querySelectorAll('[data-hw]').forEach(button=>button.onclick=()=>act(button.dataset.hw));
  const ready=p.overview||index===frames.length-1;S.gateOK=ready;go('继续',ready);hint(ready?'':p.gh);
  S.carry[key]=index;rememberStep();
 }
 function tick(){timer=setTimeout(()=>{if(!alive()){playing=false;return;}const old=index;index=Math.min(index+1,frames.length-1);if(index===frames.length-1)playing=false;draw(old);if(playing)tick();},1600);}
 function act(action){
  clearTimeout(timer);const old=index;
  if(action==='play'){playing=!playing;if(playing&&index===frames.length-1)index=0;}
  else {playing=false;index=action==='reset'?0:Math.max(0,Math.min(frames.length-1,index+(action==='next'?1:-1)));}
  draw(old);slot.querySelector(`[data-hw="${action}"]:not(:disabled)`)?.focus({preventScroll:true});if(playing)tick();
 }
 draw();
};
