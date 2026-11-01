'use strict';
// Optional real-browser check; Node.js 22+ (built-in WebSocket). Set CHROME_PATH for another Chrome location.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process'),{pathToFileURL}=require('node:url'),assert=require('node:assert/strict');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const chrome=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
 if(!fs.existsSync(chrome))throw Error('Set CHROME_PATH to a local Chrome executable.');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'quiz-browser-'));
 const extra=process.env.QUIZ_TEST_NO_SANDBOX==='1'?['--no-sandbox']:[];
 const child=spawn(chrome,['--headless=new','--disable-gpu','--in-process-gpu','--disable-software-rasterizer','--disable-extensions','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,...extra,'about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
 let errs='';child.stderr.on('data',b=>errs+=b.toString());
 let ws;
 try{
  const active=path.join(profile,'DevToolsActivePort');
  for(let i=0;i<40&&!fs.existsSync(active);i++){if(child.exitCode!==null)throw Error('Browser exited: '+errs.slice(-1200));await delay(200);}
  if(!fs.existsSync(active))throw Error('Browser startup timed out: '+errs.slice(-1200));
  const port=fs.readFileSync(active,'utf8').split('\n')[0];
  const targets=await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{const t=setTimeout(()=>j(Error('CDP connection timed out')),6000);ws.onopen=()=>{clearTimeout(t);r()};ws.onerror=()=>{clearTimeout(t);j(Error('CDP connection failed. '+errs.slice(-1400)))}});
  let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}};
  const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id,t=setTimeout(()=>{pending.delete(n);reject(Error('Browser command timed out: '+method))},6000);pending.set(n,{resolve:x=>{clearTimeout(t);resolve(x)},reject:e=>{clearTimeout(t);reject(e)}});ws.send(JSON.stringify({id:n,method,params}));});
  const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
  const atlas=process.argv.includes('--atlas');
  await send('Page.enable');await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:atlas?1280:390,height:atlas?960:844,deviceScaleFactor:1,mobile:!atlas});
  const root=path.join(__dirname,'..');await send('Page.navigate',{url:pathToFileURL(path.join(root,atlas?'demo/design-atlas.html':'demo/index.html')).href});
  if(atlas){
   for(let i=0;i<30;i++){await delay(100);if(await ev('!!document.querySelector("[data-chart]")'))break;}
   assert.equal(await ev('document.querySelectorAll("[data-chart]").length'),36);
   assert(await ev('[...document.querySelectorAll("[data-chart] svg")].every(s=>s.children.length>1)'));
   for(const id of await ev('LIB.palettes.map(p=>p.id)')){await ev(`document.getElementById('theme').value=${JSON.stringify(id)};document.getElementById('theme').dispatchEvent(new Event('change'))`);assert(await ev('document.getElementById("contrast").textContent.includes(":1")'));}
   await ev('document.getElementById("theme").value="editorial";document.getElementById("theme").dispatchEvent(new Event("change"));document.getElementById("dataKind").value="index";document.getElementById("dataKind").dispatchEvent(new Event("change"))');
   assert.equal(await ev('document.querySelectorAll("[data-chart]").length'),10);assert.equal(await ev('!!document.querySelector("[data-chart=donut]")'),false);
   await ev('document.getElementById("dataKind").value="all";document.getElementById("dataKind").dispatchEvent(new Event("change"));document.getElementById("search").value="雷达";document.getElementById("search").dispatchEvent(new Event("input"))');assert.equal(await ev('document.querySelectorAll("[data-chart]").length'),1);
   await ev('document.getElementById("search").value="";document.getElementById("search").dispatchEvent(new Event("input"));document.getElementById("detailToggle").click()');assert(await ev('document.getElementById("detail").hidden===false'));
   assert(await ev('!!document.querySelector("[data-module=formation]")'));
   await ev('document.getElementById("omitHistory").click()');assert.equal(await ev('!!document.querySelector("[data-module=formation]")'),false);assert(await ev('!!document.querySelector("[data-module=contexts]")'));
   await ev('document.getElementById("reportRecipe").value="historical-match";document.getElementById("reportRecipe").dispatchEvent(new Event("change"))');assert(await ev('!!document.querySelector("[data-module=similarity]")'));assert(await ev('!!document.querySelector("[data-module=shared-differences]")'));
   const shots=path.join(root,'docs/browser');fs.mkdirSync(shots,{recursive:true});await ev('document.getElementById("recipes").scrollIntoView({behavior:"instant"}); new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');let image=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'06-report-composition.png'),Buffer.from(image.data,'base64'));await ev('window.scrollTo(0,0)');image=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'04-design-atlas.png'),Buffer.from(image.data,'base64'));
   await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});assert(await ev('document.documentElement.scrollWidth<=window.innerWidth'));
   image=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'05-design-atlas-mobile.png'),Buffer.from(image.data,'base64'));
   console.log(JSON.stringify({atlas:true,charts:36,themes:8,verified:['all SVG previews render','data-kind guard','radar search','all theme switches','expand detail','report recipe switch','history-data fallback','390px no overflow'],screenshots:shots},null,2));return;
  }
  for(let i=0;i<30;i++){await delay(100);if(await ev('!!document.getElementById("start")'))break;}
  assert(await ev('document.title.includes("周末")'));
  const shots=path.join(root,'docs/browser');fs.mkdirSync(shots,{recursive:true});
  async function shot(name){const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,name),Buffer.from(r.data,'base64'));}
  await shot('01-intro.png');await ev('document.getElementById("start").click()');
  await ev('document.querySelector(".option").click();document.querySelectorAll(".option")[1].click()');await delay(300);
  assert.equal(await ev('current'),1);assert.equal(await ev('answers[0]'),0);
  await ev('document.getElementById("back").click();document.querySelectorAll(".option")[1].click()');await delay(300);assert.equal(await ev('answers[0]'),1);
  await shot('02-question.png');
  for(let i=1;i<9;i++){await ev('document.querySelectorAll(".option")[1].click()');await delay(270);}
  assert(await ev('!document.getElementById("result").classList.contains("hidden")'));
  assert.equal(await ev('document.querySelectorAll(".result").length'),3);
  assert(await ev('document.documentElement.scrollWidth<=window.innerWidth'));
  await shot('03-result.png');
  const displayed=await ev('document.getElementById("resultTitle").textContent');
  assert(displayed.includes(await ev('score(DATA,answers).leaders[0].name')));
  await ev('window.__download="";HTMLAnchorElement.prototype.click=function(){window.__download=this.download};document.getElementById("download").click()');
  assert.equal(await ev('window.__download'),'我的探索报告.txt');
  console.log(JSON.stringify({browser:'Chrome headless',viewport:'390x844',verified:['actual local entry','start','auto next','double-click guard','back and replace answer','complete report','three result sections','no horizontal overflow','download handler'],result:displayed,screenshots:shots},null,2));
 }finally{if(ws)ws.close();child.kill();}
})().catch(e=>{console.error(e.stack||String(e));process.exitCode=1;});
