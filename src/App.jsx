import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Suspense,lazy} from "react"
import HomePage from "./pages/HomePage";
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
import NotFound from "./pages/NotFound";
const StylePage = lazy(() => import("./pages/StylePage"));
const ConsolePage = lazy(() => import("./pages/ConsolePage"));
const HyougenPage = lazy(() => import("./pages/HyougenPage"));
import '../src/assets/css/index.css';
import React, { useEffect, useState } from "react";
import AnimationPage from "./pages/AnimationPage";
import AnimationKomawanPage from "./pages/AnimationKomawanPage";
import LoginPage from './pages/LoginPage';
import SwiperPage from "./pages/swiperPage";
const GenkoyoshiPage = lazy(() => import("./pages/GenkoyoshiPage"));


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth) {
      setIsAuthenticated(JSON.parse(savedAuth));
    }
  }, []);

  const handleLogin = () => {
    if (username === process.env.REACT_APP_USER_NAME && password === process.env.REACT_APP_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
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
              <Route path="/map" element={
                <Suspense fallback={<div>イメージマップ読み込み中・・・</div>}><AboutPage /></Suspense>
                } />
              <Route path="/kimoti" element={
                <Suspense fallback={<div>気持ちや感想　読み込み中・・・</div>}>
                <ContactPage />
                </Suspense>
              } />
              <Route path="/danraku" element={<StylePage />} />
              <Route path="/omikuji" element={
                <Suspense fallback={<div>Loading omikuji...</div>}>
                  <ConsolePage />
                </Suspense>
              } />
              <Route path="/hyougen" element={
                <Suspense fallback={<div>Loading HyougenPage...</div>}>
                  <HyougenPage />
                </Suspense>
              } />
              <Route path="/anime" element={<AnimationPage />} />
              <Route path="/animewan" element={<AnimationKomawanPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/osusume" element={<GenkoyoshiPage />} />
              <Route path="/*" element={<NotFound />} />
              <Route path="/swiper" element={<SwiperPage/>}></Route>
            </Routes>
          </BrowserRouter>
        </div>
      ) : (
        <>
          <div style={{ marginTop: '16px', marginLeft: '24px' }}>
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
              />
              <br />
              <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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