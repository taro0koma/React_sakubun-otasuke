import React from 'react';
const NotFoundStyle={
  color:"#555555",
  fontSize:50,
}
const mojiStyle={
  marginRight:50,
  marginLeft:50
}
const divStyle={
  textAlign:"center"
}
const NotFound = () => {
  console.error("Notfound");
  return (
    <div style={divStyle}>
      <img src="/src/notfound.png"></img>
      <h1 style={NotFoundStyle}>404</h1>
      <p style={mojiStyle}>Not found<br/>URL,ファイル名にタイプミスがないかご確認ください。</p>
      <a style={mojiStyle} href="/">←作文お助けアプリのトップページ</a>
    </div>
  );
};

export default NotFound;