export async function onRequestGet(context){
try{
const r=await context.env.PASTE_DB.list()
const items=(r.keys||[]).map(k=>({id:k.name,name:k.metadata?.name||'Unnamed',date:k.metadata?.date||0}))
items.sort((a,b)=>b.date-a.date)
return new Response(JSON.stringify(items),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}catch(e){
return new Response(JSON.stringify([]),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}
}
