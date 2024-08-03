import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import StylePage from "./pages/StylePage";
import ConsolePage from "./pages/ConsolePage";
import HyougenPage from "./pages/HyougenPage";
import '../src/assets/css/index.css'
import React, { useEffect, useState } from "react";
import AnimationPage from "./pages/AnimationPage";
import AnimationKomawanPage from "./pages/AnimationKomawanPage";
import LoginPage from './pages/LoginPage';
import GenkoyoshiPage from "./pages/GenkoyoshiPage";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // ローカルストレージから認証情報を読み込む
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth) {
      setIsAuthenticated(JSON.parse(savedAuth));
    }
  }, []);

  const handleLogin = () => {
    if (username === process.env.REACT_APP_USER_NAME && password === process.env.REACT_APP_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', JSON.stringify(true)); // ローカルストレージに保存
      }else if (username === '' || password === '') {
      alert('ユーザ名とパスワードを入力してください');
    }else if (username !== process.env.REACT_APP_USER_NAME && password!== process.env.REACT_APP_PASSWORD){
      alert('ユーザ名とパスワードが間違っています');
    }else {
      alert('ユーザ名またはパスワードが間違っています');
    }
  };

  return isAuthenticated ? (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mapmake" element={<AboutPage />} />
          <Route path="/kimoti" element={<ContactPage />} />
          <Route path="/danraku" element={<StylePage />} />
          <Route path="/omikuji" element={<ConsolePage />} />
          <Route path="/hyougen" element={<HyougenPage />} />
          <Route path="/anime" element={<AnimationPage />} />
          <Route path="/animewan" element={<AnimationKomawanPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/genkoyoshi" element={<GenkoyoshiPage />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  ) : (
    <>
    <div style={{marginTop: "16px",marginLeft:"24px"}}>
          <h1 className="left-top-logo">
            作文<span className="app">アプリ</span>
            <br />
            <span className="otasuke">おたすけ</span>
          </h1>
        </div>
    <div className="auth-container" style={{textAlign:"center",maxWidth: "400px",margin: "40px auto"}}>
      <div className="auth-box">
        <h2>ログイン</h2>
        <p style={{textAlign:"left",width:"100%",padding:"16px 40px"}}><strong>作文お助けアプリ</strong> は、テスト運用中です。<br/>ユーザ名とパスワード名を知っている人のみが使用できます。</p>
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
  );
};
export default App;
//border-radius:15px;
//background: -webkit-gradient(linear, left top, left bottom, from(#666666), to(#cccccc));