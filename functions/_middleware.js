export async function onRequest(context){
const url=new URL(context.request.url)
const userAgent=context.request.headers.get('User-Agent')||''
const isRoblox=userAgent.toLowerCase().includes('roblox')

if(url.pathname.startsWith('/raw/')&&isRoblox){
return context.next()
}

if(url.pathname.startsWith('/api/')||url.pathname.startsWith('/functions/')){
return context.next()
}

if(url.pathname==='/'){
const cookies=context.request.headers.get('Cookie')||''
const hasAuth=cookies.includes('auth=Luna-132')
const password=url.searchParams.get('pw')

if(password==='Luna-132'){
const response=await context.next()
const newResponse=new Response(response.body,response)
newResponse.headers.set('Set-Cookie','auth=Luna-132; Path=/; Max-Age=2592000; SameSite=Strict')
return newResponse
}

if(!hasAuth){
return new Response(`<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Protected</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:monospace;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.box{background:#1a1a1a;padding:50px;border:3px solid #0066ff;border-radius:12px;text-align:center;max-width:500px;box-shadow:0 0 50px rgba(0,102,255,0.4)}
h1{color:#00ccff;margin-bottom:30px;font-size:32px;text-shadow:0 0 15px rgba(0,204,255,0.5)}
.logo{font-size:64px;margin-bottom:20px}
input{width:100%;padding:16px;margin:25px 0;background:#0a0a0a;border:2px solid #0066ff;color:#fff;font-family:monospace;border-radius:8px;font-size:16px;transition:0.3s}
input:focus{outline:none;border-color:#00ccff;box-shadow:0 0 20px rgba(0,204,255,0.3)}
button{width:100%;padding:16px;background:linear-gradient(135deg,#0066ff,#00ccff);color:#fff;border:none;cursor:pointer;font-family:monospace;border-radius:8px;font-size:16px;font-weight:bold;transition:0.3s}
button:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,102,255,0.6)}
.error{color:#ff3333;margin-top:15px;font-size:14px;display:none}
</style>
</head>
<body>
<div class="box">
<div class="logo">🔒</div>
<h1>Script Paste</h1>
<p style="color:#888;margin-bottom:20px">Enter password to access</p>
<input type="password" id="pw" placeholder="Password" onkeypress="if(event.key==='Enter')submit()">
<button onclick="submit()">Unlock</button>
<div class="error" id="error">❌ Wrong password</div>
</div>
<script>
const urlParams=new URLSearchParams(window.location.search)
if(urlParams.get('error')==='1')document.getElementById('error').style.display='block'
function submit(){
const pw=document.getElementById('pw').value
if(!pw)return
location.href='/?pw='+encodeURIComponent(pw)
}
</script>
</body>
</html>`,{headers:{'Content-Type':'text/html'},status:401})
}
}

return context.next()
}
