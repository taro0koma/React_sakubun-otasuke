import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import "../assets/css/index.css";
import Tabs from "../component/Tabs";
import ModalFrame from "../component/ModalFrame";
import AnimationKomawanPage from "./AnimationKomawanPage";
import { Helmet } from "react-helmet-async";
import NextPageLink from "../component/NextPageLink";
import Footer from "./Footer";

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

// 読書感想文専用の書き出しタイプ
const bookOnlyTypes = [
  "この本を選んだ理由を、行動に例える",
  "この本を選んだ理由",
  "本を取ったきっかけ",
  "自分の気持ちからはじめる",
];

// 作文・読書感想文共通の書き出しタイプ
const commonTypes = [
  "自分の意見からはじめる",
  "疑問からはじめる",
  "セリフからはじめる",
  "自分の経験からはじめる",
  "例えからはじめる",
  "音からはじめる",
  "物語のようにはじめる",
];

// 全ての書き出しタイプ(読書感想文用)
const allTypes = [...commonTypes, ...bookOnlyTypes];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// 作文の種類に応じて適切な書き出しタイプを取得
function getRandomTypeForCategory(isBookReview) {
  const availableTypes = isBookReview ? allTypes : commonTypes;
  return availableTypes[getRandomInt(availableTypes.length)];
}

const ConsolePage = () => {
  const myImg = useRef();
  const whiteBoxRef = useRef();
  const adviceRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [randomType, setRandomType] = useState("");
  const [kakidashis, setKakidashis] = useState([]);
  const [aiResponses, setAiResponses] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isBook, setIsBook] = useState("");
  const [formError, setFormError] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isBoxClicked, setIsBoxClicked] = useState(false);

  useEffect(() => {
    // 初期表示時に必要なデータを取得
  }, []);

  const fetchSupabaseData = async () => {
    try {
      // 1. まずベースとなるクエリを変数に入れる
      let query = supabase
        .from("sakubunKakidashi")
        .select("*")
        .eq("types", randomType);

      // 2. 条件(isBookが"true")に一致する場合のみ .eq() を追加
      if (isBook === "true") {
        query = query.eq("is_bookReview", true);
      } else {
        query = query.eq("is_bookReview", false);
      }

      // 3. 最後に await して実行する
      const { data, error } = await query;

      if (error) {
        console.error("Supabaseデータの取得に失敗しました:", error);
        throw new Error("Supabaseデータの取得に失敗しました");
      }

      // データが空の場合のチェック
      if (!data || data.length === 0) {
        console.error("該当するデータが見つかりませんでした");
        throw new Error("該当するデータが見つかりませんでした");
      }

      console.log("取得したデータ:", data);
      return data;
      
    } catch (error) {
      console.error("Supabaseデータの取得中にエラーが発生しました:", error);
      throw error; // エラーを上位に伝播
    }
  };

  async function fetchAIResponse(type) {
    setIsAiLoading(true);
    
    try {
      // Supabaseデータの取得を確実に待つ
      const supabaseData = await fetchSupabaseData();
      
      // データが正しく取得できたかチェック
      if (!supabaseData || supabaseData.length === 0) {
        console.error("Supabaseデータが空です");
        alert("データの取得に失敗しました。もう一度お試しください。");
        setIsAiLoading(false);
        return;
      }

      const userMessage = `${
        grades[selectedGrade]
      }向けに適切な作文の書き出し例を提供してください。ただし、1つに絞ること。また最初のわかりました的なことは言わないこと。とにかく、必要なことのみ述べてください。あくまで参考として渡します。同じものを返えすことは許されません!参考データ(実際にはこの中にある〇〇が書かれている文章の〇〇に文字を入れる形で回答してください): ${JSON.stringify(
        supabaseData
      )}`;

      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/azure",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userMessage, gakunen: selectedGrade }),
          mode: "cors",
        }
      );

      if (response.ok) {
        console.log("送信したメッセージ:", userMessage, "学年:", selectedGrade);
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
        alert("AIの応答取得に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("AIのレスポンス取得中にエラーが発生しました:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsAiLoading(false);
    }
  }

  const handleSubmit = async () => {
    console.log("選択された学年:", selectedGrade, "作文の種類:", isBook,"ランダムタイプ:",randomType);
    
    // 両方の項目が選択されているかチェック
    if (!selectedGrade || !isBook) {
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
    // まだ作文の種類が選択されていない場合は共通タイプから選択
    // 既に選択されている場合はそれに応じたタイプを選択
    let newRandomType;
    if (isBook === "true") {
      newRandomType = getRandomTypeForCategory(true);
    } else if (isBook === "false") {
      newRandomType = getRandomTypeForCategory(false);
    } else {
      // まだ選択されていない場合は共通タイプから選択
      newRandomType = commonTypes[getRandomInt(commonTypes.length)];
    }
    
    setRandomType(newRandomType);
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
      <Helmet>
        <title>かっこいい書き出しおみくじ | 作文おたすけアプリ</title>
      </Helmet>
      <Tabs pageTitle="かっこいい書き出しおみくじ" contents="kakidashi" />
      <h3 className="setumei">
        おみくじ箱をクリックして、
        <br />
        かっこいい書き出しを発見!
      </h3>

      {isModalOpen && (
        <div className="saisyonihyouzisuruhurothinghuremu">
          <ModalFrame
            title="かっこいい書き出しおみくじ"
            text="どうやったらかっこいい書き出しになるのかわからない・・・そんな時はおみくじをつかってお気に入りの書き出しを見つけよう。自分の作文に合わせた言葉が変えられるように例文もついているよ。"
            onClose={handleModalClose}
            imageSrc="/images/kakenaiwan.png"
            midashi="作文の書き出しがかっこいいとなんかうれしい"
          ></ModalFrame>
        </div>
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
        style={{margin:"auto"}}
      >
        {isFormVisible && (
          <div className="grade-form">
            <p>学年を選んでね!</p>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              style={{ border: formError && !selectedGrade ? "2px solid #ff9494" : "1px solid #ccc" }}
            >
              <option value="">学年を選んでね!</option>
              {Object.keys(grades).map((key) => (
                <option key={key} value={key}>
                  {grades[key]}
                </option>
              ))}
            </select>

            <p>作文の種類を選んでね!</p>
            <select
              value={isBook}
              onChange={(e) => {
                const newIsBook = e.target.value;
                setIsBook(newIsBook);
                // 作文の種類が変更されたら、適切なランダムタイプを再設定
                if (newIsBook === "true") {
                  setRandomType(getRandomTypeForCategory(true));
                } else if (newIsBook === "false") {
                  setRandomType(getRandomTypeForCategory(false));
                }
              }}
              style={{ border: formError && !isBook ? "2px solid #ff9494" : "1px solid #ccc" }}
            >
              <option value="">作文の種類を選んでね!</option>
              <option value="true">読書感想文</option>
              <option value="false">作文</option>
            </select>
            
            {formError && (
              <p style={{ color: "#ff9494" }}>
                学年と作文の種類どちらも選択してください。
              </p>
            )}
            
            <button type="button" onClick={handleSubmit}>送信</button>
          </div>
        )}
        <button
          className="close-button"
          onClick={() => {
            setIsFormVisible(false);
            whiteBoxRef.current.classList.remove("show");
          }}
        >
          ✖️
        </button>
      </div>
      <div className="ai-response" ref={adviceRef}>
        {isAiLoading ? (
          <div className="LoadingSvg yomikomihyougen">
            <div className="svgtoka">
              <AnimationKomawanPage />
            </div>

            <h2>SAKUBUN OTASUKE</h2>
            <p>読み込み中...</p>
          </div>
        ) : (
          aiResponses.map((responseObj, index) => (
            <div key={index}>
              <div className="response-box">
                <div className="response-type-tab">{responseObj.types}</div>
                <div className="sakubunyosi">
                  <div style={{ padding: "10px", marginLeft: "10px" }}>
                    <div className="sakubun" contentEditable="true">
                      <p style={{textAlign:"left"}}>{"\u3000" + responseObj.header}</p>
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
                  <ul className="kajougaki" style={{ textAlign: "left" }}>
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
      <NextPageLink imairu="kakidashi1" />
      <Footer />
    </div>
  );
};

export default ConsolePage;