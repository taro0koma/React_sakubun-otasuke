import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from '../component/Tabs';
import AnimationKomawanPage from './AnimationKomawanPage'; // インポートするコンポーネント
import ModalFrame from "../component/ModalFrame";
import NextPageLink from '../component/NextPageLink';
import { Helmet } from 'react-helmet-async';
import Footer from './Footer';

const HyougenPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const chatContainerRef = useRef(null);
  const formRef = useRef(null);
  const inputRef = useRef(null);  // Ref to the input element

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const userMessage = formData.get('prompt');

    addMessage(userMessage, false);

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
      const response = await fetch(process.env.REACT_APP_API_URL+"/api/azurehyougen", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage, sakka: 'あまんきみこ' }),
        mode:'cors'
      });
  
      stopLoader();
      setLoading(false); // ローディングを終了
      setLoadingComplete(false); // ローディング完了フラグをリセット

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        console.log('AIの回答:', parsedData); // AIの回答をコンソールに表示
        animateMessage(uniqueId, parsedData);
      } else {
        const err = await response.text();
        updateMessage(uniqueId, t('hyougen.error'));
        alert(err);
      }
    } catch (error) {
      stopLoader();
      updateMessage(uniqueId, t('hyougen.error'));
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
    inputRef.current.focus();  // Focus the input element
  };

  return (
    <div id="app">
      <Helmet><title>{t('hyougen.helmet')}</title></Helmet>
      <Tabs pageTitle={t('hyougen.title')} contents="hyougen" />
      {isModalOpen && (
        <ModalFrame title={t('hyougen.modalTitle')} text={t('hyougen.modalText')} onClose={handleModalClose} imageSrc="/images/dousiyowan.png" />
      )}
      <div id="inputarea">
        <p style={{ textAlign: "center" }}>{t('hyougen.introText1')}<br />{t('hyougen.introText2')}</p>
        <br />
        <form ref={formRef} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            name="prompt"
            placeholder={t('hyougen.placeholder')}
            required
          />
          <br />
          <button type="submit" onClick={handleClick}>
            {t('hyougen.button')}
          </button>
        </form>
        <div id="chat_container" ref={chatContainerRef} className={loading && !loadingComplete ? "yomikomihyougen" : ""}>
          {loading && !loadingComplete ? (
            <>
            <AnimationKomawanPage />
            <h1><b>{t('hyougen.loadingText')}</b></h1>
            </>
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
      <NextPageLink imairu="hyougen1"/>
      <Footer/>
    </div>
  );
};

export default HyougenPage;
