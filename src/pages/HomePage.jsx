import React from "react";
import Hero from "../component/Hero";
import Tabs from "../component/Tabs";
const HomePage = () => {
  
// }
// .flex .image {
//   width: 640px; /*画像サイズ指定*/
//   margin: 0;
//   padding: 0;
// }
// .flex .image img {
//   width: 100%;
//   height: auto;
// }
// .flex .text {
//   margin: 0 0 0 20px;
//   padding: 0;
// }

// body {
//   margin: 20px;
//   padding: 0;
// }
  return (
    <div>
      <Tabs />
      <h1>Home</h1>
      <Hero />
      <h3>使い方</h3>
      <div class="flex" style={{display:"flex", width:640, margin:0, padding:0}}>
        <figure class="image" style={{width:640, margin:0, padding:0}}>
          <img style={{width:"100%", height:"auto"}}
            src="https://react-sakubun-otasuke.vercel.app/images/sakubunnigate.png"/>
        </figure>
        <p class="text">
          ここにテキストが入りますここにテキストが入りますここにテキストが入りますここにテキストが入りますここにテキストが入りますここにテキストが入ります
        </p>
      </div>
      <img src="https://react-sakubun-otasuke.vercel.app/images/wantyan1.png" />
      <br />
      <img src="https://react-sakubun-otasuke.vercel.app/images/mapwakatta.png" />
      <br />
      <img src="https://react-sakubun-otasuke.vercel.app/images/wantyan2.png" />
      <br />
      <img src="https://react-sakubun-otasuke.vercel.app/images/wakatta.png" />
      <br />
      <img src="https://react-sakubun-otasuke.vercel.app/images/wantyan3.png" />
      <br />
      <img src="https://react-sakubun-otasuke.vercel.app/images/uwao.png" />
      <br />
      <img src="https://react-sakubun-otasuke.vercel.app/images/wantyan4.png" />
      <br />
      <img src="https://react-sakubun-otasuke.vercel.app/images/aseru.png" />
      <br />
      <img src="https://react-sakubun-otasuke.vercel.app/images/iikaeniodoroki.png" />
      <br />
      <img src="https://react-sakubun-otasuke.vercel.app/images/sakubunmakasete.png" />
    </div>
  );
};

export default HomePage;
