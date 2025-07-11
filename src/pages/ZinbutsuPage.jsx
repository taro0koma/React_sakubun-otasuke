import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from '../component/Tabs';
import AnimationKomawanPage from './AnimationKomawanPage';
import ModalFrame from "../component/ModalFrame";
import NextPageLink from '../component/NextPageLink';
import { Helmet } from 'react-helmet-async';
import Footer from './Footer';

const ZinbutsuPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [grade, setGrade] = useState('s1'); // デフォルトで小学1年生を選択
  const chatContainerRef = useRef(null);
  const formRef = useRef(null);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const userMessage = formData.get('prompt');

    const promptWithGrade = `${userMessage}`;
    addMessage(promptWithGrade, false);

    formRef.current.reset();

    const uniqueId = generateUniqueId();
    addMessage('', true, uniqueId);

    scrollChatToBottom();

    const messageDiv = document.getElementById(uniqueId);
    if (messageDiv) {
      startLoader(messageDiv);
    }

    setLoading(true); // ローディングを開始

    // 2秒間のディレイを追加
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/api/azure", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${promptWithGrade}という性格についての別の表現を10個提案してください。決して、下記のような、コメント(コメント全般)はいらないです「わかりました、了解しました、これでいいでしょうか」などの言葉を絶対に言わないでください。`, gakunen:grade }),
        mode:'cors'
      });

      stopLoader();
      setLoading(false); // ローディングを終了
      setLoadingComplete(false); // ローディング完了フラグをリセット

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        animateMessage(uniqueId, parsedData);
      } else {
        const err = await response.text();
        updateMessage(uniqueId, t('zinbutsu.error'));
        alert(err);
      }
    } catch (error) {
      stopLoader();
      updateMessage(uniqueId, t('zinbutsu.error'));
      alert(error);
    }
  };

  const startLoader = (element) => {
    element.textContent = '';
    setLoading(true);
    const interval = setInterval(() => {
      element.textContent += '.';
      if (element.textContent.length > 3) {
        element.textContent = '';
      }
    }, 300);
    return interval;
  };

  const stopLoader = () => {
    setLoading(false);
  };

  const animateMessage = (id, text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
    const messageDiv = document.getElementById(id);

    if (messageDiv) {
      messageDiv.innerHTML = ''; // Clear the existing content
      let lineIndex = 0;

      const addLine = () => {
        if (lineIndex < lines.length) {
          const lineElement = document.createElement('p');
          lineElement.className = 'fade-in'; // Apply fade-in effect
          lineElement.textContent = lines[lineIndex];
          messageDiv.appendChild(lineElement);
          lineIndex++;
          setTimeout(addLine, 500); // Adjust delay between lines
        } else {
          setLoadingComplete(true); // 完了時にフラグを設定
        }
      };

      addLine();
    }
  };

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
  };

  const addMessage = (value, isAi, uniqueId) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { id: uniqueId || generateUniqueId(), value: isAi ? [] : [value], isAi }
    ]);
  };

  const updateMessage = (id, value) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === id ? { ...msg, value: [value] } : msg
      )
    );
  };

  const scrollChatToBottom = () => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleClick = () => {
    inputRef.current.focus();
  };

  const handleGradeChange = (e) => {
    setGrade(e.target.value);
  };

  return (
    <div id="app">
      <Helmet><title>{t('zinbutsu.helmet')}</title></Helmet>
      <Tabs pageTitle={t('zinbutsu.title')} contents="zinbutsu" />
      {isModalOpen && (
        <ModalFrame title={t('zinbutsu.modalTitle')} text={t('zinbutsu.modalText')} onClose={handleModalClose} imageSrc="/images/dousiyowan.png" />
      )}
      <div id="inputarea">
        <p style={{ textAlign: "center" }}>{t('zinbutsu.introText1')}<br />{t('zinbutsu.introText2')}</p>
        <br />
        <form ref={formRef} onSubmit={handleSubmit}>
          <select value={grade} onChange={handleGradeChange}>
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
          <br />
          <input
            ref={inputRef}
            name="prompt"
            placeholder={t('zinbutsu.placeholder')}
            required
          />
          <br />
          <button type="submit" onClick={handleClick}>
            {t('zinbutsu.button')}
          </button>
        </form>
        <div id="chat_container" ref={chatContainerRef}>
          {loading && !loadingComplete ? (
            <div className='yomikomihyougen svgtoka LoadingSvg'>
            <AnimationKomawanPage />
            <h1><b>SAKUBUN OTASUKE</b></h1>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`wrapper${msg.isAi ? 'ai' : ''}`}>
                <div className="chat">
                  <div className="message" id={msg.id}>
                    {msg.value.map((line, index) => (
                      <p key={index} className={msg.isAi ? 'fade-in' : ''}><span>{line}</span></p>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <NextPageLink imairu="zinbutu1"/>
      <Footer/>
    </div>
  );
};

export default ZinbutsuPage;
