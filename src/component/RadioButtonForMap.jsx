import React from 'react';
import "./RadioButtonForMap.css";
import { t } from 'i18next';

const RadioButtonForMap = ({ selectedValue, onChange }) => {
  return (
    <div>
  <div className="button-group">
    <button
      type="button"
      className={selectedValue === "思い浮かびません squishy squishy-neon" ? "active squishy squishy-neon" : "squishy squishy-neon"}
      onClick={() =>
        onChange({ target: { value: "思い浮かびません" } })
      }
    >
      {t("imagemapPage.RadioButton.think")}
    </button>
    <button
      type="button"
      className={selectedValue === "イメージマップを見てください squishy squishy-neon" ? "active squishy squishy-neon" : "squishy squishy-neon"}
      onClick={() =>
        onChange({ target: { value: "イメージマップを見てください" } })
      }
    >
      {t("imagemapPage.RadioButton.look")}
    </button>
    <button
      type="button"
      className={selectedValue === "使い方がよくわかりません squishy squishy-neon" ? "active squishy squishy-neon" : "squishy squishy-neon"}
      onClick={() =>
        onChange({ target: { value: "使い方がよくわかりません" } })
      }
    >
      {t("imagemapPage.RadioButton.know")}
    </button>
    
  </div>
</div>

  );
};

export default RadioButtonForMap;
