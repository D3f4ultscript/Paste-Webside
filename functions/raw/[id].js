function okPassword(req,env){
const pass=(env.SITE_PASSWORD||'').trim()
const provided=(req.headers.get('X-Password')||'').trim()
return pass&&provided===pass
}

function looksLikeBrowser(req){
const accept=(req.headers.get('Accept')||'').toLowerCase()
const sfm=req.headers.get('Sec-Fetch-Mode')||''
const sfd=req.headers.get('Sec-Fetch-Dest')||''
if(accept.includes('text/html')) return true
if(sfm==='navigate') return true
if(sfd==='document') return true
return false
}

function loginHtml(){
return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Protected</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:monospace;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh}.box{width:min(420px,90vw);background:#111;border:1px solid #333;padding:28px;border-radius:10px}h1{font-size:18px;margin-bottom:8px}p{color:#999;font-size:13px;margin-bottom:16px}input{width:100%;padding:12px;background:#000;border:1px solid #333;color:#fff;font-family:monospace;border-radius:8px}button{margin-top:12px;width:100%;padding:12px;border:0;background:#0066ff;color:#fff;font-weight:700;cursor:pointer;border-radius:8px}button:hover{background:#0052cc}.err{display:none;color:#ff6666;font-size:12px;margin-top:10px}pre{white-space:pre-wrap;word-break:break-word;background:#000;border:1px solid#222;padding:14px;margin-top:14px;max-height:60vh;overflow:auto;border-radius:8px}</style></head><body><div class="box"><h1>Access required</h1><p>Enter password to view this script.</p><input id="pw" type="password" placeholder="Password" autocomplete="off" autofocus onkeypress="if(event.key==='Enter')go()"><button onclick="go()">Unlock</button><div class="err" id="err">Wrong password</div><pre id="out" style="display:none"></pre></div><script>async function go(){var pw=document.getElementById('pw').value;if(!pw)return;var res=await fetch(location.pathname,{headers:{'X-Password':pw}});if(res.status!==200){document.getElementById('err').style.display='block';return}var t=await res.text();document.getElementById('err').style.display='none';document.getElementById('out').style.display='block';document.getElementById('out').textContent=t;document.getElementById('pw').value=''}</script></body></html>`
}

export async function onRequestGet(context){
try{
const id=context.params.id
const code=await context.env.PASTE_DB.get(id,'text')
if(!code) return new Response('Not found',{status:404})

if(okPassword(context.request,context.env)){
return new Response(code,{headers:{'Content-Type':'text/plain;charset=utf-8','Access-Control-Allow-Origin':'*'}})
}

if(looksLikeBrowser(context.request)){
return new Response(loginHtml(),{status:401,headers:{'Content-Type':'text/html'}})
}

return new Response(code,{headers:{'Content-Type':'text/plain;charset=utf-8','Access-Control-Allow-Origin':'*'}})
}catch(e){
return new Response('Error',{status:500})
}
}
