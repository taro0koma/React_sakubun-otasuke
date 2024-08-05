import React, { useState, useEffect, useRef } from 'react';

const PreviousAndNext = ({ midashi, honbun, buttontext, buttonurl }) => {
  const [boxHeight, setBoxHeight] = useState(0);
  const [hide, setHide] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const updateBoxHeight = () => {
      if (boxRef.current) {
        setBoxHeight(boxRef.current.clientHeight);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHide(true);
      } else {
        setHide(false);
      }
    };

    // 初期ロード時に高さを設定
    updateBoxHeight();

    // ウィンドウリサイズ時に高さを更新
    window.addEventListener('resize', updateBoxHeight);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', updateBoxHeight);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={boxRef} className={`down ${hide ? 'hide' : ''}`}>
      <div className='eyecatch'>
        <span></span>
      </div>
      <h4 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{midashi}</h4>
      <p>{honbun}</p>
      <a href={buttonurl}><button>{buttontext}</button></a>
      <br />
      <style jsx>{`
        .parent-padding-adjust {
          padding-bottom: ${boxHeight + 20}px;
        }
      `}</style>
    </div>
  );
};

export default PreviousAndNext;
