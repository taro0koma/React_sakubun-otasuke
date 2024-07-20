import { NextResponse } from 'next/server';

export default function middleware(req) {
  const auth = req.headers.get('Authorization');

  if (!auth) {
    const headers = new Headers();
    headers.set('WWW-Authenticate', 'Basic realm="Protected Area"');
    return new NextResponse('Authentication required', { status: 401, headers });
  }

  const [scheme, credentials] = auth.split(' ');
  if (scheme !== 'Basic') {
    const headers = new Headers();
    headers.set('WWW-Authenticate', 'Basic realm="Protected Area"');
    return new NextResponse('Authentication required', { status: 401, headers });
  }

  const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');
  if (username === process.env.REACT_APP_USER_NAME && password === process.env.REACT_APP_PASSWORD) {
    return NextResponse.next();
  }

  const headers = new Headers();
  headers.set('WWW-Authenticate', 'Basic realm="Protected Area"');
  return new NextResponse('Invalid credentials', { status: 401, headers });
}
