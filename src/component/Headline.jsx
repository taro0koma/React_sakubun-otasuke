//API叩く！ページ
import React, { useRef } from 'react';

const Headline = () => {
  let APIData = useRef(null);
  let myPTag = useRef();
  // let myHeadLine = useRef();
  const fetchData = async () => {
    
    const response = await fetch("https://dummyjson.com/products"); 
      APIData.current = await response.json();
  }
  const showData = () => {
    myPTag.current.innerText = JSON.stringify(APIData);
  }
  return (
    <div>
      <p ref={myPTag}></p>
      <button onClick={fetchData}>Call Api</button>
      <button onClick={showData}>Show Data</button>
    </div>
  );
};

export default Headline;

//YOUTUBE　33 - [Hook] useRef Caching Exp... 12:15/15:24