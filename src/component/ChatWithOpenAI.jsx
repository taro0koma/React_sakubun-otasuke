import { useState } from 'react';
import './ChatWithOpenAI.css';  // LINE風のUIスタイルを追加

const ChatWithOpenAI = ({ age, theme, goal,imagemap1 }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // ボタンが押されたときに、クリックされたボタンの文字列をセット
  const handleButtonClick = (fruit) => {
    setInputValue(fruit);
    setMessage(fruit);
  };

  const sendMessage = async () => {
    const input = imagemap1;
      console.log(input);

      // ノード情報を抽出
      const nodeLines = input.match(/Node ID: \d+, Label: .+/g);
      const nodes = {};

      if (nodeLines && nodeLines.length > 0) {
        nodeLines.forEach((line) => {
          const match = line.match(/Node ID: (\d+), Label: (.+?), Position/);
          if (match) {
            const id = match[1];
            const label = match[2];
            nodes[id] = label;
          }
        });
      }

      // エッジ情報を取得
      const edgeLines = input.match(/Edge ID: .+/g) || [];
      const edges = {};

      if (edgeLines && edgeLines.length > 0) {
        edgeLines.forEach((line) => {
          const match = line.match(/Source: (\d+), Target: (\d+)/);
          if (match) {
            const source = match[1];
            const target = match[2];
            if (!edges[source]) {
              edges[source] = [];
            }
            edges[source].push(target);
          }
        });
      }

      // データ構造の構築
      function buildTree(nodes, edges, rootId) {
        const root = {};
        if (edges[rootId]) {
          edges[rootId].forEach((childId) => {
            const childLabel = nodes[childId];
            root[nodes[rootId]] = root[nodes[rootId]] || {};
            root[nodes[rootId]][childLabel] = buildTree(nodes, edges, childId);
          });
        }
        return root[nodes[rootId]] || nodes[rootId];
      }

      // エッジもノードも存在しない場合に対応
      let result = {};
      if (Object.keys(nodes).length > 0 && Object.keys(edges).length > 0) {
        const rootId = "0"; // 最初のノードのID
        result = buildTree(nodes, edges, rootId);
      } else if (Object.keys(nodes).length > 0) {
        result = nodes; // ノードのみが存在する場合
      } else {
        result = "No data available"; // ノードもエッジも存在しない場合
      }
      console.log(JSON.stringify(result, null, 2));
    const feedbackPrompt = `
      作文の種類は: ${theme}
      どのようにするか: ${goal}
      前回のイメージマップ構成: 
      いまのイメージマップ構成: ${JSON.stringify(result, null, 2)}
      ユーザからのメッセージ（上に書いたものを参考に答えてください）: ${message}
      
      最初に、イメージマップに対してほめてください。
      もし、使い方がよくわかりませんと聞かれた場合、左上の使い方とかいてあるボタンをクリックしてみようなどと答えてください。
      次に、フィードバックを3つくらい書いてください。ほぼ完ぺきであれば、少なくてもかまいません。
      `;
    
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/danraku", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: feedbackPrompt, gakunen:age }),
      });
      
      const aiResponse = await response.json();
      console.log(aiResponse);
      setChatHistory([...chatHistory, { role: 'user', content: message }, { role: 'ai', content: aiResponse.bot }]);
      setMessage('');
    } catch (error) {
      console.error('API request failed', error);
    }
  };


  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-bubble ${chat.role === 'user' ? 'user' : 'ai'}`}>
            <p>{chat.content}</p>
          </div>
        ))}
      </div>
        <button onClick={() => handleButtonClick('イメージマップを見てください')}>イメージマップを見てください</button>
        <button onClick={() => handleButtonClick('使い方がよくわかりません')}>使い方がよくわかりません</button>
        <button onClick={() => handleButtonClick('思い浮かびません')}>思い浮かびません</button>
      <div className="chat-input-container">
        {/* <input
          type="text"
          className="chat-input"
          value={inputValue}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力..."
        /> */}
        <p className='chat-input'>{inputValue}</p>

        <button onClick={sendMessage} className="send-button">お願い</button>
      </div>
    </div>
  );
};

export default ChatWithOpenAI;
