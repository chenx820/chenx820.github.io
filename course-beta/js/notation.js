/* Shared display notation. Simulation keys and runnable code stay untouched. */
function courseNotation(text){
  // Existing inline/display TeX is already authored; never wrap it a second time.
  return text.split(/(\$\$[\s\S]*?\$\$|\$[^$]*?\$)/g).map((part,i)=>{
    if(i%2)return part;
    return part.replace(/\|([\w+−\-ψφΦΨαβ]+)[>⟩]|(?<![A-Za-z0-9_\\])(?:q\d+|CNOT|SWAP|CZ|CX|HH|HZH|[xyz]|[HXYZST](?:\d+)?)(?![A-Za-z0-9_])/g,(token,state)=>{
      if(state)return '$|'+state.replace(/[ψφΦΨαβ]/g,c=>({ψ:'\\psi',φ:'\\phi',Φ:'\\Phi',Ψ:'\\Psi',α:'\\alpha',β:'\\beta'}[c])+' ')+'\\rangle$';
      const indexed=token.match(/^([qHXYZST])(\d+)$/);
      return '$'+(indexed?indexed[1]+'_{'+indexed[2]+'}':token.length>1&&!/^H[HZ]*$/.test(token)?'\\mathrm{'+token+'}':token)+'$';
    });
  }).join('');
}

function coursePlainNotation(text){
  // Native select menus cannot contain KaTeX HTML. Use readable Unicode there.
  return text.replace(/\|([\w+−\-ψφΦΨαβ]+)>/g,'|$1⟩')
    .replace(/\b(q|[HXYZST])(\d+)\b/g,(_,symbol,index)=>symbol+[...index].map(n=>'₀₁₂₃₄₅₆₇₈₉'[n]).join(''));
}

function typesetCourseMath(root){
  if(!root)return;
  const ignored='pre,code,script,style,textarea,annotation,.katex,.katex-display,[data-no-math]';
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
    const parent=node.parentElement;
    if(!parent||parent.closest(ignored))continue;
    if(parent.closest('svg'))continue;
    const text=parent.closest('select,option')?coursePlainNotation(node.data):courseNotation(node.data);
    if(text!==node.data)node.data=text;
  }
  renderMathInElement(root,{
    delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],
    ignoredTags:['script','noscript','style','textarea','pre','code','option','select','svg'],
    ignoredClasses:['katex','katex-display'],throwOnError:false
  });
  // SVG text uses native spans, preserving its coordinates and text-anchor.
  for(const label of root.querySelectorAll('svg text')){
    if(label.dataset.notation)continue;
    const original=label.textContent;
    const formatted=courseNotation(original);
    if(formatted===original)continue;
    label.dataset.notation='true';
    label.replaceChildren();
    for(const [i,part] of formatted.split(/\$([^$]*)\$/g).entries()){
      const span=document.createElementNS('http://www.w3.org/2000/svg','tspan');
      if(i%2){
        span.setAttribute('font-family','KaTeX_Main, Times New Roman, serif');
        const indexed=part.match(/^([qHXYZST])_\{(\d+)\}$/);
        if(indexed){
          span.textContent=indexed[1];span.setAttribute('font-style','italic');
          const sub=document.createElementNS(span.namespaceURI,'tspan');
          sub.setAttribute('baseline-shift','sub');sub.setAttribute('font-size','70%');
          sub.setAttribute('font-style','normal');sub.textContent=indexed[2];span.append(sub);
        }else{
          span.textContent=part.replace(/\\rangle/g,'⟩').replace(/\\mathrm\{([^}]+)\}/g,'$1')
            .replace(/\\(psi|phi|Phi|Psi|alpha|beta)\s*/g,(_,name)=>({psi:'ψ',phi:'φ',Phi:'Φ',Psi:'Ψ',alpha:'α',beta:'β'}[name]));
          if(/^[HXYZSTxyz]+$/.test(part))span.setAttribute('font-style','italic');
        }
      }else span.textContent=part;
      label.append(span);
    }
  }
}
