import React from 'react';
import './ModalFrame.css'; // CSSファイルをインポート

const ModalFrame = ({ title, text, onClose, imageSrc,midashi,buttonName }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="hazinogazou" style={{width:"50%",height:"100%"}}>
          <img src={imageSrc} alt="画像" style={{height:"auto"}}/>
        </div>
        <div className="modal-text">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <div className="modal-header">
            <h1>{title}</h1>
            <h2>{midashi}</h2>
          </div>
          <div className="modal-body">
            <p>{text}</p>
          </div>
        </div>
        <button onClick={onClose} className='tukattemiyo'>{buttonName || "やってみる"}</button>
      </div>
    </div>
  );
};

export default ModalFrame;
