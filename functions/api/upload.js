export async function onRequestPost(context){
try{
const{name,code,customId}=await context.request.json()
if(!name||!code)return new Response(JSON.stringify({error:'Missing fields'}),{status:400,headers:{'Content-Type':'application/json'}})
let id=customId?.trim()||''
if(id){
id=id.replace(/[^a-zA-Z0-9_-]/g,'')
const existing=await context.env.PASTE_DB.get(id)
if(existing)return new Response(JSON.stringify({error:'ID already exists'}),{status:409,headers:{'Content-Type':'application/json'}})
}else{
id=Date.now().toString(36)+Math.random().toString(36).substr(2,9)
}
await context.env.PASTE_DB.put(id,code,{metadata:{name,date:Date.now()}})
const url=new URL(context.request.url)
return new Response(JSON.stringify({id,raw:`${url.origin}/raw/${id}`}),{headers:{'Content-Type':'application/json'}})
}catch(e){
return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'Content-Type':'application/json'}})
}
}
