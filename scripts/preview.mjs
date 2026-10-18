import http from 'node:http';
import worker from '../worker/index.js';
http.createServer(async(req,res)=>{try{const response=await worker.fetch(new Request('http://localhost:4321'+req.url));res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(e){res.writeHead(500);res.end(String(e));}}).listen(4321,'127.0.0.1',()=>console.log('http://localhost:4321'));
