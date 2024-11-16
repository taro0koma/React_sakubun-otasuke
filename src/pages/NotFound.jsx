import React from 'react';
import Tabs from '../component/Tabs';
const NotFoundStyle={
  color:"#555555",
  fontSize:50,
}
const mojiStyle={
  margin:"10px 30px",
  fontSize:20,
}
const divStyle={
  textAlign:"center"
}
const NotFound = () => {
  console.error("Notfound");
  return (
    <div style={divStyle} className='notfoundImage'>
      <Tabs pageTitle="" contents="danraku"/>
      <img src="https://react-sakubun-otasuke.vercel.app/images/notfound.png" style={{marginTop:-70,width:10,textAlign:"center",display: "block",marginLeft: "auto",marginRight: "auto"}}></img>
      <h1 style={NotFoundStyle}>404<br/>Not found</h1>
      <p style={mojiStyle}>URLが間違っているようだよ・・・😭</p>
      <a style={mojiStyle} href="/">←作文お助けアプリのトップページ</a>
    </div>
  );
};

export default NotFound;