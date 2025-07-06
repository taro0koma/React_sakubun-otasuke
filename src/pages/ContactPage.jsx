import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Tabs from "../component/Tabs";
import ModalFrame from "../component/ModalFrame";
import PreviousAndNext from "../component/PreviousAndNext";
import ChatWithOpenAI from './../component/ChatWithOpenAI';
import NextPageLink from "../component/NextPageLink";
import { Helmet } from "react-helmet-async";
import Footer from "./Footer";
import "./ContactPage.css"

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API_KEY
);

// 環境判定（Local環境の場合はtrueを返す）
const isLocalEnvironment = () => {
  return process.env.NODE_ENV === 'development' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         !process.env.REACT_APP_API_URL;
};

// Local環境用の仮データ
const getMockAIResponse = (option, grade) => {
  const mockResponses = {
    "ほっとした": [
      "1. 安心した",
      "2. 心が軽くなった",
      "3. 肩の荷が下りた",
      "4. 気持ちが楽になった",
      "5. 緊張がほぐれた",
      "6. 心配がなくなった",
      "7. 落ち着いた",
      "8. 平静を取り戻した",
      "9. 穏やかになった",
      "10. リラックスした"
    ],
    "おどろいた": [
      "1. びっくりした",
      "2. 驚愕した",
      "3. 仰天した",
      "4. 呆然とした",
      "5. 目を丸くした",
      "6. 衝撃を受けた",
      "7. 予想外だった",
      "8. 息を飲んだ",
      "9. 度肝を抜かれた",
      "10. 愕然とした"
    ],
    "うれしい": [
      "1. 喜んでいる",
      "2. 楽しい",
      "3. 幸せだ",
      "4. 満足している",
      "5. 心躍る",
      "6. 嬉しくてたまらない",
      "7. 気分が良い",
      "8. 晴れやかだ",
      "9. 喜びに満ちている",
      "10. ウキウキしている"
    ],
    "感激": [
      "1. 感動した",
      "2. 心を打たれた",
      "3. 深く感じ入った",
      "4. 胸が熱くなった",
      "5. 涙が出そうになった",
      "6. 心に響いた",
      "7. 感慨深い",
      "8. 胸がいっぱいになった",
      "9. 心が震えた",
      "10. 魂が揺さぶられた"
    ],
    "こわい": [
      "1. 怖ろしい",
      "2. 恐ろしい",
      "3. 不安だ",
      "4. 震え上がる",
      "5. ぞっとする",
      "6. 身震いがする",
      "7. 恐怖を感じる",
      "8. 背筋が凍る",
      "9. 心臓がドキドキする",
      "10. 足がすくむ"
    ]
  };

  const responses = mockResponses[option] || [
    "1. 該当する言い換えが見つかりません",
    "2. 別の選択肢をお試しください"
  ];

  return responses.join("<br />");
};

const ContactPage = () => {
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

  async function getKimochis(option, grade) {
    setIsLoading(true);
    
    // Local環境の場合は仮データを使用
    if (isLocalEnvironment()) {
      console.log("Local環境のため仮データを使用します");
      const mockResponse = getMockAIResponse(option, grade);
      setAiResponse(mockResponse);
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
        setAiResponse("データの取得に失敗しました。");
        setIsLoading(false);
      } else {
        setKimochis(data);
        if (data.length > 0) {
          const examples = data.map((kimochi) => kimochi.examples).join("\n");
          await fetchAIResponse(option, grade, examples);
        } else {
          setAiResponse("該当するデータが見つかりませんでした。");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("データベースアクセスエラー：", error);
      setAiResponse("データの取得中にエラーが発生しました。");
      setIsLoading(false);
    }
  }

  async function fetchAIResponse(option, grade, examples) {
    const userMessage = `下記の言葉を${option}という意味合いでどんなときにも使える拡張した言葉を10個つくり、それを改行のある1．２．などの表示になるよう箇条書きにしてください。3.〇〇や-〇〇な〇〇-のような当てはめるべきところは当てはめて出力してください。：\n\n${examples}`;
    
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/api/azure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage, gakunen: selectedGrade }),
        mode: 'cors'
      });

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        const formattedData = parsedData.replace(/\n/g, "<br />");
        setAiResponse(formattedData);
      } else {
        console.error("AIのレスポンスの取得に失敗しました。");
        setAiResponse("AIからの回答を取得できませんでした。しばらくしてからもう一度お試しください。");
      }
    } catch (error) {
      console.error("AIのレスポンス取得中にエラーが発生しました：", error);
      setAiResponse("AIとの通信中にエラーが発生しました。ネットワーク接続をご確認ください。");
    } finally {
      setIsLoading(false);
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const honbun = (
    <>
      そんなときは表現ぴったり<br />
      どんな言葉でも回答しているよ<br />
      試しにやってみよう！
    </>
  );

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
        自分の使っている言葉のほかにいいかえを知って、<br />
        気に入るものがあったら、自分の作文に使ってみよう。
      </p>

      {/* Local環境の場合は環境表示 */}
      {isLocalEnvironment() && (
        <div style={{ 
          background: '#ffffcc', 
          padding: '10px', 
          margin: '10px 0', 
          borderRadius: '5px',
          border: '1px solid #ffcc00',
          fontSize: '14px'
        }}>
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
            {isLoading ? "処理中..." : "送信！"}
          </button>
        </form>
        
        {submittedOption && (
          <div className="ai-response-container">
            <h2 className="ai-response-header">
              「<strong>{submittedOption}</strong>」をいいかえてみる！
            </h2>
            {isLoading ? (
              <div className="loading-message">
                かんがえ中だよ💭<br/>ちょっと待ってね。
              </div>
            ) : (
              <div 
                className="ai-response-content"
                dangerouslySetInnerHTML={{ __html: aiResponse.replace(/(\d+\.\s*[^<]*)/g, '<div class="ai-response-item">$1</div>') }}
              />
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