function checkAuth(req,env){
const validUser=(env.BASIC_USER||'').trim()
const validPass=(env.BASIC_PASS||'').trim()
const user=(req.headers.get('X-User')||'').trim()
const pass=(req.headers.get('X-Pass')||'').trim()
if(!validUser||!validPass) return false
return user===validUser&&pass===validPass
}

export async function onRequestGet(context){
if(!checkAuth(context.request,context.env)) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json'}})
try{
const id=context.params.id
const code=await context.env.PASTE_DB.get(id,'text')
if(!code) return new Response(JSON.stringify({error:'Not found'}),{status:404,headers:{'Content-Type':'application/json'}})
return new Response(JSON.stringify({code}),{headers:{'Content-Type':'application/json'}})
}catch(e){
return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'Content-Type':'application/json'}})
}
}
