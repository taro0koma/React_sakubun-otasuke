import React, { useState, useRef, useEffect } from 'react';
import Tabs from '../component/Tabs';

const HyougenPage = () => {
  // const apiUrl = process.env.REACT_APP_API_URL;
  const [messages, setMessages] = useState([]); // メッセージの状態管理
  const [loading, setLoading] = useState(false); // ローディング状態の管理
  const chatContainerRef = useRef(null); // チャットコンテナの参照を取得
  const formRef = useRef(null); // フォームの参照を取得

  useEffect(() => {
    const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData(formRef.current); // フォームデータを取得
      const userMessage = formData.get('prompt');

      addMessage(userMessage, false); // ユーザーメッセージを追加

      formRef.current.reset(); // フォームをリセット

      const uniqueId = generateUniqueId();
      addMessage(' ', true, uniqueId); // ボットメッセージのプレースホルダーを追加

      scrollChatToBottom(); // チャットをスクロール

      const messageDiv = document.getElementById(uniqueId);
      if (messageDiv) { // messageDivが存在する場合にのみローダーを開始
        startLoader(messageDiv);
      }

      try {
        // const response = await fetch(process.env.REACT_APP_API_URL, {
          const response = await fetch(process.env.VITE_API_URL, {
        method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userMessage }),
        });

        stopLoader(); // ローディングを停止

        if (response.ok) {
          const data = await response.json();
          const parsedData = data.bot.trim();
          updateMessage(uniqueId, parsedData); // メッセージを更新
        } else {
          const err = await response.text();
          updateMessage(uniqueId, 'エラーが出たのでもう一度入力してください。'); // エラーメッセージを表示
          alert(err);
        }
      } catch (error) {
        stopLoader(); // ローディングを停止
        updateMessage(uniqueId, 'エラーが出たのでもう一度入力してください。'); // エラーメッセージを表示
        alert(error);
      }
    };

    formRef.current.addEventListener('submit', handleSubmit); // フォーム送信イベントを設定
    formRef.current.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        handleSubmit(e); // エンターキー押下時に送信
      }
    });

    return () => {
      formRef.current.removeEventListener('submit', handleSubmit); // クリーンアップ
      formRef.current.removeEventListener('keyup', handleSubmit); // クリーンアップ
    };
  }, []);

  const startLoader = (element) => {
    element.textContent = '';
    setLoading(true); // ローディング状態を設定
    const interval = setInterval(() => {
      element.textContent += '.';
      if (element.textContent === '....') {
        element.textContent = '';
      }
    }, 300);
    return interval;
  };

  const stopLoader = () => {
    setLoading(false); // ローディング状態をリセット
  };

  const typeText = (element, text) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
  };

  const addMessage = (value, isAi, uniqueId) => {
    const message = { id: uniqueId || generateUniqueId(), value, isAi };
    setMessages((prevMessages) => [...prevMessages, message]); // メッセージを追加
  };

  const updateMessage = (id, value) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === id ? { ...msg, value } : msg))
    ); // メッセージを更新
  };

  const scrollChatToBottom = () => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight; // チャットをスクロール
  };

  return (
    
    <div id="app">
      <Tabs/>
      <h1>表現ぴったり探し</h1>
      <div id="chat_container" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`wrapper ${msg.isAi ? 'ai' : ''}`}>
            <div className="chat">
              <div className="message" id={msg.id}>
                {msg.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div id="inputarea">
        <form ref={formRef}>
          <textarea
            name="prompt"
            rows="1"
            cols="1"
            placeholder="探したい言葉を入力してね。(例：楽しい／さみしい)"
          ></textarea>
          <button type="submit">
            <img src="assets/send.svg" alt="実行する" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default HyougenPage;
