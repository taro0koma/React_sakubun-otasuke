import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Tabs from "../component/Tabs";
import ModalFrame from "../component/ModalFrame";
import PreviousAndNext from "../component/PreviousAndNext";
import NextPageLink from './../component/NextPageLink';
import { Helmet } from "react-helmet-async";
import AnimationKomawanPage from "./AnimationKomawanPage";
import Footer from "./Footer";
import { GiRhinocerosHorn } from "react-icons/gi";

const StylePage = () => {
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

  const handleCopyClick = (text) => {
    copyToClipboard(text);
  };


  let ok = "no";
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [dataArray, setDataArray] = useState([]);
  const regex = /\[([\s\S]*?)\]/; // 「[」から「]」までの部分にマッチする正規表現

  const gradeJapan = {
    grade: "とくに制限なし",
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
    d1: "大学１年生",
    d2: "大学２年生",
    d3: "大学３年生",
  };
  const typeJapan = {
    type: "特に制限なし",
    bookReview: "読書感想文",
    composition: "作文",
  };
  const [formObj, setFormObj] = useState({
    fName: "",
    nName: "",
    lName: "",
    grade: " ",
    type: " ",
    bookReviewFirst: "",
    bookReviewSecond: "",
    bookReviewThird: "",
    bookReviewArasuji: "",
    bookReviewThing:"",
    sFirst: "",
    sSecond: "",
    sThird: "",
    sTheme: "",
    sFo: "",
    sensei: " ",
  });
  const [messages, setMessage] = useState("");
  const [answers, setAnswer] = useState("");
  const [visibleRows, setVisibleRows] = useState(0);
  const [loading,setLoading] = useState([]);

  const chatContainerRef = useRef(null);

  const InputOnChange = (property, value) => {
    setFormObj((prevObj) => ({
      ...prevObj,
      [property]: value,
    }));
  };
  let userMessage = ` `; // ${typeJapan[formObj.type]}のための${gradeJapan[formObj.grade]} が作成する作文の準備をするため、主題を ${formObj.fName} に設定し、第2要素は「 ${formObj.nName} 」､第3要素は「 ${formObj.lName} 」として、テーマについて自分の考えや経験を描く1600文字程度の作文のための「PREP+」のフレームワークを５～６個の段落の概要提案になるように構成し（次の5点に必ず対応してください。 1.項目ごと150文字以上にする。2.最初の段落と最終の段落が自分の言いたいことを伝える重要なまとめの段落とする。 3. ${gradeJapan[formObj.grade]} 以下の年齢の子供の文化や世界観を表現できる文章にリライトする。 4. ${gradeJapan[formObj.grade]} 以下の年齢の子供が読んだり書いたりできるようにリライトする。 5.必ず一つ一つの提案の最後に「～～のようなことを書く段落にするのはどうでしょうか」と書く。）、const answer=[];の形式で日本語の値のみの配列を記載してください。配列のコード以外の文章やアドバイスは完全に省いてください。
  const FormSubmit = async (e) => {
    // 送信ボタンを使用不可にする
    e.preventDefault();

    let userMemo = `${typeJapan[formObj.type]}のための${
      gradeJapan[formObj.grade]
    } 向けに${formObj.fName}と ${formObj.nName} と ${
      formObj.lName
    } について書くための段落の組み立てアイデアを作ってみます。`;
    // addAnswer(userMemo, false);
    setLoading([...loading, { role: 'ai', content: <div className="loading yomikomihyougen"> <div style={{height:"80%",maxWidth:"100vw"}}><AnimationKomawanPage /></div>
            <p style={{fontSize:20,fontWeight:900}}><h2><b>SAKUBUN OTASUKE</b></h2>{t('danraku.loading')}</p></div> }])
    

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/api/azure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage,gakunen: formObj.grade }),
        mode:'cors'
      });

      if (response.ok) {
        ok = "ok";
        console.log(userMemo);
        const data = await response.json();
        const parsedData = data.bot.trim();
        addAnswer(parsedData, true);
        setLoading([...loading, { role: 'ai', content:""}])
      } else {
        setLoading([...loading, { role: 'ai', content:""}])
        const err = await response.text();
        setMessage(t('danraku.error'));
        alert(err);
      }
      // const answerArrayString = result.choices[0].text.trim();
      if (answers.length > 0) {
        const answerArray = JSON.parse(
          // answerArrayString.match(/const answer=\[(.*)\];/)[1]
          answers.value.match(/const answer=\[(.*)\];/)[1]
        );
        setData(answerArray);
      }
    } catch (error) {
      console.error("処理中にエラーが発生しました : ", error);
    }
  };

  const addAnswer = (value) => {
    let match = value.match(regex);
    let extractedArrayString = match[0]; // マッチした部分全体を取得
    let array = eval(extractedArrayString); // evalで文字列を配列として評価
    console.log(array[1]);
    setAnswer(array);
    setDataArray(array);
    scrollChatToBottom();
  };

  useEffect(() => {
    if (formObj.sensei === "DESC法") {
      setIsModalOpen(true);
    }
    else if (formObj.sensei === "PREP法") {
      setIsModalOpen(true);
    }
    else if (formObj.sensei === "一段落目が個性的なPREP法") {
      setIsModalOpen(true);
    }
  }, [formObj.sensei]);

  const senseierabi = () => {
    if (formObj.sensei === "DESC法") {
      return (
        // <img src="/images/saisensei.png" alt="担当してくれるAI先生(サイ)" />
        <div className="sensei">
        {isModalOpen && (
        <ModalFrame
          title={t('danraku.teacherSai')}
          buttonName={t('close')}
          text=""
          onClose={handleModalClose}
          imageSrc="/images/saisensei.png"
          midashi={t('danraku.saiSenseiMidashi')}
          />
      )}
        </div>
      )
    }
    else if (formObj.sensei === "PREP法") {
      return (
        // <img src="/images/risusensei.png" alt="担当してくれるAI先生(リス)" />
        <div className="sensei">
        {isModalOpen && (
        <ModalFrame
          title={t('danraku.teacherRisu')}
          buttonName={t('close')}
          text=""
          onClose={handleModalClose}
          imageSrc="/images/risusensei.png"
          midashi={t('danraku.risuSenseiMidashi')}
          />
      )}
        </div>
      )
    }
    if (formObj.sensei === "一段落目が個性的なPREP法") {
      return (
        // <img src="/images/raionsensei.png" alt="担当してくれるAI先生(ライオン)" />
        <div className="sensei">
        {isModalOpen && (
        <ModalFrame
          title={t('danraku.teacherRaion')}
          buttonName={t('close')}
          text=""
          onClose={handleModalClose}
          imageSrc="/images/raionsensei.png"
          midashi={t('danraku.raionSenseiMidashi')}
          />
      )}
        </div>
      )
    }
  }

  const renderAdditionalQuestions = () => {
    if (formObj.type === "composition") {
      userMessage = `こんにちは、ChatGPT。テーマは「${formObj.sTheme
      }」です。構成を考える手助けをお願いしたいです。${
        typeJapan[formObj.type]
      }のための${
        gradeJapan[formObj.grade]
      } が作成する作文をつくります。必ず、最初に題名のヒントとなるその作文のおすすめのテーマを出力してください。もちろん次の行は改行を入れてください。第２要素は${
        formObj.sFirst
      } に設定し、第３要素は「 ${
        formObj.sSecond
      } 」､第４要素は「 ${
        formObj.sThird
      } 」、第５要素は「${
        formObj.sFo
      }」として、テーマについて自分の考えや経験を描く1600文字程度の作文のための「${formObj.sensei}」のフレームワークを５個の段落の概要提案になるように構成し（次の5点に"必ず"対応してください。 1.項目ごと150文字以上にする。2.最初の段落と最終の段落が自分の言いたいことを伝える重要なまとめの段落とする。 3. ${
        gradeJapan[formObj.grade]
      } 以下の年齢の子供の文化や世界観を表現できる文章にリライトする。 4. ${
        gradeJapan[formObj.grade]
      } 以下の年齢の子供が読んだり書いたりできるようにリライトする。 5.あらすじは下記とする。${
        formObj.bookReviewArasuji
      }6.必ず、一文くらいの例文と最後に簡単に"一つ一つ"の提案に「～～のようなことを書く段落にするのはどうでしょうか」と書く。）、const answer=[];の形式で日本語の値のみの配列を記載してください。配列のコード以外の文章やアドバイスは”完全に省いて”ください。あまり情報がなかった場合、勝手にお話を作らないでください。大胆でいいんです！`;
      //作文の場合
      return (
        <>
          <h5>{t('danraku.themeLabel')}</h5>
          <textarea 
          onChange={(e) => {
            InputOnChange("sTheme", e.target.value);
          }}
          value={formObj.sTheme}
          placeholder={t('danraku.themePlaceholder')}
          />
          <h5 dangerouslySetInnerHTML={{ __html: t('danraku.wantsLabel') }} />
          <textarea
            onChange={(e) => {
              InputOnChange("sFirst", e.target.value);
            }}
            value={formObj.sFirst}
            placeholder={t('danraku.wants1Placeholder')}
          />
          <br />
          <textarea
            onChange={(e) => {
              InputOnChange("sSecond", e.target.value);
            }}
            value={formObj.sSecond}
            placeholder={t('danraku.wants2Placeholder')}
          />
          <br />
          <textarea
            onChange={(e) => {
              InputOnChange("sThird", e.target.value);
            }}
            value={formObj.sThird}
            placeholder={t('danraku.wants3Placeholder')}
          />
          <br/>
          <textarea
            onChange={(e) => {
              InputOnChange("sFo", e.target.value);
            }}
            value={formObj.sFo}
            placeholder={t('danraku.wants4Placeholder')}
          />
        </>
      );
    } else if (formObj.type === "bookReview") {
      //読書感想文の場合
      userMessage = `こんにちは、ChatGPT。私が読んだ本について、読書感想文の構成を考える手助けをお願いしたいです。${
        typeJapan[formObj.type]
      }のための${
        gradeJapan[formObj.grade]
      } が作成する作文をつくります。第１要素目に必ず最初に題名のヒントとなるその作文のおすすめのテーマを出力してください。もちろん次の行は改行を入れてください。本の内容は ${
        formObj.bookReviewFirst
      } に設定し、第2要素は「 ${formObj.bookReviewSecond} 」､第3要素は「 ${
        formObj.bookReviewThird
      } 」として、テーマについて自分の考えや経験を描く1600文字程度の作文のための「${formObj.sensei}」のフレームワークを５個の段落の概要提案になるように構成し（次の5点に"必ず"対応してください。 1.項目ごと150文字以上にする。2.最初の段落と最終の段落が自分の言いたいことを伝える重要なまとめの段落とする。 3. ${
        gradeJapan[formObj.grade]
      } 以下の年齢の子供の文化や世界観を表現できる文章にリライトする。 4. ${
        gradeJapan[formObj.grade]
      }表紙の様子/本の題名から考えたことは下記です。${
        formObj.bookReviewThing
      }以下の年齢の子供が読んだり書いたりできるようにリライトする。 5.必ず"一つ一つ"の提案を「～～のようなことを書く段落にするのはどうでしょうか」と書く。）、const answer=[];の形式で日本語の値のみの配列を記載してください(これ一番大事！)。配列のコード以外の文章やアドバイスは完全に省いてください。`;
      return (
        <>
        <h5>{t('danraku.bookTypeLabel')}</h5>
          <select
            onChange={(e) => {
              InputOnChange("bookReviewFirst", e.target.value);
            }}
            value={formObj.bookReviewFirst}
          >
            <option value="">{t('danraku.bookTypeDefault')}</option>
            <option value="愉快な内容の本">{t('danraku.bookType1')}</option>
            <option value="有名な人物の伝記の本">{t('danraku.bookType2')}</option>
            <option value="実際にあった話">{t('danraku.bookType3')}</option>
            <option value="冒険をする本">{t('danraku.bookType4')}</option>
            <option value="悲しいことが起こる本">{t('danraku.bookType5')}</option>
            <option value="怖い怪談についての本">{t('danraku.bookType6')}</option>
            <option value="困りごとに立ち向かう本">{t('danraku.bookType7')}</option>
            <option value="食べ物の作り方">{t('danraku.bookType8')}</option>
            <option value="科学について書かれた本">{t('danraku.bookType9')}</option>
            <option value="地球や環境について書かれた本">{t('danraku.bookType10')}</option>
            <option value="歴史について書かれた本">{t('danraku.bookType11')}</option>
            <option value="ワクワクする本">{t('danraku.bookType12')}</option>
            <option value="自分に似た人物が登場する本">{t('danraku.bookType13')}</option>
            <option value="図鑑">{t('danraku.bookType14')}</option>
            <option value="クイズの本">{t('danraku.bookType15')}</option>
            <option value="想像上の人物の日常が描かれた本">{t('danraku.bookType16')}</option>
            <option value="不思議な世界に行く話">{t('danraku.bookType17')}</option>
          </select>
          <br />
          <h5>{t('danraku.arasujiLabel')}</h5>
          <textarea onChange={(e)=>{
             InputOnChange("bookReviewArasuji", e.target.value);
          }}
          cols="10"//横幅
          rows="5"//行数
          placeholder={t('danraku.arasujiPlaceholder')} />
          <h5>{t('danraku.kokoroLabel')}</h5>
          <textarea
            onChange={(e) => {
              InputOnChange("bookReviewSecond", e.target.value);
            }}
            value={formObj.bookReviewSecond}
            placeholder={t('danraku.kokoroPlaceholder')}
          />
          <br />
          <br />
          <h5 dangerouslySetInnerHTML={{ __html: t('danraku.hyoushiLabel') }} />
          <textarea
            onChange={(e) => {
              InputOnChange("bookReviewThing", e.target.value);
            }}
            value={formObj.bookReviewThing}
            placeholder={t('danraku.hyoushiPlaceholder')}
          />
          <br />
          <br />
          <h5>{t('danraku.otherLabel')}</h5>
          <textarea
            onChange={(e) => {
              InputOnChange("bookReviewThird", e.target.value);
            }}
            value={formObj.bookReviewThird}
            placeholder={t('danraku.otherPlaceholder')}
          />
        </>
      );
    }
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  }

  const scrollChatToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };
  useEffect(() => {
    if (dataArray.length > 0) {
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
    }
  },[dataArray]);
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
              <td className="td-index"><span className="danraku-theme">{t('danraku.tableTheme')}<br/><div style={{fontSize:15}}>{t('danraku.tableThemeRecommend')}</div></span></td>
              <td className="td-item">
                {item}
                <br />
                {/**indexが0ではないときだけボタンを表示させる */}
                {index > 0 && (
                  <button onClick={() => copyToClipboard(item)} style={{ marginLeft: "10px" }}>{t('danraku.copyButton')}</button>
                )}
                
              </td>
              </>
            )}
            {/**indexが0じゃないときの条件分岐 */}
            {index > 0 && (
              <>
              <td className="td-index"><span>{index}</span></td>
              <td className="td-item">
                {item}
                <br />
                {/**indexが0ではないときだけボタンを表示させる */}
                {index > 0 && (
                  <button onClick={() => copyToClipboard(item)} style={{ marginLeft: "10px" }}>{t('danraku.copyButton')}</button>
                )}
                
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
  const honbun = (
    <>
      <span dangerouslySetInnerHTML={{ __html: t('danraku.prevNextHonbun') }} />
    </>
  );



  return (
    <div className="container">
      <Helmet>
        <title>{t('danraku.helmet')}</title>
      </Helmet>
      {loading.map((chat, index) => (
          <div key={index} className="loadingDanraku">
            <p>{chat.content}</p>
          </div>
        ))}
      <Tabs pageTitle={t('danraku.title')} contents="danraku"/>
      <p>{t('danraku.intro1')}<br/>{t('danraku.intro2')}</p>
      {isModalOpen&&formObj.sensei===" " && (
        <ModalFrame
          title={t('danraku.modalTitle')}
          text={t('danraku.modalText')}
          onClose={handleModalClose}
          imageSrc="/images/danrakuwan.png"
          midashi={t('danraku.modalMidashi')}
          />
      )}
      <b><p>{t('danraku.copyInfo')}</p></b>
      <br />
      <form onSubmit={FormSubmit}>
        <h5>{t('danraku.gradeLabel')}</h5>
        <select
          onChange={(e) => {
            InputOnChange("grade", e.target.value);
          }}
          value={formObj.grade}
          required
        >
          <option value="grade">{t('danraku.gradeDefault')}</option>
          <option value="s1">{t('zinbutsu.s1')}</option>
          <option value="s2">{t('zinbutsu.s2')}</option>
          <option value="s3">{t('zinbutsu.s3')}</option>
          <option value="s4">{t('zinbutsu.s4')}</option>
          <option value="s5">{t('zinbutsu.s5')}</option>
          <option value="s6">{t('zinbutsu.s6')}</option>
          <option value="t1">{t('zinbutsu.t1')}</option>
          <option value="t2">{t('zinbutsu.t2')}</option>
          <option value="t3">{t('zinbutsu.t3')}</option>
          <option value="k1">{t('zinbutsu.k1')}</option>
          <option value="k2">{t('zinbutsu.k2')}</option>
          <option value="k3">{t('zinbutsu.k3')}</option>
        </select>
        <h5>{t('danraku.teacherLabel')}</h5>
        <select
          onChange={(e) => {
            InputOnChange("sensei", e.target.value);
          }}
          value={formObj.sensei}
          required
        >
          <option value="未入力状態">{t('danraku.teacherDefault')}</option>
          <option value="DESC法">{t('danraku.teacherSai')}</option>
          <option value="PREP法">{t('danraku.teacherRisu')}</option>
          <option value="一段落目が個性的なPREP法">{t('danraku.teacherRaion')}</option>
        </select>
        <br />
          <div className="sensei">
            {senseierabi()}
          </div>
        <br />
        <h5>{t('danraku.typeLabel')}</h5>
        <select
          onChange={(e) => {
            InputOnChange("type", e.target.value);
          }}
          value={formObj.type}
          required
        >
          <option value="">{t('danraku.typeDefault')}</option>
          <option value="bookReview">{t('danraku.typeBookReview')}</option>
          <option value="composition">{t('danraku.typeComposition')}</option>
        </select>
        <br />
        {renderAdditionalQuestions()}

        <br />
        <br />
        <button type="submit">{t('danraku.submitButton')}</button>
        <p>{messages}</p>
      </form>

      {hyou()}
      <NextPageLink imairu="danraku1"/>
      <PreviousAndNext midashi={t('danraku.prevNextMidashi')} honbun={honbun} buttontext={t('danraku.prevNextButton')} buttonurl="/map"/>
      <div className="spacer" style={{height:400}}></div>
      <Footer/>
    </div>
  );
};

export default StylePage;
