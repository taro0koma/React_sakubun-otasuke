import React from "react";
import Tabs from "../component/Tabs";
//⇓おかしくなったらimport style from "../assets/css/styles.module.css"にする
import "../assets/css/styles.module.css";
import SwiperHome from "./SwiperHome";
import { Helmet } from "react-helmet-async";
import Footer from "./Footer";
import "../assets/css/homePage.css"
const HomePage = () => {
  const items = [
    {
      imgSrc: `/images/sakubunnigate.png`,
      titleText: "はじめ",
      altText: "作文苦手なのよー！",
      heading: "あるところに\n作文が苦手なKさんがいました。",
      text: "本をたくさん読めば語彙が増えるとか、作文や国語が得意になると言われているが、思い通りにいかない困っている人に「作文おたすけアプリ」の使い方とおすすめポイントを案内します。",
      id: "contents-top"
    },
    {
      imgSrc: `/images/wantyan1.png`,
      titleText: "コマワンちゃんポイント１",
      altText: "コマワンちゃんポイント１",
      heading:
        "そこで、コマワンちゃんが\nポイントを教えに来ました。\n「まずは マップを書こう」",
      text: "マップは一つのテーマから思いつくことをつなげて内容をふくらませよう！\n何をかけばいいかどんどん出てきます。",
      id: "komawanpoint1",
    },
    {
      imgSrc: `/images/mapwaku.png`,
      titleText: "イメージマップ",
      altText: "書きたいことがわいてくるぞー！",
      heading:
        "「書きたいことが\nわいてくるぞー！」\nと Kさん。\n\n張り切ってマップをかいています。",
      text: "真ん中に一つテーマを書くと頭で考えているときよりもイメージがわきやすくなり、一つ書き足すごとに関連する言葉がわき出てきます。",
      url: "/map",
      url2: "/imagemapmake",
      urlText: "▶ マップの作り方へ",
      urlText2: "▶ イメージマップを作ってみよう",
      id: "mapfinish",
    },
    {
      imgSrc: `/images/wantyan2.png`,
      titleText: "コマワンちゃんポイント２",
      altText: "コマワンちゃんポイント２",
      heading:
        "コマワンちゃんのポイント！\n\n段落の組み立てで\n作文のそれぞれの段落に\n何を書くか決めよう。",
      text: "何を書くか決めてもどのように書くかわからない・・・をアプリを使って助けます。",
      id: "komawanpoint2",
    },
    {
      imgSrc: "/images/wakatta.png",
      titleText: "段落の組み立て",
      altText: "どうやって書けばいいか分かった",
      heading: "「どうやってかけばいいかわかった！」と Kさん。",
      text: "書く内容がわかっていても、どのように書けばいいかわからず手が止まってしまいます。\nなので、教えてくれる物があれば便利です。",
      url: "/danraku",
      urlText: "▶ 段落の組み立てを使ってみる",
      id: "uwao",
    },
    {
      imgSrc: "/images/wantyan3.png",
      titleText: "コマワンちゃんポイント３",
      altText: "コマワンちゃんポイント３",
      heading:
        "コマワンちゃんのポイント！\n\n今やったことを活かして\n文を書いてみる！",
      text: "自分の文を修正するにはまず書かなければいけないので、まずはとりあえず文を書いてみる。",
      id: "komawanpoint3",
    },
    {
      imgSrc: "/images/uwao.png",
      titleText: "原稿用紙作成シート",
      altText: "今までよりスラスラでいい感じに書けるようになったかも！！",
      heading:
        "「今ままでよりスラスラでいい感じにかけるようになったかも！！」とKさん。手の動きが早いです。",
      text: "作文や読書感想文には枚数や文字数制限があります。そんな時、作文用紙に書くようなサイトがあれば、楽に簡単に調べることができます。",
      url: "/osusume",
      urlText: "▶ 原稿用紙作成シートについて",
      id: "surassura",
    },
    {
      imgSrc: "/images/wantyan4.png",
      titleText: "コマワンちゃんポイント４",
      altText: "コマワンちゃんポイント４",
      heading:
        "コマワンちゃんのポイント４！\n「簡単な言葉を表現ぴったり探しや気持ちや感想から見つけ出そう！」",
      text: "どうしても、簡単な言葉しか出てこず、簡単だとわかっていてもかっこいい言葉がよくわからないことがあります。",
      id: "komawanpoint4",
    },
    {
      imgSrc: "/images/aseru.png",
      titleText: "気づき",
      altText: "この言葉何回も使っているなぁ",
      heading: "「この言葉何回も使っているなぁ」とKさんは気づきました。",
      id: "iikaeniodoroki",
    },
    {
      imgSrc: "/images/iikaeniodoroki.png",
      titleText: "いいかえ",
      altText: "この言いかえいい！！こんな書き方があるんだ",
      heading: "「この言い換えがいい！！\nこんなかきかたがあるんだ」",
      text: "「表現ぴったり探し」や「気持ちや感想のいいかえ」をつかうことで、気持ちの伝わりやすい作文になりました。\nごいも増えるね！",
      url: "/hyougen",
      url2: "/kimoti",
      url3: "/zinbutsu",
      urlText: "▶ 表現ぴったり探し",
      urlText2: "▶ 気持ちや感想",
      urlText3: "▶ 登場人物の性格を表す言葉",
      id: "konoiikaeyoi",
    },
    {
      imgSrc: "/images/sakubunmakasete.png",
      titleText: "おわり",
      altText: "作文なら任せなさい…！",
      heading:
        "作文を書きなれたKさんは今では\n「作文ならまかせなさい！」\nとなるまでに成長しました。",
      id: "sakubunmakasete",
    },
    {
      heading: "Kさんのおすすめツールも使ってみてね",
      url: "/osusume",
      urlText: "▶ おすすめツールを確認",
      id: "osusume",
    },
  ];

  return (
    <div id="top" className="home-page"> {/* home-page クラスを追加 */}
      <Helmet><title>作文おたすけアプリ</title></Helmet>
      <Tabs contents="home" />
      <section className="hero-section"> {/* 新しいセクションを追加 */}
        <div className="hero-content">
          <img src="/images/coma.png" alt="ロゴ" className="app-logo" /> {/* app-logo クラスを追加 */}
          <h1>　みんなの作文をもっと楽しく。</h1> {/* h2をh1に変更し、より目立たせる */}
          <p>
            「作文が苦手」をお助けする作文教室のようなアプリです。<br />苦手だった作文や読書感想文が楽しくなるかも！
          </p>
        </div>
      </section>

      <SwiperHome />

      <nav className="navigation"> 
        <ul className="navigation-list"> 
          <li className="navigation-item"> 
            <a href="#komawanpoint1"><span>内容が思いつかないときは</span><br /><span>マップ作り</span></a> 
          </li> 
          <li className="navigation-item"> 
            <a href="#komawanpoint2"><span>書き方がわからないときは</span><br /><span>段落の組み立て</span></a> 
          </li> 
          <li className="navigation-item"> 
            <a href="#komawanpoint4"><span>言葉をいいかえたいときは</span><br /><span>気持ちや感想のいいかえ</span></a> 
          </li> 
          <li className="navigation-item"> 
            <a href="#komawanpoint4"><span>簡単な言葉をカッコよく</span><br /><span>表現ぴったり探し</span></a> 
          </li> 
          <li className="navigation-item"> 
            <a href="#osusume"><span>もっと便利に</span><br /><span>おすすめツール</span></a> 
          </li> 
        </ul> 
      </nav> 

      <div className="contents-wrapper"> {/* container を contents-wrapper に変更 */}
        {items.map((item, index) => (
          <section className="content-block" key={index} id={item.id}> {/* set を content-block に変更し、idをsectionに移動 */}
            <span>{item.titleText}</span>
            {item.imgSrc && <img src={item.imgSrc} alt={item.altText} className="content-image" />} {/* homepng を content-image に変更 */}
            {item.heading && <h3 className="content-heading">{item.heading}</h3>} {/* boldスタイルをCSSで管理 */}
            {item.text && <p className="content-text">{item.text}</p>}
            <div className="button-group"> {/* ボタンをまとめるdivを追加 */}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="content-button-link">
                  <button className="tobubutton">{item.urlText}</button>
                </a>
              )}
              {item.url2 && (
                <a href={item.url2} target="_blank" rel="noopener noreferrer" className="content-button-link">
                  <button className="tobubutton">{item.urlText2}</button>
                </a>
              )}
              {item.url3 && (
                <a href={item.url3} target="_blank" rel="noopener noreferrer" className="content-button-link">
                  <button className="tobubutton">{item.urlText3}</button>
                </a>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* 下部のクイックナビゲーションは冗長なため削除しました。必要であれば再追加してください。 */}
      <nav className="navigation"> 
        <ul className="navigation-list"> 
          <li className="navigation-item"> 
            <a href="#komawanpoint1"><span>内容が思いつかないときは</span><br /><span>マップ作り</span></a> 
          </li> 
          <li className="navigation-item"> 
            <a href="#komawanpoint2"><span>書き方がわからないときは</span><br /><span>段落の組み立て</span></a> 
          </li> 
          <li className="navigation-item"> 
            <a href="#komawanpoint4"><span>言葉をいいかえたいときは</span><br /><span>気持ちや感想のいいかえ</span></a> 
          </li> 
          <li className="navigation-item"> 
            <a href="#komawanpoint4"><span>簡単な言葉をカッコよく</span><br /><span>表現ぴったり探し</span></a> 
          </li> 
          <li className="navigation-item"> 
            <a href="#osusume"><span>もっと便利に</span><br /><span>おすすめツール</span></a> 
          </li> 
        </ul> 
      </nav> 
      <Footer />
    </div>
  );
};

export default HomePage;