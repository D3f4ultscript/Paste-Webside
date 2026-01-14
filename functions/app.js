function loginHtml(){
return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Login</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:monospace;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh}
.box{width:min(520px,92vw);background:#151515;border:1px solid #333;border-radius:12px;padding:28px;box-shadow:0 20px 70px rgba(0,0,0,0.7)}
h1{font-size:18px;margin-bottom:10px}
p{color:#aaa;font-size:13px;margin-bottom:14px;line-height:1.4}
input{width:100%;padding:12px;background:#0b0b0b;border:1px solid #333;border-radius:10px;color:#fff;font-family:monospace}
button{margin-top:12px;width:100%;padding:12px;border:0;border-radius:10px;background:#0066ff;color:#fff;font-weight:700;cursor:pointer}
button:hover{background:#0052cc}
.err{display:none;color:#ff6060;font-size:12px;margin-top:10px}
</style>
</head>
<body>
<div class="box">
<h1>Access required</h1>
<p>Enter password to open the site.</p>
<input id="pw" type="password" placeholder="Password" autocomplete="off" autofocus onkeypress="if(event.key==='Enter')go()">
<button onclick="go()">Unlock</button>
<div class="err" id="err">Wrong password.</div>
</div>
<script>
async function go(){
var pw=document.getElementById('pw').value
if(!pw) return
var res=await fetch('/app',{headers:{'X-Password':pw,'Cache-Control':'no-store'}})
if(res.status!==200){document.getElementById('err').style.display='block';return}
var html=await res.text()
document.open();document.write(html);document.close()
}
</script>
</body>
</html>`
}

function appHtml(){
return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Script Paste</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',monospace;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 100%);color:#fff;padding:40px 20px;min-height:100vh}
.container{max-width:900px;margin:0 auto}
h1{margin-bottom:22px;font-size:34px;background:linear-gradient(45deg,#0066ff,#00ccff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-align:center}
.panel{background:rgba(42,42,42,0.6);padding:22px;border-radius:12px;margin-bottom:28px;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);box-shadow:0 8px 32px rgba(0,0,0,0.4)}
input,textarea{width:100%;padding:14px;margin:10px 0;background:rgba(20,20,20,0.85);border:1px solid rgba(255,255,255,0.12);color:#fff;font-family:monospace;font-size:14px;border-radius:10px;transition:0.2s}
input:focus,textarea:focus{outline:none;border-color:#0066ff;box-shadow:0 0 15px rgba(0,102,255,0.25)}
textarea{min-height:200px;resize:vertical;font-size:13px;line-height:1.5}
.row{display:flex;gap:10px}
.btn{padding:12px 18px;background:linear-gradient(135deg,#0066ff,#0052cc);color:#fff;border:none;cursor:pointer;font-size:14px;border-radius:10px;font-weight:700;transition:0.2s;flex:1}
.btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,102,255,0.35)}
.btn:disabled{opacity:0.55;cursor:not-allowed;transform:none;box-shadow:none}
.btn.gray{background:linear-gradient(135deg,#333,#222)}
.list{margin-top:10px}
.item{background:rgba(42,42,42,0.55);padding:18px;margin:12px 0;border-left:4px solid #0066ff;border-radius:10px;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);position:relative}
.item-header{display:flex;justify-content:space-between;align-items:center;gap:10px}
.item h3{font-size:17px;color:#00ccff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:70%}
.small{font-size:12px;color:#9a9a9a;margin-top:6px}
.menu-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);color:#bbb;font-size:18px;cursor:pointer;padding:6px 10px;border-radius:8px}
.menu-btn:hover{color:#fff}
.dropdown{display:none;position:absolute;right:18px;top:52px;background:#222;border:1px solid #333;border-radius:10px;overflow:hidden;z-index:50;min-width:140px;box-shadow:0 10px 40px rgba(0,0,0,0.6)}
.dropdown.show{display:block}
.dropdown button{width:100%;text-align:left;background:none;border:none;color:#fff;padding:12px 14px;cursor:pointer;font-size:13px}
.dropdown button:hover{background:#0066ff}
.dropdown button.delete{color:#ff8080}
.dropdown button.delete:hover{background:#ff3333;color:#fff}
.links{display:flex;gap:14px;margin-top:10px}
.links a{font-size:13px;color:#4aa3ff;text-decoration:none;cursor:pointer}
.links a:hover{color:#7fd5ff}
.modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:1000;align-items:center;justify-content:center}
.modal.show{display:flex}
.modal-box{width:min(560px,92vw);background:#151515;border:1px solid #333;border-radius:12px;padding:22px;box-shadow:0 15px 60px rgba(0,0,0,0.75)}
.modal-box h2{font-size:18px;margin-bottom:12px;color:#00ccff}
.modal-actions{display:flex;gap:10px;margin-top:12px}
.modal-actions .btn{flex:1}
.loading{padding:18px;text-align:center;color:#7fd5ff}
</style>
</head>
<body>
<div class="container">
<h1>Script Paste</h1>

<div class="panel">
<input type="text" id="name" placeholder="Script Name">
<textarea id="code" placeholder="Paste your script here..."></textarea>
<input type="text" id="customId" placeholder="Custom ID (optional: banana)">
<div class="row">
<button class="btn" id="uploadBtn" onclick="upload()">Upload</button>
<button class="btn gray" onclick="clearForm()">Clear</button>
</div>
</div>

<div class="list" id="list"></div>
</div>

<div class="modal" id="pwModal">
<div class="modal-box">
<h2 id="pwTitle">Password</h2>
<input type="password" id="pwInput" placeholder="Enter password" autocomplete="off" onkeypress="if(event.key==='Enter')pwSubmit()">
<div class="modal-actions">
<button class="btn" onclick="pwSubmit()">OK</button>
<button class="btn gray" onclick="pwCancel()">Cancel</button>
</div>
</div>
</div>

<div class="modal" id="editModal">
<div class="modal-box">
<h2>Edit</h2>
<input type="text" id="editName" placeholder="Script Name">
<textarea id="editCode" placeholder="Script Code" style="min-height:280px"></textarea>
<div class="modal-actions">
<button class="btn" onclick="saveEdit()">Save</button>
<button class="btn gray" onclick="closeEdit()">Cancel</button>
</div>
</div>
</div>

<div class="modal" id="confirmModal">
<div class="modal-box">
<h2>Delete</h2>
<div style="color:#cfcfcf;margin-top:8px">Really delete this script?</div>
<div class="modal-actions">
<button class="btn gray" onclick="closeConfirm()">Cancel</button>
<button class="btn" style="background:linear-gradient(135deg,#ff3333,#c20000)" onclick="confirmDelete()">Delete</button>
</div>
</div>
</div>

<script>
var pwResolve=null
var pwReject=null
var editingId=null
var deleteId=null
var busy=false

function esc(s){
var d=document.createElement('div')
d.textContent=s==null?'':String(s)
return d.innerHTML
}

function closeAllDropdowns(){
document.querySelectorAll('.dropdown').forEach(function(d){d.classList.remove('show')})
}
document.addEventListener('click',function(){closeAllDropdowns()})

function openPw(title){
document.getElementById('pwTitle').textContent=title||'Password'
document.getElementById('pwInput').value=''
document.getElementById('pwModal').classList.add('show')
setTimeout(function(){document.getElementById('pwInput').focus()},50)
return new Promise(function(resolve,reject){pwResolve=resolve;pwReject=reject})
}

function pwSubmit(){
var v=document.getElementById('pwInput').value
document.getElementById('pwModal').classList.remove('show')
var r=pwResolve
pwResolve=pwReject=null
r(v)
}

function pwCancel(){
document.getElementById('pwModal').classList.remove('show')
var r=pwReject
pwResolve=pwReject=null
if(r) r(new Error('cancel'))
}

async function apiFetch(path,opts,pw){
var o=opts||{}
o.headers=o.headers||{}
o.headers['X-Password']=pw
o.cache='no-store'
return await fetch(path,o)
}

function clearForm(){
document.getElementById('name').value=''
document.getElementById('code').value=''
document.getElementById('customId').value=''
}

function toggleMenu(id,event){
event.stopPropagation()
var dd=document.getElementById('menu-'+id)
document.querySelectorAll('.dropdown').forEach(function(x){if(x!==dd)x.classList.remove('show')})
dd.classList.toggle('show')
}

async function fetchList(pw){
var res=await apiFetch('/api/list?t='+Date.now(),{method:'GET'},pw)
if(res.status!==200) throw new Error('unauthorized')
return await res.json()
}

function renderList(items){
if(!Array.isArray(items)||items.length===0){
document.getElementById('list').innerHTML='<div class="loading" style="color:#9a9a9a">No scripts</div>'
return
}
var out=[]
for(var i=0;i<items.length;i++){
var s=items[i]
var id=esc(s.id)
var name=esc(s.name)
var dateStr=new Date(s.date||0).toLocaleString('de-DE')
out.push(
'<div class="item">'+
  '<div class="item-header">'+
    '<h3>'+name+'</h3>'+
    '<button class="menu-btn" onclick="toggleMenu(\\''+id+'\\',event)">⋮</button>'+
    '<div class="dropdown" id="menu-'+id+'">'+
      '<button onclick="openEdit(\\''+id+'\\')">Edit</button>'+
      '<button class="delete" onclick="openDelete(\\''+id+'\\')">Delete</button>'+
    '</div>'+
  '</div>'+
  '<div class="small">'+dateStr+' • ID: '+id+'</div>'+
  '<div class="links">'+
    '<a onclick="viewRaw(\\''+id+'\\',event)">View raw</a>'+
    '<a onclick="copyLoadstring(\\''+id+'\\',event)">Copy loadstring</a>'+
  '</div>'+
'</div>'
)
}
document.getElementById('list').innerHTML=out.join('')
}

async function loadList(){
try{
document.getElementById('list').innerHTML='<div class="loading">Password required to load list...</div>'
var pw=await openPw('Enter password to view list')
document.getElementById('list').innerHTML='<div class="loading">Loading...</div>'
var items=await fetchList(pw)
renderList(items)
}catch(e){
document.getElementById('list').innerHTML='<div class="loading" style="color:#ff6666">Wrong password / cancelled</div>'
}
}

async function waitForKV(id,shouldExist,pw){
for(var i=0;i<15;i++){
await new Promise(function(r){setTimeout(r,1000)})
try{
var items=await fetchList(pw)
var ex=false
for(var j=0;j<items.length;j++){
if(items[j].id===id){ex=true;break}
}
if(shouldExist&&ex) return true
if(!shouldExist&&!ex) return true
}catch(e){}
}
return false
}

async function upload(){
if(busy) return
var name=document.getElementById('name').value.trim()
var code=document.getElementById('code').value.trim()
var customId=document.getElementById('customId').value.trim()
if(!name||!code) return
try{
busy=true
document.getElementById('uploadBtn').disabled=true
var pw=await openPw('Enter password to upload')
var res=await apiFetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,code:code,customId:customId})},pw)
var data=await res.json()
if(res.status!==200) return
clearForm()
await waitForKV(data.id,true,pw)
await loadList()
}catch(e){
}finally{
busy=false
document.getElementById('uploadBtn').disabled=false
}
}

async function openEdit(id){
closeAllDropdowns()
try{
var pw=await openPw('Enter password to edit')
var res=await apiFetch('/api/get/'+id,{method:'GET'},pw)
var data=await res.json()
if(res.status!==200) return
editingId=id
var items=await fetchList(pw)
var item=null
for(var i=0;i<items.length;i++){
if(items[i].id===id){item=items[i];break}
}
document.getElementById('editName').value=item&&item.name?item.name:'Unnamed'
document.getElementById('editCode').value=data.code||''
document.getElementById('editModal').classList.add('show')
}catch(e){}
}

function closeEdit(){
document.getElementById('editModal').classList.remove('show')
editingId=null
}

async function saveEdit(){
if(!editingId) return
var name=document.getElementById('editName').value.trim()
var code=document.getElementById('editCode').value.trim()
if(!name||!code) return
try{
var pw=await openPw('Enter password to save edit')
var res=await apiFetch('/api/edit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editingId,name:name,code:code})},pw)
if(res.status!==200) return
var id=editingId
closeEdit()
await waitForKV(id,true,pw)
await loadList()
}catch(e){}
}

function openDelete(id){
closeAllDropdowns()
deleteId=id
document.getElementById('confirmModal').classList.add('show')
}

function closeConfirm(){
document.getElementById('confirmModal').classList.remove('show')
deleteId=null
}

async function confirmDelete(){
if(!deleteId) return
try{
var pw=await openPw('Enter password to delete')
var res=await apiFetch('/api/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:deleteId})},pw)
if(res.status!==200) return
var id=deleteId
closeConfirm()
await waitForKV(id,false,pw)
await loadList()
}catch(e){}
}

function copyLoadstring(id,event){
event.preventDefault()
navigator.clipboard.writeText('loadstring(game:HttpGet("'+location.origin+'/raw/'+id+'"))()')
}

function viewRaw(id,event){
event.preventDefault()
window.open('/raw/'+id,'_blank')
}

loadList()
</script>
</body>
</html>`
}

export async function onRequestGet(context){
const pass=context.env.ADMIN_PASSWORD||''
const provided=context.request.headers.get('X-Password')||''
if(!pass) return new Response('Server not configured',{status:500,headers:{'Cache-Control':'no-store'}})
if(provided!==pass) return new Response(loginHtml(),{status:401,headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'}})
return new Response(appHtml(),{status:200,headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'}})
}
