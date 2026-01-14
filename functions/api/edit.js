export async function onRequestPost(context){
try{
const{id,name,code}=await context.request.json()
if(!id||!name||!code)return new Response('Missing fields',{status:400})
const existing=await context.env.PASTE_DB.get(id)
if(!existing)return new Response('Not found',{status:404})
await context.env.PASTE_DB.put(id,code,{metadata:{name,date:Date.now()}})
return new Response(JSON.stringify({success:true}),{headers:{'Content-Type':'application/json'}})
}catch(e){
return new Response('Error',{status:500})
}
}
