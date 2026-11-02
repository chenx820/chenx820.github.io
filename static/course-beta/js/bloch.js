/* Fixed orthographic view shared by the state and gate experiments.
   Camera depth affects drawing only; the state and measurement model stay separate. */
const BLOCH_VIEW={az:-.62,el:.36};
let blochSceneId=0;
function blochProject(b,cx=150,cy=139,r=96){
 const {az,el}=BLOCH_VIEW,x=b[0]*Math.cos(az)-b[1]*Math.sin(az),y=b[0]*Math.sin(az)+b[1]*Math.cos(az);
 return [cx+r*x,cy-r*(b[2]*Math.cos(el)-y*Math.sin(el)),y*Math.cos(el)+b[2]*Math.sin(el)];
}
function blochScene(b,{cx=150,cy=139,r=96,axis=null,trace=null,coordinates=true,overlay=''}={}){
 const project=v=>blochProject(v,cx,cy,r),point=v=>project(v).slice(0,2).map(n=>n.toFixed(2)).join(' ');
 const id=`bloch-shade-${++blochSceneId}`;
 // Split paths at the silhouette, so back arcs can be dashed without
 // confusing a complete great circle with the front surface of the sphere.
 function splitPath(points,cls){
  const paths=['',''];let previousSide=-1;
  for(let i=1;i<points.length;i++){
   const a=points[i-1],z=points[i],da=project(a)[2],dz=project(z)[2];
   const side=da+dz>=0?1:0;
   if(da*dz<0){
    const f=da/(da-dz),cross=a.map((n,j)=>n+(z[j]-n)*f),first=da>=0?1:0;
    paths[first]+=`${previousSide===first?'':'M'+point(a)}L${point(cross)}`;
    paths[1-first]+=`M${point(cross)}L${point(z)}`;previousSide=1-first;
   }else{
    paths[side]+=`${previousSide===side?'':'M'+point(a)}L${point(z)}`;previousSide=side;
   }
  }
  return paths.map((d,i)=>d?`<path class="${cls} ${i?'bs-front':'bs-back'}" d="${d}"/>`:'').join('');
 }
 const ring=fn=>Array.from({length:97},(_,i)=>fn(i*Math.PI/48));
 const equator=ring(t=>[Math.cos(t),Math.sin(t),0]);
 const meridians=[ring(t=>[Math.cos(t),0,Math.sin(t)]),ring(t=>[0,Math.cos(t),Math.sin(t)])];
 const line=(v,cls)=>`<path class="${cls}" d="M${point(v.map(n=>-n))}L${point(v)}"/>`;
 const label=(v,text,cls='')=>{const p=project(v);return `<text class="bs-label ${cls}" x="${p[0]}" y="${p[1]}" text-anchor="middle">${text}</text>`;};
 const tip=project(b),dx=tip[0]-cx,dy=tip[1]-cy,len=Math.hypot(dx,dy),ux=dx/(len||1),uy=dy/(len||1);
 const head=Math.min(11,len*.45),base=[tip[0]-ux*head,tip[1]-uy*head];
 const arrowhead=len>2?`<path class="bs-arrowhead" d="M${tip[0]} ${tip[1]}L${base[0]-uy*4.5} ${base[1]+ux*4.5}L${base[0]+uy*4.5} ${base[1]-ux*4.5}Z"/>`:'';
 return `<defs><radialGradient id="${id}" cx="32%" cy="24%" r="80%"><stop class="bs-light" offset="0"/><stop class="bs-mid" offset=".65"/><stop class="bs-shade" offset="1"/></radialGradient></defs>
 <circle class="bs-shell" cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>
 ${coordinates?[[1.08,0,0],[0,1.08,0]].map(v=>line(v,'bs-coordinate')).join(''):''}${line([0,0,1.08],'bs-coordinate')}
 ${meridians.map(v=>splitPath(v,'bs-grid')).join('')}${splitPath(equator,'bs-equator')}
 ${axis?line(axis.map(n=>n*1.12),'bs-axis'):''}
 ${trace&&trace.length>1?splitPath(trace,'bs-trace'):''}
 ${overlay}
 ${label([0,0,coordinates?1.22:1.25],'|0⟩','bs-pole-label')}
 ${label([0,0,coordinates?-1.29:-1.3],'|1⟩','bs-pole-label')}
 ${coordinates?label([1.27,0,0],'+x')+label([0,1.27,0],'+y'):''}
 ${[1,-1].map(z=>{const p=project([0,0,z]);return `<circle class="bs-pole" cx="${p[0]}" cy="${p[1]}" r="3.2"/>`;}).join('')}
 <path class="bs-vector-outline" d="M${cx} ${cy}L${tip[0]} ${tip[1]}"/>
 <path class="bs-vector" d="M${cx} ${cy}L${tip[0]} ${tip[1]}"/>${arrowhead}
 <circle class="bs-origin" cx="${cx}" cy="${cy}" r="3"/>
 <circle class="bs-state${tip[2]<0?' bs-state-back':''}" cx="${tip[0]}" cy="${tip[1]}" r="3.5"/>`;
}
