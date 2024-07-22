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

  const handleLogin = () => {
    if (username === process.env.REACT_APP_USER_NAME && password === process.env.REACT_APP_PASSWORD) {
      setIsAuthenticated(true);
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
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};
export default App;
//border-radius:15px;
//background: -webkit-gradient(linear, left top, left bottom, from(#666666), to(#cccccc));