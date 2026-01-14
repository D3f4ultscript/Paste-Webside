export async function onRequest(context){
const url=new URL(context.request.url)
const userAgent=context.request.headers.get('User-Agent')||''
const isRoblox=userAgent.toLowerCase().includes('roblox')

if(url.pathname.startsWith('/raw/')&&isRoblox){
return context.next()
}

const password=url.searchParams.get('pw')

if(url.pathname==='/'){
if(password!=='Luna-132'){
return new Response(getLoginPage(),{headers:{'Content-Type':'text/html'},status:401})
}
return context.next()
}

if(url.pathname.startsWith('/api/')){
const authHeader=context.request.headers.get('X-Password')||''
if(authHeader!=='Luna-132'){
return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json'}})
}
return context.next()
}

if(url.pathname.startsWith('/raw/')){
if(password!=='Luna-132'){
return new Response(getRawLoginPage(),{headers:{'Content-Type':'text/html'},status:401})
}
return context.next()
}

return context.next()
}

function getLoginPage(){
return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Protected</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:monospace;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.box{background:#1a1a1a;padding:50px;border:3px solid #0066ff;border-radius:12px;text-align:center;max-width:500px;box-shadow:0 0 50px rgba(0,102,255,0.4);animation:fadeIn 0.3s}
@keyframes fadeIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
h1{color:#00ccff;margin-bottom:30px;font-size:32px;text-shadow:0 0 15px rgba(0,204,255,0.5)}
.logo{font-size:64px;margin-bottom:20px;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
input{width:100%;padding:16px;margin:25px 0;background:#0a0a0a;border:2px solid #0066ff;color:#fff;font-family:monospace;border-radius:8px;font-size:16px;transition:0.3s}
input:focus{outline:none;border-color:#00ccff;box-shadow:0 0 20px rgba(0,204,255,0.3)}
button{width:100%;padding:16px;background:linear-gradient(135deg,#0066ff,#00ccff);color:#fff;border:none;cursor:pointer;font-family:monospace;border-radius:8px;font-size:16px;font-weight:bold;transition:0.3s}
button:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,102,255,0.6)}
.info{color:#ff3333;font-size:13px;margin-top:20px;font-weight:bold}
</style>
</head>
<body>
<div class="box">
<div class="logo">🔐</div>
<h1>Script Paste</h1>
<p style="color:#888;margin-bottom:20px">Maximum Security Mode</p>
<input type="password" id="pw" placeholder="Password" autofocus onkeypress="if(event.key==='Enter')submit()">
<button onclick="submit()">Unlock</button>
<div class="info">⚠️ Password required on every access</div>
</div>
<script>
function submit(){
const pw=document.getElementById('pw').value
if(!pw)return
location.href='/?pw='+encodeURIComponent(pw)
}
</script>
</body>
</html>`
}

function getRawLoginPage(){
return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Access Denied</title>
<style>
body{font-family:monospace;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.box{background:#1a1a1a;padding:40px;border:2px solid #ff3333;border-radius:8px;text-align:center;max-width:450px;box-shadow:0 0 30px rgba(255,51,51,0.3)}
h1{color:#ff3333;margin-bottom:20px;font-size:28px;text-shadow:0 0 10px rgba(255,51,51,0.5)}
input{width:100%;padding:12px;margin:20px 0;background:#0a0a0a;border:1px solid #333;color:#fff;font-family:monospace;border-radius:4px;font-size:14px}
input:focus{outline:none;border-color:#ff3333}
button{padding:12px 30px;background:#ff3333;color:#fff;border:none;cursor:pointer;font-family:monospace;border-radius:4px;font-size:14px;transition:0.2s}
button:hover{background:#ff0000;box-shadow:0 0 15px rgba(255,51,51,0.4)}
</style>
</head>
<body>
<div class="box">
<h1>🔒 Access Denied</h1>
<p>This content is protected. Enter password to view.</p>
<input type="password" id="pw" placeholder="Enter password..." autofocus onkeypress="if(event.key==='Enter')submit()">
<button onclick="submit()">Submit</button>
</div>
<script>
function submit(){
const pw=document.getElementById('pw').value
if(!pw)return
const currentUrl=new URL(window.location.href)
currentUrl.searchParams.set('pw',pw)
location.href=currentUrl.toString()
}
</script>
</body>
</html>`
}
