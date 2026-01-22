import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import ModalFrame from './../../component/ModalFrame';
import AnimationKomawanPage from './../AnimationKomawanPage';
import DanrakuCard from "../../component/DanrakuCard";

const DanrakuKumitatePage = () => {
  const { t } = useTranslation();

  const copyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard:", textToCopy);
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [dataArray, setDataArray] = useState([]);
  const regex = /\[([\s\S]*?)\]/;
  const [messages, setMessage] = useState("");
  const [visibleRows, setVisibleRows] = useState(0);
  const [loading, setLoading] = useState([]);
  const [showDanrakuCards, setShowDanrakuCards] = useState(false);
  const [currentSensei, setCurrentSensei] = useState(" ");

  const chatContainerRef = useRef(null);

  // Markdown形式の太字をHTMLに変換する関数
  const convertMarkdownBold = (text) => {
    // **text** を <strong>text</strong> に変換
    let converted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // *text* を <strong>text</strong> に変換（**の変換後に実行）
    converted = converted.replace(/\*(.+?)\*/g, '<strong>$1</strong>');
    return converted;
  };

  // APIを呼び出す関数
  const callAPI = async (formData) => {
    let userMessage = "";

    // タイプに応じてプロンプトを作成
    if (formData.type === "composition") {
      userMessage = t('danraku.compositionPrompt', {
        sTheme: formData.responses.sTheme,
        type: t('danraku.typeComposition'),
        grade: t('zinbutsu.' + formData.grade),
        sFirst: formData.responses.sFirst,
        sSecond: formData.responses.sSecond,
        sThird: formData.responses.sThird,
        sFo: formData.responses.sFo,
        sensei: formData.sensei,
      });
    } else if (formData.type === "bookReview") {
      userMessage = t('danraku.bookReviewPrompt', {
        type: t('danraku.typeBookReview'),
        grade: t('zinbutsu.' + formData.grade),
        bookReviewFirst: formData.responses.bookReviewFirst,
        bookReviewSecond: formData.responses.bookReviewSecond,
        bookReviewThird: formData.responses.bookReviewThird,
        sensei: formData.sensei,
        bookReviewThing: formData.responses.bookReviewThing,
        bookReviewArasuji: formData.responses.bookReviewArasuji,
      });
    }

    // ローディング表示
    setLoading([{ 
      role: 'ai', 
      content: (
        <div className="loading yomikomihyougen">
          <div style={{height:"80%",maxWidth:"100vw"}}>
            <AnimationKomawanPage />
          </div>
          <p style={{fontSize:20,fontWeight:900}}>
            <h2><b>{t('danraku.loadingText')}</b></h2>
            {t('danraku.loading')}
          </p>
        </div>
      )
    }]);

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/api/azure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage, gakunen: formData.grade }),
        mode: 'cors'
      });

      if (response.ok) {
        console.log("API呼び出し成功");
        const data = await response.json();
        const parsedData = data.bot.trim();
        addAnswer(parsedData);
        setLoading([]);
      } else {
        setLoading([]);
        const err = await response.text();
        setMessage(t('danraku.error'));
        alert(err);
      }
    } catch (error) {
      setLoading([]);
      console.error("処理中にエラーが発生しました : ", error);
      setMessage(t('danraku.error'));
    }
  };

  const addAnswer = (value) => {
    let match = value.match(regex);
    if (match) {
      let extractedArrayString = match[0];
      let array = eval(extractedArrayString);
      
      // 配列の各要素をMarkdown太字からHTMLに変換
      const convertedArray = array.map(item => convertMarkdownBold(item));
      
      console.log(convertedArray);
      setDataArray(convertedArray);
      scrollChatToBottom();
    }
  };

  useEffect(() => {
    if (currentSensei !== " ") {
      setIsModalOpen(true);
    }
  }, [currentSensei]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const scrollChatToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    if (dataArray.length > 0) {
      setVisibleRows(0);
      const interval = setInterval(() => {
        setVisibleRows((prev) => {
          if (prev < dataArray.length) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [dataArray]);

  const hyou = () => {
    if (Array.isArray(dataArray) && dataArray.length > 0) {
      return (
        <table>
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap" }} className="kakusitai">{t('danraku.tableHeader1')}</th>
              <th>{t('danraku.tableHeader2')}</th>
            </tr>
          </thead>
          <tbody id="danraku-answer">
            {dataArray.slice(0, visibleRows).map((item, index) => (
              <tr key={index} className="animated-row">
                {index === 0 && (
                  <>
                    <td className="td-index">
                      <span className="danraku-theme">
                        {t('danraku.tableTheme')}
                        <br/>
                        <div style={{fontSize:15}}>{t('danraku.tableThemeRecommend')}</div>
                      </span>
                    </td>
                    <td className="td-item">
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </td>
                  </>
                )}
                {index > 0 && (
                  <>
                    <td className="td-index"><span>{index}</span></td>
                    <td className="td-item">
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                      <br />
                      <button onClick={() => copyToClipboard(item)} style={{ marginLeft: "10px" }}>
                        {t('danraku.copyButton')}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  const showCards = () => {
    setShowDanrakuCards(true);
  };

  // DanrakuCardからのデータを受け取る関数
  const handleFormSubmit = (data) => {
    if (data === null) {
      // カードを閉じる
      setShowDanrakuCards(false);
    } else {
      // フォーム送信データを処理
      console.log('受信したデータ:', data);
      
      // カードを閉じる
      setShowDanrakuCards(false);
      
      // 先生を設定してモーダルを表示
      setCurrentSensei(data.sensei);
      
      // API呼び出し
      callAPI(data);
    }
  };

  return (
    <div className="container" style={{minHeight:"100vh"}}>
      <Helmet>
        <title>{t('danraku.helmet')}</title>
      </Helmet>
      
      {loading.map((chat, index) => (
        <div key={index} className="loadingDanraku">
          <p>{chat.content}</p>
        </div>
      ))}
      
      <h2 className="pagetitle" style={{marginTop:"100px"}}>{t("tabs.danraku")}</h2>
      <p>{t('danraku.intro1')}<br/>{t('danraku.intro2')}</p>
      
      {isModalOpen && currentSensei === " " && (
        <ModalFrame
          title={t('danraku.modalTitle')}
          text={t('danraku.modalText')}
          onClose={handleModalClose}
          imageSrc="/images/danrakuwan.png"
          midashi={t('danraku.modalMidashi')}
        />
      )}
            
      <br />
      
      {/* 結果が表示されていない場合のみボタンを表示 */}
      {/* {dataArray.length === 0 && ( */}
        <button onClick={showCards} style={{
          padding: "15px 30px",
          fontSize: "30px",
          fontWeight: "bold",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px"
        }} className="danraku-anquette-button">
          段落の組み立てアンケートを
          はじめる！
        </button>
      {/* )} */}

      {dataArray.length === 0 && (
        <img src="/images/danrakuLook.png" alt="" className="danrakuLook" />
      )}
      
      {/* DanrakuCardコンポーネント */}
      {showDanrakuCards && <DanrakuCard onSubmit={handleFormSubmit} />}

      {/* エラーメッセージ */}
      {messages && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>{messages}</p>
      )}

      {/* 結果テーブル */}
      {hyou()}
    </div>
  );
};

export default DanrakuKumitatePage;