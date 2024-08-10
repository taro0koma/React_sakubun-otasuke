import React from 'react';
import './ModalFrame.css'; // CSSファイルをインポート

const ModalFrame = ({ title, text, onClose, imageSrc,midashi,buttonName }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="hazinogazou">
          <img src={imageSrc} alt="画像" />
        </div>
        <div className="modal-text">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <div className="modal-header">
            <h2>{title}</h2>
            <h1>{midashi}</h1>
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
