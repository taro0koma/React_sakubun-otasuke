import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import ImagePage from "./pages/ImagePage";
import React, { useState } from 'react';
import HeadlinePage from "./pages/HeadlinePage";
import NumberPage from "./pages/NumberPage";
import KeyPage from "./pages/KeyPage";
import TodoPage from "./pages/TodoPage";
import StylePage from "./pages/StylePage";
import ConsolePage from "./pages/ConsolePage";
import HyougenPage from "./pages/HyougenPage";
import '../src/assets/css/index.css'
import LoginPage from "./pages/LoginPage";

const App = () => {

  // const buttonStyle={background:"#9369ff",color:"white",borderRadius:30}
  
  return (
    <div className="main-menu">
      <BrowserRouter>
       <Routes>
         <Route path="/" element={<HomePage/>} />
         <Route path="/mapmake" element={<AboutPage/>} />
         <Route path="/contact" element={<ContactPage/>} />
         <Route path="/image" element={<ImagePage/>} />
         <Route path="/headline" element={<HeadlinePage/>} />
         <Route path="/number" element={<NumberPage/>} />
         <Route path="/key" element={<KeyPage/>} />
         <Route path="/todo" element={<TodoPage/>} />
         <Route path="/style" element={<StylePage/>} />
         <Route path="/console" element={<ConsolePage/>} />
         <Route path="/hyougen" element={<HyougenPage/>} />
         <Route path="/login" element={<LoginPage/>} />
         <Route path="/*" element={<NotFound/>} />
       </Routes>
       </BrowserRouter>

    </div>
  );
};

export default App;
//border-radius:15px;
//background: -webkit-gradient(linear, left top, left bottom, from(#666666), to(#cccccc));