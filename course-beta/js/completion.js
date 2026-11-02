/* Completion is derived from the current curriculum, never a separate saved flag. */
function courseIsComplete(){
 const ids=allIds();
 return ids.length>0&&ids.every(id=>S.done[id]);
}
const COMPLETION_TAKEAWAYS=[
 ['认识量子比特','C2'],
 ['理解纠缠与多比特线路','C3'],
 ['体验量子编程','C7']
];
// One line per chapter for the on-page recap; the keepsake card keeps its three short takeaways.
const COMPLETION_RECAP={
 C1:'分清量子计算擅长什么、不擅长什么',
 C2:'用概率幅描述量子态，理解测量与相位',
 C3:'用 CNOT 制备纠缠，理解不可克隆与传态',
 C4:'认识四条硬件路线，以及编译做什么',
 C5:'分清测量随机性与噪声，了解纠错思路',
 C6:'用干涉理解 Grover 搜索与 Shor 算法',
 C7:'用 FatQat 写出自己的第一个量子程序'
};
// The draft stays in memory only. No account or public profile is created.
const completionDraft={nickname:'',anonymous:false};
function completionImage(src){
 return new Promise((resolve,reject)=>{
  const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Image unavailable'));image.src=src;
 });
}
async function completionIslandImage(host){
 host.innerHTML=courseIsland(allIds().length,allIds().length);
 const svg=host.querySelector('svg'),road=svg.querySelector('.journey-road'),length=road.getTotalLength();
 const runner=svg.querySelector('.journey-runner');
 runner.setAttribute('transform','translate(150 95) scale(1.35)');
 // Finish-line pose for the keepsake only: front paw raised with a pennant, tail up, smiling eyes, sparkles.
 const cat=runner.querySelector('.journey-cat');
 runner.querySelector('.journey-leg-front')?.setAttribute('d','M-7 -10L-3 0M8 -13L25 -20');
 runner.querySelector('.journey-tail')?.setAttribute('d','M-10 -12Q-24 -18 -19 -32');
 runner.querySelector('.journey-eyes')?.replaceChildren();
 cat.insertAdjacentHTML('beforeend',`<path d="M0 -26Q3 -30 6 -26M12 -26Q15 -30 18 -26" fill="none" stroke="var(--map-cat-eye)" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M27 -14L30 -60" stroke="var(--map-wood-shade)" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M30 -60L52 -52L29 -44Z" fill="var(--course-accent-9)" stroke="var(--course-accent-11)" stroke-width="1.2" stroke-linejoin="round"/>
  <circle cx="26" cy="-20" r="3" fill="var(--map-ink)"/>`);
 runner.insertAdjacentHTML('beforeend',['M-32 -44','M-20 -62','M58 -30','M62 -68'].map((m,i)=>{const r=[4,3,3.5,2.6][i];return `<path d="${m}m0 ${-r*1.6}q${r*.25} ${r*1.35} ${r*1.6} ${r*1.6}q${-r*1.35} ${r*.25} ${-r*1.6} ${r*1.6}q${-r*.25} ${-r*1.35} ${-r*1.6} ${-r*1.6}q${r*1.35} ${-r*.25} ${r*1.6} ${-r*1.6}z" fill="var(--map-gold)"/>`}).join(''));
 svg.querySelectorAll('.journey-milestone').forEach(marker=>{
  const point=road.getPointAtLength(length*Number(marker.dataset.progress));
  marker.setAttribute('transform',`translate(${point.x} ${point.y})`);
 });
 let completed=0;
 const stops=document.createElementNS('http://www.w3.org/2000/svg','g');
 Object.values(LEVELS).forEach(level=>{
  const point=road.getPointAtLength(length*completed/allIds().length);
  const stop=document.createElementNS('http://www.w3.org/2000/svg','g');
  stop.setAttribute('transform',`translate(${point.x} ${point.y})`);
  stop.innerHTML='<circle r="10" fill="#fff" stroke="var(--map-wood-dark)" stroke-width="1.2"/><path d="m-4 0 3 3 5-6" fill="none" stroke="var(--map-ink)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>';
  stops.append(stop);completed+=level.list.length;
 });
 svg.insertBefore(stops,svg.querySelector('.journey-runner'));
 // Freeze the existing map's paint and transforms into a self-contained SVG.
 // No screenshot library, external fonts, or remote resources enter the canvas.
 const clone=svg.cloneNode(true),source=[svg,...svg.querySelectorAll('*')],target=[clone,...clone.querySelectorAll('*')];
 const properties=['fill','fill-opacity','stroke','stroke-width','stroke-opacity','stroke-linecap','stroke-linejoin','stroke-dasharray','stroke-dashoffset','opacity','stop-color','stop-opacity','transform','transform-origin','display'];
 source.forEach((node,i)=>{
  const style=getComputedStyle(node);
  target[i].removeAttribute('class');
  properties.forEach(property=>{
   const value=style.getPropertyValue(property).replace(/url\(["']?[^)#]*#([^)"]+)["']?\)/g,'url(#$1)');
   target[i].style.setProperty(property,value);
  });
 });
 clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
 clone.setAttribute('width','600');clone.setAttribute('height','402');
 const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml;charset=utf-8'}));
 try{return await completionImage(url)}finally{URL.revokeObjectURL(url);host.replaceChildren()}
}
function drawCompletionCard(canvas,art,logo,nickname){
 const c=canvas.getContext('2d'),W=1080,H=1440;
 c.save();
 const font='"SpaceQat Course Sans", "PingFang SC", "Microsoft YaHei", sans-serif';
 const text=(value,x,y,size=30,weight=400,fill,align='left',max=936)=>{
  c.fillStyle=fill;c.textAlign=align;c.textBaseline='alphabetic';c.font=`${weight} ${size}px ${font}`;
  while(c.measureText(value).width>max&&size>18){size--;c.font=`${weight} ${size}px ${font}`}
  c.fillText(value,x,y);return c.measureText(value).width;
 };
 const roundRect=(x,y,w,h,r,fill)=>{c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()};
 const check=(x,y,r,bg,fg)=>{c.fillStyle=bg;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.strokeStyle=fg;c.lineWidth=r*.24;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(x-r*.42,y);c.lineTo(x-r*.1,y+r*.32);c.lineTo(x+r*.45,y-r*.3);c.stroke()};
 // The island floats on a soft sea; a paper panel at the bottom holds the numbers and takeaways.
 // Course light-theme tokens (island-theme.css), fixed so the PNG never turns dark:
 // accent-2→accent-4 sea, --card panel, --rule divider, --ink/--muted text, accent-11 emphasis, accent-9 completion marks.
 const sea1='#ebfafa',sea2='#c8f1f3',paper='#ffffff',rule='#d5dfe1',navy='#171717',teal='#276f73',muted='#525252',green='#a0ecee';
 const sea=c.createLinearGradient(0,0,0,1060);sea.addColorStop(0,sea1);sea.addColorStop(1,sea2);
 c.clearRect(0,0,W,H);c.fillStyle=sea;c.fillRect(0,0,W,H);
 c.strokeStyle='#ffffffb0';c.lineWidth=4;c.lineCap='round';
 [[120,250],[880,300],[90,980],[960,940],[760,215]].forEach(([x,y])=>{c.beginPath();c.moveTo(x-26,y);c.quadraticCurveTo(x-13,y-10,x,y);c.quadraticCurveTo(x+13,y+10,x+26,y);c.stroke()});
 c.drawImage(logo,72,64,170,170*logo.naturalHeight/logo.naturalWidth);
 roundRect(838,72,170,56,28,'#ffffffcc');text('结课纪念',923,110,28,500,teal,'center');
 c.save();c.font='112px "SpaceQat Journey Play"';c.textAlign='center';c.textBaseline='alphabetic';c.lineJoin='round';
 c.strokeStyle='#fff';c.lineWidth=16;c.strokeText('我完成了量子之旅',540,318);c.fillStyle=navy;c.fillText('我完成了量子之旅',540,318);c.restore();
 if(nickname){c.font=`500 34px ${font}`;const w=Math.min(c.measureText(nickname).width+64,800);roundRect(540-w/2,348,w,60,30,'#fff');text(nickname,540,390,34,500,teal,'center',w-40)}
 const artWidth=1010;c.drawImage(art,35,nickname?392:368,artWidth,artWidth*402/600);
 const top=1036;
 c.save();c.shadowColor='#153d4022';c.shadowBlur=30;c.shadowOffsetY=-4;roundRect(36,top,1008,368,40,paper);c.restore();
 const chapters=Object.keys(LEVELS).length,lessons=allIds().length;
 const w1=text(String(chapters),96,top+132,112,700,navy);text('章',96+w1+10,top+132,40,500,muted);
 const w2=text(String(lessons),270,top+132,112,700,navy);text('节',270+w2+10,top+132,40,500,muted);
 text('全部完成',96,top+184,30,500,teal);
 COMPLETION_TAKEAWAYS.forEach(([title],i)=>{const y=top+62+i*58;check(600,y,18,green,navy);text(title,634,y+11,32,500,navy,'left',380)});
 c.strokeStyle=rule;c.lineWidth=2;c.beginPath();c.moveTo(96,top+228);c.lineTo(984,top+228);c.stroke();
 text('开启你的量子学习之旅',96,top+296,40,600,navy);
 text('量立方 SpaceQat',96,top+340,28,400,muted);
 text('space-qat.com',984,top+310,34,600,teal,'right');
 c.restore();
}
function showCourseCompletion(){
 if(!courseIsComplete()){home();return}
 window.CourseDirectory?.dispose();disposeJourney();rememberStep();S.lesson=null;S.intro=false;
 app.innerHTML=progressHeader('学习旅程已完成',100)+`<main id="main-content" class="completion-page shell">
  <header class="completion-hero">
   <span class="completion-mark" aria-hidden="true">${courseAchievementBadge(true)}</span>
   <h1 id="completion-title" tabindex="-1">你完成了量子之旅</h1>
   <p class="completion-count">全部 ${Object.keys(LEVELS).length} 章、${allIds().length} 节已完成。从“算不完”的问题出发，你一路走过了量子比特、纠缠、硬件、纠错和量子算法，并写出了自己的第一个量子程序。</p>
  </header>
  <div class="completion-layout">
   <figure class="completion-preview"><img id="completion-card" width="1080" height="1440" alt="量子学习旅程纪念卡" hidden><span class="completion-preview-placeholder" aria-hidden="true"></span></figure>
   <div class="completion-side">
    <section class="completion-recap" aria-labelledby="completion-recap-title">
     <h2 id="completion-recap-title">旅程回顾</h2>
     <ol>${Object.entries(LEVELS).map(([chapter,level],i)=>`<li><button type="button" class="completion-recap-row" data-review-chapter="${chapter}"><span class="completion-recap-no">${i+1}</span><span class="completion-recap-text"><strong>${level.name}</strong><span>${COMPLETION_RECAP[chapter]||''}</span></span><span class="sr-only">，回顾本章</span></button></li>`).join('')}</ol>
    </section>
    <section class="completion-editor" aria-labelledby="completion-editor-title">
     <h2 id="completion-editor-title">保存纪念卡</h2>
     <label for="completion-nickname">昵称（选填，留空则不署名）</label>
     <div class="completion-save-row"><input id="completion-nickname" type="text" maxlength="40" placeholder="写上你的名字" autocomplete="off"><button id="completion-save" class="primary" disabled>保存图片</button></div>
     <p id="completion-status" role="status" aria-live="polite">正在准备纪念卡…</p>
     <button id="completion-retry" class="text-button" hidden>重新生成纪念卡</button>
    </section>
   </div>
  </div>
  <section class="completion-next" aria-labelledby="completion-next-title">
   <h2 id="completion-next-title">接下来</h2>
   <div class="completion-next-grid">
    <a class="completion-next-item" href="https://fatqat.readthedocs.io/en/latest/guide/quickstart/" target="_blank" rel="noopener noreferrer"><strong>用 FatQat 继续实践</strong><span>在自己的电脑上运行第七章的量子程序</span></a>
    <button type="button" class="completion-next-item" id="completion-back"><strong>回到课程地图</strong><span>任何一节都可以随时回来复习</span></button>
    <button type="button" class="completion-next-item" data-review-chapter="C1"><strong>从第一节重新开始</strong><span>带着新的理解再走一遍</span></button>
   </div>
  </section>
  <div class="completion-art" aria-hidden="true" inert></div>
 </main>`+siteFooter();
 const page=app.querySelector('.completion-page'),input=page.querySelector('#completion-nickname'),anonymous={checked:false,addEventListener(){}};
 const preview=page.querySelector('#completion-card'),saveButton=page.querySelector('#completion-save'),status=page.querySelector('#completion-status'),retry=page.querySelector('#completion-retry');
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1440;
 let art,logo;
 input.value=completionDraft.nickname;anonymous.checked=completionDraft.anonymous;input.disabled=anonymous.checked;
 const update=()=>{
  if(!art||!logo||!page.isConnected)return;
  const name=anonymous.checked?'':Array.from(input.value.trim()).slice(0,20).join('');
  drawCompletionCard(canvas,art,logo,name);
  preview.src=canvas.toDataURL('image/png');preview.hidden=false;
  preview.alt=`${name?name+'：':''}我完成了量子之旅。已完成 ${Object.keys(LEVELS).length} 章 ${allIds().length} 节；认识量子比特、理解纠缠与多比特线路、体验量子编程。space-qat.com`;
  saveButton.disabled=false;status.textContent='';
 };
 const edit=()=>{
  if(Array.from(input.value).length>20)input.value=Array.from(input.value).slice(0,20).join('');
  completionDraft.nickname=input.value;completionDraft.anonymous=anonymous.checked;input.disabled=anonymous.checked;update();
 };
 input.addEventListener('input',event=>{if(!event.isComposing)edit()});input.addEventListener('compositionend',edit);anonymous.addEventListener('change',edit);
 page.querySelector('#completion-back').onclick=()=>{home();window.scrollTo(0,0);document.getElementById('view-completion')?.focus({preventScroll:true})};
 page.querySelectorAll('[data-review-chapter]').forEach(button=>button.onclick=()=>open(LEVELS[button.dataset.reviewChapter].list[0]));
 saveButton.onclick=()=>{
  const link=document.createElement('a');link.download='SpaceQat-我完成了量子之旅.png';link.href=preview.src;
  document.body.append(link);link.click();link.remove();
  status.textContent='已发起图片下载';
 };
 const prepare=async()=>{
  retry.hidden=true;saveButton.disabled=true;status.textContent='正在准备纪念卡…';
  try{
   [art,logo]=await Promise.all([completionIslandImage(page.querySelector('.completion-art')),completionImage('spaceqat-logo.png'),document.fonts.load('500 54px "SpaceQat Course Sans"'),document.fonts.load('108px "SpaceQat Journey Play"')]);
   await document.fonts.ready;
   update();
  }catch(error){if(page.isConnected){status.textContent='纪念卡未能生成，请重试。';retry.hidden=false}}
 };
 retry.onclick=prepare;prepare();
 window.scrollTo(0,0);page.querySelector('h1').focus({preventScroll:true});
}
