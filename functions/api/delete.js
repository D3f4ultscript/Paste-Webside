export async function onRequestPost(context){
try{
const{id}=await context.request.json()
if(!id)return new Response(JSON.stringify({error:'Missing id'}),{status:400,headers:{'Content-Type':'application/json'}})
await context.env.PASTE_DB.delete(id)
return new Response(JSON.stringify({success:true}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}catch(e){
return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'Content-Type':'application/json'}})
}
}
