const MASTER_PASSWORD='Luna-132'
const ROBLOX_TOKEN='roblox_secret_abc123xyz'

function checkPassword(req){
const authHeader=req.headers.get('X-Password')||''
return authHeader===MASTER_PASSWORD
}

function checkSession(req){
const cookies=req.headers.get('Cookie')||''
const match=cookies.match(/session=([^;]+)/)
if(!match)return false
try{
const decoded=atob(match[1])
return decoded===MASTER_PASSWORD
}catch(e){
return false
}
}

function checkRobloxToken(url){
const token=url.searchParams.get('token')
return token===ROBLOX_TOKEN
}

export async function onRequest(context){
const url=new URL(context.request.url)
const req=context.request

if(url.pathname.startsWith('/raw/')&&checkRobloxToken(url)){
return context.next()
}

if(url.pathname.startsWith('/api/')){
if(!checkSession(req)&&!checkPassword(req)){
return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}
return context.next()
}

if(url.pathname==='/'){
if(checkPassword(req)){
const response=await context.next()
const newResponse=new Response(response.body,response)
newResponse.headers.set('Set-Cookie',`session=${btoa(MASTER_PASSWORD)}; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Strict`)
return newResponse
}
if(checkSession(req)){
return context.next()
}
return new Response(getLoginHTML(),{status:401,headers:{'Content-Type':'text/html','Cache-Control':'no-store'}})
}

return context.next()
}

function getLoginHTML(){
return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Access Required</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:monospace;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh}
.box{width:min(420px,90vw);background:#111;border:1px solid #333;border-radius:10px;padding:32px;box-shadow:0 0 60px rgba(0,102,255,0.3)}
h1{font-size:20px;margin-bottom:8px;color:#00ccff}
p{color:#999;font-size:13px;margin-bottom:20px}
input{width:100%;padding:14px;background:#000;border:1px solid #333;border-radius:8px;color:#fff;font-family:monospace;font-size:14px}
input:focus{outline:none;border-color:#0066ff}
button{margin-top:14px;width:100%;padding:14px;border:0;border-radius:8px;background:#0066ff;color:#fff;font-weight:700;cursor:pointer;font-size:14px}
button:hover{background:#0052cc}
.err{display:none;color:#ff6666;font-size:12px;margin-top:10px}
</style>
</head>
<body>
<div class="box">
<h1>🔒 Authentication Required</h1>
<p>Enter password to access</p>
<input type="password" id="pw" placeholder="Password" autofocus onkeypress="if(event.key==='Enter')go()">
<button onclick="go()">Unlock</button>
<div class="err" id="err">Wrong password</div>
</div>
<script>
async function go(){
const pw=document.getElementById('pw').value
if(!pw)return
const res=await fetch('/',{method:'GET',headers:{'X-Password':pw,'Cache-Control':'no-store'}})
if(res.status===200){
location.reload()
}else{
document.getElementById('err').style.display='block'
}
}
</script>
</body>
</html>`
}
