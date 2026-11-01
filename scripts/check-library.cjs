'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
function unique(arr,label){const ids=arr.map(x=>x.id);assert.equal(new Set(ids).size,ids.length,`${label} duplicate ids`);ids.forEach(x=>assert(x&&typeof x==='string',`${label} invalid id`));return new Map(arr.map(x=>[x.id,x]));}
function luminance(hex){assert(/^#[0-9a-f]{6}$/i.test(hex));const a=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return a[0]*.2126+a[1]*.7152+a[2]*.0722;}
function contrast(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function validateLibrary(lib,e,quiz){
 const charts=unique(lib.charts,'chart'),palettes=unique(lib.palettes,'palette');assert(charts.size>=30,'at least 30 chart patterns');
 for(const c of charts.values())for(const f of ['name','family','question','requires','avoid'])assert(c[f],`${c.id}: ${f}`);
 for(const p of palettes.values())for(const [a,b]of [['text','bg'],['text','surface'],['muted','bg'],['muted','surface'],['onPrimary','primary']])assert(contrast(p[a],p[b])>=4.5,`${p.id} ${a}/${b} contrast=${contrast(p[a],p[b])}`);
 unique(lib.optionPatterns,'option');unique(lib.reportLayouts,'layout');unique(lib.scenarios,'scenario');
 const sources=unique(e.sources,'source'),claims=unique(e.claims,'claim'),constructs=unique(e.constructs,'construct'),questions=unique(e.questions,'question'),scores=unique(e.scoring,'scoring');unique(e.outcomes,'outcome');unique(e.metrics,'metric');
 for(const s of sources.values()){for(const f of ['type','title','retrievedAt','access','locator','purpose','rights','status'])assert(s[f],`source ${s.id} missing ${f}`);assert(s.url||s.doi||s.isbn,`source ${s.id} missing locator identifier`);assert(['metadata-only','abstract','fulltext','user-provided'].includes(s.access));assert(s.rights.mode,`source ${s.id} rights missing`);}
 for(const c of claims.values()){
  assert(c.origin&&c.summary&&c.uses?.length&&Array.isArray(c.sourceIds),`claim ${c.id} incomplete`);
  if(!['design-hypothesis','fictional-world','user-observation'].includes(c.origin))assert(c.sourceIds.length,`claim ${c.id} needs sources`);
  for(const id of c.sourceIds){const s=sources.get(id);assert(s,`unknown source ${id}`);assert(s.access!=='metadata-only',`claim ${c.id}: metadata-only cannot support a claim`);assert(!['expired','withdrawn','retracted'].includes(s.status),`claim ${c.id}: inactive source ${id}`);if(s.purpose==='ui')assert(c.uses.every(x=>x==='ui'),`UI source ${id} cannot prove topic constructs`);}
 }
 const refs=(arr,table,label)=>{assert(arr?.length,`missing ${label}`);arr.forEach(id=>assert(table.has(id),`unknown ${label}: ${id}`));};
 for(const c of constructs.values())refs(c.claimIds,claims,'claim');
 for(const q of questions.values()){refs(q.claimIds,claims,'claim');refs(q.constructIds,constructs,'construct');q.claimIds.forEach(id=>assert(claims.get(id).uses.includes('question'),`claim ${id} not usable for question`));}
 for(const s of scores.values()){refs(s.claimIds,claims,'claim');assert(s.formula&&s.kind);for(const id of s.claimIds)assert(claims.get(id).uses.includes('score'),`claim ${id} not usable for scoring`);if(s.validated)assert(s.claimIds.some(id=>claims.get(id).origin==='licensed-instrument'||claims.get(id).origin==='published-finding'),'validated score lacks supporting record');}
 for(const o of e.outcomes){refs(o.claimIds,claims,'claim');assert(scores.has(o.scoreId));refs(o.chartIds,charts,'chart');assert(o.sections.includes('actions'));}
 for(const m of e.metrics){for(const f of ['origin','unit','denominator','population','timeScope','missing','transform','accessibleSummary'])assert(m[f],`metric ${m.id} missing ${f}`);assert(charts.has(m.chartId));assert(m.bounds?.length===2&&m.bounds[0]<m.bounds[1]);}
 if(quiz){assert.equal(questions.size,quiz.questions.length);quiz.questions.forEach(q=>assert(questions.has(q.id),`unmapped quiz question ${q.id}`));quiz.results.forEach(r=>assert(e.outcomes.some(o=>o.id===r.id),`unmapped result ${r.id}`));}
 return {charts:charts.size,palettes:palettes.size,sources:sources.size,claims:claims.size,mappedQuestions:questions.size,optionPatterns:lib.optionPatterns.length,reportLayouts:lib.reportLayouts.length,scenarios:lib.scenarios.length};
}
if(require.main===module){
 const lib=read('assets/design-library.json'),e=read('assets/evidence-library.json'),q=read('assets/example.json');
 try{
  console.log('PASS library structure, links and palette role contrasts',validateLibrary(lib,e,q));
  const bad=JSON.parse(JSON.stringify(e));bad.claims[0].sourceIds=['MISSING'];assert.throws(()=>validateLibrary(lib,bad,q));
  const wrong=JSON.parse(JSON.stringify(e));wrong.claims[0].sourceIds=['S-WCAG-COLOR'];assert.throws(()=>validateLibrary(lib,wrong,q));
  const metadata=JSON.parse(JSON.stringify(e));metadata.sources[0].access='metadata-only';assert.throws(()=>validateLibrary(lib,metadata,q));
  const fake=JSON.parse(JSON.stringify(e));fake.scoring[0].validated=true;assert.throws(()=>validateLibrary(lib,fake,q));
  const palettes=lib.palettes.map(p=>({id:p.id,text:contrast(p.text,p.bg).toFixed(2),muted:contrast(p.muted,p.surface).toFixed(2),button:contrast(p.onPrimary,p.primary).toFixed(2)}));console.log('PASS four negative evidence tests');console.log(JSON.stringify(palettes,null,2));
 }catch(err){console.error(err.stack);process.exitCode=1;}
}
module.exports={validateLibrary,contrast};
