const PASS='Luna-132'

function okAuth(req){
return (req.headers.get('X-Password')||'')===PASS
}

export async function onRequestGet(context){
if(!okAuth(context.request)) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
try{
const r=await context.env.PASTE_DB.list()
const items=(r.keys||[]).map(k=>({id:k.name,name:k.metadata?.name||'Unnamed',date:k.metadata?.date||0}))
items.sort((a,b)=>b.date-a.date)
return new Response(JSON.stringify(items),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}catch(e){
return new Response(JSON.stringify([]),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}
}
