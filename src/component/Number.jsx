import React, { useState } from "react";
import { BrowserRouter } from 'react-router-dom';

const Number = () => {
  const radio = 'a'
  const [number,setNumber] = useState(0);
  const pNumber = () => {
    setNumber(number + 1);
  };
  const mNumber = () => {
    if (document.getElementById("agreement").checked){
      if (number > 0) {
        setNumber(number - 1);
      } 
    }else{
      setNumber(number - 1);
    }
    
    
  };
  const reset = () =>{
    setNumber(number-number);
  }
  return (
    <div>
      <h1>数が増えるだけのサイト</h1>
      <h3>Number: {number}</h3>
      <button onClick={pNumber}>プラス</button>
      <button onClick={mNumber}>
        マイナス
      </button>
      <button onClick={reset}>リセット(0)</button>
      <br />
      <br />
      <p>マイナスを拒否</p>
      <input type="checkbox" id="agreement"/>
    </div>
  );
};

export default Number;
