import Tabs from "../component/Tabs";
import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import "../assets/css/index.css"; // CSSファイルをインポート
import ModalFrame from "../component/ModalFrame";

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
  const [isModalOpen, setIsModalOpen] = useState(true);
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
    }, 8000); // アニメーションの持続時間に合わせる

    setTimeout(() => {
      myImg.current.src = "/images/omikuji.png";
      whiteBoxRef.current.classList.remove("show"); // 白い四角を非表示
    }, 8000);
  };

  const clickmouikkai = async (e) => {
    myImg.current.src = "/images/omikujiTobidashi.png";
    myImg.current.classList.add("img-animate"); // アニメーションのクラスを追加
    whiteBoxRef.current.classList.add("show"); // 白い四角を表示

    setTimeout(() => {
      myImg.current.classList.remove("img-animate"); // アニメーションのクラスを削除
    }, 8000); // アニメーションの持続時間に合わせる

    setTimeout(() => {
      myImg.current.src = "/images/omikuji.png";
      whiteBoxRef.current.classList.remove("show"); // 白い四角を非表示
    }, 8000);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleModuleOpen = () => {
    setIsModalOpen(true);
  }

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
      {isModalOpen && (
        <ModalFrame
          title="書き出しおみくじ"
          text=""
          onClose={handleModalClose}
          imageSrc="/images/kakenaiwan.png"
          midashi="いい作文は書き出しがかっこいい！"
        ></ModalFrame>
      )}
      <h6>箱をクリックしてね👇</h6>
      <img ref={myImg} src="/images/omikuji.png" alt="おみくじ箱" className="omikujibako"/>
      <div ref={whiteBoxRef} className="white-box">
      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        kakidashis.map((kakidashi) => (
          <div key={kakidashi.id}>
            <h4>{kakidashi.examplesentence}<br/><span className="nakami">-{kakidashi.types}-</span></h4>
          </div>
        ))
      )}
      </div>
      <button onClick={clickmouikkai}>もういっかい</button>
    </div>
  );
};

export default ConsolePage;
