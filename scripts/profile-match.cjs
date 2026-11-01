'use strict';
function matchProfiles(archive,user,{minimumCoverage=.6}={}){
 if(!archive?.axes?.length||!archive?.profiles?.length)throw Error('Axes and profiles are required');
 if(!Number.isFinite(minimumCoverage)||minimumCoverage<=0||minimumCoverage>1)throw Error('minimumCoverage must be in (0,1]');
 const ids=archive.axes.map(x=>x.id);if(new Set(ids).size!==ids.length||ids.some(x=>!x))throw Error('Unique axes required');
 for(const a of archive.axes)if(!Number.isFinite(a.weight)||a.weight<=0)throw Error('Positive axis weights required');
 const known=v=>Number.isFinite(v)&&v>=0&&v<=1;
 for(const [id,v]of Object.entries(user)){if(!ids.includes(id))throw Error('Unknown user axis: '+id);if(v!==null&&!known(v))throw Error('User values must be normalized to [0,1] or null');}
 const totalWeight=archive.axes.reduce((s,x)=>s+x.weight,0),profileIds=new Set();
 const profiles=archive.profiles.map(p=>{
  if(!p.id||!p.name||profileIds.has(p.id))throw Error('Unique complete profile IDs required');profileIds.add(p.id);
  if(!['synthetic-demo','original-fiction','sourced-interpretation'].includes(p.origin))throw Error('Profile origin required');
  if(p.origin==='sourced-interpretation'&&!p.sourceRefs?.length)throw Error('Historical/real profiles need source references and interpretive coding');
  const comparisons=[];
  for(const axis of archive.axes){const pv=p.values?.[axis.id];if(pv!==undefined&&pv!==null&&!known(pv))throw Error('Profile values must be normalized to [0,1] or null');if(known(user[axis.id])&&known(pv))comparisons.push({axisId:axis.id,label:axis.label||axis.id,weight:axis.weight,userValue:user[axis.id],profileValue:pv,distance:Math.abs(user[axis.id]-pv)});}
  const weight=comparisons.reduce((s,x)=>s+x.weight,0),coverage=weight/totalWeight,eligible=coverage>=minimumCoverage;
  const index=eligible?Math.max(0,Math.min(100,100*(1-comparisons.reduce((s,x)=>s+x.weight*x.distance,0)/weight))):null;
  return {id:p.id,name:p.name,origin:p.origin,coverage,eligible,index,similarAxes:[...comparisons].sort((a,b)=>a.distance-b.distance).slice(0,3),differentAxes:[...comparisons].sort((a,b)=>b.distance-a.distance).slice(0,3)};
 });
 const ranked=profiles.filter(p=>p.eligible).sort((a,b)=>b.index-a.index);
 return {meaning:'rule-based similarity, not identity or probability',ranked,leaders:ranked.filter(p=>Math.abs(p.index-ranked[0].index)<1e-9),insufficient:profiles.filter(p=>!p.eligible),minimumCoverage};
}
if(require.main===module){const fs=require('node:fs');try{if(!process.argv[2]||!process.argv[3])throw Error('Usage: profile-match.cjs archive.json user-profile.json');console.log(JSON.stringify(matchProfiles(JSON.parse(fs.readFileSync(process.argv[2],'utf8')),JSON.parse(fs.readFileSync(process.argv[3],'utf8'))),null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={matchProfiles};
