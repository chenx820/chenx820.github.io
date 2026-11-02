/* Course navigation owns only its DOM; lesson state remains owned by app.js. */
window.CourseDirectory = (() => {
  const expanded = new Map();
  let lastChapter, cleanup = () => {};
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = path => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
  function mount() {
    cleanup();
    const main = app.querySelector('.lesson-main');
    if (!main) return;
    const chapter = S.lesson.id.split('-')[0];
    // 进入新的一章时只展开当前章，其余收起，保证当前节始终在目录里可见。
    if (chapter !== lastChapter) { expanded.clear(); expanded.set(chapter, true); }
    lastChapter = chapter;
    const layout = document.createElement('div');
    layout.className = 'course-reading-layout';
    main.before(layout);
    const sidebar = document.createElement('aside');
    sidebar.className = 'course-directory-sidebar';
    layout.append(sidebar, main);
    const contents = document.createElement('div');
    contents.className = 'course-directory-content';
    contents.innerHTML = `<button type="button" class="directory-back">${icon('m14 6-6 6 6 6')}返回课程地图</button><p class="directory-course-name">量子计算入门</p><nav aria-label="章节目录">${Object.entries(LEVELS).map(([id,level],i)=>`<section class="directory-chapter"><button type="button" class="directory-chapter-toggle" data-chapter="${id}" aria-expanded="${!!expanded.get(id)}" aria-controls="directory-lessons-${id}"><span class="directory-number">${String(i+1).padStart(2,'0')}</span><span>${escape(level.name)}</span>${icon('m6 9 6 6 6-6')}</button><div class="directory-lessons" id="directory-lessons-${id}" ${expanded.get(id)?'':'hidden'}>${level.list.map(id=>`<button type="button" class="directory-lesson" data-lesson="${id}" aria-label="${escape(REQUIRED_CATALOG[id].title)}，${S.done[id]?'已完成':S.resume[id]?'学习中':'未完成'}" ${id===S.lesson.id?'aria-current="page"':''}><span class="directory-lesson-status" aria-hidden="true">${courseAchievementBadge(!!S.done[id])}</span><span>${escape(REQUIRED_CATALOG[id].title)}</span></button>`).join('')}</div></section>`).join('')}</nav>`;
    const dialog = document.createElement('dialog');
    dialog.id = 'course-directory-drawer';
    dialog.className = 'course-directory-drawer';
    dialog.setAttribute('aria-labelledby','directory-title');
    dialog.innerHTML = `<div class="directory-heading"><strong id="directory-title">章节目录</strong><button type="button" class="directory-close" aria-label="关闭章节目录">${icon('m6 6 12 12M18 6 6 18')}</button></div>`;
    app.append(dialog);
    const directoryTitle = dialog.querySelector('#directory-title');
    const returnButton = contents.querySelector('.directory-back');
    const menu = document.createElement('button');
    menu.type = 'button';menu.className = 'directory-menu';
    menu.innerHTML = icon('m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6ZM9 3v15M15 6v15');
    menu.setAttribute('aria-label','章节目录');menu.title = '章节目录';
    menu.setAttribute('aria-haspopup','dialog');menu.setAttribute('aria-controls',dialog.id);menu.setAttribute('aria-expanded','false');
    main.querySelector('#quit')?.remove();
    main.querySelector('.lesson-meta').append(menu);
    const mobile = matchMedia('(width < 850px)');
    const unlock = () => {
      document.documentElement.classList.remove('course-directory-open');
      menu.setAttribute('aria-expanded','false');
    };
    let exitAnimation = null;
    const finishClose = restore => {
      exitAnimation = null;
      dialog.close();
      dialog.classList.remove('is-closing');
      dialog.style.removeProperty('--directory-exit-from');
      dialog.style.removeProperty('--directory-backdrop-from');
      unlock();
      if (restore) (mobile.matches ? menu : contents.querySelector('[aria-current]')).focus({preventScroll:true});
    };
    const close = (restore = true) => {
      if (!dialog.open) return;
      // Navigation/resize disposes immediately; ordinary dismissal keeps the modal
      // and scroll lock until its exit finishes. Capture an interrupted entrance.
      if (!restore || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finishClose(restore);return;
      }
      if (exitAnimation) return;
      dialog.style.setProperty('--directory-exit-from',getComputedStyle(dialog).transform);
      dialog.style.setProperty('--directory-backdrop-from',getComputedStyle(dialog,'::backdrop').opacity);
      dialog.classList.add('is-closing');
      const animation = dialog.getAnimations().find(a=>a.animationName==='directory-slide-out');
      if (!animation) {finishClose(restore);return;}
      exitAnimation = animation;
      const complete = () => {if(exitAnimation===animation) finishClose(restore);};
      animation.finished.then(complete,complete);
    };
    const position = () => {
      const hadFocus = contents.contains(document.activeElement) || dialog.contains(document.activeElement) || document.activeElement === menu;
      close(false);
      if (mobile.matches && directoryTitle.parentElement !== contents) {
        directoryTitle.replaceWith(returnButton);
        contents.prepend(directoryTitle);
      } else if (!mobile.matches && directoryTitle.parentElement === contents) {
        returnButton.replaceWith(directoryTitle);
        contents.prepend(returnButton);
      }
      (mobile.matches ? dialog : sidebar).append(contents);
      if (hadFocus) (mobile.matches ? menu : contents.querySelector('[aria-current]')).focus({preventScroll:true});
    };
    position();mobile.addEventListener('change',position);
    const current = contents.querySelector('[aria-current]');
    if (current && !mobile.matches) {
      const offset = current.getBoundingClientRect().top - sidebar.getBoundingClientRect().top;
      if (offset < 0 || offset > sidebar.clientHeight - 60) sidebar.scrollTop += offset - sidebar.clientHeight / 3;
    }
    menu.onclick = () => {
      dialog.showModal();document.documentElement.classList.add('course-directory-open');menu.setAttribute('aria-expanded','true');
      dialog.querySelector('.directory-close').focus({preventScroll:true});
    };
    dialog.querySelector('.directory-close').onclick = () => close();
    dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
    dialog.addEventListener('click',event=>{
      const r=dialog.getBoundingClientRect();
      if(event.target===dialog && (event.clientX<r.left || event.clientX>=r.right || event.clientY<r.top || event.clientY>=r.bottom)) close();
    });
    dialog.addEventListener('keydown',event=>{
      if(event.key!=='Tab') return;
      const focusable=[...dialog.querySelectorAll('button')].filter(node=>node.getClientRects().length && !node.disabled);
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    });
    returnButton.onclick = () => {close(false);home();window.scrollTo(0,0);};
    contents.addEventListener('click',event=>{
      const button=event.target.closest('button');
      if(!button) return;
      if(button.dataset.chapter){
        const state=button.getAttribute('aria-expanded')!=='true';
        expanded.set(button.dataset.chapter,state);button.setAttribute('aria-expanded',String(state));
        document.getElementById(button.getAttribute('aria-controls')).hidden=!state;
      } else if(button.dataset.lesson){
        close();
        if(button.dataset.lesson!==S.lesson.id) open(button.dataset.lesson);
      }
    });
    cleanup = () => {close(false);unlock();mobile.removeEventListener('change',position);cleanup=()=>{};};
  }
  return {mount,dispose:()=>cleanup()};
})();
