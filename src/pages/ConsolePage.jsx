import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import "../assets/css/index.css";
import Tabs from "../component/Tabs";
import ModalFrame from "../component/ModalFrame";

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
  const adviceRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [randomType, setRandomType] = useState(typesnakami[getRandomInt(typesnakami.length)]);
  const [kakidashis, setKakidashis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
      const { data, error } = await supabase.from('sakubunKakidashi').select('*').eq('types', randomType);
      if (error) {
        console.error('Supabaseデータの取得に失敗しました:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Supabaseデータの取得中にエラーが発生しました:', error);
      return null;
    }
  };

  async function fetchAIResponse(type) {
    setIsAiLoading(true);
    const supabaseData = await fetchSupabaseData();
    const userMessage = `${grades[selectedGrade]}向けに適切な作文の書き出し例を提供してください。ただし、１つに絞ること。また最初のわかりました的なことは言わないこと。とにかく、必要なことのみ述べてください。参考データ: ${JSON.stringify(supabaseData)}`;
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/danraku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        const timestamp = new Date().toLocaleTimeString();
        setAiResponses(prevResponses => [{ response: parsedData, timestamp }, ...prevResponses]);
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
    }, 8000);
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
      <Tabs />
      <h2>書き出しおみくじ</h2>
      <h3>押してね！</h3>
      {isModalOpen && (
        <ModalFrame
          title="書き出しおみくじ"
          text=""
          onClose={handleModalClose}
          imageSrc="/images/kakenaiwan.png"
          midashi="いい作文は書き出しがかっこいい！"
        ></ModalFrame>
      )}
      <img
        ref={myImg}
        src={isBoxClicked ? "/images/omikujiTobidashi.png" : "/images/omikuji.png"}
        alt="おみくじ箱"
        className="omikujibako"
        onClick={handleClickBox}
      />
      <div className={`bokasi ${isFormVisible ? 'show' : ''}`}></div>
      <div ref={whiteBoxRef} className={`white-box ${isFormVisible ? 'show' : ''}`}>
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
                <option key={key} value={key}>{grades[key]}</option>
              ))}
            </select>
            <button type="submit">送信</button>
            {formError && <p style={{ color: "red" }}>学年を選択してください。</p>}
          </form>
        )}
        <button className="close-button" onClick={() => setIsFormVisible(false)}>✖️</button>
      </div>
      <div className="ai-response" ref={adviceRef}>
        {isAiLoading ? (
          <p>読み込み中...</p>
        ) : (
          aiResponses.map((responseObj, index) => (
            <div>
            <div key={index} className="response-box">
              <p>{responseObj.response}</p>
              <span className="timestamp">{responseObj.timestamp}</span>
            </div>
            <br />
            </div>
          ))
        )}



{kakidashis.map((kakidashi) => (
  <div key={kakidashi.id}>
    <h4>{kakidashi.examplesentence}<br/><span className="nakami">-{kakidashi.types}-</span></h4>
  </div>
))}
      </div>
    </div>
  );
};

export default ConsolePage;
