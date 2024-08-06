import React, { useState, useRef, useEffect } from 'react';
import Tabs from '../component/Tabs';
import AnimationKomawanPage from './AnimationKomawanPage'; // インポートするコンポーネント

const HyougenPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const chatContainerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
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

      try {
        const response = await fetch(process.env.REACT_APP_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userMessage,sakka: 'あまんきみこ' }),
        });

        stopLoader();

        if (response.ok) {
          const data = await response.json();
          const parsedData = data.bot.trim();
          console.log('AIの回答:', parsedData); // AIの回答をコンソールに表示
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

    formRef.current.addEventListener('submit', handleSubmit);
    formRef.current.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        handleSubmit(e);
      }
    });

    return () => {
      formRef.current.removeEventListener('submit', handleSubmit);
      formRef.current.removeEventListener('keyup', handleSubmit);
    };
  }, []);

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

  return (
    <div id="app">
      <Tabs pageTitle="表現ぴったり探し"/>
      <div id="inputarea" style={{marginBottom:"0"}}>
        <p style={{margin:0}}>探したい言葉を入力してね。<br/>10個の例を教えてくれるよ！<br/>文章をすてきにするために参考にしてね！</p>
        <br />
        <form ref={formRef}>
          <input
            name="prompt"
            rows="1"
            cols="1"
            placeholder="例：楽しい／さみしい"
            required
          />
          <br />
          <button type="submit">
            この言葉の表現を探す！
          </button>
        </form>
        <div id="chat_container" ref={chatContainerRef}>
          {loading && !loadingComplete ? (
            <AnimationKomawanPage /> // アニメーションを表示
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
    </div>
  );
};

export default HyougenPage;
