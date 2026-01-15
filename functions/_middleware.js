function checkBasicAuth(request,env){
const authHeader=request.headers.get('Authorization')
if(!authHeader||!authHeader.startsWith('Basic ')) return false
const base64=authHeader.substring(6)
const decoded=atob(base64)
const [user,pass]=decoded.split(':')
const validUser=(env.BASIC_USER||'').trim()
const validPass=(env.BASIC_PASS||'').trim()
if(!validUser||!validPass) return false
return user===validUser&&pass===validPass
}

export async function onRequest(context){
const url=new URL(context.request.url)
const path=url.pathname

if(path==='/'||path==='/index.html'){
return Response.redirect(url.origin+'/app',302)
}

if(path.startsWith('/raw/')){
return context.next()
}

if(!checkBasicAuth(context.request,context.env)){
return new Response('Unauthorized',{
status:401,
headers:{
'WWW-Authenticate':'Basic realm="Script Paste"',
'Cache-Control':'no-store'
}
})
}

return context.next()
}
