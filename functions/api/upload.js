export async function onRequestPost(context){
try{
const{name,code}=await context.request.json()
if(!name||!code)return new Response('Missing fields',{status:400})
const id=Date.now().toString(36)+Math.random().toString(36).substr(2,9)
await context.env.PASTE_DB.put(id,code,{metadata:{name,date:Date.now()}})
const url=new URL(context.request.url)
return new Response(JSON.stringify({id,raw:`${url.origin}/raw/${id}`}),{headers:{'Content-Type':'application/json'}})
}catch(e){
return new Response('Error',{status:500})
}
}
