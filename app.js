const input=document.getElementById('file'), choose=document.getElementById('choose');
const results=document.getElementById('results'), empty=document.getElementById('empty');
let records=[];
function size(n){if(n<1024)return n+' B';let u=['KB','MB','GB'];let i=-1;do{n/=1024;i++}while(n>=1024&&i<u.length-1);return n.toFixed(2)+' '+u[i]}
function render(){document.getElementById('count').textContent=records.length;document.getElementById('total').textContent=size(records.reduce((a,x)=>a+x.bytes,0));empty.hidden=records.length>0;results.innerHTML='';records.forEach(r=>{let el=document.createElement('article');el.className='result';el.innerHTML=`<div class="result-top"><div class="result-name"></div><div class="result-type"></div></div><div class="result-meta"></div>`;el.querySelector('.result-name').textContent=r.name;el.querySelector('.result-type').textContent=r.type;el.querySelector('.result-meta').textContent=`Größe: ${size(r.bytes)} · ${r.date} | SHA-256: ${r.hash}`;results.appendChild(el)})}
choose.addEventListener('click',()=>input.click());
input.addEventListener('change',async()=>{const f=input.files?.[0];if(!f)return;let type=f.name.toLowerCase().endsWith('.apk')?'APK':f.name.toLowerCase().endsWith('.ipa')?'IPA':'ZIP';let hash='Nicht verfügbar';try{const buf=await f.arrayBuffer();const digest=await crypto.subtle.digest('SHA-256',buf);hash=[...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){hash='Browser unterstützt SHA-256 nicht'}records.unshift({name:f.name,type,bytes:f.size,date:new Date().toLocaleString('de-DE'),hash});render();input.value=''});
document.getElementById('clear').addEventListener('click',()=>{records=[];render()});
if('serviceWorker'in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
render();
