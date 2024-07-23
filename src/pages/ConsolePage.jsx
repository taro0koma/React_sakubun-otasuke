import Tabs from "../component/Tabs";
import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import "../assets/css/index.css"; // CSSファイルをインポート

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API_KEY,
);

const gradeJapan = {
  s1: "小学１年生",
  s2: "小学２年生",
  s3: "小学３年生",
  s4: "小学４年生",
  s5: "小学５年生",
  s6: "小学６年生",
  t1: "中学１年生",
  t2: "中学２年生",
  t3: "中学３年生",
  k1: "高校１年生",
  k2: "高校２年生",
  k3: "高校３年生",
};

const typesnakami = [
  "この本を選んだ理由を、行動に例える",
  "自分の意見から入る",
  "この本を選んだ理由",
  "疑問から入る",
  "自分の経験から入る",
  "本を取ったきっかけ",
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const ConsolePage = () => {
  const myImg = useRef();
  const whiteBoxRef = useRef();
  const [kakidashis, setKakidashis] = useState([]);
  const [randomType, setRandomType] = useState(typesnakami[getRandomInt(typesnakami.length)]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getKakidashis();
  }, [randomType]);

  async function getKakidashis() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("sakubunKakidashi")
      .select('*')
      .eq('types', randomType);

    if (error) {
      console.error("フェッチでエラーが発生しました：", error);
    } else {
      setKakidashis(data);
    }
    setIsLoading(false);
  }

  const clickListener = async (e) => {
    const newRandomType = typesnakami[getRandomInt(typesnakami.length)];
    setRandomType(newRandomType);

    myImg.current.src = "/images/omikujiTobidashi.png";
    myImg.current.classList.add("img-animate"); // アニメーションのクラスを追加
    whiteBoxRef.current.classList.add("show"); // 白い四角を表示

    setTimeout(() => {
      myImg.current.classList.remove("img-animate"); // アニメーションのクラスを削除
    }, 3000); // アニメーションの持続時間に合わせる

    setTimeout(() => {
      myImg.current.src = "/images/omikuji.png";
      whiteBoxRef.current.classList.remove("show"); // 白い四角を非表示
    }, 3000); // 1秒後に再読み込み
  };

  useEffect(() => {
    const imgElm = myImg.current;
    if (imgElm) {
      imgElm.addEventListener("click", clickListener);
    }

    return () => {
      if (imgElm) {
        imgElm.removeEventListener("click", clickListener);
      }
    };
  }, [kakidashis]);

  return (
    <div>
      <Tabs />
      <h2>書き出しおみくじ</h2>
      <h6>押してね！</h6>
      <img ref={myImg} src="/images/omikuji.png" alt="おみくじ箱" />
      <div ref={whiteBoxRef} className="white-box">
      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        kakidashis.map((kakidashi) => (
          <div key={kakidashi.id}>
            <h4>{kakidashi.examplesentence}</h4>
            <p style={{fontSize:15}}>{kakidashi.types}</p>
          </div>
        ))
      )}
      </div>
      <button onClick={clickListener}>もう一回行って</button>
    </div>
  );
};

export default ConsolePage;
