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
// import LoginPage from "./pages/LoginPage";
import React, { useEffect, useState } from "react";
// import { supabase } from "./lib/helper/supabaseClient";

// export default function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleAuth = () => {
//     const username = prompt('Enter username:');
//     const password = prompt('Enter password:');
//     if (username === 'yourUsername' && password === 'yourPassword') {
//       setIsAuthenticated(true);
//     } else {
//       alert('Incorrect username or password');
//     }
//   };

//   if (!isAuthenticated) {
//     handleAuth();
//   }
//   const [user, setUser] = useState(null);

// const login = async() => {
//   const {error} = await supabase.auth.signInWithOAuth({
//       provider: "github",
//       options: {
//         redirectTo:window.location.origin,
//       },
//     });
//     if(error){
//       console.error('Error logging in: ', error.message);
//     }
//   };

//   const logout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error('Error logging out: ', error.message);
//     } else {
//       setUser(null); // Reset user state to null after logging out
//     }
//   };

//   // useEffect(() => {
//   //   const session = supabase.auth.getSession();
//   //   setUser(session?.user);
//   // }, []);

//   useEffect(() => {
//     const getSession = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       setUser(session?.user);
//     };

//     getSession();
//   }, []);

//   // const buttonStyle={background:"#9369ff",color:"white",borderRadius:30}
  
//   return (
//     <div className="main-menu">
//       <div>
//       {user ? (
//         <div>
//         <h1>ログイン中</h1>
//         <button onClick={logout}>ログアウト</button>
//         </div>
//       ) : (
//         <button onClick={login}>Githubでログイン</button>
//       )}
//     </div>
//       <BrowserRouter>
//        <Routes>
//          <Route path="/" element={<HomePage/>} />
//          <Route path="/mapmake" element={<AboutPage/>} />
//          <Route path="/contact" element={<ContactPage/>} />
//          <Route path="/image" element={<ImagePage/>} />
//          <Route path="/headline" element={<HeadlinePage/>} />
//          <Route path="/number" element={<NumberPage/>} />
//          <Route path="/key" element={<KeyPage/>} />
//          <Route path="/todo" element={<TodoPage/>} />
//          <Route path="/style" element={<StylePage/>} />
//          <Route path="/console" element={<ConsolePage/>} />
//          <Route path="/hyougen" element={<HyougenPage/>} />
//          <Route path="/login" element={<LoginPage/>} />
//          <Route path="/*" element={<NotFound/>} />
//        </Routes>
//        </BrowserRouter>

//     </div>
//   );
// };

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