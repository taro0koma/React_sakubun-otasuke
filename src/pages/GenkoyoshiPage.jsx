import React from 'react';
import Tabs from './../component/Tabs';
import PreviousAndNext from '../component/PreviousAndNext';

const GenkoyoshiPage = () => {
  return (
    <div>
      <Tabs pageTitle="原稿用紙について"/>
      <h5>このサービスではまだ原稿用紙を作るコンテンツができていないため、おすすめのサイトを伝えます。</h5>
      <p><a href="https://seipsg.main.jp/service/manuscriptpaper_gs" target='_blank'>縦書き原稿用紙<br/>（おすすめ：原稿用紙シート　タイプC-サンプル2　2000字 （20×100））</a></p>
      <div className='genkouimage'>
      <img src="/images/sakubunyoshi2.png" alt="原稿用紙作成シートのスクショ" />
      <br />
      <img src="/images/sakubunyoshi1.png" alt="原稿用紙作成シートのスクショ２" />
      </div> 
      <PreviousAndNext midashi="書きたいことが決まっていない？" honbun="何を書くかわかんないときはマップがおすすめ！試しにやってみよう！" buttontext="マップ作り" buttonurl="/mapmake"/>
    </div>
  );
};

export default GenkoyoshiPage;