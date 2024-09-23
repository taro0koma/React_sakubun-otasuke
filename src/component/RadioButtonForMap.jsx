import React from 'react';
import "./RadioButtonForMap.css";

const RadioButtonForMap = ({ selectedValue, onChange }) => {
  return (
    <div>
      <fieldset className="radio-3">
        <label>
          <input 
            type="radio" 
            name="radio-3" 
            value="イメージマップを見てください" 
            checked={selectedValue === "イメージマップを見てください"} 
            onChange={onChange} 
          />
          イメージマップを見てください
        </label>
        <label>
          <input 
            type="radio" 
            name="radio-3" 
            value="使い方がよくわかりません" 
            checked={selectedValue === "使い方がよくわかりません"} 
            onChange={onChange} 
          />
          使い方がよくわかりません
        </label>
        <label>
          <input 
            type="radio" 
            name="radio-3" 
            value="思い浮かびません" 
            checked={selectedValue === "思い浮かびません"} 
            onChange={onChange} 
          />
          思い浮かびません
        </label>
      </fieldset>
    </div>
  );
};

export default RadioButtonForMap;
