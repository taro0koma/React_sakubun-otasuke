import React, { useState, useRef } from 'react';
import Tabs from '../component/Tabs';
import AnimationKomawanPage from './AnimationKomawanPage';
import ModalFrame from "../component/ModalFrame";
import NextPageLink from '../component/NextPageLink';
import { Helmet } from 'react-helmet-async';

const HyougenPage = () => {
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
      const response = await fetch(process.env.REACT_APP_API_URL+"/danraku", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${promptWithGrade}という性格についての別の表現を10個提案してください。決して、下記のような、コメント(コメント全般)はいらないです「わかりました、了解しました、これでいいでしょうか」などの言葉を絶対に言わないでください。`, gakunen:grade }),
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
        updateMessage(uniqueId, 'エラーが出たのでもう一度入力してください。');
        alert(err);
      }
    } catch (error) {
      stopLoader();
      updateMessage(uniqueId, 'エラーが出たのでもう一度入力してください。');
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
      <Helmet><title>登場人物の性格を表す言葉 | 作文おたすけアプリ</title></Helmet>
      <Tabs pageTitle="登場人物の性格を表す言葉" contents="zinbutsu" />
      {isModalOpen && (
        <ModalFrame title="「登場人物の性格を表す言葉」の使い方" text="「登場人物の性格を表す言葉」で、いろいろな表現が知ることができます。自分の書いてみた文章の中に別の表現にしたい言葉はありませんか？" onClose={handleModalClose} imageSrc="/images/dousiyowan.png" />
      )}
      <div id="inputarea">
        <p style={{ textAlign: "center" }}>自分の使っている言葉のほかの表現を知って、<br />気に入るものがあったら、自分の作文に使ってみよう！</p>
        <br />
        <form ref={formRef} onSubmit={handleSubmit}>
          <select value={grade} onChange={handleGradeChange}>
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
          </select>
          <br />
          <input
            ref={inputRef}
            name="prompt"
            placeholder="例：やさしい／人見知り"
            required
          />
          <br />
          <button type="submit" onClick={handleClick}>
            この言葉の表現を探す！
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
    </div>
  );
};

export default HyougenPage;
