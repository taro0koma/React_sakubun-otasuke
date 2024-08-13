import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import './swiperPage.css';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // ナビゲーションボタン用のスタイル

const SwiperPage = ({ gazou1, gazou2, gazou3, gazou4 }) => {
  const modalRef = useRef(null);
  const modalImgRef = useRef(null);
  const closeSpanRef = useRef(null);

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
          <p className="img"><img src={gazou1} alt="スライド1" className="popup" /></p>
        </SwiperSlide>
        <SwiperSlide>
          <p className="img"><img src={gazou2} alt="スライド2" className="popup" /></p>
        </SwiperSlide>
        <SwiperSlide>
          <p className="img"><img src={gazou3 || gazou1} alt="スライド3" className="popup" /></p>
        </SwiperSlide>
        <SwiperSlide>
          <p className="img"><img src={gazou4 || gazou2} alt="スライド4" className="popup" /></p>
        </SwiperSlide>
      </Swiper>
      <div id="modal" ref={modalRef} className="modal">
        <span id="close" ref={closeSpanRef}>×</span>
        <img className="modal-content" ref={modalImgRef} id="modalImage" alt="拡大表示" />
      </div>
    </>
  );
};

export default SwiperPage;
