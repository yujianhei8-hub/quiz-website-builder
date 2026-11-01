'use strict';
const fs=require('node:fs'),path=require('node:path'),{catalog}=require('./compose-report.cjs');
function initial(topic){const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/project-state-template.json'),'utf8'));if(!String(topic).trim())throw Error('A topic is required');state.topic=String(topic).trim();return state;}
function advance(input,event){
 const s=JSON.parse(JSON.stringify(input)),p=event.payload||{},need=(ok,msg)=>{if(!ok)throw Error(msg)},phase=(...allowed)=>need(allowed.includes(s.phase),`${event.type} is not allowed from ${s.phase}`);
 const userApproval=()=>{need(event.actor==='user'||(event.actor==='delegated-agent'&&s.delegation),'Actual user approval or recorded delegation required');const message=event.actor==='user'?event.userMessage:s.delegation.userMessage;need(typeof message==='string'&&message.trim(),'Approval must retain actual user instruction');return {actor:event.actor,userMessage:message,at:event.at||new Date().toISOString()};};
 switch(event.type){
  case 'delegate':phase('direction','research','proposal-review','prototype','prototype-review');need(event.actor==='user'&&event.userMessage?.trim(),'Delegation needs an actual user instruction');s.delegation={userMessage:event.userMessage,at:event.at||new Date().toISOString()};break;
  case 'start-research':phase('direction');s.phase='research';s.research.status='working';break;
  case 'submit-proposal':{
   phase('research');const r=p.research;need(r&&Array.isArray(r.keywordFamilies)&&r.keywordFamilies.length>=4,'Proposal needs broad keyword families');need(['verified','limited'].includes(r.status),'Research must distinguish verified and limited capability');need(Array.isArray(r.searchLog)&&Array.isArray(r.sourceIds)&&Array.isArray(r.limitations),'Research logs, source IDs and limitations required');if(r.status==='verified')need(r.searchLog.length>0&&r.sourceIds.length>0,'Verified research requires actual search logs and source references');if(r.status==='limited')need(r.limitations.length>0,'Limited research needs explicit limitations');need(p.artifact&&catalog.recipes.some(x=>x.id===p.recipe),'Concrete proposal artifact and report recipe required');s.research=r;s.proposal={revision:s.proposal.revision+1,artifact:p.artifact,reportRecipe:p.recipe};s.approvals.proposal=null;s.phase='proposal-review';break;
  }
  case 'revise-proposal':phase('proposal-review');need(event.userMessage?.trim(),'Proposal feedback required');s.feedback.push({stage:'proposal',message:event.userMessage});s.phase='research';s.approvals.proposal=null;break;
  case 'approve-proposal':phase('proposal-review');s.approvals.proposal={...userApproval(),revision:s.proposal.revision};s.phase='prototype';break;
  case 'submit-prototype':phase('prototype');need(s.approvals.proposal,'Proposal must be approved');need(p.artifact,'Prototype artifact required');s.prototype={revision:s.prototype.revision+1,artifact:p.artifact};s.approvals.prototype=null;s.phase='prototype-review';break;
  case 'feedback':phase('prototype-review');need(event.actor==='user'&&event.userMessage?.trim(),'User feedback required');s.feedback.push({stage:'prototype',revision:s.prototype.revision,message:event.userMessage});s.approvals.prototype=null;s.phase='prototype';break;
  case 'accept-prototype':phase('prototype-review');s.approvals.prototype={...userApproval(),revision:s.prototype.revision};s.phase='audit';s.audit.status='working';break;
  case 'audit-fail':phase('audit');need(Array.isArray(p.issues)&&p.issues.length&&p.issues.every(x=>x.id&&x.description),'Audit issues need IDs and descriptions');s.audit={...s.audit,status:'fixing',unresolved:p.issues};break;
  case 'audit-pass':{
   phase('audit');need(s.approvals.prototype,'Prototype acceptance required');const required=['content','score','report','interaction','export'];need(Array.isArray(p.checked)&&required.every(x=>p.checked.includes(x)),'Audit must cover content, scores, report, interaction and export');const closed=new Set(p.resolvedIssueIds||[]);need(s.audit.unresolved.every(x=>closed.has(x.id)),'Open audit defects must be resolved');s.audit={status:'passed',unresolved:[],checked:p.checked,limitations:p.limitations||[]};break;
  }
  case 'deliver':phase('audit');need(s.audit.status==='passed','Audit must pass before delivery');need(p.html&&p.validationNote,'HTML and validation note required');s.phase='delivered';s.delivery={...p};break;
  default:throw Error('Unknown event: '+event.type);
 }
 s.history.push({event:event.type,from:input.phase,to:s.phase,at:event.at||new Date().toISOString()});return s;
}
if(require.main===module){try{const [cmd,a,b]=process.argv.slice(2);if(cmd==='init'){if(!a||!b)throw Error('Usage: workflow.cjs init TOPIC state.json');if(fs.existsSync(b))throw Error('State already exists; do not overwrite approvals');fs.mkdirSync(path.dirname(path.resolve(b)),{recursive:true});fs.writeFileSync(b,JSON.stringify(initial(a),null,2));console.log(b);}else if(cmd==='apply'){if(!a||!b)throw Error('Usage: workflow.cjs apply state.json event.json');const next=advance(JSON.parse(fs.readFileSync(a,'utf8')),JSON.parse(fs.readFileSync(b,'utf8')));fs.writeFileSync(a,JSON.stringify(next,null,2));console.log(next.phase);}else throw Error('Use init or apply');}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={initial,advance};
