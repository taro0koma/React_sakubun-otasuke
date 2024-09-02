import React from 'react';
import './custom-node.css'; // スタイルファイルをインポート

const CustomNode = ({ data }) => {
  return (
    <div className="custom-node">
      <div className="custom-node__port custom-node__port--input"></div>
      <div className="custom-node__content">{data.label}</div>
      <div className="custom-node__port custom-node__port--output"></div>
    </div>
  );
};

export default CustomNode;