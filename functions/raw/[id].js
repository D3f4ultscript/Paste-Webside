export async function onRequestGet(context){
try{
const id=context.params.id
const code=await context.env.PASTE_DB.get(id,'text')
if(!code) return new Response('Not found',{status:404})

const userAgent=(context.request.headers.get('User-Agent')||'').toLowerCase()
const isRoblox=userAgent.includes('roblox')

if(!isRoblox){
return new Response(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Access Denied</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:monospace;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh}.box{width:min(420px,90vw);background:#111;border:1px solid #333;padding:28px;border-radius:10px;text-align:center}h1{font-size:20px;margin-bottom:12px;color:#ff6666}p{color:#999;font-size:13px;line-height:1.6}</style></head><body><div class="box"><h1>⛔ Access Denied</h1><p>This resource cannot be accessed directly.</p></div></body></html>`,{status:403,headers:{'Content-Type':'text/html'}})
}

return new Response(code,{headers:{'Content-Type':'text/plain;charset=utf-8','Access-Control-Allow-Origin':'*'}})
}catch(e){
return new Response('Error',{status:500})
}
}
