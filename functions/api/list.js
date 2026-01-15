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
const r=await context.env.PASTE_DB.list()
const items=(r.keys||[]).map(k=>({id:k.name,name:k.metadata?.name||'Unnamed',date:k.metadata?.date||0}))
items.sort((a,b)=>b.date-a.date)
return new Response(JSON.stringify(items),{headers:{'Content-Type':'application/json'}})
}catch(e){
return new Response(JSON.stringify([]),{headers:{'Content-Type':'application/json'}})
}
}
