// // import React, { useRef } from 'react';
// // import { useReactToPrint } from 'react-to-print';




// // const ScreenshotPage = () => {
// // // const componentRef = useRef();
// // // const handlePrint = useReactToPrint({
// // // content: () => componentRef.current,
// // // });


// // return (
// // <div>
// // {/* <h1 ref={componentRef} >紙で書き写すかPDFで保存すると安心だよ✨</h1>
// // <button onClick={handlePrint}>PDFで保存</button> */}
// // </div>
// // );
// // };


// // export default ScreenshotPage;
// import React, { useState } from 'react';
// import UsageStep from '../component/UsageStep';
// const ScreenshotPage = () => {
//   const steps = [
//     {
//       title: 'ステップ 1',
//       imageSrc: 'image1.png',
//       description: 'ここにステップ1の説明が入ります。',
//     },
//     {
//       title: 'ステップ 2',
//       imageSrc: 'image2.png',
//       description: 'ここにステップ2の説明が入ります。',
//     },
//     {
//       title: 'ステップ 3',
//       imageSrc: 'image3.png',
//       description: 'ここにステップ3の説明が入ります。',
//     },
//   ];

//   const [currentStep, setCurrentStep] = useState(0);

//   const handleNext = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handleTryIt = () => {
//     alert('使ってみるボタンがクリックされました！');
//     // ここで次のアクションを実行します
//   };

//   return (
//     <div>
//       {currentStep < steps.length ? (
//         <UsageStep
//           title={steps[currentStep].title}
//           imageSrc={steps[currentStep].imageSrc}
//           description={steps[currentStep].description}
//           onNext={handleNext}
//         />
//       ) : (
//         <div className="final-step-container">
//           <h2>すべてのステップが完了しました！</h2>
//           <button onClick={handleTryIt} className="try-button">使ってみる</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScreenshotPage;

import React, { useState } from 'react';
import UsageStep from '../component/UsageStep';
const ScreenshotPage = () => {
  const steps = [
    {
      title: 'ステップ 1',
      imageSrc: 'image1.png',
      description: 'ここにステップ1の説明が入ります。',
    },
    {
      title: 'ステップ 2',
      imageSrc: 'image2.png',
      description: 'ここにステップ2の説明が入ります。',
    },
    {
      title: 'ステップ 3',
      imageSrc: 'image3.png',
      description: 'ここにステップ3の説明が入ります。',
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [showFinalButtons, setShowFinalButtons] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTryIt = () => {
    alert('使ってみるボタンがクリックされました！');
    setShowFinalButtons(false); // ボタンを消す
    // ここで次のアクションを実行します
  };

  return (
    <div>
      {currentStep < steps.length ? (
        <UsageStep
          title={steps[currentStep].title}
          imageSrc={steps[currentStep].imageSrc}
          description={steps[currentStep].description}
          onNext={handleNext}
          onBack={handleBack}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
          showFinalButtons={showFinalButtons}
          onTryIt={handleTryIt}
        />
      ) : (
        <div className="final-step-container">
          <h2>すべてのステップが完了しました！</h2>
          {showFinalButtons && (
            <div className="button-container">
              <button onClick={handleBack} className="back-button">← 戻る</button>
              <button onClick={handleTryIt} className="try-button">使ってみる</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ScreenshotPage;