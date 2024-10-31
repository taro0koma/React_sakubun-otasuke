import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
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
import ChatBot from "./pages/ChatBot";
import { HelmetProvider } from "react-helmet-async";


//今度Basic認証を付けるときは下のURLにアクセスし、コードを変更しよう！
//https://github.com/taro0koma/React_sakubun-otasuke/blob/2deb39ad8356b8d71c4958616fc092c0f36ca6da/src/App.jsx
const App = () => {

  return (
    <HelmetProvider>
    <Suspense fallback={<div>Loading...</div>}>
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
              <Route path="/chatBot" element={<ChatBot />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
    </Suspense>
    </HelmetProvider>
  );
};

export default App;
