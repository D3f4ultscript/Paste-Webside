export async function onRequestGet(context){
try{
const id=context.params.id
const code=await context.env.PASTE_DB.get(id)
if(!code)return new Response('Not found',{status:404})
return new Response(code,{headers:{'Content-Type':'text/plain','Access-Control-Allow-Origin':'*'}})
}catch(e){
return new Response('Error',{status:500})
}
}
