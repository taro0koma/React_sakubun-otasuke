import { useState,useRef } from 'react';
import './ChatWithOpenAI.css';  // LINE風のUIスタイルを追加
import RadioButtonForMap from './RadioButtonForMap';
import FloatingFrame from './FloatingFrame';
import { Canvas, useFrame } from '@react-three/fiber'
import { FaDownLong } from 'react-icons/fa6';
import {useGLTF,OrbitControls,Stats} from '@react-three/drei';

const steps = [
  { theme: "開いたら出てくる画面", gif: "/images/anm_image1.gif", text: "開いたらまず真ん中くらいに「アイデア」と書いてある四角があるよ！" },
  { theme: "入力する用意をしよう", gif: "/images/anm_image2.gif", text: "真ん中にある四角をクリックすると上の入力らんに四角（アイデア）の文字が表示されるよ" },
  { theme: "入力してみよう", gif: "/images/anm_image3.gif", text: "入力らんに書きたいこと（まずはテーマ）を入力しよう" },
  { theme: "イメージマップでいらないところを削除しよう", gif: "/images/anm_image4.gif", text: "いらない四角の部分をクリックしよう。そのあと「Back Space（Windows）」ボタンをクリックしよう\n※Macの場合は「DELETE」をクリックしてください。" },
  { theme: "チャット機能を使おう！", gif: "/images/anm_image5.gif", text: "このチャット機能は、思いつかないときに質問してマップをどんどんふくらませるためにあるよ！まず、学年を選択して、作文か読書感想文どちらを書きたいか選ぼう！次に、それぞれそのあとに出てきた質問に対して答えよう。これで質問は終わりだよ！次にチャット機能を実際に使おう。３つの中から自分に合ったものを選んで送ろう！" },
  // 追加のステップも自由にここに入れられる
];


function Box(props){
  const ref = useRef();
  const [cliked, setCliked] = useState(false)
  const [hoverd,setHoverd] = useState(false);

  useFrame(() => (ref.current.rotation.x += 0.01))
  return(
    <mesh {...props} ref={ref} castShadow onClick={() => setCliked(!cliked)} scale={cliked ? 2:1} onPointerOver={() => setHoverd(true)} onPointerOut={() => setHoverd(false)}>
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color={hoverd ? "hotpink" : "orange"} />
    </mesh>
  )
}

function Komawan(props){
  // const ref = useRef();
  const { scene, nodes } = useGLTF("models/komawan.glb")
  console.log('nodes:', nodes)
  console.log('scene:', scene)
  const mesh_kao = nodes["コマワンちゃんの顔test"] || scene.children.find(child => child.isMesh)
  const mesh_mabuta = nodes["コマワンちゃんの瞼とかまつ毛001"] || scene.children.find(child => child.isMesh)

  // 瞬き処理がすでにスケジュールされているかを管理する
  const blinkTriggered = useRef(false)

  useFrame((state) => {
    // 顔のシェイプキーはサイン波で常にアニメーション
    if (mesh_kao && mesh_kao.morphTargetInfluences) {
      mesh_kao.morphTargetInfluences[0] = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 0)
    }
    // 瞼（mesh_mabuta）の処理
    if (mesh_mabuta && mesh_mabuta.morphTargetInfluences) {
      // すでに瞬き処理がスケジュールされていなければ
      if (!blinkTriggered.current) {
        blinkTriggered.current = true;
        // 3000ms 後に瞬きを開始
        setTimeout(() => {
          let step = 0;
          const totalSteps = 5;       // 瞬きを5段階で実施
          const stepDelay = 50;       // 各ステップの間隔（ミリ秒）
          // 再帰的に各ステップの値を更新する関数
          function animateBlink() {
            if (step < totalSteps) {
              // state.clock.elapsedTime は setTimeout 内では固定値となりがちなので、
              // 各ステップでオフセットを加えて変化を付けています
              mesh_mabuta.morphTargetInfluences[0] = 0.5 + 0.5 * Math.sin((state.clock.elapsedTime + step * 0.05) * 1);
              step++;
              setTimeout(animateBlink, stepDelay);
            } else {
              // 瞬き終了後は 0 にリセット
              mesh_mabuta.morphTargetInfluences[0] = 0;
              blinkTriggered.current = false;
            }
          }
          animateBlink();
        }, 3000);
      }
    }
  })
  // useFrame(() => (ref.current.rotation.x += 0.01))
  // console.log(ref.current.rotation.x);
  return(
    <mesh>
    <primitive object={scene} />
    </mesh>
  )
}

const ChatWithOpenAI = ({ age, theme, goal,imagemap1 }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedRadio, setSelectedRadio] = useState('');
  const [showFrame, setShowFrame] = useState(false);
  let imagemapMae = "";
  const handleShowFrame = () => {
    setShowFrame(true); // ボタンを押したらフレームを表示
  };

  const handleCloseFrame = () => {
    setShowFrame(false);
  }

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

  const handleRadioChange = (event) => {  // ✨ 新しい関数を追加
    const value = event.target.value;
    setSelectedRadio(value);  // ✨ ラジオボタンの値をセット
    sendMessage(value);
  };

  const sendMessage = async (selectedValue) => {
    console.log(selectedValue);
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
      ${imagemapMae ? `前回のイメージマップ構成: ${imagemapMae}` : ""}
      いまのイメージマップ構成: ${JSON.stringify(result, null, 2)}
      ユーザからのメッセージ（上に書いたものを参考に答えてください）: ${selectedValue}
      ${imagemapMae ? `最初に、前回のマップと今回のマップを比べた褒めをもらいたいです。たとえば、「〇〇についてが詳しくなりましたね！その調子です！」のような感じです。` : "最初の1行目に何もない状態から発生した設定として、頑張ったことについてほめてください。"}
      もし、ユーザからのメッセージが使い方がよくわかりませんと聞かれた場合、「左上の使い方とかいてあるボタンをクリックしてみよう」などと答えてください。
      次に、アドバイスを3つくらい提案してください。ほぼ完ぺきであれば、少なくてもかまいません。
      Nodeについてしゃべらないでください。Nodeはイメージマップを書くにあたっての初期値なので、その部分は何も変更を加えていない状況という設定として考えてください。
      また、ほめ方を、「作文に挑戦することはとても素晴らしいね」などの褒め方はよくないです。作文を書いていることについてやイメージマップを書いていることについてをほめるのではなく、イメージマップの内容についてほめてください。
      また、アドバイスは「〇〇を詳しく書くといいです。」などではなく、「〇〇について、△△や◆◆などのことを書いてみるといいかもしれないです。」など、加えるべきことについてほどほどに詳しくしてもらえたらと思います。
      `;
      console.log(selectedValue);
      setChatHistory([...chatHistory, { role: 'user', content: selectedValue }, { role: 'ai', content: <div style={{display:"flex"}}><img src="/images/spinnerAnimation.svg" alt="" style={{width:17,height:"auto",margin:"0 5px 0 0",padding:0}}/>まってね～</div> }]);
    
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/api/azure", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: feedbackPrompt, gakunen:age }),
        mode:"cors"
      });
      
      const aiResponse = await response.json();
      console.log(aiResponse);
      setChatHistory([...chatHistory, { role: 'user', content: selectedValue },{ role: 'ai', content: aiResponse.bot }]);
      setMessage('');
      console.log(feedbackPrompt);
      imagemapMae = JSON.stringify(result, null, 2);
    } catch (error) {
      console.error('API request failed', error);
    }
  };


  return (
    <div className="chat-container">
      <div className={showFrame ? "background" : ""}>
      {showFrame && <FloatingFrame steps={steps} onClose={handleCloseFrame}/>}</div>
      <div className="chat-history">
      <div className={`chat-bubble user`}>
            <p>私は {gradeJapan[age]} だよ。<br/>{theme}についてのイメージマップを書いてるよ。<br/>テーマは {goal} についてだよ。</p><div className='blinking'><p><FaDownLong/> 下へ</p></div>
        </div>
      <div className={`chat-bubble ai`}>
            <p>では、ひだりのイメージマップツールを使ってあなたの{theme}の{goal}について思いつくことをまずひとつかいてみよう！</p>
            <br />
            <p>つかい方がわからないときは下のつかい方ボタンをクリックしてね！</p>
            <div className={`notimagemap app-container ${showFrame ? 'blur-background' : ''}`} style={{textAlign:"center"}}>
            <button onClick={handleShowFrame}>つかい方</button>
            </div>
        </div>
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-bubble ${chat.role === 'user' ? 'user' : 'ai'}`}>
            <div>{chat.content}</div>
          </div>
        ))}
      </div>
        <RadioButtonForMap selectedValue={selectedRadio} onChange={handleRadioChange}/>
      <div className="chat-input-container">
      {/* {selectedRadio ? (
        <button onClick={sendMessage} className="send-button">
        <p className='chat-input' >{selectedRadio}　</p>をお願いする</button>
      ) : (
        <button className="send-button" disabled>
        上から１つえらんでください</button>
      )} */}
        
      </div>
      <div className='komawan'>
        <Canvas>
          {/* <mesh position={[-10, -2, 1]}> */}
          {/* <boxGeometry args={[2, 2, 2]} /> */}
          <Komawan/>
          <directionalLight position={[0, 3, 5]} castShadow intensity={2.5} />
          <directionalLight position={[0, -10, 11]} castShadow intensity={2.5} />
          <ambientLight intensity={0.5} />
          {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1}/> */}
          {/* </mesh> */}
        </Canvas>
        </div>
    </div>
  );
};

export default ChatWithOpenAI;
