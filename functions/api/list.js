export async function onRequestGet(context){
try{
const list=await context.env.PASTE_DB.list()
const items=list.keys.map(k=>({id:k.name,...k.metadata}))
return new Response(JSON.stringify(items),{headers:{'Content-Type':'application/json'}})
}catch(e){
return new Response('[]',{headers:{'Content-Type':'application/json'}})
}
}
