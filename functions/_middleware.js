export async function onRequest(context){
const url=new URL(context.request.url)
if(url.pathname==='/'||url.pathname==='/index.html') return Response.redirect(url.origin+'/app',302)
return context.next()
}
