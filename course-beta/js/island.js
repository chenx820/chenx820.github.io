/* Production island navigation. Learning state remains in app.js/progress.js.
   All illustration colors are CSS tokens in island-theme.css. */
function journeyMilestoneIcon(isSign){
  if(isSign)return `<g class="journey-icon">
    <ellipse cy="17" rx="18" ry="4.5" fill="var(--map-leaf-pale)"/>
    <ellipse cy="17" rx="8" ry="2" fill="var(--map-land-shade)" opacity=".35"/>
    <g class="journey-sign">
      <path d="M-3 -8Q0 -10 3 -8L4 15Q0 18 -4 15Z" fill="var(--map-wood-shade)"/>
      <path d="M-1 -5L0 13" stroke="var(--map-wood-light)"/>
      <path d="M-18 -12Q-19 -16 -14 -16L10 -15Q13 -15 15 -12L19 -6Q20 -4 17 -2L12 3Q10 5 6 5L-14 4Q-18 4 -18 0Z" fill="var(--map-wood-shade)"/>
      <path d="M-18 -14Q-19 -18 -14 -18L10 -17Q13 -17 15 -14L19 -8Q20 -6 17 -4L12 1Q10 3 6 3L-14 2Q-18 2 -18 -2Z" fill="url(#journey-soft-wood)"/>
      <path d="M-14 -15Q-5 -16 7 -15" stroke="var(--map-sand-light)" opacity=".8"/>
      <path d="M-14 -1Q-10 -2 -6 -1M8 0L11 -1" stroke="var(--map-wood-shade)" opacity=".55"/>
      <path d="M-4 -7H10M6 -11L11 -7L6 -3" stroke="var(--map-cream)" class="journey-sign-arrow"/>
      <path d="M-13 -10Q-7 -13 -7 -7Q-12 -4 -13 -10Z" fill="var(--map-leaf)"/>
      <path d="M-12 -6L-9 -9" stroke="var(--map-sand-light)"/>
    </g>
    <path d="M-13 18Q-18 13 -16 11Q-12 12 -12 17Q-11 11 -8 11Q-7 15 -10 18M10 18Q9 13 11 12L14 17L17 13L16 18" fill="var(--map-land-shade)"/>
  </g>`;
  return `<g class="journey-icon">
    <ellipse cx="1" cy="17" rx="24" ry="5" fill="var(--map-leaf-pale)"/>
    <ellipse cx="1" cy="17" rx="17" ry="2.5" fill="var(--map-land-shade)" opacity=".35"/>
    <path class="journey-chest-glow" d="M-13 0L-25 -33Q0 -47 25 -33L13 0Z"/>
    <g class="journey-chest-inside">
      <path d="M-16 2Q-18 -3 -12 -5H14Q19 -4 17 1L13 5Z" fill="var(--map-wood-dark)"/>
      <ellipse cx="-7" cy="-1" rx="4.5" ry="2.5" fill="var(--map-sand)"/>
      <ellipse cx="1" cy="-2" rx="4.5" ry="2.5" fill="var(--map-gold)"/>
      <ellipse cx="8" cy="0" rx="4.5" ry="2.5" fill="var(--map-sand)"/>
      <path d="M0 -2L4 -7Q5 -8 6 -6L9 -2L5 2Z" fill="var(--map-jade)"/>
      <path d="M4 -6L5 -1L1 -2Z" fill="var(--map-river-light)"/>
    </g>
    <g class="journey-chest-lid">
      <path d="M10 -15Q20 -16 20 -6V-2Q20 1 14 3L9 -1Z" fill="var(--map-wood-shade)"/>
      <path d="M-17 0V-5Q-17 -16 -8 -16H6Q15 -16 15 -5V0Q15 2 12 2H-14Q-17 2 -17 0Z" fill="url(#journey-soft-wood)"/>
      <path d="M-14 -10Q-12 -14 -7 -14H5" stroke="var(--map-sand-light)" opacity=".8"/>
      <path d="M-10 1V-5Q-10 -11 -7 -15M8 1V-5Q8 -11 5 -15" stroke="var(--map-land-shade)" class="journey-chest-band"/>
      <path d="M-14 -3H12" stroke="var(--map-wood-shade)" opacity=".45"/>
      <rect x="-3.5" y="-2" width="7" height="6" rx="2.5" fill="var(--map-sand)"/>
    </g>
    <path d="M13 2L20 -2V9Q20 12 15 15L11 14Z" fill="var(--map-wood-shade)"/>
    <path d="M-17 2H15V11Q15 16 10 16H-12Q-17 16 -17 11Z" fill="var(--map-wood)"/>
    <path d="M-14 4H12M-13 10Q-4 9 3 11" stroke="var(--map-wood-shade)" opacity=".45"/>
    <path d="M-10 3V12Q-10 14 -8 14M8 3V12Q8 14 6 14" stroke="var(--map-land-shade)" class="journey-chest-band"/>
    <rect x="-3.5" y="2" width="7" height="7" rx="2.5" fill="var(--map-sand)"/>
    <path d="M-1 4Q3 3 2 6Q-1 8 -1 4Z" fill="var(--map-leaf)"/>
    <path d="M-21 18Q-24 13 -21 12L-18 17L-16 13L-15 18M17 18Q18 11 21 12L20 17L24 15L23 18" fill="var(--map-land-shade)"/>
  </g>`;
}

function courseIsland(got,total){
 const milestones=[Math.ceil(total/3),Math.ceil(total*2/3)];
 return `<div class="island-map journey-progress"><span class="sr-only" role="progressbar" aria-label="课程完成进度" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${got}" aria-valuetext="已完成 ${got} / ${total} 节"></span><svg class="journey-scene island-scene" viewBox="0 0 600 402" fill="none" aria-hidden="true">
<defs>
<linearGradient id="journey-soft-wood" x2="0" y2="1"><stop stop-color="var(--map-wood-light)"/><stop offset="1" stop-color="var(--map-wood)"/></linearGradient>
 <pattern id="water" width="38" height="31" patternUnits="userSpaceOnUse"><path d="M4 18Q9 21 14 18" stroke="var(--map-water-line)" style="stroke-width:1.4px" stroke-linecap="round"/></pattern>
 <pattern id="grass" width="33" height="29" patternUnits="userSpaceOnUse"><path d="M11 18l2 -3l3 3" stroke="var(--map-land-shade)" style="stroke-width:1px" opacity=".5"/></pattern>
 <g id="tree"><ellipse cy="22" rx="22" ry="7" fill="var(--map-leaf)" opacity=".3"/><path d="M-5 -4L-6 22Q0 26 6 22L4 -5Z" fill="var(--map-wood-shade)"/><path d="M-1 2V20" stroke="var(--map-wood)" style="stroke-width:2px"/><path d="M-23 -10C-31 -22 -20 -34 -12 -35C-12 -50 12 -51 15 -36C32 -34 33 -13 23 -9C18 6 -17 6 -23 -10Z" fill="var(--map-leaf)"/><path d="M-22 -21C-20 -30 -12 -28 -9 -36C-3 -45 12 -43 14 -33C21 -29 24 -19 19 -15C10 -7 -17 -8 -22 -21Z" fill="var(--map-leaf-light)"/><ellipse cx="-7" cy="-30" rx="5" ry="3" fill="var(--map-leaf-pale)" opacity=".7"/></g>
 <g id="flower"><path d="M0 3V-4M0 1L-4 -1" stroke="var(--map-leaf)" style="stroke-width:1.5px" stroke-linecap="round"/><g fill="var(--map-cream)"><circle cx="-2" cy="-5" r="2.5"/><circle cx="2" cy="-5" r="2.5"/><circle cy="-8" r="2.5"/><circle cy="-3" r="2.5"/></g><circle cy="-5" r="1.7" fill="var(--map-travel)"/></g>
 <g id="bush"><ellipse cy="5" rx="15" ry="4" fill="var(--map-land-shade)" opacity=".4"/><path d="M-15 0Q-16 -9 -7 -9Q-2 -19 6 -10Q17 -12 16 -1Q10 9 -15 0Z" fill="var(--map-land-shade)"/><path d="M-9 -5l3 2M5 -6l3 2" stroke="var(--map-land)" style="stroke-width:2px" stroke-linecap="round"/></g>
</defs>
<ellipse cx="305" cy="229" rx="282" ry="160" fill="var(--map-water)"/><ellipse cx="305" cy="229" rx="282" ry="160" fill="url(#water)"/>
<path d="M63 173C36 117 82 74 145 71C190 39 254 61 297 54C345 24 424 50 445 80C506 72 552 111 540 159C584 199 569 266 527 287C511 340 422 351 376 337C311 379 251 349 217 348C140 372 79 327 80 289C28 268 25 206 63 173Z" fill="var(--map-land-shade)" transform="translate(0 10)"/>
<path d="M63 173C36 117 82 74 145 71C190 39 254 61 297 54C345 24 424 50 445 80C506 72 552 111 540 159C584 199 569 266 527 287C511 340 422 351 376 337C311 379 251 349 217 348C140 372 79 327 80 289C28 268 25 206 63 173Z" fill="var(--map-bank)"/>
<path d="M76 174C52 120 91 88 151 85C197 55 255 76 300 68C346 42 414 63 440 94C493 85 538 118 526 165C570 199 550 255 515 276C496 326 424 338 377 322C311 362 258 334 216 335C146 354 94 315 94 278C45 257 42 208 76 174Z" fill="var(--map-land)"/>
<path d="M76 174C52 120 91 88 151 85C197 55 255 76 300 68C346 42 414 63 440 94C493 85 538 118 526 165C570 199 550 255 515 276C496 326 424 338 377 322C311 362 258 334 216 335C146 354 94 315 94 278C45 257 42 208 76 174Z" fill="url(#grass)"/>
<path d="M110 282C150 330 210 335 240 290S355 235 392 278S520 275 487 200S425 130 371 155S285 190 248 145S195 75 150 104" stroke="var(--map-land-shade)" style="stroke-width:28px" stroke-linecap="round"/>
<path class="journey-road" d="M110 279C150 327 210 332 240 287S355 232 392 275S520 272 487 197S425 127 371 152S285 187 248 142S195 72 150 101" stroke="var(--map-sand)" style="stroke-width:24px" stroke-linecap="round"/>
<path d="M110 277C150 325 210 330 240 285S355 230 392 273S520 270 487 195S425 125 371 150S285 185 248 140S195 70 150 99" stroke="var(--map-sand-light)" style="stroke-width:15px" stroke-linecap="round"/>
<path class="journey-travelled" d="M110 279C150 327 210 332 240 287S355 232 392 275S520 272 487 197S425 127 371 152S285 187 248 142S195 72 150 101" pathLength="100" stroke-dasharray="${got/total*100} 100" ${got?'':'visibility="hidden"'}/>
<path d="M355 77C359 104 320 99 320 126C320 151 347 154 341 190C334 218 308 225 320 251C329 271 308 284 310 305" stroke="var(--map-leaf-light)" style="stroke-width:24px" stroke-linecap="round"/>
<path d="M355 77C359 104 320 99 320 126C320 151 347 154 341 190C334 218 308 225 320 251C329 271 308 284 310 305" stroke="var(--map-river)" style="stroke-width:19px" stroke-linecap="round"/>
<path d="M349 91l-7 6M327 123l1 7M337 180l-3 9M315 290l1 6" stroke="var(--map-river-light)" style="stroke-width:2px" stroke-linecap="round"/>
<g transform="translate(331 164) rotate(9)"><rect x="-20" y="-13" width="40" height="26" rx="3" fill="var(--map-wood-shade)"/><path d="M-18 -10H18M-18 -4H18M-18 2H18M-18 8H18" stroke="var(--map-wood-light)" style="stroke-width:4px"/><path d="M-21 -14V14M21 -14V14" stroke="var(--map-wood-dark)" style="stroke-width:4px" stroke-linecap="round"/></g>
<g transform="translate(320 254) rotate(-8)"><rect x="-17" y="-12" width="34" height="24" rx="3" fill="var(--map-wood-shade)"/><path d="M-15 -9H15M-15 -3H15M-15 3H15M-15 9H15" stroke="var(--map-wood-light)" style="stroke-width:4px"/><path d="M-18 -13V13M18 -13V13" stroke="var(--map-wood-dark)" style="stroke-width:3px" stroke-linecap="round"/></g>
<use href="#tree" transform="translate(93 159) scale(.95)"/><use href="#tree" transform="translate(187 225) scale(.82)"/><use href="#tree" transform="translate(449 111) scale(.9)"/><use href="#tree" transform="translate(465 323) scale(.75)"/>
<use href="#bush" transform="translate(145 177)"/><use href="#bush" transform="translate(386 100)"/><use href="#bush" transform="translate(263 333)"/><use href="#bush" transform="translate(521 238) scale(.8)"/>
<use href="#flower" transform="translate(113 205)"/><use href="#flower" transform="translate(125 212) scale(.8)"/><use href="#flower" transform="translate(276 97)"/><use href="#flower" transform="translate(291 105) scale(.8)"/><use href="#flower" transform="translate(411 221)"/><use href="#flower" transform="translate(424 229) scale(.8)"/><use href="#flower" transform="translate(190 291)"/>



<g stroke="var(--map-water-line)" style="stroke-width:1.5px" stroke-linecap="round"><path d="M70 342q5 4 10 0M497 355q5 4 10 0M38 200q5 4 10 0M541 104q5 4 10 0"/></g>

<circle class="journey-endpoint${got===total?' is-reached':''}" cx="150" cy="101" r="5"/>
${milestones.map((n,i)=>`<g class="journey-milestone${got>=n?' is-reached':''}" data-progress="${n/total}" data-count="${n}"><g transform="translate(0 32)">${journeyMilestoneIcon(i===0)}<g class="journey-sparkles"><path d="M-25 -22v8m-4 -4h8M25 -28v8m-4 -4h8M2 -39v6m-3 -3h6"/></g></g></g>`).join('')}
      <g class="journey-runner" transform="translate(24 75)">
        <ellipse class="journey-cat-shadow" cy="1" rx="17" ry="4"/>
        <g class="journey-cat">
          <path class="journey-tail" d="M-10 -12Q-28 -13 -22 -26"/>
          <path class="journey-leg journey-leg-back" d="M-8 -10L-12 0M5 -10L9 0"/>
          <path class="journey-cat-body" d="M-13 -15Q-10 -24 2 -20L11 -15L9 -6H-10Z"/>
          <path class="journey-leg journey-leg-front" d="M-7 -10L-3 0M8 -10L13 0"/>
          <path class="journey-cat-head" d="M-5 -24L-8 -39L3 -33Q8 -35 13 -32L22 -41L21 -23Q19 -14 8 -15Q-3 -15 -5 -24Z"/>
          <g class="journey-eyes">
            <path class="journey-cat-eye" d="M-1 -27H7A4 4 0 0 1-1 -27Z"/>
            <ellipse class="journey-cat-eye" cx="15" cy="-26" rx="4" ry="5"/>
            <path class="journey-pupils" d="M4 -28V-25M16 -29V-23"/>
          </g>
        </g>
        <path class="journey-heart" d="M5 -54C-9 -62 -5 -72 2 -67L5 -64L8 -67C15 -72 19 -62 5 -54Z"/>
      </g>
</svg>${Object.entries(LEVELS).map(([key,level],i)=>`<button class="island-pin" data-chapter="${key}" aria-label="第 ${i+1} 章 ${level.name}，已完成 ${level.list.filter(id=>S.done[id]).length} / ${level.list.length} 节" aria-pressed="false"><span>${level.list.every(id=>S.done[id])?'✓':String(i+1).padStart(2,'0')}</span></button>`).join('')}</div>`;
}
let islandCatProgress=null;
function bindIslandJourney(got,total){
 const scene=document.querySelector('.island-scene'),road=scene.querySelector('.journey-road');
 const length=road.getTotalLength(),point=p=>road.getPointAtLength(length*p);
 const place=(el,p)=>{const q=point(p);el.setAttribute('transform',`translate(${q.x} ${q.y})`)};
 const runner=scene.querySelector('.journey-runner');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,arrival=null,target=islandCatProgress??got/total,lastTime=null;
 islandCatProgress=target;
 const paint=()=>{
  const cat=point(islandCatProgress);
  runner.setAttribute('transform',`translate(${cat.x-40} ${cat.y-32})`);
 };
 const stop=()=>{cancelAnimationFrame(frame);frame=0;lastTime=null;runner.classList.remove('is-running')};
 const finish=()=>{stop();const callback=arrival;arrival=null;callback?.()};
 const tick=time=>{
  if(!scene.isConnected){stop();return}
  if(lastTime===null)lastTime=time;
  // Arc length, rather than curve parameters, keeps speed constant through bends.
  const step=260*(time-lastTime)/1000/length;
  lastTime=time;
  const distance=target-islandCatProgress;
  islandCatProgress+=Math.sign(distance)*Math.min(Math.abs(distance),step);
  paint();
  if(islandCatProgress===target)finish();else frame=requestAnimationFrame(tick);
 };
 const move=(id,onArrival)=>{
  target=Math.max(0,allIds().indexOf(id))/total;
  arrival=onArrival;
  if(motion.matches){islandCatProgress=target;paint();finish();return}
  if(target===islandCatProgress){finish();return}
  runner.classList.add('is-running');
  if(!frame){lastTime=null;frame=requestAnimationFrame(tick)}
 };
 const reduceMotion=()=>{if(motion.matches&&frame){islandCatProgress=target;paint();finish()}};
 motion.addEventListener('change',reduceMotion);
 paint();
 const markers=[...scene.querySelectorAll('.journey-milestone')];
 markers.forEach(m=>place(m,+m.dataset.progress));
 let before=0;
 document.querySelectorAll('.island-pin').forEach(button=>{
  const p=point(before/total);button.style.left=`${p.x/6}%`;button.style.top=`${p.y/4.02}%`;
  before+=LEVELS[button.dataset.chapter].list.length;
 });
 const seenKey=STORE+'.journey-seen.v1';
 try{journeySeen=Number(localStorage.getItem(seenKey))||0}catch(e){}
 journeySeen=Math.min(Math.max(0,journeySeen),got);
 try{localStorage.setItem(seenKey,String(journeySeen))}catch(e){}
 const pending=markers.filter(m=>+m.dataset.count>journeySeen&&got>=+m.dataset.count);
 pending.forEach(m=>m.classList.add('is-pending'));
 let welcome=null;
 const reobserve=()=>{visibility.unobserve(scene);visibility.observe(scene)};
 const visibility=new IntersectionObserver(entries=>{
  if(!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.5)||!scene.isConnected)return;
  welcome=document.querySelector('.welcome-dialog[open]');
  if(welcome){welcome.addEventListener('close',reobserve,{once:true});return}
  pending.forEach((m,i)=>{m.style.setProperty('--milestone-delay',`${i*240}ms`);m.classList.remove('is-pending');m.classList.add('is-celebrating')});
  journeySeen=got;try{localStorage.setItem(seenKey,String(got))}catch(e){}
  visibility.disconnect();
 },{threshold:.5});
 visibility.observe(scene);
 disposeJourney=()=>{stop();arrival=null;motion.removeEventListener('change',reduceMotion);visibility.disconnect();welcome?.removeEventListener('close',reobserve)};
 return move;
}
function courseAchievementBadge(done){
 return `<svg class="achievement-badge${done?' is-complete':''}" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle class="achievement-rim" cx="14" cy="14" r="10.5"/>${done?'<path class="achievement-check" d="m9 14 3.3 3.3 6.7-6.6"/>':''}</svg>`;
}
function renderIslandHome(preferredChapter){
 const ids=allIds(),total=ids.length,got=ids.filter(id=>S.done[id]).length;
 const next=ids.find(id=>!S.done[id])||ids[0],chapters=Object.entries(LEVELS);
 let selected=LEVELS[preferredChapter]?preferredChapter:next.split('-')[0];
 app.innerHTML=progressHeader('',got/total*100)+`<main id="main-content" class="island-home shell">
  <div class="island-intro"><h1>量子计算入门课程</h1></div>
  ${progressNotice?`<p class="curriculum-note" role="status">${progressNotice}</p>`:''}
  ${courseIsComplete()?`<section class="completion-entry" aria-label="结课纪念"><div><strong>你已完成全部 ${chapters.length} 章 ${total} 节</strong><p>查看你的学习旅程，保存一张结课纪念卡。</p></div><button id="view-completion" class="primary">查看我的学习旅程</button></section>`:''}
  <div class="island-layout"><section class="island-panel" aria-labelledby="map-heading">${courseIsland(got,total)}<div class="island-progress"><span><strong>${got}</strong> / ${total} 节已完成</span><div class="island-progress-track" aria-hidden="true"><span style="width:${got/total*100}%"></span></div></div></section>
  <nav class="island-directory" aria-labelledby="syllabus-heading"><div class="syllabus-heading"><h2 id="syllabus-heading">课程目录</h2></div><div class="course-map">${chapters.map(([key,level],i)=>{
   return `<details class="level" id="chapter-${key}" data-level="${key}" name="course-chapters"><summary class="level-head" data-chapter="${key}"><span class="level-title"><span class="level-index">第 ${i+1} 章</span>${level.name}</span><span class="level-toggle" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 9 7 7 7-7"/></svg></span></summary><div class="level-rows">${level.list.map(id=>`<button class="map-row${S.done[id]?' done':''}${id===next?' current':''}" data-id="${id}" ${id===next?'aria-current="step"':''} aria-label="${LESSONS[id].title}，${S.done[id]?'已完成':S.resume[id]?'学习中':'未完成'}"><span class="map-no" aria-hidden="true">${courseAchievementBadge(!!S.done[id])}</span><span class="map-title">${LESSONS[id].title}</span></button>`).join('')}</div></details>`;
  }).join('')}</div><button class="primary start" id="start"></button></nav></div>
  <div class="home-bottom"><button id="reset" class="text-button">清除进度</button></div></main>`+siteFooter();
 document.getElementById('view-completion')?.addEventListener('click',showCourseCompletion);
 const directory=app.querySelector('.island-directory'),levels=[...directory.querySelectorAll('.level')];
 const pins=[...app.querySelectorAll('.island-pin')],start=directory.querySelector('#start');
 const moveCat=bindIslandJourney(got,total);
 // Wait until a newly completed badge is actually visible, including folded chapters.
 const stampObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   const row=entry.target,id=row.dataset.id;
   if(S.done[id]&&pendingAchievementStamps.delete(id)){
    const badge=row.querySelector('.achievement-badge');
    badge.classList.add('is-stamping');
    badge.addEventListener('animationend',()=>badge.classList.remove('is-stamping'),{once:true});
   }
   stampObserver.unobserve(row);
  });
 },{threshold:.5});
 directory.querySelectorAll('.map-row.done').forEach(row=>{
  if(pendingAchievementStamps.has(row.dataset.id))stampObserver.observe(row);
 });
 const disposeMap=disposeJourney;
 disposeJourney=()=>{stampObserver.disconnect();disposeMap()};
 // Lesson navigation is immediate; decorative travel only accompanies chapter selection.
 const enterLesson=id=>open(id);
 const syncChapter=()=>{
  if(!directory.isConnected)return;
  const expanded=levels.find(level=>level.open);
  if(expanded&&selected!==expanded.dataset.level){selected=expanded.dataset.level;moveCat(LEVELS[selected].list[0])}
  pins.forEach(pin=>pin.setAttribute('aria-pressed',pin.dataset.chapter===expanded?.dataset.level));
  const level=LEVELS[selected],target=level.list.find(id=>!S.done[id])||level.list[0];
  start.textContent=level.list.every(id=>S.done[id])?`复习第 ${Object.keys(LEVELS).indexOf(selected)+1} 章`:S.resume[target]||level.list.some(id=>S.done[id])?'继续学习':selected==='C1'?'开始第一节':'开始本章';
  start.onclick=()=>enterLesson(target);
 };
 // Native details supplies keyboard navigation and expanded semantics; the map opens the same directory.
 levels.forEach(level=>level.addEventListener('toggle',syncChapter));
 pins.forEach(pin=>pin.onclick=()=>{
  levels.forEach(level=>level.open=level.dataset.level===pin.dataset.chapter);
  moveCat(LEVELS[pin.dataset.chapter].list[0]);
  syncChapter();
 });
 directory.querySelectorAll('.map-row').forEach(button=>button.onclick=()=>enterLesson(button.dataset.id));
 syncChapter();
 document.getElementById('reset').onclick=()=>{if(confirm('清除这台设备上的学习进度？')){S.done={};S.resume={};pendingAchievementStamps.clear();islandCatProgress=0;save();saveResume();STUDIO.sessions={};QUBIT.sessions={};ENT.sessions={};LAB.sessions={};LAB.latest={};LAB.report=null;home()}};
 typesetMath(app);
}
