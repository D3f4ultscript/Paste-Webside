function parseBasic(req){
const h=req.headers.get('Authorization')||''
if(!h.startsWith('Basic ')) return null
try{
const d=atob(h.slice(6))
const i=d.indexOf(':')
if(i<0) return null
return {u:d.slice(0,i),p:d.slice(i+1)}
}catch(e){
return null
}
}

function unauthorized(){
return new Response('Unauthorized',{status:401,headers:{'WWW-Authenticate':'Basic realm="Secure Area"'}})
}

export async function onRequest(context){
const u=(context.env.BASIC_USER||'').trim()
const p=(context.env.BASIC_PASS||'').trim()
if(!u||!p) return new Response('Server misconfigured',{status:500})

const c=parseBasic(context.request)
if(!c||c.u!==u||c.p!==p) return unauthorized()

return context.next()
}
