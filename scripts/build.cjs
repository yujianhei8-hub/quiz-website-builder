'use strict';
const fs=require('node:fs'),path=require('node:path');const {validate}=require('./core.cjs');
function build(input,output,evidenceFile){
 const data=validate(JSON.parse(fs.readFileSync(input,'utf8')));
 const catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/design-library.json'),'utf8'));
 const theme=catalog.palettes.find(p=>p.id===(data.ui?.palette||'editorial'));if(!theme)throw Error('Unknown UI palette');
 if(evidenceFile){const evidence=JSON.parse(fs.readFileSync(evidenceFile,'utf8'));require('./check-library.cjs').validateLibrary(catalog,evidence,data);}
 const template=fs.readFileSync(path.join(__dirname,'../assets/quiz-template.html'),'utf8');
 const core=fs.readFileSync(path.join(__dirname,'core.cjs'),'utf8').replace('module.exports={validate,score,report};','');
 const safeJson=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 const html=template.replace('/* QUIZ_CORE */',()=>core).replace('/* QUIZ_DATA */',()=>`const DATA=${safeJson};const UI_THEME=${JSON.stringify(theme)};`);
 fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,html);return output;
}
if(require.main===module){try{const [input,output,evidence]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node scripts/build.cjs quiz.json output/index.html [evidence-library.json]');console.log(build(input,output,evidence));}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={build};
