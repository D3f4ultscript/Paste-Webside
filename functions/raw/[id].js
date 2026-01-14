export async function onRequestGet(context){
try{
const id=context.params.id
const code=await context.env.PASTE_DB.get(id,'text')
if(!code) return new Response('Not found',{status:404})

const url=new URL(context.request.url)
const reqToken=url.searchParams.get('token')||''
const validToken=(context.env.RAW_TOKEN||'').trim()

if(!validToken) return new Response('Server not configured',{status:500})

if(reqToken!==validToken){
return new Response('Invalid or missing token',{status:403})
}

return new Response(code,{headers:{'Content-Type':'text/plain;charset=utf-8','Access-Control-Allow-Origin':'*'}})
}catch(e){
return new Response('Error',{status:500})
}
}
