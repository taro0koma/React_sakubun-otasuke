import express from 'express';
import basicAuth from 'express-basic-auth';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv'

dotenv.config();
const app = express();
const port = 5173;

// Basic認証設定
app.use(basicAuth({
  users: { [process.env.REACT_APP_USER_NAME]: process.env.REACT_APP_PASSWORD }, // 適切なユーザー名とパスワードに変更
  challenge: true,
  realm: 'Protected Area',
}));

// Viteの開発サーバーを作成
async function startServer() {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
    },
  });

  // Viteの開発サーバーをプロキシとして使用
  app.use(vite.middlewares);

  // サーバーの起動
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${process.env.REACT_APP_API_URL || port}`);
  });
}

startServer();
