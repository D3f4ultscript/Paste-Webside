function okPassword(req,env){
const pass=(env.SITE_PASSWORD||'').trim()
const provided=(req.headers.get('X-Password')||'').trim()
if(!pass) return false
return provided===pass
}

export async function onRequestPost(context){
if(!okPassword(context.request,context.env)) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
try{
const {id,name,code}=await context.request.json()
if(!id||!name||!code) return new Response(JSON.stringify({error:'Missing fields'}),{status:400,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})

const exists=await context.env.PASTE_DB.get(id)
if(!exists) return new Response(JSON.stringify({error:'Not found'}),{status:404,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})

await context.env.PASTE_DB.put(id,code,{metadata:{name:String(name),date:Date.now()}})
return new Response(JSON.stringify({success:true}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}catch(e){
return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}
}
