import React,{ useState } from 'react';
import Tabs from './Tabs';

const Key = () => {
  const [myObj,setMyObj] = useState({
    key1: "Ariyan 1",
    key2: "Ariyan 2",
    key3: "Ariyan 3",
  })
  const change = () => {
    setMyObj(
      prevOBJ=>({
        ...prevOBJ,
        key1:"hi how are you?",
        key2:"what is your name?",
        key3:"where are you?"
      })
    );
  }

  return (
    <div>
      <Tabs/>
      <h1>🎉key🎉</h1>
      <h2>{myObj.key1}</h2>
      <h2>{myObj.key2}</h2>
      <h2>{myObj.key3}</h2>
      <button onClick={change}>change</button>
    </div>
  );
};

export default Key;