function ok(req,env){
const pass=(env.SITE_PASSWORD||'').trim()
const provided=(req.headers.get('X-Password')||'').trim()
return pass&&provided===pass
}

function sanitizeId(s){
return (s||'').trim().replace(/[^a-zA-Z0-9_-]/g,'')
}

export async function onRequestPost(context){
if(!ok(context.request,context.env)) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json'}})
try{
const {name,code,customId}=await context.request.json()
if(!name||!code) return new Response(JSON.stringify({error:'Missing fields'}),{status:400,headers:{'Content-Type':'application/json'}})

let id=sanitizeId(customId)
if(id){
const exists=await context.env.PASTE_DB.get(id)
if(exists) return new Response(JSON.stringify({error:'ID exists'}),{status:409,headers:{'Content-Type':'application/json'}})
}else{
id=Date.now().toString(36)+Math.random().toString(36).slice(2,11)
}

await context.env.PASTE_DB.put(id,code,{metadata:{name:String(name),date:Date.now()}})
return new Response(JSON.stringify({id}),{headers:{'Content-Type':'application/json'}})
}catch(e){
return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'Content-Type':'application/json'}})
}
}
