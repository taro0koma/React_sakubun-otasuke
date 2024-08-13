import React,{useState} from 'react';
import Tabs from './../component/Tabs';
import ModalFrame from "../component/ModalFrame";
import SwiperPage from './swiperPage';

const GenkoyoshiPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Tabs pageTitle="おすすめツール" contents="genkouyoshi"/>
      {isModalOpen && (
        <ModalFrame title="デジタルでも書け、文字数や枚数が確認できるツールをがほしい！" text="作文には枚数や文字数制限などがあるので、自分が書いている文章が何文字多いかOR少ないか知ることができるサイトを紹介しています" onClose={handleModalClose} imageSrc="/vite.svg" buttonName="見てみる"/>
      )}
      <p>作文を書くのに便利なツールを紹介します。</p>
      <br />
      <h4 style={{padding:"0 10px"}}>１. 縦書き原稿用紙作成シート</h4>
      <p style={{textAlign:"left"}}>「学校教育情報処理研究会」が提供している「縦書き原稿用紙作成シート」は清書する前の下書きにぴったり。作文の文字数や行数を表示してくれるので、文字数が決まっている宿題を調整できるよ</p>
      
      <div style={{display:"flex",textAlign:"center",justifyContent:"center"}}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Google_Sheets_2020_Logo.svg/140px-Google_Sheets_2020_Logo.svg.png" alt="logo" style={{width:"2rem",margin:"0 1rem 0 0"}}/>
      <p style={{color:"blue",textDecoration: "underline"}}><a href="https://seipsg.main.jp/service/manuscriptpaper_gs" target='_blank' className='linkosusume'>縦書き原稿用紙作成シート</a></p>
      </div>
      <img src="/images/genkouyousisakuseTukatta.png" alt="コマワンちゃんが操作中" style={{maxWidth:640}} />
      <div className='genkouimage'>
      <br />
      </div> 
      <h4 style={{padding:"0 10px"}}>２. Figjam</h4>
      <p style={{textAlign:"left"}}>「Figma, Inc.（本社：米国サンフランシスコ）」が提供している「Figjam」はイメージマップを書くのにぴったり。<br/>見やすくて、便利！</p>
      <div style={{display:"flex",textAlign:"center",justifyContent:"center"}}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/300px-Figma-logo.svg.png" alt="logo" style={{width:"2rem",margin:"0 1rem 0 0"}}/>
      <p style={{color:"blue",textDecoration: "underline"}}><a href="https://www.figma.com/" target='_blank' className='linkosusume'>Figjam</a></p>
      </div>
      <div className='genkouimage'>
      <SwiperPage gazou1="/images/sakubunMap1.png" gazou2="/images/sakubunMap2.png" gazou3="/images/sakubunMap3.png" gazou4="/images/dokushokansouMap.png"/>

      <br />
      </div> 
    </div>
  );
};

export default GenkoyoshiPage;