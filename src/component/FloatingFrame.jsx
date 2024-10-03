import React, { useState } from 'react';
import './FloatingFrame.css'; // CSSを別ファイルに分離


const FloatingFrame = ({ steps,onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFrameVisible, setIsFrameVisible] = useState(true);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeFrame = () => {
    setIsFrameVisible(false); // 「使ってみる」を押すとフレームを閉じる
    setCurrentStep(0);
    onClose();
  };

  const currentData = steps[currentStep];

  if (!isFrameVisible) {
    return null; // フレームが非表示のときは何も表示しない
  }

  return (
    <div className="floating-frame">
      <button className="close-btn" onClick={closeFrame}>×</button>
      {currentData ? (
        <div className="content">
          <img src={currentData.gif} alt="GIF" className="gif" />
          <h2>{currentData.theme}</h2>
          <p>{currentData.text}</p>
        </div>
      ) : (
        <p>コンテンツが存在しません</p>
      )}

      <div className="navigation">
        <button onClick={prevStep} disabled={currentStep === 0}>前へ</button>
        {currentStep < steps.length - 1 ? (
          <button onClick={nextStep}>次へ</button>
        ) : (
          <button className="try-btn" onClick={closeFrame}>使ってみる</button>
        )}
      </div>
    </div>
  );
};

export default FloatingFrame;
