/* Completion records and per-lesson bookmarks for the current curriculum.
   The course has not launched; earlier preview stores (spq.done, spq.done.v2–v9) are ignored. */
const COURSE_STORE='spq.course.v1';
const COURSE_RESUME_STORE=COURSE_STORE+'.resume';
const CAREER_DIRECTIONS=['hardware','software','theory','application'];
// A bookmark only resumes the exact lesson content it was saved for; any edit restarts the lesson.
function courseLessonRevision(lesson){
 const text=JSON.stringify(lesson.pages);let hash=2166136261;
 for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),16777619);
 return (hash>>>0).toString(16);
}
function courseCleanResume(value,lessons,done){
 if(!value||typeof value!=='object'||Array.isArray(value))return {};
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
 const records={};
 for(const [id,lesson] of Object.entries(lessons)){
  const record=value[id],revision=courseLessonRevision(lesson);
  if(done[id]||!record||record.revision!==revision||!Number.isInteger(record.step)||record.step<0||record.step>=lesson.pages.length)continue;
  const answers={};
  lesson.pages.forEach((page,i)=>{
   const answer=object(record.answers)[i];
   if(page.o){
    const valid=n=>Number.isInteger(n)&&n>=0&&n<page.o.length;
    if(page.multi&&Array.isArray(answer?.selected)&&answer.selected.every(valid))answers[i]={selected:answer.selected,submitted:answer.submitted===true};
    else if(!page.multi&&valid(answer))answers[i]=answer;
   }
   else if(page.art==='timeline'&&Number.isInteger(answer?.historyIndex))answers[i]={historyIndex:answer.historyIndex};
   else if(page.art==='careerDirections'&&CAREER_DIRECTIONS.includes(answer?.careerDirection))answers[i]={careerDirection:answer.careerDirection};
   else if(page.art==='careerNext'&&CAREER_DIRECTIONS.includes(answer?.careerInterest))answers[i]={careerInterest:answer.careerInterest};
   else if(page.art==='hardwareOverview'&&Number.isInteger(answer?.routeIndex)&&answer.routeIndex>=0&&answer.routeIndex<4)answers[i]={routeIndex:answer.routeIndex};
  });
  records[id]={revision,step:record.step,answers,carry:object(record.carry),carrySnapshots:object(record.carrySnapshots)};
 }
 return records;
}
function courseLoadResume(storage,lessons,done){
 const raw=storage.getItem(COURSE_RESUME_STORE);
 return raw===null?{}:courseCleanResume(JSON.parse(raw),lessons,done);
}
// Keep only current lesson IDs that are marked complete.
function courseCleanProgress(value,ids){
 if(!value||typeof value!=='object'||Array.isArray(value))return {};
 return Object.fromEntries(ids.filter(id=>value[id]===1||value[id]===true).map(id=>[id,1]));
}
function courseLoadProgress(storage,ids){
 try{
  const raw=storage.getItem(COURSE_STORE);
  if(raw===null)return {done:{}};
  try{return {done:courseCleanProgress(JSON.parse(raw),ids)};}
  catch(e){return {done:{},error:'进度记录无法读取；可以重新学习。'};}
 }catch(e){return {done:{},error:'当前浏览器无法保存进度；关闭后可能需要重新学习。'};}
}
