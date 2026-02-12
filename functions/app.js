function loginHtml() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zenk Scripts - Login</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
      color: #e4e6eb;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    
    .login-container {
      width: 100%;
      max-width: 400px;
      background: rgba(15, 18, 35, 0.95);
      border: 1px solid rgba(0, 200, 255, 0.2);
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 600;
      color: #00c8ff;
      margin-bottom: 8px;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-shadow: 0 0 20px rgba(0, 200, 255, 0.3);
    }
    
    .subtitle {
      color: #8892b0;
      font-size: 13px;
      letter-spacing: 1px;
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    label {
      display: block;
      font-size: 12px;
      color: #00c8ff;
      margin-bottom: 6px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    input {
      width: 100%;
      padding: 12px 14px;
      background: rgba(20, 25, 45, 0.8);
      border: 1px solid rgba(0, 200, 255, 0.3);
      border-radius: 8px;
      color: #e4e6eb;
      font-size: 14px;
      font-family: inherit;
      transition: all 0.3s ease;
      outline: none;
    }
    
    input:focus {
      border-color: #00c8ff;
      box-shadow: 0 0 0 3px rgba(0, 200, 255, 0.1);
      background: rgba(20, 25, 45, 1);
    }
    
    input::placeholder {
      color: #5a6677;
    }
    
    .login-btn {
      width: 100%;
      padding: 12px;
      margin-top: 20px;
      background: linear-gradient(135deg, #00c8ff 0%, #009acc 100%);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 15px rgba(0, 200, 255, 0.3);
    }
    
    .login-btn:hover {
      background: linear-gradient(135deg, #00e8ff 0%, #00badc 100%);
      box-shadow: 0 6px 20px rgba(0, 200, 255, 0.4);
      transform: translateY(-2px);
    }
    
    .login-btn:active {
      transform: translateY(0);
    }
    
    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      box-shadow: 0 4px 15px rgba(0, 200, 255, 0.2);
    }
    
    .error-msg {
      display: none;
      margin-top: 15px;
      padding: 10px 12px;
      background: rgba(255, 100, 100, 0.1);
      border: 1px solid rgba(255, 100, 100, 0.3);
      border-radius: 6px;
      color: #ff6464;
      font-size: 12px;
      text-align: center;
    }
    
    .loading-spinner {
      display: none;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(0, 200, 255, 0.3);
      border-top: 2px solid #00c8ff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-header">
      <div class="logo">Zenk Scripts</div>
      <div class="subtitle">Zenk Studios Scripts</div>
    </div>
    
    <form onsubmit="handleLogin(event)">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" placeholder="Enter your username" autocomplete="off" autofocus>
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="Enter your password" autocomplete="off">
      </div>
      
      <button type="submit" class="login-btn" id="loginBtn">
        <span id="btnText">Login</span>
        <div class="loading-spinner" id="spinner"></div>
      </button>
    </form>
    
    <div class="error-msg" id="errorMsg">Wrong credentials</div>
  </div>
  
  <script>
    async function handleLogin(event) {
      event.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const errorMsg = document.getElementById('errorMsg');
      const loginBtn = document.getElementById('loginBtn');
      const spinner = document.getElementById('spinner');
      const btnText = document.getElementById('btnText');
      
      if (!username || !password) {
        errorMsg.textContent = 'Please enter username and password';
        errorMsg.style.display = 'block';
        return;
      }
      
      loginBtn.disabled = true;
      spinner.style.display = 'block';
      btnText.style.display = 'none';
      errorMsg.style.display = 'none';
      
      try {
        const res = await fetch('/app', {
          headers: {
            'X-User': username,
            'X-Pass': password
          }
        });
        
        if (res.status === 401) {
          errorMsg.textContent = 'Wrong credentials';
          errorMsg.style.display = 'block';
          loginBtn.disabled = false;
          spinner.style.display = 'none';
          btnText.style.display = 'inline';
          return;
        }
        
        if (res.status !== 200) {
          errorMsg.textContent = 'Login error';
          errorMsg.style.display = 'block';
          loginBtn.disabled = false;
          spinner.style.display = 'none';
          btnText.style.display = 'inline';
          return;
        }
        
        const html = await res.text();
        const finalHtml = html
          .replace('__USER__', JSON.stringify(username))
          .replace('__PASS__', JSON.stringify(password));
        
        document.open();
        document.write(finalHtml);
        document.close();
      } catch (error) {
        console.error('Login error:', error);
        errorMsg.textContent = 'Connection error';
        errorMsg.style.display = 'block';
        loginBtn.disabled = false;
        spinner.style.display = 'none';
        btnText.style.display = 'inline';
      }
    }
  </script>
</body>
</html>`
}

function appHtml() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zenk Script Storage</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
      color: #e4e6eb;
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding: 20px 0;
      border-bottom: 2px solid rgba(0, 200, 255, 0.2);
    }
    
    .title {
      font-size: 32px;
      font-weight: 600;
      color: #00c8ff;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-shadow: 0 0 20px rgba(0, 200, 255, 0.3);
      margin-bottom: 10px;
    }
    
    .subtitle {
      color: #8892b0;
      font-size: 13px;
      letter-spacing: 1px;
    }
    
    .panel {
      background: rgba(15, 18, 35, 0.95);
      border: 1px solid rgba(0, 200, 255, 0.2);
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
    
    .section-title {
      font-size: 14px;
      color: #00c8ff;
      margin-bottom: 20px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    label {
      display: block;
      font-size: 12px;
      color: #8892b0;
      margin-bottom: 6px;
      font-weight: 500;
    }
    
    input[type="text"],
    textarea {
      width: 100%;
      padding: 12px 14px;
      background: rgba(20, 25, 45, 0.8);
      border: 1px solid rgba(0, 200, 255, 0.2);
      border-radius: 8px;
      color: #e4e6eb;
      font-size: 14px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      transition: all 0.3s ease;
      outline: none;
    }
    
    input[type="text"]:focus,
    textarea:focus {
      border-color: #00c8ff;
      box-shadow: 0 0 0 3px rgba(0, 200, 255, 0.1);
      background: rgba(20, 25, 45, 1);
    }
    
    input::placeholder,
    textarea::placeholder {
      color: #5a6677;
    }
    
    textarea {
      resize: vertical;
      min-height: 200px;
      font-size: 13px;
    }
    
    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 11px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      white-space: nowrap;
      outline: none;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #00c8ff 0%, #009acc 100%);
      color: #fff;
      box-shadow: 0 4px 15px rgba(0, 200, 255, 0.3);
      flex: 1;
      min-width: 120px;
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, #00e8ff 0%, #00badc 100%);
      box-shadow: 0 6px 20px rgba(0, 200, 255, 0.4);
      transform: translateY(-2px);
    }
    
    .btn-primary:active {
      transform: translateY(0);
    }
    
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background: rgba(60, 75, 110, 0.6);
      color: #00c8ff;
      border: 1px solid rgba(0, 200, 255, 0.3);
      flex: 1;
      min-width: 100px;
    }
    
    .btn-secondary:hover {
      background: rgba(60, 75, 110, 1);
      border-color: #00c8ff;
      transform: translateY(-2px);
    }
    
    .btn-small {
      padding: 8px 16px;
      font-size: 12px;
      min-width: auto;
      flex: none;
    }
    
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .list-title {
      font-size: 14px;
      color: #00c8ff;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .script-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .script-item {
      background: rgba(20, 25, 45, 0.8);
      border: 1px solid rgba(0, 200, 255, 0.15);
      border-radius: 8px;
      padding: 20px;
      position: relative;
      transition: all 0.3s ease;
    }
    
    .script-item:hover {
      border-color: rgba(0, 200, 255, 0.4);
      box-shadow: 0 4px 12px rgba(0, 200, 255, 0.1);
    }
    
    .script-name {
      font-size: 15px;
      font-weight: 600;
      color: #e4e6eb;
      margin-bottom: 8px;
      word-break: break-word;
    }
    
    .script-meta {
      display: flex;
      gap: 15px;
      font-size: 12px;
      color: #8892b0;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    
    .script-meta-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .script-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .script-actions a,
    .script-actions .menu-btn {
      font-size: 12px;
      color: #00c8ff;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid rgba(0, 200, 255, 0.3);
      padding: 6px 12px;
      border-radius: 6px;
      transition: all 0.3s ease;
      background: transparent;
    }
    
    .script-actions a:hover,
    .script-actions .menu-btn:hover {
      border-color: #00c8ff;
      background: rgba(0, 200, 255, 0.1);
    }
    
    .menu-btn {
      position: relative;
      padding: 6px 12px;
    }
    
    .dropdown-menu {
      display: none;
      position: absolute;
      right: 0;
      top: 100%;
      background: rgba(20, 25, 45, 0.95);
      border: 1px solid rgba(0, 200, 255, 0.3);
      border-radius: 6px;
      overflow: hidden;
      z-index: 100;
      min-width: 120px;
      margin-top: 5px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .dropdown-menu.show {
      display: block;
    }
    
    .dropdown-menu button {
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      color: #e4e6eb;
      padding: 10px 14px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    }
    
    .dropdown-menu button:hover {
      background: rgba(0, 200, 255, 0.2);
      color: #00c8ff;
    }
    
    .dropdown-menu .danger {
      color: #ff6464;
    }
    
    .dropdown-menu .danger:hover {
      background: rgba(255, 100, 100, 0.2);
    }
    
    .loading {
      text-align: center;
      padding: 20px;
      color: #8892b0;
      font-size: 14px;
    }
    
    .modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .modal.show {
      display: flex;
    }
    
    .modal-content {
      width: 100%;
      max-width: 500px;
      background: rgba(15, 18, 35, 0.98);
      border: 1px solid rgba(0, 200, 255, 0.2);
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }
    
    .modal-title {
      font-size: 18px;
      font-weight: 600;
      color: #00c8ff;
      margin-bottom: 20px;
    }
    
    @media (max-width: 768px) {
      .title {
        font-size: 24px;
      }
      
      .panel {
        padding: 20px;
      }
      
      .button-group {
        gap: 10px;
      }
      
      .btn {
        padding: 10px 16px;
        font-size: 12px;
      }
      
      .script-item {
        padding: 16px;
      }
      
      .script-actions {
        gap: 8px;
      }
      
      .script-actions a,
      .script-actions .menu-btn {
        padding: 5px 10px;
        font-size: 11px;
      }
      
      .list-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">Zenk Scripts</div>
      <div class="subtitle">Zenk Studios Scripts</div>
    </div>
    
    <div class="panel">
      <div class="section-title">Upload New Script</div>
      
      <div class="form-group">
        <label for="scriptName">Script Name</label>
        <input type="text" id="scriptName" placeholder="Enter script name...">
      </div>
      
      <div class="form-group">
        <label for="scriptCode">Script Code</label>
        <textarea id="scriptCode" placeholder="Paste your script code here..."></textarea>
      </div>
      
      <div class="form-group">
        <label for="customId">Custom ID (Optional)</label>
        <input type="text" id="customId" placeholder="e.g. my-script (leave empty for auto-generate)">
      </div>
      
      <div class="button-group">
        <button class="btn btn-primary" id="uploadBtn" onclick="handleUpload()">Upload Script</button>
        <button class="btn btn-secondary" onclick="handleClear()">Clear</button>
      </div>
    </div>
    
    <div class="list-header">
      <div class="list-title">Your Scripts</div>
      <button class="btn btn-secondary btn-small" onclick="handleRefresh()">↻ Refresh</button>
    </div>
    
    <div class="script-list" id="scriptList">
      <div class="loading">Loading scripts...</div>
    </div>
  </div>
  
  <div class="modal" id="editModal">
    <div class="modal-content">
      <div class="modal-title">Edit Script</div>
      
      <div class="form-group">
        <label for="editName">Script Name</label>
        <input type="text" id="editName" placeholder="Script name...">
      </div>
      
      <div class="form-group">
        <label for="editCode">Script Code</label>
        <textarea id="editCode" placeholder="Script code..." style="min-height: 200px;"></textarea>
      </div>
      
      <div class="button-group">
        <button class="btn btn-primary" onclick="handleSaveEdit()">Save Changes</button>
        <button class="btn btn-secondary" onclick="handleCloseEdit()">Cancel</button>
      </div>
    </div>
  </div>
  
  <script>
    var USER = __USER__;
    var PASS = __PASS__;
    var editingId = null;
    
    function escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, m => map[m]);
    }
    
    function closeAllDropdowns() {
      document.querySelectorAll('.dropdown-menu').forEach(x => x.classList.remove('show'));
    }
    
    document.addEventListener('click', closeAllDropdowns);
    
    function handleClear() {
      document.getElementById('scriptName').value = '';
      document.getElementById('scriptCode').value = '';
      document.getElementById('customId').value = '';
    }
    
    function toggleDropdown(id, event) {
      event.stopPropagation();
      const menu = document.getElementById('menu-' + id);
      closeAllDropdowns();
      menu.classList.toggle('show');
    }
    
    async function fetchScripts() {
      const res = await fetch('/api/list', {
        headers: {
          'X-User': USER,
          'X-Pass': PASS
        }
      });
      if (res.status !== 200) throw new Error('Failed to fetch');
      return await res.json();
    }
    
    function renderScripts(items) {
      const listContainer = document.getElementById('scriptList');
      
      if (!items || items.length === 0) {
        listContainer.innerHTML = '<div class="loading">No scripts yet. Upload one to get started!</div>';
        return;
      }
      
      const html = items.map(script => {
        const id = escapeHtml(script.id);
        const name = escapeHtml(script.name);
        const date = new Date(script.date || 0).toLocaleString('de-DE');
        
        return \`
          <div class="script-item">
            <div class="script-name">\${name}</div>
            <div class="script-meta">
              <div class="script-meta-item">📅 \${date}</div>
              <div class="script-meta-item">🆔 \${id}</div>
            </div>
            <div class="script-actions">
              <a onclick="handleCopyLoadstring('\${id}', event)">📋 Copy Loadstring</a>
              <button class="menu-btn" onclick="toggleDropdown('\${id}', event)">⋮ More</button>
              <div class="dropdown-menu" id="menu-\${id}">
                <button onclick="handleOpenEdit('\${id}')">✏️ Edit</button>
                <button class="danger" onclick="handleDelete('\${id}')">🗑️ Delete</button>
              </div>
            </div>
          </div>
        \`;
      }).join('');
      
      listContainer.innerHTML = html;
    }
    
    async function handleRefresh() {
      try {
        const list = document.getElementById('scriptList');
        list.innerHTML = '<div class="loading">Loading...</div>';
        const scripts = await fetchScripts();
        renderScripts(scripts);
      } catch (e) {
        document.getElementById('scriptList').innerHTML = '<div class="loading" style="color: #ff6464;">Error loading scripts</div>';
      }
    }
    
    async function handleUpload() {
      const name = document.getElementById('scriptName').value.trim();
      const code = document.getElementById('scriptCode').value.trim();
      const customId = document.getElementById('customId').value.trim();
      
      if (!name || !code) {
        alert('Please enter script name and code');
        return;
      }
      
      const btn = document.getElementById('uploadBtn');
      btn.disabled = true;
      
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User': USER,
            'X-Pass': PASS
          },
          body: JSON.stringify({ name, code, customId })
        });
        
        const data = await res.json();
        
        if (res.status !== 200) {
          alert('Upload failed: ' + (data.error || 'Unknown error'));
          return;
        }
        
        handleClear();
        await new Promise(r => setTimeout(r, 1000));
        await handleRefresh();
      } finally {
        btn.disabled = false;
      }
    }
    
    async function handleOpenEdit(id) {
      closeAllDropdowns();
      
      try {
        const res = await fetch('/api/get/' + id, {
          headers: {
            'X-User': USER,
            'X-Pass': PASS
          }
        });
        
        const data = await res.json();
        if (res.status !== 200) {
          alert('Failed to load script');
          return;
        }
        
        editingId = id;
        const scripts = await fetchScripts();
        const script = scripts.find(x => x.id === id);
        
        document.getElementById('editName').value = script ? script.name : 'Unnamed';
        document.getElementById('editCode').value = data.code || '';
        document.getElementById('editModal').classList.add('show');
      } catch (e) {
        alert('Error loading script');
      }
    }
    
    function handleCloseEdit() {
      document.getElementById('editModal').classList.remove('show');
      editingId = null;
    }
    
    async function handleSaveEdit() {
      if (!editingId) return;
      
      const name = document.getElementById('editName').value.trim();
      const code = document.getElementById('editCode').value.trim();
      
      if (!name || !code) {
        alert('Please enter name and code');
        return;
      }
      
      try {
        const res = await fetch('/api/edit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User': USER,
            'X-Pass': PASS
          },
          body: JSON.stringify({ id: editingId, name, code })
        });
        
        if (res.status !== 200) {
          alert('Save failed');
          return;
        }
        
        handleCloseEdit();
        await new Promise(r => setTimeout(r, 1000));
        await handleRefresh();
      } catch (e) {
        alert('Error saving script');
      }
    }
    
    async function handleDelete(id) {
      closeAllDropdowns();
      
      if (!confirm('Delete this script permanently?')) return;
      
      try {
        const res = await fetch('/api/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User': USER,
            'X-Pass': PASS
          },
          body: JSON.stringify({ id })
        });
        
        if (res.status !== 200) {
          alert('Delete failed');
          return;
        }
        
        await new Promise(r => setTimeout(r, 1000));
        await handleRefresh();
      } catch (e) {
        alert('Error deleting script');
      }
    }
    
    function handleCopyLoadstring(id, event) {
      event.preventDefault();
      const url = location.origin + '/raw/' + id;
      const loadstring = 'loadstring(game:HttpGet("' + url + '"))()';
      navigator.clipboard.writeText(loadstring).then(() => {
        alert('Loadstring copied!');
      }).catch(() => {
        alert('Failed to copy');
      });
    }
    
    handleRefresh();
  </script>
</body>
</html>`
}

async function notifyLoginAttempt(user, pass, isSuccess, context) {
  const webhookUrl = (context.env.DC_WEBHOOK || '').trim();
  if (!webhookUrl) return;

  try {
    const userAgent = context.request.headers.get('user-agent') || 'Unknown';
    const clientIp = context.request.headers.get('cf-connecting-ip') ||
      context.request.headers.get('x-forwarded-for') ||
      'Unknown';

    const timestamp = new Date().toISOString();
    const statusColor = isSuccess ? 0x00c800 : 0xff6464;
    const statusText = isSuccess ? '✅ Successful' : '❌ Failed';

    const embed = {
      title: 'Login Attempt - ' + statusText,
      color: statusColor,
      fields: [
        {
          name: 'Username',
          value: '```' + String(user).substring(0, 50) + '```',
          inline: false
        },
        {
          name: 'Password',
          value: '```' + String(pass).substring(0, 50) + '```',
          inline: false
        },
        {
          name: 'IP Address',
          value: '```' + String(clientIp) + '```',
          inline: true
        },
        {
          name: 'User Agent',
          value: '```' + userAgent.substring(0, 100) + '```',
          inline: false
        },
        {
          name: 'Timestamp',
          value: '```' + timestamp + '```',
          inline: true
        }
      ],
      footer: {
        text: 'Script Paste Login Monitor'
      }
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });
  } catch (e) {
    console.error('Webhook notification failed:', e);
  }
}

function checkAuth(req, env) {
  const validUser = (env.BASIC_USER || '').trim();
  const validPass = (env.BASIC_PASS || '').trim();
  const user = (req.headers.get('X-User') || '').trim();
  const pass = (req.headers.get('X-Pass') || '').trim();

  if (!validUser || !validPass) return false;
  return user === validUser && pass === validPass;
}

export async function onRequestGet(context) {
  const user = (context.request.headers.get('X-User') || '').trim();
  const pass = (context.request.headers.get('X-Pass') || '').trim();
  const isValid = checkAuth(context.request, context.env);

  if (user || pass) {
    await notifyLoginAttempt(user, pass, isValid, context);
  }

  if (!isValid) {
    return new Response(loginHtml(), { status: 401, headers: { 'Content-Type': 'text/html' } });
  }
  return new Response(appHtml(), { status: 200, headers: { 'Content-Type': 'text/html' } });
}
