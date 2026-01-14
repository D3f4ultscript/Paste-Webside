function ok(req,env){
return (req.headers.get('X-Password')||'')===(env.ADMIN_PASSWORD||'')
}
export async function onRequestGet(context){
if(!ok(context.request,context.env)) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
try{
const id=context.params.id
const code=await context.env.PASTE_DB.get(id,'text')
if(!code) return new Response(JSON.stringify({error:'Not found'}),{status:404,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
return new Response(JSON.stringify({code}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}catch(e){
return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}
}
