'use strict';
const fs=require('node:fs'),path=require('node:path');
const catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/report-recipes.json'),'utf8'));
function composeReport(recipeId,dataKinds,settingId){
 const recipe=catalog.recipes.find(x=>x.id===recipeId);if(!recipe)throw Error(`Unknown report recipe: ${recipeId}`);
 const available=new Set(dataKinds===undefined?recipe.plannedData:dataKinds),modules=new Map(catalog.modules.map(m=>[m.id,m]));
 const setting=settingId||recipe.settingOptions[0];if(!recipe.settingOptions.includes(setting))throw Error(`Setting ${setting} incompatible with ${recipeId}`);
 const selected=[],adaptations=[],seen=new Set();
 function resolve(id,visited=[]){const m=modules.get(id);if(!m)throw Error(`Missing module: ${id}`);if(visited.includes(id))throw Error('Module fallback cycle');const missing=m.needs.filter(x=>!available.has(x));if(!missing.length)return m;if(m.fallback){adaptations.push({from:id,to:m.fallback,missing,internalOnly:true});return resolve(m.fallback,[...visited,id]);}adaptations.push({from:id,to:null,missing,internalOnly:true});return null;}
 for(const id of recipe.modules){const m=resolve(id);if(m&&!seen.has(m.id)){seen.add(m.id);selected.push({...m});}}
 return {kind:'author-proposal-not-personal-report',recipeId,name:recipe.name,setting:catalog.settings.find(x=>x.id===setting),scoreContract:catalog.scoreContracts.find(x=>x.id===recipe.scoreContract),inputInterpretation:dataKinds===undefined?'planned-inputs-not-verified-data':'explicit-available-input-kinds',sections:selected,adaptations,searchFamilies:recipe.searchFamilies,seedTerms:recipe.seedTerms||null,nextStep:'Retrieve and inspect topic sources, map questions and claims, then present this proposal for user approval before prototyping.'};
}
if(require.main===module){try{const id=process.argv[2]||'preference',file=process.argv[3],result=composeReport(id);if(file){fs.mkdirSync(path.dirname(path.resolve(file)),{recursive:true});fs.writeFileSync(file,JSON.stringify(result,null,2));console.log(file);}else console.log(JSON.stringify(result,null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={composeReport,catalog};
