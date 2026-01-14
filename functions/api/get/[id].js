export async function onRequestGet(context){
try{
const id=context.params.id
const code=await context.env.PASTE_DB.get(id,'text')
if(!code)return new Response(JSON.stringify({error:'Not found'}),{status:404,headers:{'Content-Type':'application/json'}})
return new Response(JSON.stringify({code}),{headers:{'Content-Type':'application/json'}})
}catch(e){
return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'Content-Type':'application/json'}})
}
}
