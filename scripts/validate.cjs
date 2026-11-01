'use strict';
const fs=require('node:fs');const {validate,score}=require('./core.cjs');
function audit(data){
 validate(data);
 const combos=data.questions.reduce((n,q)=>n*q.options.length,1);
 const reached=new Set();let checked=0;
 if(combos<=100000){
  const walk=a=>{if(a.length===data.questions.length){const r=score(data,a);r.leaders.forEach(x=>reached.add(x.id));if(r.ranked.some(x=>x.index<0||x.index>100))throw Error('score out of range');checked++;return;}data.questions[a.length].options.forEach((_,i)=>walk([...a,i]));};walk([]);
 }else{
  for(const r of data.results){const a=data.questions.map(q=>q.options.reduce((best,o,i)=>(o.scores[r.id]||0)>(q.options[best].scores[r.id]||0)?i:best,0));score(data,a).leaders.forEach(x=>reached.add(x.id));checked++;}
 }
 for(const r of data.results)if(!reached.has(r.id))throw Error(`result cannot lead in checked paths: ${r.id}`);
 return {valid:true,questions:data.questions.length,results:data.results.length,checkedPaths:checked,exhaustive:combos<=100000};
}
if(require.main===module){try{const file=process.argv[2];if(!file)throw Error('Usage: node scripts/validate.cjs quiz.json');console.log(JSON.stringify(audit(JSON.parse(fs.readFileSync(file,'utf8'))),null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={audit};
