/* Lesson titles for the seven-chapter required curriculum. */
const REQUIRED_CATALOG={
 "C1-1": {
  "title": "“算得慢”与“算不完”"
 },
 "C1-2": {
  "title": "量子计算的潜力与边界"
 },
 "C1-3": {
  "title": "量子计算发展史"
 },
 "C2-1": {
  "title": "量子比特的状态怎么描述？"
 },
 "C2-2": {
  "title": "概率幅、概率与测量"
 },
 "C2-3": {
  "title": "单比特门的旋转作用"
 },
 "C2-4": {
  "title": "测量概率相同，为什么量子态会不同？"
 },
 "C3-1": {
  "title": "只看每个量子比特，够吗？"
 },
 "C3-2": {
  "title": "CNOT：受控翻转"
 },
 "C3-3": {
  "title": "制备一个贝尔态"
 },
 "C3-4": {
  "title": "量子态能被复制吗？"
 },
 "C3-5": {
  "title": "量子隐形传态"
 },
 "C4-1": {"title": "量子计算机硬件路线"},
 "C4-2": {"title": "用编译连接软硬件"},
 "C5-1": {
  "title": "噪声与测量的随机性"
 },
 "C5-2": {
  "title": "如何发现并处理错误"
 },
 "C6-1": {
  "title": "概率幅与干涉"
 },
 "C6-2": {
  "title": "Grover 搜索算法"
 },
 "C6-3": {
  "title": "Shor 算法：用周期分解整数"
 },
 "C7-1": {
  "title": "用 FatQat 编写量子程序"
 },
 "C7-2": {
  "title": "走进量子计算：找到你的探索方向"
 }
};
const R={
 say:(...b)=>({t:'say',b}),
 ask:(q,o,a,why)=>({t:'ask',q,o,a,f:why}),
 end:line=>({t:'end',line}),
 play:(kind,task,config={})=>({t:'play',c:'studio',kind,task,gh:'',...config}),
 lab:(task,config)=>({t:'play',c:'lab',task,gh:'运行一次当前实验，再继续。',ok:m=>!!m.result,...config}),
 add:(id,pages)=>{const meta=REQUIRED_CATALOG[id];if(!meta)throw Error('Unknown lesson '+id);LESSONS[id]={...meta,ask:meta.title,pages};}
};
