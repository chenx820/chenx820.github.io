/* Circuit illustrations share one renderer with the live chapter-3 experiments.
   A measurement changes a single quantum wire into a double classical wire.
   Classical controls are drawn explicitly; an assumed cloning device remains a dashed box. */
function entCircuitSVG({wires,columns,title,caption='',output=[],classicalReceived=false}){
 const escape=value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const top=34,row=64,start=112,ys=wires.map((_,i)=>top+i*row);
 let edge=start;
 const xs=columns.map(column=>{const width=column.width||48;const x=edge+width/2;edge+=width;return x;});
 const width=Math.max(256,edge+88),height=top*2+row*(wires.length-1)+12;
 const meterAt=wires.map((_,q)=>columns.findIndex(c=>c.ops.some(op=>op.type==='measure'&&op.wire===q)));
 const path=(d,cls='')=>`<path class="${cls}" d="${d}"/>`;
 let lines='',nodes='';
 wires.forEach((wire,q)=>{
  const y=ys[q],meter=meterAt[q],end=width-50;
  lines+=path(`M95 ${y}H${meter<0?end:xs[meter]}`,'qc-quantum');
  if(meter>=0)lines+=path(`M${xs[meter]+17} ${y-2}H${end}M${xs[meter]+17} ${y+2}H${end}`,'qc-classical');
  nodes+=`${wire.owner?`<text class="qc-owner" x="6" y="${y-18}">${escape(wire.owner)}</text>`:''}<text class="qc-wire-label" x="6" y="${y+5}">${escape(wire.name||'q'+String(q).replace(/\d/g,x=>'₀₁₂₃₄₅₆₇₈₉'[x]))}</text><text class="qc-state" x="57" y="${y+5}" text-anchor="middle">${escape(wire.input||'')}</text>`;
  if(output[q])nodes+=`<text class="qc-output" x="${end+6}" y="${y+5}">${escape(output[q])}</text>`;
 });
 columns.forEach((column,col)=>column.ops.forEach(op=>{
  const x=xs[col],y=ys[op.wire],status=op.active===true?' qc-complete':op.active===false?' qc-pending':'';
  if(op.type==='cx'){
   const sy=ys[op.control];
   lines+=path(`M${x} ${sy}V${y}`,'qc-control'+status);
   nodes+=`<g class="qc-op qc-cx${status}" data-qc-kind="cx" data-qc-control="${op.control}" data-qc-target="${op.wire}"><circle class="qc-dot" cx="${x}" cy="${sy}" r="4"/><circle class="qc-target" cx="${x}" cy="${y}" r="12"/>${path(`M${x-12} ${y}H${x+12}M${x} ${y-12}V${y+12}`)}</g>`;
  }else if(op.type==='span'){
   const low=ys[op.to],h=low-y+36,w=(column.width||100)-12;
   nodes+=`<g class="qc-op qc-assumed" data-qc-kind="assumed"><rect x="${x-w/2}" y="${y-18}" width="${w}" height="${h}" rx="3"/><text x="${x}" y="${(low+y)/2+5}" text-anchor="middle">${escape(op.label)}</text></g>`;
  }else if(op.type==='measure'){
   nodes+=`<g class="qc-op qc-measure${status}" data-qc-kind="measure" data-qc-wire="${op.wire}"><rect x="${x-17}" y="${y-17}" width="34" height="34" rx="3"/>${path(`M${x-11} ${y+9}A11 11 0 0 1 ${x+11} ${y+9}M${x} ${y+9}L${x+8} ${y-10}M${x+8} ${y-10}L${x+3} ${y-7}M${x+8} ${y-10}L${x+9} ${y-4}`)}</g>`;
  }else{
   if(op.source!==undefined){
    const sourceY=ys[op.source];
    lines+=path(`M${x-2} ${sourceY}V${y-18}M${x+2} ${sourceY}V${y-18}`,'qc-classical-control'+(classicalReceived?' qc-complete':''));
    nodes+=`<g data-qc-kind="classical-control" data-qc-source="${op.source}" data-qc-target="${op.wire}"><circle class="qc-dot" cx="${x}" cy="${sourceY}" r="3"/></g>`;
   }
   nodes+=`<g class="qc-op qc-gate${status}" data-qc-kind="gate" data-qc-wire="${op.wire}"><rect x="${x-17}" y="${y-17}" width="34" height="34" rx="2"/><text x="${x}" y="${y+6}" text-anchor="middle">${op.label==='Xr'?'X<tspan dy="-7" font-size="12">r</tspan>':escape(op.label)}</text>${op.skipped?`<text class="qc-small" x="${x}" y="${y+34}" text-anchor="middle">跳过</text>`:''}</g>`;
  }
 }));
 return `<figure class="qc-figure"><div class="qc-scroll" tabindex="0" role="region" aria-label="${escape(title)}，线路从左向右读，可横向滚动"><svg class="qc-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(title)}">${lines}${nodes}</svg></div>${caption?`<figcaption>${caption}</figcaption>`:''}</figure>`;
}
function entPairCircuit(prep='independent',basis='Z',{measured=true,stage=null}={}){
 const wires=[{input:'|0⟩'},{input:'|0⟩'}],columns=[];
 const gate=(wire,label)=>({type:'gate',wire,label});
 let caption='',title='';
 if(prep==='independent'){
  columns.push({ops:[gate(0,'H'),gate(1,'H')]});
  title='两个零态分别经过 H';caption='两条线上分别施加 H，各自准备$|+\\rangle$。';
 }else if(prep==='mixed'){
  columns.push({ops:[gate(0,'Xr'),gate(1,'Xr')]});
  title='同一个经典随机位 r 控制两条线上的 X';caption='r 是同一个经典随机位，0、1 各半。r=0 时两个 X 都不执行，准备 00；r=1 时两个 X 都执行，准备 11。';
 }else{
  if(stage===null||stage>=1)columns.push({ops:[gate(0,'H')]});
  if(stage===null||stage>=2)columns.push({ops:[{type:'cx',wire:1,control:0}]});
  title='从两个零态制备贝尔态';
 }
 if(basis==='X'){columns.push({ops:[gate(0,'H'),gate(1,'H')]});caption+='读出前双方各加 H，改变测量设置。';}
 if(measured){columns.push({ops:[{type:'measure',wire:0},{type:'measure',wire:1}]});caption+='表盘符号表示计算基测量；双线承载经典结果。';}
 return entCircuitSVG({wires,columns,title,caption,output:measured?['c₀','c₁']:[]});
}
function entCandidateCircuit(input='|ψ⟩'){
 return entCircuitSVG({wires:[{input},{input:'|0⟩'}],columns:[{width:132,ops:[{type:'span',wire:0,to:1,label:'候选机器 U'}]}],title:'一个任意输入态与一个零态一起进入同一台候选机器 U',caption:'虚线框是假设中的通用机器，内部操作未知；不是已经实现的复制线路。'});
}
function entTeleportCircuit(m=null,resources=false){
 const op=(type,wire,extra={},active=true)=>({type,wire,...extra,...(m?{active}:{})});
 const columns=[{ops:[op('gate',1,{label:'H'})]},{ops:[op('cx',2,{control:1})]}];
 if(!resources)columns.push(
  {ops:[op('cx',1,{control:0},m?.stage>=1)]},
  {ops:[op('gate',0,{label:'H'},m?.stage>=2)]},
  {ops:[op('measure',0,{},m?.stage>=3),op('measure',1,{},m?.stage>=3)]},
  {ops:[op('gate',2,{label:'X',source:1,skipped:m?.stage===5&&!m.gates.includes('X')},m?.gates.includes('X'))]},
  {ops:[op('gate',2,{label:'Z',source:0,skipped:m?.stage===5&&!m.gates.includes('Z')},m?.gates.includes('Z'))]}
 );
 const bits=m?.outcome!==null&&m?.outcome!==undefined?m.outcome.toString(2).padStart(2,'0'):null;
 return entCircuitSVG({wires:[{name:'q₀',owner:'Alice',input:'|ψ⟩'},{name:'q₁',input:'|0⟩'},{name:'q₂',owner:'Bob',input:'|0⟩'}],columns,title:resources?'传态资源：q₀ 是输入，提前用 H 和 CNOT 在 q₁、q₂ 间制备贝尔态':'量子隐形传态完整线路；q₁ 的测量结果控制 Bob 的 X，q₀ 的测量结果控制 Bob 的 Z',caption:resources?'最左侧两步提前制备共享贝尔态，之后 q₁、q₂ 分别由 Alice 和 Bob 持有。q₀ 是另一个待传输入。':'从左向右：预共享纠缠 → Alice 的 CNOT、H 与测量 → 经典通信 → Bob 的条件修正。双线从 q₁ 连到 X，从 q₀ 连到 Z。'+(m?'绿色为已执行的门；灰色为尚未执行或无需执行的门。':''),output:resources?[]:[bits?bits[0]:'m₀',bits?bits[1]:'m₁',m?.stage===5?'|ψ⟩':''],classicalReceived:m?.stage>=4});
}
function entLessonCircuit(kind){
 if(kind.startsWith('cnot'))return entCircuitSVG({wires:[{input:kind==='cnot10'?'|1⟩':'|0⟩'},{input:'|0⟩'}],columns:[{ops:[{type:'cx',control:0,wire:1}]}],title:'q₀ 控制 q₁ 的 CNOT'});
 if(kind==='bell')return entPairCircuit('bell','Z',{measured:false});
 if(kind==='bell-measured')return entPairCircuit('bell');
 if(kind==='pair-Z'||kind==='pair-X')return `<div class="qc-comparison"><section><h3>贝尔态</h3>${entPairCircuit('bell',kind.slice(-1))}</section><section><h3>随机准备 00 或 11</h3>${entPairCircuit('mixed',kind.slice(-1))}</section></div>`;
 if(kind==='candidate')return entCandidateCircuit();
 if(kind==='teleport-prepare')return entCircuitSVG({
  wires:[{name:'Q',owner:'Alice',input:'|ψ⟩'},{name:'A'},{name:'B',owner:'Bob'}],
  columns:[
   {ops:[{type:'cx',control:0,wire:1,active:true}]},
   {ops:[{type:'gate',wire:0,label:'H',active:true}]},
   {ops:[{type:'measure',wire:0},{type:'measure',wire:1}]}
  ],output:['a','b',''],
  title:'Alice 先以 Q 控制 A 做 CNOT，再对 Q 做 H，然后测量 Q、A 得到 a、b；Bob 暂不操作 B'
 });
 throw Error('Unknown chapter-3 circuit: '+kind);
}
