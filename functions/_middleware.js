export async function onRequest(context){
const url=new URL(context.request.url)
const p=url.pathname

if(p.startsWith('/raw/')) return context.next()

if(p==='/'||p==='/index.html') return Response.redirect(url.origin+'/app',302)

return context.next()
}
