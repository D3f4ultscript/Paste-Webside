function isOperaGX(req){
const ua=(req.headers.get('User-Agent')||'').toLowerCase()
return ua.includes('opx')
}

function parseBasicAuth(req){
const auth=req.headers.get('Authorization')||''
if(!auth.startsWith('Basic ')) return null
try{
const decoded=atob(auth.slice(6))
const [user,pass]=decoded.split(':',2)
return {user,pass}
}catch(e){
return null
}
}

function downHtml(){
return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Maintenance</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh}.modal{background:#111;border:2px solid#333;padding:40px;border-radius:12px;text-align:center;max-width:420px}h1{font-size:22px;margin-bottom:16px;color:#ff6666}p{font-size:14px;color:#999;line-height:1.6}</style></head><body><div class="modal"><h1>⚠️ Service Unavailable</h1><p>The website is currently undergoing maintenance. Please try again later.</p></div></body></html>`
}

function unauthorized(){
return new Response('Unauthorized',{status:401,headers:{'WWW-Authenticate':'Basic realm="Secure Area"'}})
}

export async function onRequest(context){
const env=context.env
const req=context.request

if(!isOperaGX(req)){
return new Response(downHtml(),{status:503,headers:{'Content-Type':'text/html'}})
}

const validUser=(env.BASIC_USER||'').trim()
const validPass=(env.BASIC_PASS||'').trim()

if(!validUser||!validPass){
return new Response('Server misconfigured',{status:500})
}

const creds=parseBasicAuth(req)
if(!creds||creds.user!==validUser||creds.pass!==validPass){
return unauthorized()
}

return context.next()
}
