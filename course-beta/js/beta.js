/* 内测版专用：欢迎卡片注明内测与反馈方式，页脚常驻反馈入口，到期后停止使用。
   只存在于内测发布包，不进入课程源码。 */
(()=>{
 const BETA_END=new Date('2026-11-10T00:00:00+08:00');
 const FEEDBACK='Chen（微信 <strong>physchen820</strong>，或飞书私信）';
 const expired=()=>Date.now()>=BETA_END.getTime();
 const baseWelcome=showWelcome,baseFooter=siteFooter;
 siteFooter=function(){
  return baseFooter().replace('<span>© 2026 量立方 SpaceQat</span>','<span>© 2026 量立方 SpaceQat<span class="beta-footer-note">内测版 · 问题反馈：'+FEEDBACK+'</span></span>');
 };
 showWelcome=function(){
  baseWelcome();
  const dialog=document.querySelector('.welcome-dialog'),card=dialog?.querySelector('.welcome-card');
  if(!card)return;
  card.querySelector('#welcome-title').insertAdjacentHTML('beforebegin','<span class="beta-badge">内测版</span>');
  if(expired()){
   card.querySelector('#welcome-title').textContent='内测已结束';
   card.querySelector('#welcome-intro').textContent='本内测版本已于 2026 年 11 月 10 日失效，感谢你的参与。';
   card.querySelector('.welcome-start').replaceWith(Object.assign(document.createElement('p'),{className:'beta-notice',innerHTML:'如需继续体验或反馈问题，请联系 '+FEEDBACK+'。'}));
   dialog.addEventListener('cancel',e=>e.preventDefault());
   document.title='内测已结束 | 量立方 SpaceQat';
   return;
  }
  card.querySelector('.welcome-start').insertAdjacentHTML('beforebegin','<p class="beta-notice">这是内测版本，链接将于 <strong>2026 年 11 月 10 日</strong>失效。<br>遇到问题或有建议，请反馈给 '+FEEDBACK+'。</p>');
 };
})();
