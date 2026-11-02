/* 课程外壳：目录、步骤与进度 */
// 暂停展示章首页；保留渲染与导航代码，改为 true 即可恢复。
const SHOW_CHAPTER_DIRECTORY=false;
const S={intro:false,lesson:null,i:0,picked:null,answers:{},passed:{},gateOK:false,carry:{},carrySnapshots:{},done:{},resume:{}};
// Transient feedback only; saved completion records never replay the stamp.
const pendingAchievementStamps=new Set();
const app=document.getElementById('app');
function codeToolbar(label='复制整段代码'){
  const safeLabel=String(label).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  return `<div class="code-toolbar"><span class="code-status" role="status"></span><button type="button" class="code-copy" data-copy-label="${safeLabel}" aria-label="${safeLabel}" title="${safeLabel}"><svg class="copy-symbol" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg><svg class="copy-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></button></div>`;
}
function codeBlock(code){
  const escaped=String(code).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<div class="code-block">${codeToolbar()}<pre><code>${escaped}</code></pre></div>`;
}
async function copyCode(text){
  try{
    if(navigator.clipboard&&window.isSecureContext){
      await navigator.clipboard.writeText(text);
      return;
    }
  }catch(e){}
  // Support local files and browsers where the Clipboard API is unavailable.
  const field=document.createElement('textarea'),focused=document.activeElement;
  field.value=text;
  field.setAttribute('readonly','');
  field.className='clipboard-fallback';
  document.body.appendChild(field);
  try{
    field.focus({preventScroll:true});
    field.select();
    if(!document.execCommand('copy'))throw new Error('Copy failed');
  }finally{
    field.remove();
    if(focused&&focused.isConnected)focused.focus({preventScroll:true});
  }
}
const copyStatusTimers=new WeakMap();
function clearCopyStatusTimer(status){
  const timers=copyStatusTimers.get(status);
  if(timers){
    clearTimeout(timers.fade);
    clearTimeout(timers.clear);
    copyStatusTimers.delete(status);
  }
  status.classList.remove('is-fading');
}
app.addEventListener('click',async event=>{
  const button=event.target.closest('.code-copy');
  if(!button||button.disabled)return;
  const block=button.closest('.code-block,[data-code-copy-scope]'),status=block.querySelector('.code-status');
  const copyLabel=button.dataset.copyLabel||'复制整段代码';
  const releaseBusy=CourseUI.beginButtonBusy(button,'正在复制',{iconOnly:true});
  clearCopyStatusTimer(status);
  status.textContent='';
  button.classList.remove('is-copied');
  button.setAttribute('aria-label',copyLabel);
  try{
    await copyCode(block.querySelector('code').textContent);
    status.textContent='已复制';
    button.classList.add('is-copied');
    button.setAttribute('aria-label','已复制');
    const fade=setTimeout(()=>status.classList.add('is-fading'),2380);
    const clear=setTimeout(()=>{
      status.textContent='';
      status.classList.remove('is-fading');
      copyStatusTimers.delete(status);
      button.classList.remove('is-copied');
      button.setAttribute('aria-label',copyLabel);
    },2500);
    copyStatusTimers.set(status,{fade,clear});
  }catch(e){
    status.textContent='复制失败，请手动选择代码复制';
  }finally{
    releaseBusy();
  }
});
const STORE=COURSE_STORE;
let progressNotice='';
const allIds=()=>Object.values(LEVELS).flatMap(level=>level.list);
function load(){
 let result;
 try{result=courseLoadProgress(localStorage,allIds())}catch(e){result={done:{},error:'当前浏览器无法保存进度。'}}
 S.done=result.done;
 progressNotice=result.error||'';
 try{S.resume=courseLoadResume(localStorage,LESSONS,S.done)}catch(e){S.resume={}}
}
function save(){try{S.done=courseCleanProgress(S.done,allIds());localStorage.setItem(STORE,JSON.stringify(S.done))}catch(e){progressNotice='当前浏览器无法保存进度；关闭后可能需要重新学习。'}}
function saveResume(){
 try{localStorage.setItem(COURSE_RESUME_STORE,JSON.stringify(S.resume))}catch(e){progressNotice='当前浏览器无法保存进度；关闭后可能需要重新学习。'}
}
function rememberStep(){
 if(!S.lesson||S.intro||S.done[S.lesson.id])return;
 S.resume[S.lesson.id]={revision:courseLessonRevision(S.lesson),step:S.i,answers:S.answers,carry:S.carry,carrySnapshots:S.carrySnapshots};
 saveResume();
}
window.addEventListener('pagehide',rememberStep);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')rememberStep()});
function fill(t){return String(t).replace(/\{([A-Za-z_]\w*)\}/g,(m,k)=>S.carry[k]!==undefined?S.carry[k]:m)}
function typesetMath(root){typesetCourseMath(root)}
function progressHeader(label,progress){return `<header class="site-header"><div class="shell"><div class="header-row"><a class="brand" href="https://space-qat.com/" aria-label="访问量立方官网"><img src="spaceqat-logo.png?v=20261031" alt="量立方 SpaceQat" width="4221" height="1639"></a><span class="step-label">${label}</span></div><div class="progress" role="progressbar" aria-label="课程完成进度" aria-valuemin="0" aria-valuemax="${allIds().length}" aria-valuenow="${allIds().filter(id=>S.done[id]).length}"><span style="--progress:${progress}%"></span></div></div></header>`}
function siteFooter(){return `<footer class="site-footer"><div class="shell"><span>© 2026 量立方 SpaceQat</span><a href="https://space-qat.com/">量立方官网</a></div></footer>`}
function showWelcome(){
  const dialog=document.createElement('dialog');
  dialog.className='welcome-dialog';
  dialog.setAttribute('aria-labelledby','welcome-title');
  dialog.setAttribute('aria-describedby','welcome-intro');
  dialog.innerHTML=`<section class="welcome-card">
    <a href="https://space-qat.com/" aria-label="访问量立方官网"><img class="welcome-brand" src="spaceqat-logo.png?v=20261031" alt="量立方 SpaceQat" width="116"></a>
    <h2 id="welcome-title" tabindex="-1" autofocus>欢迎走进量子计算的世界</h2>
    <p id="welcome-intro">面向零基础学习者，通过问答、实验和代码示例认识量子计算。</p>
    <div class="welcome-credit"><img src="assets/openqi-mark.png" alt="" width="48"><p>本互动课程由<strong><a href="https://open-qi.com/" target="_blank" rel="noopener noreferrer">通源量智</a></strong>贡献</p></div>
    <button class="primary welcome-start" type="button">开始学习</button>
  </section>`;
  dialog.querySelector('.welcome-start').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{
    document.body.classList.remove('welcome-open');
    dialog.remove();
    document.getElementById('start')?.focus({preventScroll:true});
  },{once:true});
  document.body.append(dialog);
  document.body.classList.add('welcome-open');
  dialog.showModal();
}
let disposeJourney=()=>{};
let journeySeen=0;
function home(){
 window.CourseDirectory?.dispose();
 disposeJourney();
 rememberStep();
 const chapter=S.lesson?.id.split('-')[0];
 S.lesson=null;S.intro=false;
 renderIslandHome(chapter);
}
function open(id,step,chapterEntry=false){
 if(!LESSONS[id])return;
 disposeJourney();
 islandCatProgress=allIds().indexOf(id)/allIds().length;
 rememberStep();
 const saved=step===undefined&&!S.done[id]?S.resume[id]:null;
 S.lesson=LESSONS[id];S.lesson.id=id;S.i=step??saved?.step??0;
 S.answers=saved?.answers||{};S.passed={};S.carry=saved?.carry||{};S.carrySnapshots=saved?.carrySnapshots||{};
 S.intro=SHOW_CHAPTER_DIRECTORY&&(chapterEntry||(step===undefined&&!saved&&LEVELS[id.split('-')[0]].list[0]===id));
 if(S.intro)renderChapterTitle();else render();
 window.scrollTo(0,0);
}
function renderChapterTitle(){
 if(!SHOW_CHAPTER_DIRECTORY){S.intro=false;render();return}
 window.CourseDirectory?.dispose();
 disposeJourney();
 S.intro=true;
 const id=S.lesson.id,chapter=id.split('-')[0],level=LEVELS[chapter],number=Object.keys(LEVELS).indexOf(chapter)+1,ids=allIds();
 const previousId=ids[ids.indexOf(level.list[0])-1];
 const completed=level.list.filter(id=>S.done[id]).length;
 app.innerHTML=progressHeader(`第 ${number} 章 / 共 ${Object.keys(LEVELS).length} 章`,ids.filter(id=>S.done[id]).length/ids.length*100)+`
 <main id="main-content" class="chapter-title-main shell">
   <div class="chapter-title-meta"><span>量子计算入门</span><button id="quit" class="text-button">返回课程地图</button></div>
   <section class="chapter-title-card" aria-labelledby="chapter-title">
     <div class="chapter-cover-intro">
       <p class="chapter-cover-label">第 ${number} 章</p>
       <h1 id="chapter-title" tabindex="-1">${level.name}</h1>
       <div class="chapter-cover-progress"><span>本章进度</span><span>已完成 ${completed} / ${level.list.length} 节</span></div>
       <progress class="chapter-cover-meter" max="${level.list.length}" value="${completed}" aria-label="本章学习进度"></progress>
     </div>
     <div class="chapter-cover-outline">
       <div class="chapter-outline-heading"><h2>本章内容</h2></div>
       <ol class="chapter-lesson-list">${level.list.map((lessonId,i)=>`<li><button class="chapter-lesson-link" data-chapter-lesson="${lessonId}"><span class="chapter-lesson-index" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span class="chapter-lesson-copy"><span class="chapter-lesson-title">${LESSONS[lessonId].title}</span><span class="chapter-lesson-state">${S.done[lessonId]?'已完成':S.resume[lessonId]?'学习中':'未开始'}</span></span><span class="chapter-lesson-badge" aria-hidden="true">${courseAchievementBadge(!!S.done[lessonId])}</span></button></li>`).join('')}</ol>
       <div class="chapter-title-actions"><button id="back" class="ghost">${previousId?'返回上一章':'返回课程地图'}</button><button id="chapter-start" class="primary">${S.resume[id]?'继续学习':'开始本章'}</button></div>
     </div>
   </section>
 </main>`+siteFooter();
 document.getElementById('quit').onclick=()=>{home();window.scrollTo(0,0)};
 document.getElementById('back').onclick=()=>{if(previousId)open(previousId,LESSONS[previousId].pages.length-1);else home();window.scrollTo(0,0)};
 document.getElementById('chapter-start').onclick=()=>{S.intro=false;render();window.scrollTo(0,0);app.querySelector('h1').setAttribute('tabindex','-1');app.querySelector('h1').focus({preventScroll:true})};
 app.querySelectorAll('[data-chapter-lesson]').forEach(button=>button.onclick=()=>{
  open(button.dataset.chapterLesson);
  if(S.intro){S.intro=false;render();}
  const heading=app.querySelector('h1');heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});
 });
 document.getElementById('chapter-title').focus({preventScroll:true});
}
function next(){
  const lesson=S.lesson;
  S.carrySnapshots[S.i]={...S.carry};
  if(S.i<lesson.pages.length-1){S.i++;render();window.scrollTo(0,0);return}
  const wasComplete=courseIsComplete();
  if(!S.done[lesson.id])pendingAchievementStamps.add(lesson.id);
  S.done[lesson.id]=1;save();
  delete S.resume[lesson.id];saveResume();
  if(!wasComplete&&courseIsComplete()){showCourseCompletion();return}
  const nx=nextId(lesson.id);if(nx)open(nx,undefined,nx.split('-')[0]!==lesson.id.split('-')[0]);else{home();window.scrollTo(0,0)}
}
function previous(){
  if(!S.lesson)return;
  S.carrySnapshots[S.i]={...S.carry};
  if(S.i===0){
    if(SHOW_CHAPTER_DIRECTORY&&LEVELS[S.lesson.id.split('-')[0]].list[0]===S.lesson.id){renderChapterTitle();window.scrollTo(0,0);return}
    const ids=allIds(),index=ids.indexOf(S.lesson.id),id=ids[index-1];
    if(id){open(id,LESSONS[id].pages.length-1);return}
    home();window.scrollTo(0,0);return;
  }
  S.i--;render();window.scrollTo(0,0);
}
function nextId(id){const ids=allIds(),k=ids.indexOf(id);return k>=0&&k<ids.length-1?ids[k+1]:null}
function render(){
  window.CourseDirectory?.dispose();
  disposeJourney();
  S.picked=null;S.gateOK=false;
  const lesson=S.lesson,page=lesson.pages[S.i],ids=allIds(),idx=ids.indexOf(lesson.id),level=LEVELS[lesson.id.split('-')[0]],chapterNumber=Object.values(LEVELS).indexOf(level)+1;
  const snapshot=S.carrySnapshots[S.i];
  if(snapshot)S.carry={...snapshot};
  app.innerHTML=progressHeader(`${idx+1} / ${ids.length}`,ids.filter(id=>S.done[id]).length/ids.length*100)+`<main id="main-content" class="lesson-main shell"><div class="lesson-meta"><span class="lesson-no">第 ${chapterNumber} 章 / ${level.name}</span><button id="quit" class="text-button map-button" aria-label="课程地图" title="课程地图"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></svg></button></div><div class="lesson-card"><div class="thread"><h1>${lesson.ask}</h1></div><div class="dots" aria-label="本节步骤 ${S.i+1} / ${lesson.pages.length}">${lesson.pages.map((_,j)=>`<span class="dot${j<=S.i?' on':''}"></span>`).join('')}</div><div class="screen" id="scr" tabindex="0" role="region" aria-label="课程内容"></div></div><div class="bottom"><p class="hintline" id="hint" role="status"></p><div class="lesson-actions"><button class="ghost back" id="back">上一步</button><button class="primary go" id="go"></button></div></div></main>`+siteFooter();
  document.getElementById('quit').onclick=()=>{home();window.scrollTo(0,0)};document.getElementById('back').onclick=previous;
  if(idx===0&&S.i===0)document.getElementById('back').textContent='返回地图';document.getElementById('go').onclick=next;
  window.CourseDirectory?.mount();
  ({ask:pAsk,say:pSay,show:pShow,play:pPlay,flaw:pFlaw,end:pEnd})[page.t](page);
  typesetMath(app);
  if(S.passed[S.i]&&page.t==='play'&&!['lab','qubit','teleportLesson','groverLock'].includes(page.c)){
    go('继续',true);hint('');
  }
  if(snapshot)S.carry={...snapshot};
  rememberStep();
}
function go(label,on){const b=document.getElementById('go');b.textContent=label;b.disabled=!on}
function hint(s){const node=document.getElementById('hint');node.textContent=s||'';typesetMath(node)}
function lead(p){
  const art=p.illustration;
  const image=art?`<img class="lesson-illustration${art.wide?' lesson-illustration--wide':''}" src="${art.src}" alt="${art.alt}" width="${art.width||2164}" height="${art.height||726}">`:'';
  return (p.circuit?entLessonCircuit(p.circuit):image)+(p.carry?`<p class="carry">${fill(p.carry)}</p>`:'');
}
const VERDICT_ICON={
  right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
  wrong:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  retry:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg>'
};
function answerVerdict(s,kind,text){
  s.querySelector('.answer-verdict')?.remove();
  const anchor=s.querySelector('.opts')||s.lastElementChild;
  anchor.insertAdjacentHTML('afterend',`<p class="answer-verdict is-${kind}" role="status">${VERDICT_ICON[kind]}<span>${text}</span></p>`);
}
function chooseOption(p,s,b,restoring=false){
  if(S.picked!==null)return;
  const pickedIndex=+b.dataset.j;
  // 三个及以上选项时，第一次答错只标出这一项并给一次重选机会；两个选项重选等于直接给答案，不提供。
  if(!restoring&&pickedIndex!==p.a&&p.o.length>2&&!s.dataset.retried){
    s.dataset.retried='1';
    b.disabled=true;b.classList.add('tried');
    b.insertAdjacentHTML('afterbegin','<span class="mark no" aria-hidden="true">✕</span>');
    if(Array.isArray(p.f)&&p.f[pickedIndex])b.insertAdjacentHTML('afterend',`<div class="opt-note wrong">${fill(p.f[pickedIndex])}</div>`);
    answerVerdict(s,'retry','不对，再想一想。你还有一次机会。');
    typesetMath(s);
    return;
  }
  S.picked=pickedIndex;
  S.answers[S.i]=S.picked;
  s.querySelectorAll('.opt').forEach((x,j)=>{
    x.disabled=true;
    if(j!==p.a&&j!==S.picked)return;
    const right=j===p.a;
    x.classList.add(right?'right':'wrong');
    x.insertAdjacentHTML('afterbegin',`<span class="mark ${right?'ok':'no'}" aria-hidden="true">${right?'✓':'✕'}</span>`);
    if(Array.isArray(p.f)&&p.f[j]){
      const noteId=`opt-note-${j}`;
      x.insertAdjacentHTML('afterend',`<div class="opt-note ${right?'right':'wrong'}" id="${noteId}">${fill(p.f[j])}</div>`);
      x.setAttribute('aria-describedby',noteId);
    }
  });
  s.querySelectorAll('.opt-item>.opt-note').forEach(note=>{if(!note.id)note.remove()});
  s.querySelectorAll('.opt.tried').forEach(x=>{x.classList.add('wrong');x.querySelectorAll('.mark').forEach((m,k)=>{if(k)m.remove()})});
  const correct=S.picked===p.a;
  answerVerdict(s,correct?'right':'wrong',correct?(s.dataset.retried?'对了！这次答对了。':'答对了！'):(s.dataset.retried?'这次也不对，看看下面的解析。':'答错了，看看下面的解析。'));
  if(typeof p.f==='string')s.insertAdjacentHTML('beforeend',`<div class="fb"><b>本题解析</b>${fill(p.f)}</div>`);
  if(p.review)s.insertAdjacentHTML('beforeend',questionReview(p.review));
  if(p.feedbackCircuit)s.insertAdjacentHTML('beforeend',`<div class="answer-circuit">${entLessonCircuit(p.feedbackCircuit)}</div>`);
  typesetMath(s);
  go('继续',true);hint('');
  rememberStep();
}
function questionReview(items){
  return `<section class="answer-review" aria-label="知识回顾"><h3>顺手复习</h3><dl>${items.map(([label,detail])=>`<div><dt>${fill(label)}</dt><dd>${fill(detail)}</dd></div>`).join('')}</dl></section>`;
}
/* ---------- 猜 ---------- */
function pAsk(p){
  const s=document.getElementById('scr');
  s.innerHTML=lead(p)+`<p class="q">${fill(p.q)}</p><div class="opts">${
    p.o.map((o,j)=>`<div class="opt-item"><button class="opt" data-j="${j}">${o}</button></div>`).join('')}</div>`;
  if(p.multi){setupMulti(p,s);return;}
  go('继续',false);hint('');
  s.querySelectorAll('.opt').forEach(b=>b.onclick=()=>chooseOption(p,s,b));
  restoreAnswer(p,s);
}
function setupMulti(p,s){
  const saved=S.answers[S.i];
  const selected=new Set(Array.isArray(saved?.selected)?saved.selected:[]);
  const options=[...s.querySelectorAll('.opt')];
  const confirm=document.getElementById('go');
  confirm.classList.add('multi-confirm');
  const refresh=()=>{
    options.forEach((b,j)=>{b.classList.toggle('selected',selected.has(j));b.setAttribute('aria-pressed',String(selected.has(j)));});
    confirm.disabled=selected.size===0;
  };
  const submit=()=>{
    if(!selected.size)return;
    S.answers[S.i]={selected:[...selected],submitted:true};
    options.forEach((b,j)=>{
      b.disabled=true;
      b.classList.remove('selected');
      const right=p.a.includes(j);
      if(!right&&!selected.has(j))return;
      b.classList.add(right?'right':'wrong');
      b.insertAdjacentHTML('afterbegin',`<span class="mark ${right?'ok':'no'}" aria-hidden="true">${right?'✓':'✕'}</span>`);
      if(Array.isArray(p.f)&&p.f[j]){
        const noteId=`opt-note-${j}`;
        b.insertAdjacentHTML('afterend',`<div class="opt-note ${right?'right':'wrong'}" id="${noteId}">${fill(p.f[j])}</div>`);
        b.setAttribute('aria-describedby',noteId);
      }
    });
    const allRight=selected.size===p.a.length&&p.a.every(j=>selected.has(j));
    answerVerdict(s,allRight?'right':'wrong',allRight?'全部答对！':'有遗漏或多选了，看看下面的解析。');
    if(typeof p.f==='string')s.insertAdjacentHTML('beforeend',`<div class="fb"><b>本题解析</b>${fill(p.f)}</div>`);
    if(p.feedbackCircuit)s.insertAdjacentHTML('beforeend',`<div class="answer-circuit">${entLessonCircuit(p.feedbackCircuit)}</div>`);
    typesetMath(s);
    confirm.classList.remove('multi-confirm');confirm.onclick=next;go('继续',true);hint('');
    rememberStep();
  };
  options.forEach((b,j)=>b.onclick=()=>{
    selected.has(j)?selected.delete(j):selected.add(j);
    S.answers[S.i]={selected:[...selected],submitted:false};
    refresh();
    rememberStep();
  });
  confirm.onclick=submit;
  go('确认答案',false);hint('');
  refresh();
  if(saved?.submitted)submit();
}
function restoreAnswer(p,s){
  const answer=S.answers[S.i];
  if(answer!==undefined){
    const button=s.querySelectorAll('.opt')[answer];
    if(button)chooseOption(p,s,button,true);
  }
}

/* ---------- 说 / 揭 ---------- */
function pSay(p){
  document.getElementById('scr').innerHTML=lead(p)+p.b.map(t=>`<p class="say${t.startsWith('$$')?' math-line':''}">${fill(t)}</p>`).join('');
  go('继续',true);
}

/* ---------- 看 ---------- */
function pShow(p){
  document.getElementById('scr').innerHTML=lead(p)+`<div>${ART[p.art](p)}</div><p class="cap">${fill(p.cap)}</p>`;
  if(p.art==='hardwareOverview')bindHardwareOverview(document.getElementById('scr'));
  if(p.art==='timeline'){
    const events=[...document.querySelectorAll('#scr .history-event')],step=S.i,answers=S.answers;
    const saved=answers[step]?.historyIndex;
    if(Number.isInteger(saved)){
      events.forEach(event=>event.open=false);
      if(events[saved])events[saved].open=true;
    }
    events.forEach(event=>event.addEventListener('toggle',()=>{
      if(event.isConnected){answers[step]={historyIndex:events.findIndex(item=>item.open)};rememberStep();}
    }));
  }
  if(['careerDirections','careerNext'].includes(p.art))bindCareerExploration(document.getElementById('scr'),p);
  go('继续',true);
}

/* ---------- 找错 ---------- */
function pFlaw(p){
  const s=document.getElementById('scr');
  s.innerHTML=lead(p)+`<div class="flawbox"><p>${fill(p.claim)}</p></div>
    <p class="flawq">${p.q||'这段推理错在哪一步？'}</p>
    <div class="opts">${p.o.map((o,j)=>`<div class="opt-item"><button class="opt" data-j="${j}">${o}</button></div>`).join('')}</div>`;
  go('继续',false);hint('');
  s.querySelectorAll('.opt').forEach(b=>b.onclick=()=>chooseOption(p,s,b));
  restoreAnswer(p,s);
}

/* ---------- 玩 ---------- */
function pPlay(p){
  const s=document.getElementById('scr');
  const intro=p.intro?`<div class="play-intro">${p.intro.map(text=>`<p class="say">${fill(text)}</p>`).join('')}</div>`:'';
  s.innerHTML=lead(p)+intro+`<p class="task">${fill(p.task)}</p><div id="slot"></div>`;
  go('继续',false);hint(p.gh||'');
  COMP[p.c](document.getElementById('slot'),p);
}
function pass(msg){
  if(S.gateOK)return;S.gateOK=true;S.passed[S.i]=true;go('继续',true);hint(msg||'');
}

/* ---------- 收 ---------- */
function pEnd(p){
  const paragraphs=fill(p.line).split(/<br\s*\/?\s*>/i).map(line=>`<p>${line}</p>`).join('');
  document.getElementById('scr').innerHTML=p.recap?`<section class="lesson-recap" aria-label="本节小结">
    <h2>${fill(p.line)}</h2>
    <dl class="recap-cases">${p.recap.map(item=>`<div><dt>${item.name}</dt><dd><p>${fill(item.detail)}</p><strong>${item.note}</strong></dd></div>`).join('')}</dl>
    <div class="recap-bridge"><h3>${p.bridge}</h3><p>${p.next}</p></div>
  </section>`:`<div class="done">
    <div class="seal">✓</div><div class="able${p.steps?' able-checklist':''}">${paragraphs}${p.steps?`<ol>${p.steps.map(step=>`<li>${fill(step)}</li>`).join('')}</ol>`:''}</div></div>`;
  const nx=nextId(S.lesson.id);
  const finishesCourse=!courseIsComplete()&&allIds().every(id=>id===S.lesson.id||S.done[id]);
  go(finishesCourse?'完成学习，查看旅程':nx?(nx.split('-')[0]===S.lesson.id.split('-')[0]?'下一节':'进入下一章'):'完成本节，返回地图',true);
}
