const te=new TextEncoder()

function b64u(bytes){
let s=''
for(let i=0;i<bytes.length;i++) s+=String.fromCharCode(bytes[i])
return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
}

function ub64u(s){
s=s.replace(/-/g,'+').replace(/_/g,'/')
while(s.length%4) s+='='
const bin=atob(s)
const out=new Uint8Array(bin.length)
for(let i=0;i<bin.length;i++) out[i]=bin.charCodeAt(i)
return out
}

function cookieGet(req,name){
const c=req.headers.get('Cookie')||''
const parts=c.split(';')
for(let i=0;i<parts.length;i++){
const p=parts[i].trim()
if(!p) continue
const eq=p.indexOf('=')
if(eq<0) continue
const k=p.slice(0,eq).trim()
if(k===name) return p.slice(eq+1)
}
return ''
}

function downHtml(){
return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Login</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:monospace;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}.box{width:min(520px,92vw);background:#151515;border:1px solid #333;border-radius:12px;padding:28px;box-shadow:0 20px 70px rgba(0,0,0,0.7)}h1{font-size:18px;margin-bottom:10px}p{color:#aaa;font-size:13px;margin-bottom:14px;line-height:1.4}input{width:100%;padding:12px;background:#0b0b0b;border:1px solid #333;border-radius:10px;color:#fff;font-family:monospace}button{margin-top:12px;width:100%;padding:12px;border:0;border-radius:10px;background:#0066ff;color:#fff;font-weight:700;cursor:pointer}button:hover{background:#0052cc}.err{margin-top:10px;color:#ff6060;font-size:12px;display:none}</style></head><body><div class="box"><h1>Access required</h1><p>Please sign in to continue.</p><form method="POST" action="/__login"><input name="u" placeholder="Username" autocomplete="username" autofocus><input name="p" type="password" placeholder="Password" autocomplete="current-password"><input type="hidden" name="n" value=""><button type="submit">Login</button><div class="err" id="e">Invalid username or password.</div></form></div><script>var q=new URLSearchParams(location.search);var e=q.get('e');if(e==='1')document.getElementById('e').style.display='block';document.querySelector('input[name=n]').value=q.get('next')||'/';</script></body></html>`
}

function redirectTo(url){
return new Response(null,{status:302,headers:{Location:url}})
}

async function hmacKey(secret){
return crypto.subtle.importKey('raw',te.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])
}

async function sign(secret,msg){
const key=await hmacKey(secret)
const sig=await crypto.subtle.sign('HMAC',key,te.encode(msg))
return b64u(new Uint8Array(sig))
}

async function verify(secret,msg,sig){
try{
const key=await hmacKey(secret)
return await crypto.subtle.verify('HMAC',key,ub64u(sig),te.encode(msg))
}catch(e){
return false
}
}

async function isAuthed(req,env){
const pass=(env.BASIC_PASS||'').trim()
if(!pass) return false
const v=cookieGet(req,'cf_auth')
if(!v) return false
const parts=v.split('.')
if(parts.length!==2) return false
const ts=parts[0]
const mac=parts[1]
if(!/^\d{10,}$/.test(ts)) return false
const t=Number(ts)
if(!Number.isFinite(t)) return false
if(Date.now()-t>7*24*60*60*1000) return false
return await verify(pass,'v1.'+ts,mac)
}

function secureCookie(value){
return 'cf_auth='+value+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800'
}

function blankDown(){
return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Service Unavailable</title><style>html,body{margin:0;height:100%;background:#000}</style></head><body><script>alert('The website is currently down. Please try again later.')</script></body></html>`,{status:503,headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'}})
}

export async function onRequest(context){
const u=(context.env.BASIC_USER||'').trim()
const p=(context.env.BASIC_PASS||'').trim()
if(!u||!p) return new Response('Server misconfigured',{status:500,headers:{'Cache-Control':'no-store'}})

const url=new URL(context.request.url)

if(url.pathname==='/__logout'){
return new Response(null,{status:302,headers:{Location:'/', 'Set-Cookie':'cf_auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0','Cache-Control':'no-store'}})
}

if(url.pathname==='/__login' && context.request.method==='POST'){
const form=await context.request.formData()
const iu=String(form.get('u')||'')
const ip=String(form.get('p')||'')
const next=String(form.get('n')||'/')
if(iu!==u||ip!==p) return redirectTo('/__login?e=1&next='+encodeURIComponent(next))
const ts=String(Date.now())
const mac=await sign(p,'v1.'+ts)
const cookie=secureCookie(ts+'.'+mac)
return new Response(null,{status:302,headers:{Location:next,'Set-Cookie':cookie,'Cache-Control':'no-store'}})
}

if(url.pathname==='/__login'){
return new Response(downHtml(),{status:200,headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'}})
}

if(await isAuthed(context.request,context.env)){
return context.next()
}

if(context.request.method==='GET' && (url.pathname.endsWith('.js')||url.pathname.endsWith('.css')||url.pathname.endsWith('.png')||url.pathname.endsWith('.jpg')||url.pathname.endsWith('.svg')||url.pathname.endsWith('.ico')||url.pathname.endsWith('.woff')||url.pathname.endsWith('.woff2')||url.pathname.endsWith('.ttf')||url.pathname.endsWith('.json')||url.pathname.startsWith('/api/')||url.pathname.startsWith('/raw/')||url.pathname==='/app')){
const nxt=encodeURIComponent(url.pathname+url.search)
return redirectTo('/__login?next='+nxt)
}

if(context.request.method==='GET') return redirectTo('/__login?next='+encodeURIComponent(url.pathname+url.search))

return blankDown()
}
