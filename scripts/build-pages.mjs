import {mkdir,writeFile,rm} from 'node:fs/promises';
import worker from '../worker/index.js';
const out=new URL('../docs/',import.meta.url);
await rm(out,{recursive:true,force:true});await mkdir(new URL('data/history/',out),{recursive:true});
const run=path=>worker.fetch(new Request('https://build.local'+path));
let html=await(await run('/')).text();
const data=await(await run('/api/neighbourhoods')).json();
await writeFile(new URL('data/neighbourhoods.json',out),JSON.stringify(data));
for(const row of data.rows){const history=await run('/api/history?area='+encodeURIComponent(row.slug));await writeFile(new URL('data/history/'+row.slug+'.json',out),await history.text());}
html=html.replace("fetch('/api/neighbourhoods')","fetch('./data/neighbourhoods.json')").replace("fetch('/api/history?area='+encodeURIComponent(area))","fetch('./data/history/'+encodeURIComponent(area)+'.json')").replaceAll('href="/"','href="./"');
html=html.replace('</header>','</header><div style="padding:12px 5%;background:#e7edde;color:#224e40;font-size:12px;line-height:1.7">Статистика от Imot.bg · Исторически справки: октомври 2011–2026 г. · Бъдещите сценарии са илюстративни, без гаранция за резултат.</div>');
await writeFile(new URL('index.html',out),html);await writeFile(new URL('.nojekyll',out),'');
console.log('Statistics site ready: '+data.rows.length+' areas.');
