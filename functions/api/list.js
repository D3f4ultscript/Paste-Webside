export async function onRequestGet(context){
try{
const list=await context.env.PASTE_DB.list()
const items=list.keys.map(k=>({id:k.name,name:k.metadata?.name||'Unnamed',date:k.metadata?.date||Date.now()}))
return new Response(JSON.stringify(items.sort((a,b)=>b.date-a.date)),{headers:{'Content-Type':'application/json','Cache-Control':'no-cache'}})
}catch(e){
return new Response(JSON.stringify([]),{headers:{'Content-Type':'application/json'}})
}
}
