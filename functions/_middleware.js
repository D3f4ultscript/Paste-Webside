function parseBasic(req){
const h=req.headers.get('Authorization')||''
if(!h.startsWith('Basic ')) return null
try{
const d=atob(h.slice(6))
const i=d.indexOf(':')
if(i<0) return null
return {u:d.slice(0,i),p:d.slice(i+1)}
}catch(e){return null}
}

function unauthorized(){
return new Response('Unauthorized',{status:401,headers:{'WWW-Authenticate':'Basic realm="Secure Area"','Cache-Control':'no-store'}})
}

export async function onRequest(context){
const u=(context.env.BASIC_USER||'').trim()
const p=(context.env.BASIC_PASS||'').trim()
if(!u||!p||!context.env.HB_DB) return new Response('Server misconfigured',{status:500,headers:{'Cache-Control':'no-store'}})

const url=new URL(context.request.url)
const ip=context.request.headers.get('CF-Connecting-IP')||'0'
const key='hb:'+ip

if(url.pathname==='/__hb'){
if(context.request.method!=='POST') return new Response('Method Not Allowed',{status:405,headers:{'Cache-Control':'no-store'}})
const c=parseBasic(context.request)
if(!c||c.u!==u||c.p!==p) return unauthorized()
await context.env.HB_DB.put(key,'1',{expirationTtl:75})
return new Response(null,{status:204,headers:{'Cache-Control':'no-store'}})
}

const active=await context.env.HB_DB.get(key)
if(!active) return unauthorized()

const c=parseBasic(context.request)
if(!c||c.u!==u||c.p!==p) return unauthorized()

return context.next()
}
