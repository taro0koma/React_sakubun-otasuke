import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import "../assets/css/index.css";
import Tabs from "../component/Tabs";
import ModalFrame from "../component/ModalFrame";
import AnimationKomawanPage from "./AnimationKomawanPage";
import { Helmet } from "react-helmet-async";
import NextPageLink from "../component/NextPageLink";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API_KEY
);

const grades = {
  s1: "小学1年生",
  s2: "小学2年生",
  s3: "小学3年生",
  s4: "小学4年生",
  s5: "小学5年生",
  s6: "小学6年生",
  t1: "中学1年生",
  t2: "中学2年生",
  t3: "中学3年生",
  k1: "高校1年生",
  k2: "高校2年生",
  k3: "高校3年生",
};

// const sakkamei = {
//   s1: "松谷みよ子",
//   s2: "あんびるやすこ",
//   s3: "安西水丸",
//   s4: "角野栄子",
//   s5: "ヨシタケシンスケ",
//   s6: "宮沢賢治",
//   t1: "重松清",
//   t2: "森絵都",
//   t3: "住野よる",
//   k1: "小川洋子",
//   k2: "梨木香歩",
//   k3: "あさのあつこ",
// };
//⇑まだ文を比べて並び替えしてないから仮として
const typesnakami = [
  "この本を選んだ理由を、行動に例える",
  "自分の意見から入る",
  "この本を選んだ理由",
  "疑問から入る",
  "自分の経験から入る",
  "本を取ったきっかけ",
  "自分の気持ちから入る",
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const ConsolePage = () => {
  const myImg = useRef();
  const whiteBoxRef = useRef();
  const adviceRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [randomType, setRandomType] = useState(
    typesnakami[getRandomInt(typesnakami.length)]
  );
  const [kakidashis, setKakidashis] = useState([]);
  const [aiResponses, setAiResponses] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [formError, setFormError] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isBoxClicked, setIsBoxClicked] = useState(false);

  useEffect(() => {
    // 初期表示時に必要なデータを取得
  }, []);

  const fetchSupabaseData = async () => {
    try {
      const { data, error } = await supabase
        .from("sakubunKakidashi")
        .select("*")
        .eq("types", randomType);
      if (error) {
        console.error("Supabaseデータの取得に失敗しました:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Supabaseデータの取得中にエラーが発生しました:", error);
      return null;
    }
  };

  async function fetchAIResponse(type) {
    setIsAiLoading(true);
    const supabaseData = await fetchSupabaseData();
    const userMessage = `${
      grades[selectedGrade]
    }向けに適切な作文の書き出し例を提供してください。ただし、1つに絞ること。また最初のわかりました的なことは言わないこと。とにかく、必要なことのみ述べてください。あくまで参考として渡します。同じものを返えすことは許されません！参考データ（実際にはこの中にある〇〇が書かれている文章の〇〇に文字を入れる形で回答してください）: ${JSON.stringify(
      supabaseData
    )}`;
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/api/azure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage,gakunen:selectedGrade }),
      });

      if (response.ok) {
        console.log(userMessage,selectedGrade);
        const data = await response.json();
        const parsedData = data.bot.trim();
        const timestamp = new Date().toLocaleTimeString();
        setAiResponses((prevResponses) => [
          {
            response: parsedData,
            types: type,
            examplesentence: supabaseData[0]?.examplesentence || "",
            header: supabaseData[0]?.header || "",
            timestamp,
          },
          ...prevResponses,
        ]);
      } else {
        console.error("AIのレスポンスの取得に失敗しました。");
      }
    } catch (error) {
      console.error("AIのレスポンス取得中にエラーが発生しました：", error);
    }
    setIsAiLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGrade) {
      setFormError(true);
      return;
    }
    setFormError(false);
    setIsFormVisible(false);
    await fetchAIResponse(randomType);
    whiteBoxRef.current.classList.remove("show");
    setIsBoxClicked(true); // 画像変更のための状態更新
    triggerLightAnimation(); // 黄色い光のアニメーションをトリガー

    setTimeout(() => {
      adviceRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  };

  const handleClickBox = () => {
    const newRandomType = typesnakami[getRandomInt(typesnakami.length)];
    setRandomType(newRandomType); // 毎回ランダムタイプを設定
    setIsFormVisible(true);
    whiteBoxRef.current.classList.add("show");

    setTimeout(() => {
      adviceRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const triggerLightAnimation = () => {
    myImg.current.classList.add("light-animate");
    setTimeout(() => {
      myImg.current.classList.remove("light-animate");
      setIsBoxClicked(false); // アニメーション後に画像を元に戻す
    }, 8000); // アニメーションの時間に合わせて調整
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (kakidashis.length > 0) {
      adviceRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [kakidashis]);

  return (
    <div>
      <Helmet><title>かっこいい書き出しおみくじ | 作文おたすけアプリ</title></Helmet>
      <Tabs pageTitle="かっこいい書き出しおみくじ" contents="kakidashi"/>
      <h3 className="setumei">
        おみくじ箱をクリックして、
        <br />
        かっこいい書き出しを発見！
      </h3>
      {isModalOpen && (
        <ModalFrame
          title="かっこいい書き出しおみくじ"
          text="どうやったらかっこいい書き出しになるのかわからない・・・そんな時はおみくじをつかってお気に入りの書き出しを見つけよう。自分の作文に合わせた言葉が変えられるように例文もついているよ。"
          onClose={handleModalClose}
          imageSrc="/images/kakenaiwan.png"
          midashi="作文の書き出しがかっこいいとなんかうれしい"
        ></ModalFrame>
      )}
      <img
        ref={myImg}
        src={
          isBoxClicked ? "/images/omikujiTobidashi.png" : "/images/omikuji.png"
        }
        alt="おみくじ箱"
        className="omikujibako"
        onClick={handleClickBox}
      />
      <div className={`bokasi ${isFormVisible ? "show" : ""}`}></div>
      <div
        ref={whiteBoxRef}
        className={`white-box ${isFormVisible ? "show" : ""}`}
      >
        <p>学年を選んでね！</p>
        {isFormVisible && (
          <form onSubmit={handleSubmit} className="grade-form">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              style={{ border: formError ? "2px solid red" : "1px solid #ccc" }}
              required
            >
              <option value="">学年を選んでね！</option>
              {Object.keys(grades).map((key) => (
                <option key={key} value={key}>
                  {grades[key]}
                </option>
              ))}
            </select>
            <button type="submit">送信</button>
            {formError && (
              <p style={{ color: "red" }}>学年を選択してください。</p>
            )}
          </form>
        )}
        <button
          className="close-button"
          onClick={() => setIsFormVisible(false)}
        >
          ✖️
        </button>
      </div>
      <div className="ai-response" ref={adviceRef}>
        {isAiLoading ? (
          <div className="LoadingSvg yomikomihyougen">
            <div className="svgtoka"><AnimationKomawanPage/></div>
            
            <h2>SAKUBUN OTASUKE</h2>
            <p>読み込み中...</p>
          </div>
        ) : (
          aiResponses.map((responseObj, index) => (
            <div>
              <div key={index} className="response-box">
                
                <div className="response-type-tab">{responseObj.types}</div>
                <div className="sakubunyosi">
                  <div style={{ padding: "10px", marginLeft: "10px" }}>
                    <div className="sakubun" contenteditable="true">
                      <p>{"\u3000" + responseObj.header}</p>
                    </div>
                  </div>
                </div>
                <div className="response-content-tab">
                  <div className="balloon1">
                    <p>
                      たと
                      <br />
                      えば
                    </p>
                  </div>
                  <ul className="kajougaki" style={{textAlign:"left"}}>
                    <li className="example-sentencee">
                      {responseObj.examplesentence}
                    </li>
                    <li className="response-content">{responseObj.response}</li>
                  </ul>
                  <span className="timestamp">{responseObj.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
        {kakidashis.length === 0 && !isAiLoading && <p></p>}
      </div>
      <NextPageLink imairu="kakidashi1"/>
    </div>
  );
};

export default ConsolePage;