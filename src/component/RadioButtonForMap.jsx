import React from 'react';
import "./RadioButtonForMap.css";

const RadioButtonForMap = ({ selectedValue, onChange }) => {
  return (
    <div>
  <div className="button-group">
    <button
      type="button"
      className={selectedValue === "イメージマップを見てください squishy squishy-neon" ? "active squishy squishy-neon" : "squishy squishy-neon"}
      onClick={() =>
        onChange({ target: { value: "イメージマップを見てください" } })
      }
    >
      イメージマップを見てほしい
    </button>
    <button
      type="button"
      className={selectedValue === "使い方がよくわかりません squishy squishy-neon" ? "active squishy squishy-neon" : "squishy squishy-neon"}
      onClick={() =>
        onChange({ target: { value: "使い方がよくわかりません" } })
      }
    >
      つかい方がよくわかりません
    </button>
    <button
      type="button"
      className={selectedValue === "思い浮かびません squishy squishy-neon" ? "active squishy squishy-neon" : "squishy squishy-neon"}
      onClick={() =>
        onChange({ target: { value: "思い浮かびません" } })
      }
    >
      思いうかびません
    </button>
  </div>
</div>

  );
};

export default RadioButtonForMap;
