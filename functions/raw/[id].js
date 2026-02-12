export async function onRequestGet(context) {
  try {
    const id = context.params.id
    const code = await context.env.PASTE_DB.get(id, 'text')
    if (!code) return new Response('Not found', { status: 404 })

    const userAgent = (context.request.headers.get('User-Agent') || '').toLowerCase()
    const isRoblox = userAgent.includes('roblox')

    if (!isRoblox) {
      return new Response(`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Denied</title>
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
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .error-container {
      text-align: center;
      background: rgba(15, 18, 35, 0.95);
      border: 2px solid rgba(255, 100, 100, 0.3);
      border-radius: 12px;
      padding: 40px;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      margin-bottom: 20px;
    }
    .error-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      color: #ff6464;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
      p {
      color: #8892b0;
      font-size: 14px;
      line-height: 1.6;
    }
    .discord-link {
      color: #5865f2;
      text-decoration: none;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 13px;
      padding: 8px 16px;
      background: rgba(88, 101, 242, 0.1);
      border: 1px solid rgba(88, 101, 242, 0.2);
      border-radius: 20px;
      transition: all 0.3s ease;
      letter-spacing: 0.5px;
    }
    .discord-link:hover {
      background: rgba(88, 101, 242, 0.2);
      border-color: #5865f2;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="error-container">
    <div class="error-icon">🛡️</div>
    <h1>Access Denied</h1>
    <p>This resource cannot be accessed directly from your current client.</p>
  </div>
  <a href="https://discord.gg/5XH3pgW8ah" target="_blank" class="discord-link">discord.gg/5XH3pgW8ah</a>
</body>
</html>`, { status: 403, headers: { 'Content-Type': 'text/html' } })
    }

    return new Response(code, { headers: { 'Content-Type': 'text/plain;charset=utf-8', 'Access-Control-Allow-Origin': '*' } })
  } catch (e) {
    return new Response('Error', { status: 500 })
  }
}
