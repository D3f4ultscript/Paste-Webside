const PASS='Luna-132'

function okAuth(req){
return (req.headers.get('X-Password')||'')===PASS
}

export async function onRequestPost(context){
if(!okAuth(context.request)) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
try{
const {id}=await context.request.json()
if(!id) return new Response(JSON.stringify({error:'Missing id'}),{status:400,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
await context.env.PASTE_DB.delete(id)
return new Response(JSON.stringify({success:true}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}catch(e){
return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
}
}
