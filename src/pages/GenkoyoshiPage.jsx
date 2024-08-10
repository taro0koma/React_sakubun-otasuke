import React,{useState} from 'react';
import Tabs from './../component/Tabs';
import ModalFrame from "../component/ModalFrame";

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
      <p>「学校教育情報処理研究会」が提供している「縦書き原稿用紙作成シート」は清書する前の下書きにぴったり。作文の文字数や行数を表示してくれるので、文字数が決まっている宿題を調整できるよ</p>
      <p style={{color:"blue",textDecoration: "underline"}}><a href="https://seipsg.main.jp/service/manuscriptpaper_gs" target='_blank' className='linkosusume'>縦書き原稿用紙作成シート</a></p>
      <div className='genkouimage'>
      <img src="/images/sakubunyoshi2.png" alt="原稿用紙作成シートのスクショ" />
      <br />
      <img src="/images/sakubunyoshi1.png" alt="原稿用紙作成シートのスクショ２" />
      <br />
      </div> 
    </div>
  );
};

export default GenkoyoshiPage;