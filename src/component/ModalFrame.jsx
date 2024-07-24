import React from 'react';
import './ModalFrame.css'; // CSSファイルをインポート

const ModalFrame = ({ title, text, onClose, imageSrc }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src="/images/notfound.png" alt="画像" className='hazinogazou'/>
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
