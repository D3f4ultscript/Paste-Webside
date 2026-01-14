function ok(req,env){
const pass=(env.SITE_PASSWORD||'').trim()
const provided=(req.headers.get('X-Password')||'').trim()
return pass&&provided===pass
}

export async function onRequestGet(context){
if(!ok(context.request,context.env)) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json'}})
try{
const r=await context.env.PASTE_DB.list()
const items=(r.keys||[]).map(k=>({id:k.name,name:k.metadata?.name||'Unnamed',date:k.metadata?.date||0}))
items.sort((a,b)=>b.date-a.date)
return new Response(JSON.stringify(items),{headers:{'Content-Type':'application/json'}})
}catch(e){
return new Response(JSON.stringify([]),{headers:{'Content-Type':'application/json'}})
}
}
