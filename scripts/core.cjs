'use strict';
function validate(data) {
  const fail = m => { throw new Error(m); };
  if (!data || typeof data.title !== 'string' || !data.title.trim()) fail('title must be nonempty');
  if (!Array.isArray(data.results) || data.results.length < 2) fail('at least two results required');
  if(data.ui?.chart&&!['bar','dot','lollipop'].includes(data.ui.chart))fail('Starter renders bar/dot/lollipop; use the atlas to implement other suitable charts');
  const ids = data.results.map(r => r.id);
  if (new Set(ids).size !== ids.length || ids.some(id => !/^[a-z][a-z0-9-]*$/.test(id))) fail('unique lowercase result ids required');
  for (const r of data.results) if (![r.name,r.definition,r.caution].every(x=>typeof x==='string'&&x.trim()) || !Array.isArray(r.actions) || r.actions.length<1 || r.actions.some(x=>typeof x!=='string'||!x.trim())) fail(`incomplete result ${r.id}`);
  if (!Array.isArray(data.questions) || data.questions.length<1 || data.questions.length>40) fail('1..40 questions required');
  if (new Set(data.questions.map(q=>q.id)).size!==data.questions.length) fail('duplicate question id');
  for (const q of data.questions) {
    if (typeof q.id!=='string'||!q.id.trim()||typeof q.text!=='string'||!q.text.trim()) fail('question id/text required');
    if (!Array.isArray(q.options)||q.options.length<2||q.options.length>6) fail(`2..6 options required: ${q.id}`);
    for (const o of q.options) {
      if (typeof o.text!=='string'||!o.text.trim()||typeof o.reason!=='string'||!o.reason.trim()) fail(`option text/reason required: ${q.id}`);
      if (!o.scores || typeof o.scores!=='object' || Array.isArray(o.scores)||!Object.keys(o.scores).length) fail(`scores missing: ${q.id}`);
      for(const [id,v] of Object.entries(o.scores)) if(!ids.includes(id)||!Number.isFinite(v)||v<0||v>5) fail(`invalid score ${q.id}/${id}`);
      if (!Object.values(o.scores).some(x=>x>0)) fail(`option has no effect: ${q.id}`);
    }
  }
  for(const id of ids) if(data.questions.reduce((s,q)=>s+Math.max(...q.options.map(o=>o.scores[id]||0)),0)<=0) fail(`unreachable scoring denominator: ${id}`);
  return data;
}
function score(data,answers) {
  if (!Array.isArray(answers)||answers.length!==data.questions.length||data.questions.some((q,i)=>!Number.isInteger(answers[i])||!q.options[answers[i]])) throw new Error('complete valid answers required');
  const ranked=data.results.map(r=>{
    let total=0,max=0;const reasons=[];
    data.questions.forEach((q,i)=>{const o=q.options[answers[i]],v=o.scores[r.id]||0;total+=v;max+=Math.max(...q.options.map(x=>x.scores[r.id]||0));if(v>0)reasons.push(o.reason);});
    return {...r,total,max,index:100*total/max,reasons:reasons.length?[...new Set(reasons)].slice(0,3):['本次选择较少支持这个方向，它可以作为对照，而非优先安排。']};
  }).sort((a,b)=>b.index-a.index);
  return {ranked,leaders:ranked.filter(r=>Math.abs(r.index-ranked[0].index)<1e-9)};
}
function report(data,answers){
  const {ranked,leaders}=score(data,answers);
  return `${data.title}\n\n主要方向：${leaders.map(r=>r.name).join(' / ')}${leaders.length>1?'（并列）':''}\n\n`+ranked.map(r=>`${r.name} · ${Math.round(r.index)}% ${data.scoreLabel||'规则指数'}\n${r.definition}\n回答中的线索：\n${r.reasons.map(x=>'• '+x).join('\n')}\n留意：${r.caution}\n建议：\n${r.actions.map((x,i)=>`${i+1}. ${x}`).join('\n')}`).join('\n\n')+'\n\n指数仅表示本规则下的偏好程度，不是诊断或概率。';
}
module.exports={validate,score,report};
