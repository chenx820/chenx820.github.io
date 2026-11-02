/* Shared visual behavior; no course or simulation state lives here. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const syncThemeColor=()=>document.querySelector('meta[name="theme-color"]')?.setAttribute('content',getComputedStyle(document.documentElement).getPropertyValue('--course-neutral-1').trim());
  syncThemeColor();
  new MutationObserver(syncThemeColor).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  const springs = Object.freeze({
    drag: Object.freeze({stiffness: 1200, damping: 80, mass: 1}),
    like: Object.freeze({stiffness: 380, damping: 18, mass: 1})
  });
  // Unit step response of m*x'' + c*x' + k*x = k, starting at rest.
  function springProgress(seconds, preset) {
    const {stiffness: k, damping: c, mass: m} = preset;
    const a = c / (2 * m), w2 = k / m;
    if (a * a > w2) {
      const d = Math.sqrt(a * a - w2), r1 = -a + d, r2 = -a - d;
      return 1 + (r2 * Math.exp(r1 * seconds) - r1 * Math.exp(r2 * seconds)) / (r1 - r2);
    }
    if (a * a === w2) return 1 - Math.exp(-a * seconds) * (1 + a * seconds);
    const w = Math.sqrt(w2 - a * a);
    return 1 - Math.exp(-a * seconds) * (Math.cos(w * seconds) + a / w * Math.sin(w * seconds));
  }
  const animations = new WeakMap();
  function springScale(element, target, preset, initial) {
    cancelAnimationFrame(animations.get(element));
    if (reduced.matches) {element.style.removeProperty('scale'); return;}
    const from = initial ?? (parseFloat(element.style.scale) || 1), start = performance.now();
    function frame(now) {
      if (!element.isConnected) {animations.delete(element); return;}
      const elapsed = (now - start) / 1000;
      element.style.scale = from + (target - from) * springProgress(elapsed, preset);
      if (elapsed < 1.2 && !reduced.matches) animations.set(element, requestAnimationFrame(frame));
      else {element.style.scale = target; animations.delete(element);}
    }
    animations.set(element, requestAnimationFrame(frame));
  }
  // Append text chunks, preserving graphemes and scheduling across chunk boundaries.
  // Call cancelStream before replacing content or abandoning a stream.
  const streams = new WeakMap();
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('zh', {granularity: 'grapheme'}) : null;
  function appendStreamText(element, text) {
    const chunk = String(text);
    if (reduced.matches) {element.append(document.createTextNode(chunk)); return;}
    const now = performance.now();
    let next = Math.max(now, streams.get(element) || now);
    const fragment = document.createDocumentFragment();
    const characters = segmenter ? Array.from(segmenter.segment(chunk), item => item.segment) : Array.from(chunk);
    for (const character of characters) {
      const span = document.createElement('span');
      span.className = 'stream-char';
      span.textContent = character;
      span.style.setProperty('--stream-delay', `${next - now}ms`);
      span.addEventListener('animationend', () => span.replaceWith(document.createTextNode(character)), {once: true});
      fragment.append(span);
      next += 30;
    }
    streams.set(element, next);
    element.append(fragment);
  }
  function cancelStream(element) {
    streams.delete(element);
    element.querySelectorAll('.stream-char').forEach(span => span.replaceWith(document.createTextNode(span.textContent)));
  }
  function prepareDetails(details) {
    if (details.classList.contains('motion-details')) return;
    const summary = details.querySelector(':scope > summary');
    if (!summary) return;
    const body = document.createElement('div');
    body.className = 'disclosure-body';
    for (const child of Array.from(details.childNodes)) if (child !== summary) body.append(child);
    details.append(body);
    details.classList.add('motion-details');
    const sync = () => {body.inert = !details.open;};
    sync();
    details.addEventListener('toggle', sync);
  }
  function enhance(root) {
    if (!(root instanceof Element)) return;
    if (root.matches('details')) prepareDetails(root);
    root.querySelectorAll('details').forEach(prepareDetails);
  }
  enhance(document.body);
  new MutationObserver(records => {
    for (const record of records) for (const node of record.addedNodes) enhance(node);
  }).observe(document.body, {childList: true, subtree: true});

  // Spring feedback is opt-in; the course keeps direct manipulation still.
  document.addEventListener('pointerdown', event => {
    const target = event.target.closest?.('[data-spring-drag]');
    if (!target || event.button !== 0) return;
    springScale(target, 1.01, springs.drag);
    const pointerId = event.pointerId;
    const release = e => {
      if (e.pointerId !== pointerId) return;
      springScale(target, 1, springs.drag);
      document.removeEventListener('pointerup', release);
      document.removeEventListener('pointercancel', release);
      target.removeEventListener('lostpointercapture', release);
    };
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);
    target.addEventListener('lostpointercapture', release);
  });
  // Opt-in hook for a future like control; it does not create or toggle likes.
  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-like]');
    if (button && !button.disabled) springScale(button, 1, springs.like, .92);
  });
  // 保留原内容占位，加载文字与图标不改变按钮宽高；结束时恢复原节点和可用状态。
  const busyButtons = new WeakMap();
  function beginButtonBusy(button, label, {iconOnly = false} = {}) {
    if (busyButtons.has(button)) return busyButtons.get(button);
    const disabled = button.disabled, ariaLabel = button.getAttribute('aria-label');
    const rest = document.createElement('span'), pending = document.createElement('span');
    rest.className = 'button-rest';rest.setAttribute('aria-hidden', 'true');
    while (button.firstChild) rest.append(button.firstChild);
    pending.className = 'button-pending';pending.setAttribute('aria-hidden', 'true');
    pending.innerHTML = '<svg class="button-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" opacity=".25"/><path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    if (!iconOnly) pending.append(document.createTextNode(label));
    button.append(rest, pending);button.classList.add('button-busy');
    button.disabled = true;button.setAttribute('aria-busy', 'true');button.setAttribute('aria-label', label);
    const release = () => {
      if (!busyButtons.has(button)) return;
      button.replaceChildren(...rest.childNodes);button.classList.remove('button-busy');
      button.disabled = disabled;button.removeAttribute('aria-busy');
      // 操作可能已写入“已复制”等结果，不覆盖新的可访问名称。
      if (button.getAttribute('aria-label') === label) {
        if (ariaLabel === null) button.removeAttribute('aria-label');
        else button.setAttribute('aria-label', ariaLabel);
      }
      busyButtons.delete(button);
    };
    busyButtons.set(button, release);
    return release;
  }
  window.CourseUI = Object.freeze({springs, springProgress, appendStreamText, cancelStream, beginButtonBusy});
})();
