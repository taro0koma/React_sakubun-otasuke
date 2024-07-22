import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import ImagePage from "./pages/ImagePage";
import HeadlinePage from "./pages/HeadlinePage";
import NumberPage from "./pages/NumberPage";
import KeyPage from "./pages/KeyPage";
import TodoPage from "./pages/TodoPage";
import StylePage from "./pages/StylePage";
import ConsolePage from "./pages/ConsolePage";
import HyougenPage from "./pages/HyougenPage";
import '../src/assets/css/index.css'
import React, { useEffect, useState } from "react";


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
    } else {
      alert('Incorrect username or password');
    }
  };

  return isAuthenticated ? (
    <div className="main-menu">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mapmake" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/image" element={<ImagePage />} />
          <Route path="/headline" element={<HeadlinePage />} />
          <Route path="/number" element={<NumberPage />} />
          <Route path="/key" element={<KeyPage />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/style" element={<StylePage />} />
          <Route path="/console" element={<ConsolePage />} />
          <Route path="/hyougen" element={<HyougenPage />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  ) : (
    <>
    <div>
          <h1 className="left-top-logo">
            作文<span className="app">アプリ</span>
            <br />
            <span className="otasuke">おたすけ</span>
          </h1>
        </div>
    <div className="auth-container" style={{textAlign:"center",width: "400px",margin: "40px auto"}}>
      <div className="auth-box">
        <h2>ログイン</h2>
        <p style={{textAlign:"left"}}><strong>作文お助けアプリ</strong> は、テスト運用中です。<br/>ユーザ名とパスワード名を知っている人のみが使用できます。</p>
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