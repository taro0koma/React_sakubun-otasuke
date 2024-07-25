import React from 'react';
import './ModalFrame.css'; // CSSファイルをインポート

const ModalFrame = ({ title, text, onClose, imageSrc }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="hazinogazou">
          <img src="/images/komawantyan.png" alt="画像" />
        </div>
        <div className="modal-text">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <div className="modal-header">
            <h2>{title}</h2>
          </div>
          <div className="modal-body">
            <p>{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalFrame;
