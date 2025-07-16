import { useState, useRef, useEffect } from 'react';
import './ChatWithOpenAI.css'; // LINE風のUIスタイルを追加
import RadioButtonForMap from './RadioButtonForMap';
import FloatingFrame from './FloatingFrame';
import { Canvas as ThreeCanvas, useFrame } from '@react-three/fiber'; // 名前を ThreeCanvas に変更して明確化
import { FaDownLong } from 'react-icons/fa6';
import { useGLTF, OrbitControls, Stats } from '@react-three/drei';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'; // useStateMachineInputを追加

const steps = [
  { theme: "開いたら出てくる画面", gif: "/images/anm_image1.gif", text: "開いたらまず真ん中くらいに「アイデア」と書いてある四角があるよ！" },
  { theme: "入力する用意をしよう", gif: "/images/anm_image2.gif", text: "真ん中にある四角をクリックすると上の入力らんに四角（アイデア）の文字が表示されるよ" },
  { theme: "入力してみよう", gif: "/images/anm_image3.gif", text: "入力らんに書きたいこと（まずはテーマ）を入力しよう" },
  { theme: "イメージマップでいらないところを削除しよう", gif: "/images/anm_image4.gif", text: "いらない四角の部分をクリックしよう。そのあと「Back Space（Windows）」ボタンをクリックしよう\n※Macの場合は「DELETE」をクリックしてください。" },
  { theme: "チャット機能を使おう！", gif: "/images/anm_image5.gif", text: "このチャット機能は、思いつかないときに質問してマップをどんどんふくらませるためにあるよ！まず、学年を選択して、作文か読書感想文どちらを書きたいか選ぼう！次に、それぞれそのあとに出てきた質問に対して答えよう。これで質問は終わりだよ！次にチャット機能を実際に使おう。３つの中から自分に合ったものを選んで送ろう！" },
  // 追加のステップも自由にここに入れられる
];

// Boxコンポーネント (変更なし)
function Box(props) {
  const ref = useRef();
  const [cliked, setCliked] = useState(false)
  const [hoverd, setHoverd] = useState(false);

  useFrame(() => (ref.current.rotation.x += 0.01))
  return (
    <mesh {...props} ref={ref} castShadow onClick={() => setCliked(!cliked)} scale={cliked ? 2 : 1} onPointerOver={() => setHoverd(true)} onPointerOut={() => setHoverd(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hoverd ? "hotpink" : "orange"} />
    </mesh>
  )
}

// GLTFモデル用のKomawanコンポーネント (元の定義のまま、今回は直接使用しない)
function Komawan(props) {
  const { scene, nodes } = useGLTF("models/komawan.glb")
  console.log('nodes:', nodes)
  console.log('scene:', scene)

  const mesh_kao = nodes["kuchi"]
  const mesh_mabuta = nodes["コマワンちゃんの瞼"]

  const blinkTriggered = useRef(false)
  console.log(nodes["kuchi"]);

  useFrame((state) => {
    if (mesh_kao && mesh_kao.children) { // children ではなく morphTargetInfluences などを使うのが一般的
      // mesh_kao.children = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 3)
      // 注意: mesh.children は通常、子オブジェクトの配列です。
      // シェイプキー(morphTarget)を操作する場合、mesh.morphTargetInfluences[index] のようにアクセスします。
      // この部分はGLTFモデルの構造に依存するため、適切に修正が必要です。
    }
    if (mesh_mabuta && mesh_mabuta.children) { // こちらも同様
      if (!blinkTriggered.current) {
        blinkTriggered.current = true;
        setTimeout(() => {
          let step = 0;
          const totalSteps = 5;
          const stepDelay = 50;
          function animateBlink() {
            if (step < totalSteps) {
              // mesh_mabuta.children = 0.5 + 0.5 * Math.sin((state.clock.elapsedTime + step * 0.05) * 3);
              step++;
              setTimeout(animateBlink, stepDelay);
            } else {
              // mesh_mabuta.children = 0;
              blinkTriggered.current = false;
            }
          }
          animateBlink();
        }, 3000);
      }
    }
  })
  return (
    <mesh>
      <primitive object={scene} />
    </mesh>
  )
}

const ChatWithOpenAI = ({ age, theme, goal, imagemap1 }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedRadio, setSelectedRadio] = useState('');
  const [showFrame, setShowFrame] = useState(false);
  const imagemapMaeRef = useRef("");

  // アニメーション実行中かどうかを管理する状態 (ボタンクリック用)
  const [isAnimating, setIsAnimating] = useState(false);
  // AI読み込み中かどうかを管理する状態
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleShowFrame = () => {
    setShowFrame(true);
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

  // Riveアニメーション設定
  const STATE_MACHINE_NAME = 'State Machine 1';
  const INPUT_NAME = 'rating'; // 実際のRiveファイル内のInput名に合わせて変更してください

  const { rive, RiveComponent } = useRive({
    src: '/models/comawan.riv',
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
    onLoad: () => {
      console.log('Rive file loaded successfully');
    },
    onLoadError: (error) => {
      console.error('Rive loading error:', error);
    },
    // アニメーションの状態変化を監視
    onStateChange: (event) => {
      console.log('Rive state changed:', event);
    },
    // アニメーションループの監視
    onLoop: (event) => {
      console.log('Rive animation looped:', event);
    }
  });

  const animation = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME);

  // 初期化時に標準状態を設定
  useEffect(() => {
    if (animation && rive) {
      // 少し遅延を入れてから初期値を設定
      setTimeout(() => {
        animation.value = 4;
        console.log('Animation initialized to default state (4)');
      }, 100);
    }
  }, [animation, rive]);

  // AI読み込み状態に基づいてRiveアニメーションを制御するuseEffect
  useEffect(() => {
    if (animation) {
      if (isAnimating) {
        // ボタンアニメーションが優先されるため、AI読み込み中はアニメーション値を変更しない
        console.log('Button animation active, AI loading animation suppressed.');
      } else if (isLoadingAI) {
        // AI読み込み中はアニメーション値を5に設定（ループアニメーション）
        animation.value = 5;
        console.log('AI loading: Animation set to 5 (looping)');
      } else {
        // AI読み込みもボタンアニメーションも実行中でない場合はデフォルトに戻す
        animation.value = 4;
        console.log('AI not loading, no button animation: Animation reset to 4');
      }
    }
  }, [isLoadingAI, animation, isAnimating]); // isAnimatingも依存配列に追加

  // アニメーション実行関数を分離 (ボタンクリック用)
  const triggerAnimation = () => {
    return new Promise(resolve => { // Promiseを返すように変更
      if (!animation || !rive) {
        console.warn('Animation or Rive instance not available');
        resolve(); // アニメーションがない場合も解決
        return;
      }

      try {
        setIsAnimating(true);
        console.log('Starting button animation sequence');

        animation.value = 1; // アクション状態
        console.log('Animation set to action state (1)');

        const buttonAnimationDuration = 1000; // 1秒に設定

        setTimeout(() => {
          if (animation) {
            // ボタンアニメーションが終了したら、まずリセット状態に戻す
            animation.value = 4;
            console.log('Animation reset to default state (4) after button click animation.');

            // 短い遅延を挟んでから、AI読み込み状態に応じてアニメーションを設定
            setTimeout(() => {
              if (isLoadingAI) { // ここでisLoadingAIの状態を再確認
                animation.value = 5; // AI読み込み中のループアニメーション
                console.log('Transitioning to AI loading animation (5).');
              }
              setIsAnimating(false); // ボタンアニメーションのフラグを解除
              console.log('Button animation sequence completed.');
              resolve();
            }, 100); // 短いリセット期間
          } else {
            setIsAnimating(false);
            resolve();
          }
        }, buttonAnimationDuration);

      } catch (error) {
        console.error('Button animation trigger failed:', error);
        setIsAnimating(false);
        resolve(); // エラー時も解決
      }
    });
  };

  // Riveアニメーションの状態を監視するカスタムフック (既存のまま)
  useEffect(() => {
    if (rive) {
      const handleRiveEvent = (event) => {
        console.log('Rive event:', event);
        // アニメーション完了時の処理
        if (event.type === 'stop' || event.type === 'pause') {
          // setIsAnimating(false); // この行はtriggerAnimation内で制御するため削除
        }
      };

      // イベントリスナーの追加（利用可能な場合）
      if (rive.on) {
        rive.on('stop', handleRiveEvent);
        rive.on('pause', handleRiveEvent);
      }

      // クリーンアップ
      return () => {
        if (rive.off) {
          rive.off('stop', handleRiveEvent);
          rive.off('pause', handleRiveEvent);
        }
      };
    }
  }, [rive]);
  const scrollableDivRef = useRef(null);

  // 修正されたhandleRadioChange関数
  const handleRadioChange = async (event) => { // asyncを追加
    const value = event.target.value;
    setSelectedRadio(value);

    console.log('Radio changed, value:', value);

    // ボタンクリックアニメーションを実行し、完了を待つ
    await triggerAnimation(); // awaitを追加
    // メッセージ送信
    sendMessage(value); // setTimeoutを削除
  };

  const sendMessage = async (selectedValueFromRadio) => {
    const userMessage = selectedValueFromRadio;
    console.log('Sending message:', userMessage);
    const input = imagemap1;
    console.log('Input imagemap:', input);

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
    function buildTree(nodesMap, edgesMap, rootId) {
      const root = {};
      if (nodesMap[rootId] && edgesMap[rootId]) {
        edgesMap[rootId].forEach((childId) => {
          const childLabel = nodesMap[childId];
          if (childLabel) {
            root[nodesMap[rootId]] = root[nodesMap[rootId]] || {};
            root[nodesMap[rootId]][childLabel] = buildTree(nodesMap, edgesMap, childId);
          }
        });
      }
      return root[nodesMap[rootId]] || nodesMap[rootId] || {};
    }

    // エッジもノードも存在しない場合に対応
    let result = {};
    if (Object.keys(nodes).length > 0) {
      const rootId = Object.keys(nodes).find(id => !Object.values(edges).flat().includes(id)) || "0";
      if (nodes[rootId]) {
        result = buildTree(nodes, edges, rootId);
        if (Object.keys(result).length === 0 && Object.keys(nodes).length > 0) {
          result = nodes[rootId];
        }
      } else if (Object.keys(nodes).length > 0) {
        result = nodes;
      } else {
        result = "No data available";
      }
    } else {
      result = "No data available";
    }
    console.log('Processed result:', JSON.stringify(result, null, 2));

    const feedbackPrompt = `
      作文の種類は: ${theme}
      どのようにするか: ${goal}
      ${imagemapMaeRef.current ? `前回のイメージマップ構成: ${imagemapMaeRef.current}` : ""}
      いまのイメージマップ構成: ${JSON.stringify(result, null, 2)}
      ユーザからのメッセージ（上に書いたものを参考に答えてください）: ${userMessage}
      ${imagemapMaeRef.current ? `最初に、前回のマップと今回のマップを比べた褒めをもらいたいです。たとえば、「〇〇についてが詳しくなりましたね！その調子です！」のような感じです。` : "最初の1行目に何もない状態から発生した設定として、頑張ったことについてほめてください。"}
      もし、ユーザからのメッセージが使い方がよくわかりませんと聞かれた場合、「左上の使い方とかいてあるボタンをクリックしてみよう」などと答えてください。
      次に、アドバイスを3つくらい提案してください。ほぼ完ぺきであれば、少なくてもかまいません。
      Nodeについてしゃべらないでください。Nodeはイメージマップを書くにあたっての初期値なので、その部分は何も変更を加えていない状況という設定として考えてください。
      また、ほめ方を、「作文に挑戦することはとても素晴らしいね」などの褒め方はよくないです。作文を書いていることについてやイメージマップを書いていることについてをほめるのではなく、イメージマップの内容についてほめてください。
      また、アドバイスは「〇〇を詳しく書くといいです。」などではなく、「〇〇について、△△や◆◆などのことを書いてみるといいかもしれないです。」など、加えるべきことについてほどほどに詳しくしてもらえたらと思います。
      `;

    console.log('Feedback prompt:', feedbackPrompt);

    // AI読み込み開始
    setIsLoadingAI(true);
    setChatHistory(prevChatHistory => [...prevChatHistory,
      { role: 'user', content: userMessage },
      { role: 'ai', content: <div style={{ display: "flex" }}><img src="/images/spinnerAnimation.svg" alt="" style={{ width: 17, height: "auto", margin: "0 5px 0 0", padding: 0 }} />まってね～</div> }
    ]);

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/api/azure", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: feedbackPrompt, gakunen: age }),
        mode: "cors"
      });
      if (scrollableDivRef.current){
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }

    if (animation && !isAnimating) {
    animation.value = 4;
    console.log('Auto-scroll: Animation reset to default state (4)');
  }

      const aiResponse = await response.json();
      console.log('AI Response:', aiResponse);

      // APIからの応答でチャット履歴を更新する際、スピナーメッセージを置き換える
      setChatHistory(prevChatHistory => {
        const newHistory = [...prevChatHistory];
        // 最後のメッセージがスピナーかどうかをチェックして置き換え
        if (newHistory.length > 0 &&
            newHistory[newHistory.length - 1].role === 'ai' &&
            typeof newHistory[newHistory.length - 1].content === 'object') {
          newHistory[newHistory.length - 1] = { role: 'ai', content: aiResponse.bot };
        } else {
          newHistory.push({ role: 'ai', content: aiResponse.bot });
        }
        return newHistory;
      });

      console.log('Final feedback prompt:', feedbackPrompt);
      imagemapMaeRef.current = JSON.stringify(result, null, 2);

    } catch (error) {
      console.error('API request failed', error);
      // エラー発生時もスピナーをエラーメッセージで置き換える
      setChatHistory(prevChatHistory => {
        const newHistory = [...prevChatHistory];
        if (newHistory.length > 0 &&
            newHistory[newHistory.length - 1].role === 'ai' &&
            typeof newHistory[newHistory.length - 1].content === 'object') {
          newHistory[newHistory.length - 1] = { role: 'ai', content: "ごめんなさい、エラーが起きました。" };
        } else {
          newHistory.push({ role: 'ai', content: "ごめんなさい、エラーが起きました。" });
        }
        return newHistory;
      });
    } finally {
      // AI読み込み終了
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="chat-container">
      <div className={showFrame ? "background" : ""}>
        {showFrame && <FloatingFrame steps={steps} onClose={handleCloseFrame} />}
      </div>
      <div className="chat-history" ref={scrollableDivRef}>
        <div className={`chat-bubble user`}>
          <p>私は {gradeJapan[age]} だよ。<br />{theme}についてのイメージマップを書いてるよ。<br />テーマは {goal} についてだよ。</p>
          <div className='blinking'><p><FaDownLong /> 下へ</p></div>
        </div>
        <div className={`chat-bubble ai`}>
          <p>では、ひだりのイメージマップツールを使ってあなたの{theme}の{goal}について思いつくことをまずひとつかいてみよう！</p>
          <br />
          <p>つかい方がわからないときは下のつかい方ボタンをクリックしてね！</p>
          <div className={`notimagemap app-container ${showFrame ? 'blur-background' : ''}`} style={{ textAlign: "center" }}>
            <button onClick={handleShowFrame}>つかい方</button>
          </div>
        </div>
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-bubble ${chat.role === 'user' ? 'user' : 'ai'}`}>
            <div>{chat.content}</div>
          </div>
        ))}
      </div>
      <div style={{zIndex:100}}>
        <RadioButtonForMap selectedValue={selectedRadio} onChange={handleRadioChange} />
      </div>
      <div className="chat-input-container">
        {/* RadioButtonForMap内で送信がトリガーされるため、ここは空 */}
      </div>

      {/* Riveアニメーションを表示するコンテナ */}
      <div className='komawan' style={{ marginTop: '20px', textAlign: 'center' }}>
        {RiveComponent && <RiveComponent style={{ width: '180px', height: '180px' }} />}
      </div>

      {/* 元の@react-three/fiberのCanvasとライト設定。
      もしGLTFモデルの<Komawan />や<Box />などを表示したい場合は、
      このThreeCanvasコンポーネント内で使用します。
      現在はコメントアウトされています。
      */}
      {/*
      <div className='three-js-canvas-container' style={{ width: '100%', height: '300px', marginTop: '20px', border: '1px solid #ccc' }}>
        <ThreeCanvas>
          <ambientLight intensity={1.5} />
          <directionalLight position={[0, 10, 5]} castShadow intensity={2.5} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          <directionalLight position={[0, -10, -5]} intensity={1.0} />
          <OrbitControls />
          <Stats />
        </ThreeCanvas>
      </div>
      */}
    </div>
  );
};

export default ChatWithOpenAI;
