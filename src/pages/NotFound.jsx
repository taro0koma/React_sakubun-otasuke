import React from 'react';
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
      <img src="https://react-sakubun-otasuke.vercel.app/images/notfound.png" style={{margin:"40px 0 0 0", width:10,textAlign:"center"}}></img>
      <h1 style={NotFoundStyle}>404<br/>Not found</h1>
      <p style={mojiStyle}>URL,ファイル名に<br/>タイプミスがないかご確認ください。</p>
      <a style={mojiStyle} href="/">←作文お助けアプリのトップページ</a>
    </div>
  );
};

export default NotFound;