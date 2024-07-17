import React from "react";
import Hero from "../component/Hero";
import Tabs from "../component/Tabs";
// import '../../assets/css/styles.css'; 
import 'https://react-sakubun-otasuke.vercel.app/css/style.css'

const HomePage = () => {
  const items = [
    {
      imgSrc:
        "https://react-sakubun-otasuke.vercel.app/images/sakubunnigate.png",
      altText: "作文苦手なのよー！",
      heading: "あるところに<br/>作文が苦手なKさんがいました。",
      text: "説明文1",
    },
    {
      imgSrc: "https://react-sakubun-otasuke.vercel.app/images/wantyan1.png",
      altText: "コマワンちゃんポイント１",
      heading:
        "そこで、コマワンちゃんがポイントを教えに来ました。<br/>「まずは マップを書こう」",
      text: "マップは一つのテーマから思いつくことをつなげて内容をふくらませよう！<br/>何をかけばいいかどんどん出てきます。",
    },
    {
      imgSrc: "https://react-sakubun-otasuke.vercel.app/images/mapwaku.png",
      altText: "書きたいことがわいてくるぞー！",
      heading:
        "「書きたいことがわいてくるぞー！」とKさん。<br/>張り切ってマップをかいています。",
      text: "真ん中に一つテーマを書くと頭で考えているときよりもイメージがわきやすくなり、一つ書き足すごとに関連する言葉がわき出てきます。",
    },
    {
      imgSrc: "https://react-sakubun-otasuke.vercel.app/images/wantyan2.png",
      altText: "コマワンちゃんポイント２",
      heading:
        "コマワンちゃんのポイント２！<br/>「段落の組み立てで作文のそれぞれの段落に何を書くか決めよう」",
      text: "何を書くか決めてもどのように書くかわからない・・・をアプリを使って助けます。",
    },
    {
      imgSrc: "https://react-sakubun-otasuke.vercel.app/images/wakatta.png",
      altText: "どうやって書けばいいか分かった",
      heading: "「どうやってかけばいいかわかった！」とKさん。",
      text: "書く内容がわかっていても、どのように書けばいいかわからず手が止まってしまいます。<br/>なので、教えてくれる物があれば便利です。",
    },
    {
      imgSrc: "https://react-sakubun-otasuke.vercel.app/images/wantyan3.png",
      altText: "コマワンちゃんポイント３",
      heading:
        "コマワンちゃんのポイント3！<br/>「今やったことを活かして文を書いてみる！」",
      text: "自分の文を修正するにはまず書かなければいけないので、まずはとりあえず文を書いてみる。",
    },
    {
      imgSrc: "https://react-sakubun-otasuke.vercel.app/images/uwao.png",
      altText: "今までよりスラスラでいい感じに書けるようになったかも！！",
      heading:
        "「今ままでよりスラスラでいい感じにかけるようになったかも！！」とKさん。手の動きが早いです。",
      text: "説明文5",
    },
    {
      imgSrc: "https://react-sakubun-otasuke.vercel.app/images/wantyan4.png",
      altText: "コマワンちゃんポイント４",
      heading:
        "コマワンちゃんのポイント４！<br/>「簡単な言葉を表現ぴったり探しや登場人物の性格を表す言葉から見つけ出そう！」",
      text: "説明文5",
    },
    {
      imgSrc: "https://react-sakubun-otasuke.vercel.app/images/aseru.png",
      altText: "この言葉何回も使っているなぁ",
      heading: "「この言葉何回も使っているなぁ」とKさんは気づきました。",
      text: "説明文5",
    },
    {
      imgSrc:
        "https://react-sakubun-otasuke.vercel.app/images/iikaeniodoroki.png",
      altText: "この言いかえいい！！こんな書き方があるんだ",
      heading: "「この言い換えがいい！！<br/>こんなかきかたがあるんだ」",
      text: "説明文5",
    },
    {
      imgSrc:
        "https://react-sakubun-otasuke.vercel.app/images/sakubunmakasete.png",
      altText: "作文なら任せなさい…！",
      heading:
        "作文を書きなれたKさんは今では「作文ならまかせなさい！」となるまでに成長しました。",
      text: "説明文5",
    },
  ];

  return (
    <div>
      <Tabs />
      <h1>Home</h1>
      <Hero />
      <h3>使い方</h3>
      <div className="container">
        {items.map((item, index) => (
          <div className="set" key={index}>
            <img src={item.imgSrc} alt={item.altText} />
            <h2>{item.heading}</h2>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
