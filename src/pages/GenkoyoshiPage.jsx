import React from 'react';
import Tabs from './../component/Tabs';
import PreviousAndNext from '../component/PreviousAndNext';

const GenkoyoshiPage = () => {
  return (
    <div>
      <Tabs pageTitle="原稿用紙について" contents="genkouyoshi"/>
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