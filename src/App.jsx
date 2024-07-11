import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import ImagePage from "./pages/ImagePage";
// const App = () => {

//   return (
//     <div>
//       <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomePage/>} />
//         <Route path="/about/:id/:name" element={<AboutPage/>} />
//         <Route path="/contact" element={<ContactPage/>} />
//         <Route path="/*" element={<NotFound/>} />
//       </Routes>
//       </BrowserRouter>
//     </div>
//   );
// };
// export default App;
import React from 'react';
import HeadlinePage from "./pages/HeadlinePage";
import NumberPage from "./pages/NumberPage";
import KeyPage from "./pages/KeyPage";
import TodoPage from "./pages/TodoPage";
import StylePage from "./pages/StylePage";
import ConsolePage from "./pages/ConsolePage";
import HyougenPage from "./pages/HyougenPage";
const App = () => {
  console.log(process.env.REACT_APP_API_URL);

  // const buttonStyle={background:"#9369ff",color:"white",borderRadius:30}
  
  return (
    <div>
      <BrowserRouter>
       <Routes>
         <Route path="/" element={<HomePage/>} />
         <Route path="/about/:id/:name" element={<AboutPage/>} />
         <Route path="/contact" element={<ContactPage/>} />
         <Route path="/image" element={<ImagePage/>} />
         <Route path="/headline" element={<HeadlinePage/>} />
         <Route path="/number" element={<NumberPage/>} />
         <Route path="/key" element={<KeyPage/>} />
         <Route path="/todo" element={<TodoPage/>} />
         <Route path="/style" element={<StylePage/>} />
         <Route path="/console" element={<ConsolePage/>} />
         <Route path="/hyougen" element={<HyougenPage/>} />
         <Route path="/*" element={<NotFound/>} />
       </Routes>
       </BrowserRouter>

    </div>
  );
};

export default App;
//border-radius:15px;
//background: -webkit-gradient(linear, left top, left bottom, from(#666666), to(#cccccc));
