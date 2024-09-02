import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import CryptoJS from 'crypto-js';  // トークンの暗号化に使用
import '../src/assets/css/index.css';

const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const StylePage = lazy(() => import("./pages/StylePage"));
const ConsolePage = lazy(() => import("./pages/ConsolePage"));
const HyougenPage = lazy(() => import("./pages/HyougenPage"));
const AnimationPage = lazy(() => import("./pages/AnimationPage"));
const AnimationKomawanPage = lazy(() => import("./pages/AnimationKomawanPage"));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SwiperPage = lazy(() => import("./pages/swiperPage"));
const ImagemapPage = lazy(() => import("./pages/ImagemapPage"));
const ZinbutsuPage = lazy(() => import("./pages/ZinbutsuPage"));
const GenkoyoshiPage = lazy(() => import("./pages/GenkoyoshiPage"));
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import MyComponent from "./pages/ScreenshotPage";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || 'default_secret_key'; // 環境変数からキーを取得、デフォルト値を設定

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decryptedToken = CryptoJS.AES.decrypt(token, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if (decryptedToken === "authenticated") {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('トークンの復号に失敗しました', error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const handleLogin = () => {
    if (username === process.env.REACT_APP_USER_NAME && password === process.env.REACT_APP_PASSWORD) {
      const token = CryptoJS.AES.encrypt("authenticated", SECRET_KEY).toString();
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
    } else if (username === '' || password === '') {
      alert('ユーザ名とパスワードを入力してください');
    } else {
      alert('ユーザ名またはパスワードが間違っています');
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isAuthenticated ? (
        <div className="container">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<AboutPage />} />
              <Route path="/kimoti" element={<ContactPage />} />
              <Route path="/danraku" element={<StylePage />} />
              <Route path="/omikuji" element={<ConsolePage />} />
              <Route path="/hyougen" element={<HyougenPage />} />
              <Route path="/anime" element={<AnimationPage />} />
              <Route path="/imagemapmake" element={<ImagemapPage />} />
              <Route path="/zinbutsu" element={<ZinbutsuPage />} />
              <Route path="/animewan" element={<AnimationKomawanPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/osusume" element={<GenkoyoshiPage />} />
              <Route path="/swiper" element={<SwiperPage />} />
              <Route path="/sksyo" element={<MyComponent />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      ) : (
        <>
          <div style={{ marginTop: '16px', marginLeft: '24px', textAlign: "left" }}>
            <h1 className="left-top-logo">
              作文<span className="app">アプリ</span>
              <br />
              <span className="otasuke">おたすけ</span>
            </h1>
          </div>
          <div className="auth-container" style={{ textAlign: 'center', maxWidth: '400px', margin: '40px auto' }}>
            <div className="auth-box">
              <h2>ログイン</h2>
              <p style={{ textAlign: 'left', width: '100%', padding: '16px 40px' }}>
                <strong>作文お助けアプリ</strong> は、テスト運用中です。<br />
                ユーザ名とパスワードを知っている人のみが使用できます。
              </p>
              <input
                type="text"
                placeholder="ユーザ名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ marginLeft: "auto", width: "90%", maxWidth: "500px" }}
              />
              <br />
              <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginRight: 'auto', display: "block", marginLeft: "auto", width: "90%", maxWidth: "500px" }}
              />
              <br />
              <button onClick={handleLogin}>ログインする</button>
            </div>
          </div>
        </>
      )}
    </Suspense>
  );
};

export default App;
