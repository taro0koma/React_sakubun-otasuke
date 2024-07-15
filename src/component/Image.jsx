
import React, { useRef } from 'react';
let kao=true;
const ImagePage = () => {

  const imagepngStyle={
    'height':'300px','width':'300px'
  }
  let lastName,firstName = useRef();
  let myImg = useRef();
  const buttonStyle={background:"#9369ff",color:"white",borderRadius:30}
  const change = () =>{
    
    // myImg.current.setAttribute('height',"200px")
    // myImg.current.setAttribute('width','300px')
    let fName = firstName.value;
    let lName = lastName.value;
    if (kao===true){
    myImg.current.src = "https://react-sakubun-otasuke.vercel.app/imges/eye-cloes.png"
    myImg.current.setAttribute('height',"300px")
    myImg.current.setAttribute('width','300px')
    kao=false;
  }else{
    myImg.current.src = "src/eye-open.png"
    myImg.current.setAttribute('height',"300px")
    myImg.current.setAttribute('width','300px')
    kao=true;
  }
    alert("👏こんにちは！ "+fName+" "+lName+" さん👏");
  }
  return (
    <div>
      <h1>イメージページです🎉</h1>
       <input ref={(a)=>firstName=a} placeholder="姓　例：作文" /><br />
       <input ref={(a)=>lastName=a} placeholder="名　例：太郎" /><br />
      <img ref={myImg} src="src/eye-cloes.png" style={imagepngStyle}/>
      <button onClick={change}>クリック！</button>

    </div>
  );
};

export default ImagePage;
//border-radius:15px;
//background: -webkit-gradient(linear, left top, left bottom, from(#666666), to(#cccccc));
