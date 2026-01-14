export async function onRequestGet(context){
try{
const id=context.params.id
const code=await context.env.PASTE_DB.get(id,'text')
if(!code)return new Response('Not found',{status:404})

const userAgent=context.request.headers.get('User-Agent')||''
const isRoblox=userAgent.toLowerCase().includes('roblox')

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
<input type="password" id="pw" placeholder="Enter password..." onkeypress="if(event.key==='Enter')submit()">
<button onclick="submit()">Submit</button>
</div>
<script>
function submit(){location.href='?pw='+document.getElementById('pw').value}
</script>
</body>
</html>`,{headers:{'Content-Type':'text/html'},status:403})
}
}

return new Response(code,{headers:{'Content-Type':'text/plain;charset=utf-8','Access-Control-Allow-Origin':'*','Cache-Control':'no-cache'}})
}catch(e){
return new Response('Error: '+e.message,{status:500})
}
}
