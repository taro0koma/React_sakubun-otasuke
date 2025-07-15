import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import './SwiperHome.css';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // ナビゲーションボタン用のスタイル

const SwiperHome = ({  }) => {
  const modalRef = useRef(null);
  const modalImgRef = useRef(null);
  const closeSpanRef = useRef(null);
  const text = {
    "imagemap":["イメージマップ","内容が思いつかないときはイメージマップを作ってみよう！","/images/imagemapsenden2.png"],
    "danraku":["段落の組み立て","書き方がわからないときは段落の組み立てを使おう！","/images/danrakusenden.png"],
    "kimochi":["気持ちや感想のいいかえ","言葉をいいかえたいときは気持ちや感想のいいかえを使おう！","/images/iikaesenden2.png"],
    "hyougen":["表現ぴったり探し","カッコよい表現にしたいときは表現ぴったり探しを使ってみよう！","/images/iikaesenden.png"],
    "zinbutsu":["登場人物の性格を表す言葉","人物をいいかえたいときは登場人物の性格を表す言葉！","/images/iikaeniodoroki2.png"],
    "kakidashi":["かっこいい書き出しおみくじ","書き出しをカッコよくしたいときは書き出しおみくじを使おう!","/images/link_omikuji.png"],
    "osusume":["おすすめツール","文字数・枚数確認できたり、イメージマップを作るのに便利なツールを紹介するよ！","/images/benrituru.png"],
    "home":["もくじ","手順やコツを紹介するよ！","/images/sakubunkotsu.png"],
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
        
        centeredSlides={true}
        spaceBetween={40}
        autoplay={{ delay: 3000 }}
        navigation
        breakpoints={{
        // 481pxから768pxまでの画面幅の場合
        481: {
          slidesPerView:1.5
        },
        // 769pxから1024pxまでの画面幅の場合
        769: {
          slidesPerView:2
        },
        1020: {
          slidesPerView:2.5
        },
      }}
      >
        <SwiperSlide>
        <a href="#komawanpoint1">
          <p className="img"><img src={text["imagemap"][2]} alt="スライド1" className="popup" />
          <p className="contentsmei">{text["imagemap"][0]}</p>
          <p className="contentssetumei">{text["imagemap"][1]}</p></p>
          </a>
        </SwiperSlide>
        <SwiperSlide>
        <a href="#komawanpoint2">
          <p className="img"><img src={text["danraku"][2]} alt="スライド2" className="popup" /><p className="contentsmei">{text["danraku"][0]}</p>
          <p className="contentssetumei">{text["danraku"][1]}</p></p></a>
        </SwiperSlide>
        <SwiperSlide>
        <a href="#komawanpoint4">
          <p className="img"><img src={text["kimochi"][2]} alt="スライド3" className="popup" /><p className="contentsmei">{text["kimochi"][0]}</p>
          <p className="contentssetumei">{text["kimochi"][1]}!</p></p>
          </a>
        </SwiperSlide>
        <SwiperSlide>
        <a href="#komawanpoint4">
          <p className="img"><img src={text["hyougen"][2]} alt="スライド4" className="popup" /><p className="contentsmei">{text["hyougen"][0]}</p>
          <p className="contentssetumei">{text["hyougen"][1]}!</p></p>
          </a>
        </SwiperSlide>
        <SwiperSlide>
        <a href="#komawanpoint4">
          <p className="img"><img src={text["zinbutsu"][2]} alt="スライド1" className="popup" /><p className="contentsmei">{text["zinbutsu"][0]}</p>
          <p className="contentssetumei">{text["zinbutsu"][1]}!</p></p>
          </a>
        </SwiperSlide>
        <SwiperSlide>
        <a href="#komawanpoint1">
          <p className="img"><img src={text["kakidashi"][2]} alt="スライド2" className="popup" /><p className="contentsmei">{text["kakidashi"][0]}</p>
          <p className="contentssetumei">{text["kakidashi"][1]}!</p></p>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="#osusume">
          <p className="img"><img src={text["osusume"][2]} alt="スライド3" className="popup" /><p className="contentsmei">{text["osusume"][0]}</p>
          <p className="contentssetumei">{text["osusume"][1]}</p></p>
          </a>
        </SwiperSlide>
        <SwiperSlide>
        <a href="#contents-top">
          <p className="img"><img src={text["home"][2]} alt="スライド4" className="popup" /><p className="contentsmei">{text["home"][0]}</p>
          <p className="contentssetumei">{text["home"][1]}</p></p>
          </a>
        </SwiperSlide>
      </Swiper>
      <div id="" ref={modalRef} className="">
        <span id="" ref={closeSpanRef}></span>
      </div>
      <br />
    </>
  );
};

export default SwiperHome;
