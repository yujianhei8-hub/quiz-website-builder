'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {validate,score,report}=require('./core.cjs'),{audit}=require('./validate.cjs'),{build}=require('./build.cjs');
const root=path.join(__dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'assets/example.json'),'utf8'));
let checks=0;function check(name,fn){fn();checks++;console.log('PASS '+name);}
check('example schema and all 19683 answer routes',()=>{assert.equal(audit(data).checkedPaths,19683);});
check('incomplete and invalid answers are rejected',()=>{assert.throws(()=>score(data,[]));assert.throws(()=>score(data,Array(9).fill(100)));});
check('each result leads with its strongest answer pattern',()=>{for(const r of data.results){const a=data.questions.map(q=>q.options.reduce((b,o,i)=>(o.scores[r.id]||0)>(q.options[b].scores[r.id]||0)?i:b,0));assert(score(data,a).leaders.some(x=>x.id===r.id));}});
check('changing an answer replaces its score rather than appending',()=>{const a=Array(9).fill(0),before=score(data,a);a[0]=1;const after=score(data,a);assert.notEqual(before.ranked.find(r=>r.id==='quiet').total,after.ranked.find(r=>r.id==='quiet').total);a[0]=0;assert.deepEqual(score(data,a),before);});
check('ties are explicit co-leaders',()=>{const d={...data,questions:[{id:'t',text:'t',options:[{text:'a',reason:'a',scores:{quiet:1,city:1,make:1}},{text:'b',reason:'b',scores:{quiet:1,city:1,make:1}}]}]};validate(d);assert.equal(score(d,[0]).leaders.length,3);assert(report(d,[0]).includes('并列'));});
check('unknown score keys and no-effect options fail validation',()=>{const d=JSON.parse(JSON.stringify(data));d.questions[0].options[0].scores={unknown:2};assert.throws(()=>validate(d));d.questions[0].options[0].scores={quiet:0};assert.throws(()=>validate(d));});
const target=path.join(root,'demo/index.html');build(path.join(root,'assets/example.json'),target);
check('generated inline JavaScript parses',()=>{const html=fs.readFileSync(target,'utf8'),scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,1);new vm.Script(scripts[0][1]);assert(!html.includes('/* QUIZ_DATA */'));assert(!/<script[^>]+src=/.test(html));});
check('JSON embedding cannot close the HTML script',()=>{const tmp=path.join(root,'demo/escape-data.json'),out=path.join(root,'demo/escape.html'),d=JSON.parse(JSON.stringify(data));d.title='</script><img src=x>';try{fs.writeFileSync(tmp,JSON.stringify(d));build(tmp,out);const html=fs.readFileSync(out,'utf8');assert(!html.includes('const DATA={"title":"</script>'));}finally{fs.rmSync(tmp,{force:true});fs.rmSync(out,{force:true});}});
check('report includes current leading outcome and score',()=>{const a=Array(9).fill(1),s=score(data,a),txt=report(data,a);assert(txt.includes(s.leaders[0].name));assert(txt.includes(`${Math.round(s.ranked[0].index)}%`));});
console.log(`\n${checks} checks passed. Browser layout and real interactions still require browser verification.`);
