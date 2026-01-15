function unauthorized(){
return new Response("Unauthorized",{status:401,headers:{"WWW-Authenticate":"Basic realm=\"Secure Area\"","Cache-Control":"no-store"}})
}

function parseBasic(h){
if(!h||!h.startsWith("Basic ")) return null
try{
const s=atob(h.slice(6))
const i=s.indexOf(":")
if(i<0) return null
return {u:s.slice(0,i),p:s.slice(i+1)}
}catch(e){
return null
}
}

function eq(a,b){
a=String(a);b=String(b)
if(a.length!==b.length) return false
let r=0
for(let i=0;i<a.length;i++) r|=a.charCodeAt(i)^b.charCodeAt(i)
return r===0
}

export async function onRequest(context){
const u=(context.env.BASIC_USER||"").trim()
const p=(context.env.BASIC_PASS||"").trim()
if(!u||!p) return new Response("Server misconfigured",{status:500,headers:{"Cache-Control":"no-store"}})

const c=parseBasic(context.request.headers.get("Authorization"))
if(!c||!eq(c.u,u)||!eq(c.p,p)) return unauthorized()

return context.next()
}
