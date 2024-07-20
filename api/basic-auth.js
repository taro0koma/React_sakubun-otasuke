// /api/basic-auth.js

export default async function handler(req) {
  const auth = req.headers.get('Authorization');

  // ベーシック認証がない場合
  if (!auth || !auth.startsWith('Basic ')) {
    const headers = new Headers();
    headers.set('WWW-Authenticate', 'Basic realm="Protected Area"');
    return new Response('Authentication required', { status: 401, headers });
  }

  // 認証情報を取得
  const credentials = auth.split(' ')[1];
  const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
  const [username, password] = decodedCredentials.split(':');
  
  // ユーザー名とパスワードを検証
  if (username === process.env.REACT_APP_USER_NAME && password === process.env.REACT_APP_PASSWORD) {
    // 認証成功の場合、リクエストを元の URL に転送
    return fetch(new URL(req.url, `http://${req.headers.get('host')}`), {
      method: req.method,
      headers: req.headers,
      body: req.method === 'POST' ? req.body : undefined
    }).then(response => response);
  }

  // 認証失敗の場合
  const headers = new Headers();
  headers.set('WWW-Authenticate', 'Basic realm="Protected Area"');
  return new Response('Invalid credentials', { status: 401, headers });
}
