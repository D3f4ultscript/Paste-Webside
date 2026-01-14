export async function onRequestPost(context){
try{
const{id}=await context.request.json()
if(!id)return new Response('Missing id',{status:400})
await context.env.PASTE_DB.delete(id)
return new Response(JSON.stringify({success:true}),{headers:{'Content-Type':'application/json'}})
}catch(e){
return new Response('Error',{status:500})
}
}
