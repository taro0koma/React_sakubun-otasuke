import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "./SwiperHome.css";
import "swiper/css";
import "swiper/css/navigation";

// データを配列に集約
const SLIDE_DATA = [
  {
    id: "imagemap",
    link: "/imagemapmake",
    title: "イメージマップ",
    desc: "内容が思いつかないときはイメージマップを作ってみよう！",
    img: "/images/imagemapsenden2.png",
  },
  {
    id: "danraku",
    link: "/danraku",
    title: "段落の組み立て",
    desc: "書き方がわからないときは段落の組み立てを使おう！",
    img: "/images/danrakusenden.png",
  },
  {
    id: "kimochi",
    link: "/kimoti",
    title: "気持ちや感想のいいかえ",
    desc: "言葉をいいかえたいときは気持ちや感想のいいかえを使おう！",
    img: "/images/iikaesenden2.png",
  },
  {
    id: "hyougen",
    link: "/hyougen",
    title: "表現ぴったり探し",
    desc: "カッコよい表現にしたいときは表現ぴったり探しを使ってみよう！",
    img: "/images/iikaesenden.png",
  },
  {
    id: "zinbutsu",
    link: "/zinbutsu",
    title: "登場人物の性格を表す言葉",
    desc: "人物をいいかえたいときは登場人物の性格を表す言葉！",
    img: "/images/iikaeniodoroki2.png",
  },
  {
    id: "kakidashi",
    link: "/omikuji",
    title: "かっこいい書き出しおみくじ",
    desc: "書き出しをカッコよくしたいときは書き出しおみくじを使おう!",
    img: "/images/link_omikuji.png",
  },
  {
    id: "osusume",
    link: "/osusume",
    title: "おすすめツール",
    desc: "文字数・枚数確認できたり、イメージマップを作るのに便利なツールを紹介するよ！",
    img: "/images/benrituru.png",
  },
  {
    id: "home",
    link: "#contents-top",
    title: "もくじ",
    desc: "手順やコツを紹介するよ！",
    img: "/images/sakubunkotsu.png",
  },
];

const SwiperHome = () => {
  const [modalImg, setModalImg] = useState(null);

  return (
    <>
      <Swiper
        modules={[Navigation, Autoplay]}
        speed={500}
        loop={true}
        centeredSlides={true}
        spaceBetween={40}
        autoplay={{ delay: 3000 }}
        navigation
        breakpoints={{
          481: { slidesPerView: 1.5 },
          769: { slidesPerView: 2 },
          1020: { slidesPerView: 2.5 },
        }}
      >
        {/* map関数で繰り返し処理 */}
        {SLIDE_DATA.map((item, index) => (
          <SwiperSlide key={item.id}>
            <a href={item.link}>
              <div className="img">
                <img
                  src={item.img}
                  alt={`スライド${index + 1}`}
                  className="popup"
                  /* onClick内の e.preventDefault() を削除しました。
             これで画像をクリックしてもリンク先へ飛ぶようになります。
          */
                />
                <p className="contentsmei">{item.title}</p>
                <p className="contentssetumei">{item.desc}</p>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Reactのステートを使ったモーダル表示 */}
      {modalImg && (
        <div className="modal-overlay" onClick={() => setModalImg(null)}>
          <div className="modal-content">
            <img src={modalImg} alt="拡大表示" />
            <span className="close-btn" onClick={() => setModalImg(null)}>
              &times;
            </span>
          </div>
        </div>
      )}
      <br />
    </>
  );
};

export default SwiperHome;
