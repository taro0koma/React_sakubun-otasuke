import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import './SwiperHome.css';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // ナビゲーションボタン用のスタイル

const SwiperHome = ({ gazou1, gazou2, gazou3, gazou4,gazou5, gazou6, gazou7, gazou8 }) => {
  const modalRef = useRef(null);
  const modalImgRef = useRef(null);
  const closeSpanRef = useRef(null);
  const text = {
    "imagemap":["イメージマップ","内容が思いつかないときはイメージマップを作ってみよう！",],
    "danraku":["段落の組み立て","書き方がわからないときは段落の組み立てを使おう！"],
    "kimochi":["気持ちや感想のいいかえ","言葉をいいかえたいときは気持ちや感想のいいかえを使おう！"],
    "hyougen":["表現ぴったり探し","カッコよい表現にしたいときは表現ぴったり探しを使ってみよう！"],
    "zinbutsu":["登場人物の性格を表す言葉","人物をいいかえたいときは登場人物の性格を表す言葉！"],
    "kakidashi":["かっこいい書き出しおみくじ","内容が思いつかないときはイメージマップを作ってみよう"],
    "osusume":["おすすめツール","書き出しをカッコよくしたいときは書き出しおみくじを使おう"],
    "home":["イメージマップ","手順やコツを紹介するよ！"],
  }

  useEffect(() => {
    const modal = modalRef.current;
    const modalImg = modalImgRef.current;
    const closeSpan = closeSpanRef.current;
    const imgs = document.querySelectorAll('.popup');

    const openModal = (imgSrc) => {
      modal.style.opacity = "1";
      modal.style.visibility = "visible";
      modalImg.src = imgSrc;
    };

    const closeModal = () => {
      modal.style.opacity = "0";
      modal.style.visibility = "hidden";
    };

    imgs.forEach(img => {
      img.addEventListener('click', () => openModal(img.src));
    });

    closeSpan.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    // Cleanup
    return () => {
      imgs.forEach(img => {
        img.removeEventListener('click', () => openModal(img.src));
      });
      closeSpan.removeEventListener('click', closeModal);
      window.removeEventListener('click', (event) => {
        if (event.target === modal) {
          closeModal();
        }
      });
    };
  }, []);

  return (
    <>
      <Swiper
        modules={[Navigation, Autoplay]}
        speed={500}
        loop={true}
        slidesPerView={1.5}
        centeredSlides={true}
        spaceBetween={40}
        autoplay={{ delay: 3000 }}
        navigation
      >
        <SwiperSlide>
          <p className="img"><img src={gazou1} alt="スライド1" className="popup" /><p className="contentsmei">{text["imagemap"][0]}</p>
          <p className="contentssetumei">{text["imagemap"][1]}</p></p>
        </SwiperSlide>
        <SwiperSlide>
          <p className="img"><img src={gazou2} alt="スライド2" className="popup" /><p className="contentsmei">{text["danraku"][0]}</p>
          <p className="contentssetumei">{text["danraku"][1]}</p></p>
        </SwiperSlide>
        <SwiperSlide>
          <p className="img"><img src={gazou3} alt="スライド3" className="popup" /><p className="contentsmei">{text["kimochi"][0]}</p>
          <p className="contentssetumei">{text["kimochi"][1]}!</p></p>
        </SwiperSlide>
        <SwiperSlide>
          <p className="img"><img src={gazou4} alt="スライド4" className="popup" /><p className="contentsmei">{text["hyougen"][0]}</p>
          <p className="contentssetumei">{text["hyougen"][1]}!</p></p>
        </SwiperSlide>
        <SwiperSlide>
          <p className="img"><img src={gazou5 || gazou1} alt="スライド1" className="popup" /><p className="contentsmei">{text["zinbutsu"][0]}</p>
          <p className="contentssetumei">{text["zinbutsu"][1]}!</p></p>
        </SwiperSlide>
        <SwiperSlide>
          <p className="img"><img src={gazou6 || gazou2} alt="スライド2" className="popup" /><p className="contentsmei">{text["kakidashi"][0]}</p>
          <p className="contentssetumei">{text["kakidashi"][1]}!</p></p>
        </SwiperSlide>
        <SwiperSlide>
          <p className="img"><img src={gazou7 || gazou3} alt="スライド3" className="popup" /><p className="contentsmei">{text["osusume"][0]}</p>
          <p className="contentssetumei">{text["osusume"][1]}</p></p>
        </SwiperSlide>
        <SwiperSlide>
          <p className="img"><img src={gazou8 || gazou4} alt="スライド4" className="popup" /><p className="contentsmei">{text["home"][0]}</p>
          <p className="contentssetumei">{text["home"][1]}</p></p>
        </SwiperSlide>
      </Swiper>
      <div id="modal" ref={modalRef} className="modal">
        <span id="close" ref={closeSpanRef}>×</span>
        <img className="modal-content" ref={modalImgRef} id="modalImage" alt="拡大表示" />
      </div>
      <br />
    </>
  );
};

export default SwiperHome;