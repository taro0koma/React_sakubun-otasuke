import React from 'react';
import "./usage.css"
const UsageStep = ({ title, imageSrc, description, onNext, onBack, isFirstStep, isLastStep, showFinalButtons, onTryIt }) => {
  return (
    <div className="usage-step-container">
      <div className="image-container">
        <img src={imageSrc} alt="ステップ画像" className="step-image" />
      </div>
      <div className="text-container">
        <h2 className="title">{title}</h2>
        <p className="description">{description}</p>
        <div className="button-container">
          {!isFirstStep && (
            <button onClick={onBack} className="back-button">← 戻る</button>
          )}
          {isLastStep && showFinalButtons ? (
            <button onClick={onTryIt} className="try-button">使ってみる</button>
          ) : !isLastStep ? (
            <button onClick={onNext} className="next-button">次へ →</button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UsageStep;
