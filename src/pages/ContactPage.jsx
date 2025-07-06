import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Tabs from "../component/Tabs";
import ModalFrame from "../component/ModalFrame";
import PreviousAndNext from "../component/PreviousAndNext";
import ChatWithOpenAI from "./../component/ChatWithOpenAI";
import NextPageLink from "../component/NextPageLink";
import { Helmet } from "react-helmet-async";
import Footer from "./Footer";
import "./ContactPage.css";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API_KEY
);

// 環境判定（Local環境の場合はtrueを返す）
const isLocalEnvironment = () => {
  return (
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    !process.env.REACT_APP_API_URL
  );
};

// Local環境用の仮データ
const getMockAIResponse = (option, grade) => {
  const mockResponses = {
    ほっとした: [
      `const answer=["a","b","c","d","e","a","a","a","a","a",]`,
    ],
    おどろいた: [
      `const answer=["a","b","c","d","e","a","a","a","a","a",]`
    ],
    うれしい: [
      `const answer=["a","b","c","d","e","a","a","a","a","a",]`
    ],
    感激: [
      `const answer=["a","b","c","d","e","a","a","a","a","a",]`
    ],
    こわい: [
      `const answer=["a","b","c","d","e","a","a","a","a","a",]`
    ],
  };

  return mockResponses[option] || [
    "該当する言い換えが見つかりません",
    "別の選択肢をお試しください",
  ];
};

const ContactPage = () => {
  const [dataArray, setDataArray] = useState([]);
  const [visibleRows, setVisibleRows] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [submittedOption, setSubmittedOption] = useState("");
  const [submittedGrade, setSubmittedGrade] = useState("");
  const [kimochis, setKimochis] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeOption = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleChangeGrade = (e) => {
    setSelectedGrade(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedOption(selectedOption);
    setSubmittedGrade(selectedGrade);
    getKimochis(selectedOption, selectedGrade);
  };

  // JSON文字列を配列に変換する関数
  const parseAIResponse = (responseString) => {
    try {
      // 様々なパターンのJSON文字列に対応
      let cleanedString = responseString.trim();
      
      // const answer = []; の形式の場合
      const constMatch = cleanedString.match(/const\s+answer\s*=\s*(\[.*?\]);?/s);
      if (constMatch) {
        cleanedString = constMatch[1];
      }
      
      // [] で囲まれた配列の場合
      const arrayMatch = cleanedString.match(/\[(.*?)\]/s);
      if (arrayMatch) {
        cleanedString = arrayMatch[0];
      }
      
      // JSON.parseで解析
      const parsed = JSON.parse(cleanedString);
      
      if (Array.isArray(parsed)) {
        return parsed;
      } else {
        throw new Error("配列ではありません");
      }
    } catch (error) {
      console.error("JSON解析エラー:", error);
      
      // JSON解析に失敗した場合、文字列から配列を抽出する代替方法
      try {
        // 行ごとに分割して配列を作成
        const lines = responseString.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => {
            // 番号付きの行を処理 (例: "1. 安心した")
            const match = line.match(/^\d+\.\s*(.+)$/);
            if (match) {
              return match[1];
            }
            // クォートを除去
            return line.replace(/^["']|["']$/g, '');
          });
        
        return lines.length > 0 ? lines : ["データの解析に失敗しました"];
      } catch (fallbackError) {
        console.error("代替解析もエラー:", fallbackError);
        return ["データの解析に失敗しました"];
      }
    }
  };

  async function getKimochis(option, grade) {
    setIsLoading(true);
    setDataArray([]); // 前回の結果をクリア
    setVisibleRows(0); // アニメーションをリセット

    // Local環境の場合は仮データを使用
    if (isLocalEnvironment()) {
      console.log("Local環境のため仮データを使用します");
      const mockResponse = getMockAIResponse(option, grade);
      setDataArray(mockResponse);
      // アニメーション開始
      setTimeout(() => {
        setVisibleRows(mockResponse.length);
      }, 100);
      setIsLoading(false);
      return;
    }

    // 本番環境の場合は実際のSupabaseからデータを取得
    try {
      let { data, error } = await supabase
        .from("sakubunKimochi")
        .select("*")
        .eq("types", option);

      if (error) {
        console.error("フェッチでエラーが発生しました：", error);
        setDataArray(["データの取得に失敗しました。"]);
        setIsLoading(false);
      } else {
        setKimochis(data);
        if (data.length > 0) {
          const examples = data.map((kimochi) => kimochi.examples).join("\n");
          await fetchAIResponse(option, grade, examples);
        } else {
          setDataArray(["該当するデータが見つかりませんでした。"]);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("データベースアクセスエラー：", error);
      setDataArray(["データの取得中にエラーが発生しました。"]);
      setIsLoading(false);
    }
  }

  async function fetchAIResponse(option, grade, examples) {
    const userMessage = `下記の言葉を${option}という意味合いでどんなときにも使える拡張した言葉を10個つくり、const answer=[];の形式で日本語の値のみの配列を記載してください。3.〇〇や-〇〇な〇〇-のような当てはめるべきところは当てはめて出力してください。：\n\n${examples}`;

    try {
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
        const data = await response.json();
        const parsedData = data.bot.trim();
        
        console.log("AIレスポンス:", parsedData);
        
        // JSON文字列を配列に変換
        const resultArray = parseAIResponse(parsedData);
        
        console.log("解析結果:", resultArray);
        
        setDataArray(resultArray);
        
        // アニメーション開始
        setTimeout(() => {
          setVisibleRows(resultArray.length);
        }, 100);
        
      } else {
        console.error("AIのレスポンスの取得に失敗しました。");
        setDataArray([
          "AIからの回答を取得できませんでした。しばらくしてからもう一度お試しください。"
        ]);
      }
    } catch (error) {
      console.error("AIのレスポンス取得中にエラーが発生しました：", error);
      setDataArray([
        "AIとの通信中にエラーが発生しました。ネットワーク接続をご確認ください。"
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // アニメーション効果のためのuseEffect
  React.useEffect(() => {
    if (dataArray.length > 0 && visibleRows < dataArray.length) {
      const timer = setTimeout(() => {
        setVisibleRows(prev => Math.min(prev + 1, dataArray.length));
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [dataArray, visibleRows]);

  //HTML------------------------------------------------------------------
  return (
    <div className="contact-container">
      {/* Noise animation background */}
      <div className="noise-background"></div>

      <Helmet>
        <title>気持ちや感想のいいかえ | 作文おたすけアプリ</title>
      </Helmet>

      <Tabs pageTitle="気持ちや感想のいいかえ" contents="kimoti" />

      {isModalOpen && (
        <ModalFrame
          title="気持ちや感想のいいかえの使い方"
          text="「気持ちや感想のいいかえ」で、 どんないいかえ かをを知ることができます。自分の書いてみた文章の中にいいかえてみたい言葉はありますか？"
          onClose={handleModalClose}
          imageSrc="/images/dousiyowan.png"
        />
      )}

      <p className="intro-text">
        自分の使っている言葉のほかにいいかえを知って、
        <br />
        気に入るものがあったら、自分の作文に使ってみよう。
      </p>

      {/* Local環境の場合は環境表示 */}
      {isLocalEnvironment() && (
        <div
          style={{
            background: "#ffffcc",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ffcc00",
            fontSize: "14px",
          }}
        >
          <strong>開発環境モード:</strong> 仮データを使用しています
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="dropdownOption" className="form-label">
              知りたい気持ち・感想はなにか選んでね！
            </label>
            <select
              id="dropdownOption"
              value={selectedOption}
              onChange={handleChangeOption}
              className="form-select"
              required
            >
              <option value="">気持ちや感想を選択してね</option>
              <option value="ほっとした">ほっとした</option>
              <option value="おどろいた">おどろいた</option>
              <option value="うれしい">うれしい</option>
              <option value="感激">感激</option>
              <option value="こわい">こわい</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dropdownGrade" className="form-label">
              あなたは何年生ですか？
            </label>
            <select
              id="dropdownGrade"
              value={selectedGrade}
              onChange={handleChangeGrade}
              className="form-select"
              required
            >
              <option value="">学年を選択してね</option>
              <option value="s1">小学1年生</option>
              <option value="s2">小学2年生</option>
              <option value="s3">小学3年生</option>
              <option value="s4">小学4年生</option>
              <option value="s5">小学5年生</option>
              <option value="s6">小学6年生</option>
              <option value="t1">中学1年生</option>
              <option value="t2">中学2年生</option>
              <option value="t3">中学3年生</option>
              <option value="k1">高校1年生</option>
              <option value="k2">高校2年生</option>
              <option value="k3">高校3年生</option>
              <option value="oldPeople">大人</option>
            </select>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "かんがえ中" : "送信！"}
          </button>
        </form>

        {submittedOption && (
          <div className="ai-response-container">
            <h2 className="ai-response-header">
              「<strong>{submittedOption}</strong>」をいいかえてみる！
            </h2>
            {isLoading ? (
              <div className="loading-message">
                かんがえ中だよ💭
                <br />
                ちょっと待ってね。
              </div>
            ) : (
              <div className="ai-response-content">
                {dataArray.map((item, index) => (
                  <div 
                    key={index}
                    className={`ai-response-item ${index < visibleRows ? 'visible' : ''}`}
                    style={{
                      opacity: index < visibleRows ? 1 : 0,
                      transform: index < visibleRows ? 'translateY(0)' : 'translateY(10px)',
                      transition: `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="spacer"></div>
      <NextPageLink imairu="kimochi1" />
      <br />
      <Footer />
    </div>
  );
};

export default ContactPage;