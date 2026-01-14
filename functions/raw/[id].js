export async function onRequestGet(context){
try{
const id=context.params.id
const code=await context.env.PASTE_DB.get(id)
if(!code)return new Response('Not found',{status:404})

const userAgent=context.request.headers.get('User-Agent')||''
const isRoblox=userAgent.includes('Roblox')||userAgent.includes('roblox')

if(!isRoblox){
const url=new URL(context.request.url)
const password=url.searchParams.get('pw')
if(password!=='Luna-132'){
return new Response(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Access Denied</title>
<style>
body{font-family:monospace;background:#1a1a1a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.box{background:#2a2a2a;padding:30px;border:2px solid #ff4444;text-align:center;max-width:400px}
h1{color:#ff4444;margin-bottom:20px}
input{width:100%;padding:10px;margin:15px 0;background:#1a1a1a;border:1px solid #444;color:#fff;font-family:monospace}
button{padding:10px 20px;background:#0066ff;color:#fff;border:none;cursor:pointer;font-family:monospace}
</style>
</head>
<body>
<div class="box">
<h1>Access Denied</h1>
<p>This content is protected. Enter password to view.</p>
<input type="password" id="pw" placeholder="Password">
<button onclick="location.href='?pw='+document.getElementById('pw').value">Submit</button>
</div>
</body>
</html>`,{headers:{'Content-Type':'text/html'},status:403})
}
}

return new Response(code,{headers:{'Content-Type':'text/plain;charset=utf-8','Access-Control-Allow-Origin':'*'}})
}catch(e){
return new Response('Error',{status:500})
}
}
