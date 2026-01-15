function checkAuth(req,env){
const validUser=(env.BASIC_USER||'').trim()
const validPass=(env.BASIC_PASS||'').trim()
const user=(req.headers.get('X-User')||'').trim()
const pass=(req.headers.get('X-Pass')||'').trim()
if(!validUser||!validPass) return false
return user===validUser&&pass===validPass
}

export async function onRequestPost(context){
if(!checkAuth(context.request,context.env)) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json'}})
try{
const {id,name,code}=await context.request.json()
if(!id||!name||!code) return new Response(JSON.stringify({error:'Missing fields'}),{status:400,headers:{'Content-Type':'application/json'}})

const exists=await context.env.PASTE_DB.get(id)
if(!exists) return new Response(JSON.stringify({error:'Not found'}),{status:404,headers:{'Content-Type':'application/json'}})

await context.env.PASTE_DB.put(id,code,{metadata:{name:String(name),date:Date.now()}})
return new Response(JSON.stringify({success:true}),{headers:{'Content-Type':'application/json'}})
}catch(e){
return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'Content-Type':'application/json'}})
}
}
