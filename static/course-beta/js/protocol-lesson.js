/* Shared experiment evidence persists across pages, revisits and reloads. */
function protocolSave(){
 for(const snapshot of Object.values(S.carrySnapshots))snapshot.protocol=S.carry.protocol;
 rememberStep();
}
function protocolInvalidate(from){
 for(const key of Object.keys(S.answers))if(Number(key)>=from)delete S.answers[key];
 for(const key of Object.keys(S.passed))if(Number(key)>=from)delete S.passed[key];
}
function protocolOptions(labels,selected,attribute='choice'){
 return `<div class="opts">${labels.map((label,i)=>`<button class="opt${selected===i?' selected':''}" data-protocol-${attribute}="${i}" aria-pressed="${selected===i}">${label}</button>`).join('')}</div>`;
}
function protocolButton(action,label,disabled=false){return `<button class="primary" data-protocol-action="${action}"${disabled?' disabled':''}>${label}</button>`;}
function protocolNote(text){return `<p class="protocol-feedback" role="status">${text}</p>`;}
