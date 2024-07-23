import React from "react";
import Hero from "../component/Hero";
import Tabs from "../component/Tabs";
import styles from '../assets/css/styles.module.css'; 
// import '/css/style.css'
 
  // width: 100% !important;
  // height: 100% !important;

const HomePage = () => {
  const items = [
    {
      imgSrc:
        `/images/sakubunnigate.png`,
      altText: "作文苦手なのよー！",
      heading: "あるところに\n作文が苦手なKさんがいました。",
      text: "本をたくさん読めば語彙が増えるとか、作文や国語が得意になると言われているが、思い通りにいかない困っている人に「作文おたすけアプリ」の使い方とおすすめポイントを案内します。",
    },
    {
      imgSrc: `/images/wantyan1.png`,
      altText: "コマワンちゃんポイント１",
      heading:"そこで、コマワンちゃんが\nポイントを教えに来ました。\n「まずは マップを書こう」",
      text: "マップは一つのテーマから思いつくことをつなげて内容をふくらませよう！\n何をかけばいいかどんどん出てきます。",
    },
    {
      imgSrc: `/images/mapwaku.png`,
      altText: "書きたいことがわいてくるぞー！",
      heading:
        "「書きたいことが\nわいてくるぞー！」\nと Kさん。\n\n張り切ってマップをかいています。",
      text: "真ん中に一つテーマを書くと頭で考えているときよりもイメージがわきやすくなり、一つ書き足すごとに関連する言葉がわき出てきます。",
    },
    {
      imgSrc: `/images/wantyan2.png`,
      altText: "コマワンちゃんポイント２",
      heading:
        "コマワンちゃんのポイント！\n\n段落の組み立てで\n作文のそれぞれの段落に\n何を書くか決めよう。",
      text: "何を書くか決めてもどのように書くかわからない・・・をアプリを使って助けます。",
    },
    {
      imgSrc: "/images/wakatta.png",
      altText: "どうやって書けばいいか分かった",
      heading: "「どうやってかけばいいかわかった！」と Kさん。",
      text: "書く内容がわかっていても、どのように書けばいいかわからず手が止まってしまいます。\nなので、教えてくれる物があれば便利です。",
    },
    {
      imgSrc: "/images/wantyan3.png",
      altText: "コマワンちゃんポイント３",
      heading:
        "コマワンちゃんのポイント！\n\n今やったことを活かして\n文を書いてみる！",
      text: "自分の文を修正するにはまず書かなければいけないので、まずはとりあえず文を書いてみる。",
    },
    {
      imgSrc: "/images/uwao.png",
      altText: "今までよりスラスラでいい感じに書けるようになったかも！！",
      heading:
        "「今ままでよりスラスラでいい感じにかけるようになったかも！！」とKさん。手の動きが早いです。",
      text: "説明文5",
    },
    {
      imgSrc: "/images/wantyan4.png",
      altText: "コマワンちゃんポイント４",
      heading:
        "コマワンちゃんのポイント４！\n「簡単な言葉を表現ぴったり探しや登場人物の性格を表す言葉から見つけ出そう！」",
      text: "説明文5",
    },
    {
      imgSrc: "/images/aseru.png",
      altText: "この言葉何回も使っているなぁ",
      heading: "「この言葉何回も使っているなぁ」とKさんは気づきました。",
      text: "説明文5",
    },
    {
      imgSrc:
        "/images/iikaeniodoroki.png",
      altText: "この言いかえいい！！こんな書き方があるんだ",
      heading: "「この言い換えがいい！！\nこんなかきかたがあるんだ」",
      text: "説明文5",
    },
    {
      imgSrc:
        "/images/sakubunmakasete.png",
      altText: "作文なら任せなさい…！",
      heading:
        "作文を書きなれたKさんは今では「作文ならまかせなさい！」となるまでに成長しました。",
      text: "説明文5",
    },
  ];

  return (
    <div>
      <Tabs />
      <Hero />
      <div className="contact-card">
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSdJvzw5aympJYQrL58b9DbDy-Jqm8Xr1s43S8gfWTG4y8JY0g/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer">
        <div className="contact-card-content">
          <img src="/images/formImage.png" alt="お問い合わせフォームプレビュー" className="contact-card-image" />
          <div className="contact-card-text">
            <h3>フィードバック</h3>
            <p>作文お助けアプリのご意見をお聞かせください。</p>
            <div className="EmbedBaseLinkCard"><img src="https://www.google.com/s2/favicons?sz=14&amp;domain_url=https://docs.google.com" alt="docs.google.com favicon image" width="14" height="14"/>docs.google.com</div>
          </div>
        </div>
      </a>
    </div>
      <div className={styles.container}>
      <h2>作文お助けアプリの使い方</h2>
      <br />
      {/* <img src="/images/coma.png" alt="image"/> */}

        {items.map((item, index) => (
          <div className={styles.set} key={index}>
            <img src={item.imgSrc} alt={item.altText}/>
            <h3>{item.heading}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
