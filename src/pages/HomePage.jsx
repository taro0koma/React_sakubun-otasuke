import React from "react";
import Tabs from "../component/Tabs";
import styles from "../assets/css/styles.module.css";
// import '/css/style.css'

// width: 100% !important;
// height: 100% !important;

const HomePage = () => {
  const items = [
    {
      imgSrc: `/images/sakubunnigate.png`,
      altText: "作文苦手なのよー！",
      heading: "あるところに\n作文が苦手なKさんがいました。",
      text: "本をたくさん読めば語彙が増えるとか、作文や国語が得意になると言われているが、思い通りにいかない困っている人に「作文おたすけアプリ」の使い方とおすすめポイントを案内します。",
    },
    {
      imgSrc: `/images/wantyan1.png`,
      altText: "コマワンちゃんポイント１",
      heading:
        "そこで、コマワンちゃんが\nポイントを教えに来ました。\n「まずは マップを書こう」",
      text: "マップは一つのテーマから思いつくことをつなげて内容をふくらませよう！\n何をかけばいいかどんどん出てきます。",
      id: "komawanpoint1",
    },
    {
      imgSrc: `/images/mapwaku.png`,
      altText: "書きたいことがわいてくるぞー！",
      heading:
        "「書きたいことが\nわいてくるぞー！」\nと Kさん。\n\n張り切ってマップをかいています。",
      text: "真ん中に一つテーマを書くと頭で考えているときよりもイメージがわきやすくなり、一つ書き足すごとに関連する言葉がわき出てきます。",
      url: "/mapmake",
      urlText: "▶ マップの作り方へ",
      id: "mapfinish",
    },
    {
      imgSrc: `/images/wantyan2.png`,
      altText: "コマワンちゃんポイント２",
      heading:
        "コマワンちゃんのポイント！\n\n段落の組み立てで\n作文のそれぞれの段落に\n何を書くか決めよう。",
      text: "何を書くか決めてもどのように書くかわからない・・・をアプリを使って助けます。",
      id: "komawanpoint2",
    },
    {
      imgSrc: "/images/wakatta.png",
      altText: "どうやって書けばいいか分かった",
      heading: "「どうやってかけばいいかわかった！」と Kさん。",
      text: "書く内容がわかっていても、どのように書けばいいかわからず手が止まってしまいます。\nなので、教えてくれる物があれば便利です。",
      url: "/danraku",
      urlText: "▶ 段落の組み立てを使ってみる",
      id: "uwao",
    },
    {
      imgSrc: "/images/wantyan3.png",
      altText: "コマワンちゃんポイント３",
      heading:
        "コマワンちゃんのポイント！\n\n今やったことを活かして\n文を書いてみる！",
      text: "自分の文を修正するにはまず書かなければいけないので、まずはとりあえず文を書いてみる。",
      id: "komawanpoint3",
    },
    {
      imgSrc: "/images/uwao.png",
      altText: "今までよりスラスラでいい感じに書けるようになったかも！！",
      heading:
        "「今ままでよりスラスラでいい感じにかけるようになったかも！！」とKさん。手の動きが早いです。",
      text: "作文や読書感想文には枚数や文字数制限があります。そんな時、作文用紙に書くようなサイトがあれば、楽に簡単に調べることができます。",
      url: "/genkoyoshi",
      urlText: "▶ 原稿用紙作成シートについて",
      id: "surassura",
    },
    {
      imgSrc: "/images/wantyan4.png",
      altText: "コマワンちゃんポイント４",
      heading:
        "コマワンちゃんのポイント４！\n「簡単な言葉を表現ぴったり探しや気持ちや感想から見つけ出そう！」",
      text: "どうしても、簡単な言葉しか出てこず、簡単だとわかっていてもかっこいい言葉がよくわからないことがあります。",
      id: "komawanpoint4",
    },
    {
      imgSrc: "/images/aseru.png",
      altText: "この言葉何回も使っているなぁ",
      heading: "「この言葉何回も使っているなぁ」とKさんは気づきました。",
      id: "iikaeniodoroki",
    },
    {
      imgSrc: "/images/iikaeniodoroki.png",
      altText: "この言いかえいい！！こんな書き方があるんだ",
      heading: "「この言い換えがいい！！\nこんなかきかたがあるんだ」",
      text: "「表現ぴったり探し」や「気持ちや感想のいいかえ」をつかうことで、気持ちの伝わりやすい作文になりました。\nごいも増えるね！",
      url: "/hyougen",
      url2: "/kimoti",
      urlText: "▶ 表現ぴったり探し",
      urlText2: "▶ 気持ちや感想",
      id: "konoiikaeyoi",
    },
    {
      imgSrc: "/images/sakubunmakasete.png",
      altText: "作文なら任せなさい…！",
      heading:
        "作文を書きなれたKさんは今では「作文ならまかせなさい！」となるまでに成長しました。",
      id: "sakubunmakasete",
    },
    {
      heading:"Kさんのおすすめツールも使ってみてね",
      url: "/genkoyoshi",
      urlText: "▶ おすすめツールを確認",
      id: "osusume",
    },
  ];
  
  return (
    <div id="top">
      <Tabs contents="home"/>
      <div className="setumei">
        <img src="/images/Applogo.png" alt="ロゴ" style={{maxWidth:"400px"}}/>
        <h2>作文おたすけアプリとは？</h2>
        <p>
          「作文が苦手」をお助けする作文教室のようなアプリです。<br/>このアプリを作って、作文や読書感想文を楽しく作ってみましょう。
        </p>
      </div>
      <div className="contact-card">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdJvzw5aympJYQrL58b9DbDy-Jqm8Xr1s43S8gfWTG4y8JY0g/viewform?usp=sf_link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="contact-card-content">
            <img
              src="/images/formImage.png"
              alt="お問い合わせフォームプレビュー"
              className="contact-card-image"
            />
            <div className="contact-card-text">
              <h3>フィードバック ぜひ ください</h3>
              <p>作文お助けアプリを使ってみた感想を教えてくれるとうれしいです。</p>
              <div className="EmbedBaseLinkCard">
                <img
                  src="https://www.google.com/s2/favicons?sz=14&amp;domain_url=https://docs.google.com"
                  alt="docs.google.com favicon image"
                  width="14"
                  height="14"
                />
                docs.google.com
              </div>
            </div>
          </div>
        </a>
      </div>

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
      <div className={styles.container}>
        <br />
        {/* <img src="/images/coma.png" alt="image"/> */}

        {items.map((item, index) => (
          <div className={styles.set} key={index}>
            <br  id={item.id}/>
            <img src={item.imgSrc} alt={item.altText} className="homepng"/>
            <h3 style={{fontWeight:"bold"}}>{item.heading}</h3>
            <p>
              {item.text}
              </p>
              {/* item.urlの中身があるかどうかを調べる条件分岐を作りその中に表示するHTMLを入れる */}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <button className="tobubutton">{item.urlText}</button>
                </a>
              )}
              {/*item.url2の中身があるかどうかを調べる条件分岐を作りそのなかにボタンを作るHTMLを入れる */}
              {item.url2 && (
                <a href={item.url2} target="_blank" rel="noopener noreferrer">
                  <br />
                  <button className="tobubutton">{item.urlText2}</button>
                </a>
              )}
              {/* <a href={item.url}><button>{item.urlText}</button></a> */}
          </div>
        ))}
        
        {/* <div>
        <br id="#osusume"/>
              <h1>おすすめツール</h1>
              <p>Kさんのおすすめツール使ってみてね</p>
              <a href="/genkoyoshi">
                <button>おすすめツール</button>
              </a>
              </div> */}
      </div>
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
      <br />
    </div>
  );
};

export default HomePage;
