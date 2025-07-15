import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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

// Local環境用の仮データ（文字列形式で返す）
const getMockAIResponse = (option, grade) => {
  const mockResponses = {
    ほっとした: `const answer=["ほっとした","安心した","気が楽になった","心配がなくなった","落ち着いた","安堵した","肩の荷が下りた","緊張がほぐれた","穏やかになった","平和な気持ちになった"];`,
    おどろいた: `const answer=["おどろいた","びっくりした","驚愕した","衝撃を受けた","仰天した","目を丸くした","度肝を抜かれた","驚嘆した","呆気にとられた","唖然とした"];`,
    うれしい: `const answer=["うれしい","喜んだ","幸せな気持ち","満足した","楽しい","心が弾む","嬉しくてたまらない","喜びに満ちた","わくわくする","心が躍る"];`,
    感激: `const answer=["感激した","感動した","心を打たれた","胸が熱くなった","涙が出そうになった","深く感じ入った","心に響いた","魂が震えた","感慨深い","心が震えた"];`,
    こわい: `const answer=["こわい","恐ろしい","怖くてたまらない","ゾッとした","身震いした","不安になった","恐怖を感じた","背筋が寒くなった","びくびくした","怖がった"];`,
  };

  return mockResponses[option] || `const answer=["該当する言い換えが見つかりません","別の選択肢をお試しください"];`;
};

const ContactPage = () => {
  const { t } = useTranslation();
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

  const selectList = {
    "ほっとした":t("contact.formSelect1Option1"),
    "おどろいた":t("contact.formSelect1Option2"),
    "うれしい":t("contact.formSelect1Option3"),
    "感激":t("contact.formSelect1Option4"),
    "こわい":t("contact.formSelect1Option5"),
  }

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
        
        return lines.length > 0 ? lines : [t('contact.errorParse')];
      } catch (fallbackError) {
        console.error("代替解析もエラー:", fallbackError);
        return [t('contact.errorParse')];
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
      const mockResponseString = getMockAIResponse(option, grade);
      console.log("Mock AI Response:", mockResponseString);
      
      // 文字列を配列に変換
      const resultArray = parseAIResponse(mockResponseString);
      console.log("解析結果:", resultArray);
      
      setDataArray(resultArray);
      // アニメーション開始
      setTimeout(() => {
        setVisibleRows(resultArray.length);
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
        setDataArray([t('contact.errorFetch')]);
        setIsLoading(false);
      } else {
        setKimochis(data);
        if (data.length > 0) {
          const examples = data.map((kimochi) => t("language")=="ja"?kimochi.examples_ja:(t("language")=="en"? kimochi.examples_en:kimochi.examples_zh)).join("\n");
          console.log(`データベースの中身${examples}`);
          await fetchAIResponse(option, grade, examples);
        } else {
          setDataArray([t('contact.errorNoData')]);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("データベースアクセスエラー：", error);
      setDataArray([t('contact.errorAccess')]);
      setIsLoading(false);
    }
  }

  async function fetchAIResponse(option, grade, examples) {
    console.log(`データベースの中身${examples}`);
    const userMessage = `${t("contact.prompt",{option:selectList[option]})}：\n\n${examples}`;
    console.log(`プロンプト：${userMessage}`)

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
        setDataArray([t('contact.errorAIResponse')]);
      }
    } catch (error) {
      console.error("AIのレスポンス取得中にエラーが発生しました：", error);
      setDataArray([t('contact.errorAIComm')]);
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
        <title>{t('contact.helmet')}</title>
      </Helmet>

      <Tabs pageTitle={t('contact.title')} contents="kimoti" />

      {isModalOpen && (
        <ModalFrame
          title={t('contact.modalTitle')}
          text={t('contact.modalText')}
          onClose={handleModalClose}
          imageSrc="/images/dousiyowan.png"
        />
      )}

      <p className="intro-text">
        {t('contact.introText1')}
        <br />
        {t('contact.introText2')}
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
          <strong>{t('contact.devMode')}</strong>
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="dropdownOption" className="form-label">
              {t('contact.formLabel1')}
            </label>
            <select
              id="dropdownOption"
              value={selectedOption}
              onChange={handleChangeOption}
              className="form-select"
              required
            >
              <option value="">{t('contact.formSelect1Default')}</option>
              <option value="ほっとした">{t('contact.formSelect1Option1')}</option>
              <option value="おどろいた">{t('contact.formSelect1Option2')}</option>
              <option value="うれしい">{t('contact.formSelect1Option3')}</option>
              <option value="感激">{t('contact.formSelect1Option4')}</option>
              <option value="こわい">{t('contact.formSelect1Option5')}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dropdownGrade" className="form-label">
              {t('contact.formLabel2')}
            </label>
            <select
              id="dropdownGrade"
              value={selectedGrade}
              onChange={handleChangeGrade}
              className="form-select"
              required
            >
              <option value="">{t('contact.formSelect2Default')}</option>
              <option value="s1">{t('contact.formSelect2Option1')}</option>
              <option value="s2">{t('contact.formSelect2Option2')}</option>
              <option value="s3">{t('contact.formSelect2Option3')}</option>
              <option value="s4">{t('contact.formSelect2Option4')}</option>
              <option value="s5">{t('contact.formSelect2Option5')}</option>
              <option value="s6">{t('contact.formSelect2Option6')}</option>
              <option value="t1">{t('contact.formSelect2Option7')}</option>
              <option value="t2">{t('contact.formSelect2Option8')}</option>
              <option value="t3">{t('contact.formSelect2Option9')}</option>
              <option value="k1">{t('contact.formSelect2Option10')}</option>
              <option value="k2">{t('contact.formSelect2Option11')}</option>
              <option value="k3">{t('contact.formSelect2Option12')}</option>
              <option value="oldPeople">{t('contact.formSelect2Option13')}</option>
            </select>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? t('contact.submitButtonLoading') : t('contact.submitButton')}
          </button>
        </form>

        {submittedOption && (
          <div className="ai-response-container">
            <h2 className="ai-response-header">
              {t('contact.responseHeader', { submittedOption:submittedOption })}
            </h2>
            {isLoading ? (
              <div className="loading-message" dangerouslySetInnerHTML={{ __html: t('contact.loadingMessage') }} />
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