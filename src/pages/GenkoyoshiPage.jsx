import React from 'react';
import Tabs from './../component/Tabs';
import PreviousAndNext from '../component/PreviousAndNext';

const GenkoyoshiPage = () => {
  return (
    <div>
      <Tabs pageTitle="原稿用紙について"/>
      <h5>このサービスではまだ原稿用紙を作るコンテンツができていないため、おすすめのサイトを伝えます。</h5>
      <p><a href="https://seipsg.main.jp/service/manuscriptpaper_gs" target='_blank'>縦書き原稿用紙</a></p>
      <PreviousAndNext Previous="段落の組み立て" urlP="/danraku" Next="書き出しおみくじ" urlN="/omikuji"/>
    </div>
  );
};

export default GenkoyoshiPage;