const PASS='Luna-132'

function isRoblox(req){
const ua=(req.headers.get('User-Agent')||'').toLowerCase()
return ua.includes('roblox')
}

function okHeader(req){
return (req.headers.get('X-Password')||'')===PASS
}

function loginHtml(){
return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Protected</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:monospace;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh}
.box{width:min(520px,92vw);background:#151515;border:1px solid #333;border-radius:10px;padding:28px}
h1{font-size:18px;margin-bottom:10px}
p{color:#aaa;font-size:13px;margin-bottom:14px}
input{width:100%;padding:12px;background:#0b0b0b;border:1px solid #333;border-radius:8px;color:#fff;font-family:monospace}
button{margin-top:12px;width:100%;padding:12px;border:0;border-radius:8px;background:#0066ff;color:#fff;font-weight:700;cursor:pointer}
button:hover{background:#0052cc}
.err{display:none;color:#ff6060;font-size:12px;margin-top:10px}
pre{white-space:pre-wrap;word-break:break-word;background:#0b0b0b;border:1px solid #222;border-radius:8px;padding:14px;margin-top:14px;max-height:60vh;overflow:auto}
</style>
</head>
<body>
<div class="box">
<h1>Access required</h1>
<p>Enter password to view this raw script.</p>
<input id="pw" type="password" placeholder="Password" autocomplete="off">
<button onclick="go()">Unlock</button>
<div class="err" id="err">Wrong password.</div>
<pre id="out" style="display:none"></pre>
</div>
<script>
async function go(){
const pw=document.getElementById('pw').value
if(!pw) return
const res=await fetch(location.pathname,{headers:{'X-Password':pw,'Cache-Control':'no-store'}})
if(res.status!==200){
document.getElementById('err').style.display='block'
return
}
const t=await res.text()
document.getElementById('err').style.display='none'
document.getElementById('out').style.display='block'
document.getElementById('out').textContent=t
document.getElementById('pw').value=''
}
</script>
</body>
</html>`
}

export async function onRequestGet(context){
try{
const id=context.params.id
const req=context.request

const code=await context.env.PASTE_DB.get(id,'text')
if(!code) return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}})

if(isRoblox(req)){
return new Response(code,{headers:{'Content-Type':'text/plain;charset=utf-8','Access-Control-Allow-Origin':'*','Cache-Control':'no-store'}})
}

if(okHeader(req)){
return new Response(code,{headers:{'Content-Type':'text/plain;charset=utf-8','Access-Control-Allow-Origin':'*','Cache-Control':'no-store'}})
}

return new Response(loginHtml(),{status:401,headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'}})
}catch(e){
return new Response('Error',{status:500,headers:{'Cache-Control':'no-store'}})
}
}
