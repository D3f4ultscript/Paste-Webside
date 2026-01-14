export async function onRequestGet(context){
try{
const id=context.params.id
const code=await context.env.PASTE_DB.get(id,'text')
if(!code)return new Response('Not found',{status:404})
return new Response(code,{headers:{'Content-Type':'text/plain;charset=utf-8','Access-Control-Allow-Origin':'*','Cache-Control':'no-cache'}})
}catch(e){
return new Response('Error: '+e.message,{status:500})
}
}
