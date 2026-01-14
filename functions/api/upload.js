const PASS='Luna-132'

function okAuth(req){
return (req.headers.get('X-Password')||'')===PASS
}

function sanitizeId(s){
return (s||'').trim().replace(/[^a-zA-Z0-9_-]/g,'')
}

export async function onRequestPost(context){
if(!okAuth(context.request)) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
try{
const {name,code,customId}=await context.request.json()
if(!name||!code) return new Response(JSON.stringify({error:'Missing fields'}),{status:400,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})

let id=sanitizeId(customId)
if(id){
const exists=await context.env.PASTE_DB.get(id)
if(exists) return new Response(JSON.stringify({error:'ID already exists'}),{status:409,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}else{
id=Date.now().toString(36)+Math.random().toString(36).slice(2,11)
}

await context.env.PASTE_DB.put(id,code,{metadata:{name:String(name),date:Date.now()}})
const url=new URL(context.request.url)
return new Response(JSON.stringify({id,raw:`${url.origin}/raw/${id}`}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}catch(e){
return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}
}
