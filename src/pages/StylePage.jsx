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
  let userMessage = ` `;
  const FormSubmit = async (e) => {
    e.preventDefault();

    let userMemo = t('danraku.userMemo', {
      type: t('danraku.type' + formObj.type),
      grade: t('zinbutsu.' + formObj.grade),
      fName: formObj.fName,
      nName: formObj.nName,
      lName: formObj.lName,
    });
    setLoading([...loading, { role: 'ai', content: <div className="loading yomikomihyougen"> <div style={{height:"80%",maxWidth:"100vw"}}><AnimationKomawanPage /></div>
            <p style={{fontSize:20,fontWeight:900}}><h2><b>{t('danraku.loadingText')}</b></h2>{t('danraku.loading')}</p></div> }])
    

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
      if (answers.length > 0) {
        const answerArray = JSON.parse(
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
    let extractedArrayString = match[0];
    let array = eval(extractedArrayString);
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
        <div className="sensei">
        {isModalOpen && (
        <ModalFrame
          title={t('danraku.teacherSai')}
          buttonName={t('danraku.close')}
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
        <div className="sensei">
        {isModalOpen && (
        <ModalFrame
          title={t('danraku.teacherRisu')}
          buttonName={t('danraku.close')}
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
        <div className="sensei">
        {isModalOpen && (
        <ModalFrame
          title={t('danraku.teacherRaion')}
          buttonName={t('danraku.close')}
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
      userMessage = t('danraku.compositionPrompt', {
        sTheme: formObj.sTheme,
        type: t('danraku.typeComposition'),
        grade: t('zinbutsu.' + formObj.grade),
        sFirst: formObj.sFirst,
        sSecond: formObj.sSecond,
        sThird: formObj.sThird,
        sFo: formObj.sFo,
        sensei: formObj.sensei,
        bookReviewArasuji: formObj.bookReviewArasuji,
      });
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
      userMessage = t('danraku.bookReviewPrompt', {
        type: t('danraku.typeBookReview'),
        grade: t('zinbutsu.' + formObj.grade),
        bookReviewFirst: formObj.bookReviewFirst,
        bookReviewSecond: formObj.bookReviewSecond,
        bookReviewThird: formObj.bookReviewThird,
        sensei: formObj.sensei,
        bookReviewThing: formObj.bookReviewThing,
      });
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
            <option value={t('danraku.bookType1')}>{t('danraku.bookType1')}</option>
            <option value={t('danraku.bookType2')}>{t('danraku.bookType2')}</option>
            <option value={t('danraku.bookType3')}>{t('danraku.bookType3')}</option>
            <option value={t('danraku.bookType4')}>{t('danraku.bookType4')}</option>
            <option value={t('danraku.bookType5')}>{t('danraku.bookType5')}</option>
            <option value={t('danraku.bookType6')}>{t('danraku.bookType6')}</option>
            <option value={t('danraku.bookType7')}>{t('danraku.bookType7')}</option>
            <option value={t('danraku.bookType8')}>{t('danraku.bookType8')}</option>
            <option value={t('danraku.bookType9')}>{t('danraku.bookType9')}</option>
            <option value={t('danraku.bookType10')}>{t('danraku.bookType10')}</option>
            <option value={t('danraku.bookType11')}>{t('danraku.bookType11')}</option>
            <option value={t('danraku.bookType12')}>{t('danraku.bookType12')}</option>
            <option value={t('danraku.bookType13')}>{t('danraku.bookType13')}</option>
            <option value={t('danraku.bookType14')}>{t('danraku.bookType14')}</option>
            <option value={t('danraku.bookType15')}>{t('danraku.bookType15')}</option>
            <option value={t('danraku.bookType16')}>{t('danraku.bookType16')}</option>
            <option value={t('danraku.bookType17')}>{t('danraku.bookType17')}</option>
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
                {index > 0 && (
                  <button onClick={() => copyToClipboard(item)} style={{ marginLeft: "10px" }}>{t('danraku.copyButton')}</button>
                )}
                
              </td>
              </>
            )}
            {index > 0 && (
              <>
              <td className="td-index"><span>{index}</span></td>
              <td className="td-item">
                {item}
                <br />
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
