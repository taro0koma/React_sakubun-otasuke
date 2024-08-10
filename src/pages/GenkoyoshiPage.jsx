import React,{useState} from 'react';
import Tabs from './../component/Tabs';
import PreviousAndNext from '../component/PreviousAndNext';
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
        <ModalFrame title="原稿用紙作成シートについて" text="このサイトは、文字数や枚数、行数などを実際に入力し原稿用紙に移すような形で、調べることのできるサイトの紹介が書かれています" onClose={handleModalClose} imageSrc="/vite.svg"/>
      )}
      <p>文字数や行数が調べられる機能を紹介するよ</p>
      <p><a href="https://seipsg.main.jp/service/manuscriptpaper_gs" target='_blank'>縦書き原稿用紙<br/>（おすすめ：原稿用紙シート　タイプC-サンプル2　2000字 （20×100））</a></p>
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