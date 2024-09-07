import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import "./map.css"; // 必要なCSSファイルのパスを指定
import Tabs from "./../component/Tabs";
import ChatBot from "./ChatBot";
const materialColors = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFEB3B",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#9E9E9E",
  "#607D8B",
];

const getColorById = (id) =>
  materialColors[Math.abs(parseInt(id, 10)) % materialColors.length];

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style }) => {
  const color = getColorById(id);

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`}
      style={{ ...style, stroke: color, strokeWidth: 2 }}
    />
  );
};

const initialNodes = [
  {
    id: "0",
    type: "input",
    data: { label: "Node" },
    position: { x: 0, y: 50 },
  },
];

let id = 1;
const getId = () => `${id++}`;

const AddNodeOnEdgeDrop = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null); // 選択されたノードのID
  const [nodeLabel, setNodeLabel] = useState(""); // ノードのラベルを管理するステート
  const { screenToFlowPosition, getEdges, getNodes } = useReactFlow();
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodeEdgeInfo, setNodeEdgeInfo] = useState(""); // ノードとエッジ情報を表示するためのステート
  const [active, setActive] = useState(false);
  const [zenactive, setZenactive] = useState(false);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const chatContainerRef = useRef(null);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData(formRef.current);
  //   const userMessage = formData.get("prompt");

  //   addMessage(userMessage, false);

  //   formRef.current.reset();

  //   const uniqueId = generateUniqueId();
  //   addMessage("", true, uniqueId);

  //   scrollChatToBottom();

  //   const messageDiv = document.getElementById(uniqueId);
  //   if (messageDiv) {
  //     startLoader(messageDiv);
  //   }

  //   try {
  //     // const input = nodeEdgeInfo;
  //     // console.log(input);

  //     // // ノード情報を抽出
  //     // const nodeLines = input.match(/Node ID: \d+, Label: .+/g);
  //     // const nodes = {};

  //     // if (nodeLines && nodeLines.length > 0) {
  //     //   nodeLines.forEach((line) => {
  //     //     const match = line.match(/Node ID: (\d+), Label: (.+?), Position/);
  //     //     if (match) {
  //     //       const id = match[1];
  //     //       const label = match[2];
  //     //       nodes[id] = label;
  //     //     }
  //     //   });
  //     // }

  //     // // エッジ情報を取得
  //     // const edgeLines = input.match(/Edge ID: .+/g) || [];
  //     // const edges = {};

  //     // if (edgeLines && edgeLines.length > 0) {
  //     //   edgeLines.forEach((line) => {
  //     //     const match = line.match(/Source: (\d+), Target: (\d+)/);
  //     //     if (match) {
  //     //       const source = match[1];
  //     //       const target = match[2];
  //     //       if (!edges[source]) {
  //     //         edges[source] = [];
  //     //       }
  //     //       edges[source].push(target);
  //     //     }
  //     //   });
  //     // }

  //     // // データ構造の構築
  //     // function buildTree(nodes, edges, rootId) {
  //     //   const root = {};
  //     //   if (edges[rootId]) {
  //     //     edges[rootId].forEach((childId) => {
  //     //       const childLabel = nodes[childId];
  //     //       root[nodes[rootId]] = root[nodes[rootId]] || {};
  //     //       root[nodes[rootId]][childLabel] = buildTree(nodes, edges, childId);
  //     //     });
  //     //   }
  //     //   return root[nodes[rootId]] || nodes[rootId];
  //     // }

  //     // // エッジもノードも存在しない場合に対応
  //     // let result = {};
  //     // if (Object.keys(nodes).length > 0 && Object.keys(edges).length > 0) {
  //     //   const rootId = "0"; // 最初のノードのID
  //     //   result = buildTree(nodes, edges, rootId);
  //     // } else if (Object.keys(nodes).length > 0) {
  //     //   result = nodes; // ノードのみが存在する場合
  //     // } else {
  //     //   result = "No data available"; // ノードもエッジも存在しない場合
  //     // }
  //     // console.log(JSON.stringify(result, null, 2));

  //     //AIを呼び出す必要はない
  //     // const response = await fetch(process.env.REACT_APP_API_URL + "/danraku", {
  //     //   method: "POST",
  //     //   headers: { "Content-Type": "application/json" },
  //     //   body: JSON.stringify({
  //     //     prompt: `質問：${userMessage}　参考：${JSON.stringify(
  //     //       result,
  //     //       null,
  //     //       2
  //     //     )}　ちなみに、聞いていること以外話さないでください。もし、どうすればいいですか？などの質問であれば、参考に書かれていることにあるJson形式のものをイメージマップ・マインドマップと認識し、作文に対してのほかに必要なものを提案してください。例えば、そのイメージマップが読書感想文だと認識したら、かつあらすじをかいていなかったらあらすじを書いてという提案などをするとか・・・。Nodeという言葉は初期値なので、Nodeというテーマだと勘違いしないでください。もし、Nodeという言葉しか存在しない場合は　「頑張ってるね！！もし使い方がわからなかったら左上にある作り方を参考に書いてみましょう。もし、何を書いていいかわからない場合、読書感想文だとあらすじや感想をかくといいよ」のようなことを教えてください、そして、「Node」という言葉しかない場合という言葉を絶対に入れないでください！必要ありません。もし、できましたと答えられた場合、見たところ不足しているなと思うところをいくつか挙げてください、たとえば感想がうれしかったなどという簡単か言葉から何かが続いていなかったらなにがうれしかったのですかとかあらすじが短かったら詳しくどんなお話なのか書いてみてください、ここの部分を詳しく書こうなど、そのほかにも必要と思うことは書いてください。そこそこできていれば1行目などに褒めを入れてユーザが喜んでもらえるようにしてください。で、例えば質問とかではなくありがとうなど感謝を伝えられた時はどういたしまして！のような返事を返してください。褒め方はすごい！やいいね！などいわれてうれしいことを言ってください。決して良くできましたという言葉を使わないこと。この言葉は日本人にとって上から目線でむかつく言葉に当たります。`,
  //     //     gakunen: "s6",
  //     //   }),
  //     // });
    

  //     // stopLoader();

  //     // if (response.ok) {
  //     //   const data = await response.json();
  //     //   const parsedData = data.bot.trim();
  //     //   console.log("AIの回答:", parsedData); // AIの回答をコンソールに表示
  //     //   animateMessage(uniqueId, parsedData);
  //     // } else {
  //     //   const err = await response.text();
  //     //   updateMessage(uniqueId, "エラーが出たのでもう一度入力してください。");
  //     //   alert(err);
  //     // }
  //   } catch (error) {
  //     // stopLoader();
  //     updateMessage(uniqueId, "エラーが出たのでもう一度入力してください。");
  //     alert(error);
  //   }
  // };
  const startLoader = (element) => {
    element.textContent = "";
    setLoading(true);
    const interval = setInterval(() => {
      element.textContent += ".";
      if (element.textContent.length > 3) {
        element.textContent = "";
      }
    }, 300);
    return interval;
  };

  const stopLoader = () => {
    setLoading(false);
  };

  const animateMessage = (id, text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    const messageDiv = document.getElementById(id);

    if (messageDiv) {
      messageDiv.innerHTML = ""; // Clear the existing content
      let lineIndex = 0;

      const addLine = () => {
        if (lineIndex < lines.length) {
          const lineElement = document.createElement("p");
          lineElement.className = "fade-in"; // Apply fade-in effect
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
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: uniqueId || generateUniqueId(), value: isAi ? [] : [value], isAi },
    ]);
  };

  const updateMessage = (id, value) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, value: [value] } : msg
      )
    );
  };

  const scrollChatToBottom = () => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const handleClick = () => {
    inputRef.current.focus(); // Focus the input element
  };

  const classToggle = () => {
    setActive(!active);
  };
  const zenGamen = () => {
    setZenactive(!active);
  };
  const onConnect = useCallback((params) => {
    connectingNodeId.current = null;
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        const id = getId();
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label: `Node ${id}` },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id: `e${connectingNodeId.current}-${id}`,
            source: connectingNodeId.current,
            target: id,
          })
        );
      }
    },
    [screenToFlowPosition]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    setNodeLabel(node.data.label); // 選択されたノードのラベルを設定
  }, []);

  const onLabelChange = useCallback(
    (event) => {
      setNodeLabel(event.target.value);
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? { ...node, data: { label: event.target.value } }
            : node
        )
      );
    },
    [selectedNodeId, setNodes]
  );

  const onPaneClick = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains("react-flow__pane");
      if (targetIsPane) {
        const { clientX, clientY } = event;
        const newNode = {
          id: getId(),
          position: screenToFlowPosition({ x: clientX, y: clientY }),
          data: { label: `Node ${id}` },
        };
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [screenToFlowPosition]
  );

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "Backspace") {
        const selectedEdges = getEdges().filter((edge) => edge.selected);
        if (selectedEdges.length) {
          setEdges((eds) =>
            eds.filter((edge) => !selectedEdges.includes(edge))
          );
        }
      }
    },
    [getEdges]
  );

  // 定期的にノードとエッジの情報を更新
  useEffect(() => {
    const intervalId = setInterval(() => {
      const nodesInfo = getNodes()
        .map(
          (node) =>
            `Node ID: ${node.id}, Label: ${node.data.label}, Position: (${node.position.x}, ${node.position.y})`
        )
        .join("\n");
      const edgesInfo = getEdges()
        .map(
          (edge) =>
            `Edge ID: ${edge.id}, Source: ${edge.source}, Target: ${edge.target}`
        )
        .join("\n");
      setNodeEdgeInfo(`${nodesInfo}\n\n${edgesInfo}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [getNodes, getEdges]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nodesInfo = getNodes()
        .map(
          (node) =>
            `Node ID: ${node.id}, Label: ${node.data.label}, Position: (${node.position.x}, ${node.position.y})`
        )
        .join("\n");
      const edgesInfo = getEdges()
        .map(
          (edge) =>
            `Edge ID: ${edge.id}, Source: ${edge.source}, Target: ${edge.target}`
        )
        .join("\n");
      setNodeEdgeInfo(`${nodesInfo}\n\n${edgesInfo}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [getNodes, getEdges]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Chromeでの警告表示に必要
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <Tabs pageTitle="イメージマップ作成ツール" contents="genkouyoshi" />
      <div
        className="wrapper"
        ref={reactFlowWrapper}
        style={{ width: "100%", height: "500px", position: "relative" }}
      >
        <button style={{ marginRight: "100%" }}>
          使い方
        </button>
        <div className="node-input">
          <label htmlFor="node-label" style={{ textAlign: "center" }}>
            思いついたことを入力
          </label>
          <textarea
            id="node-label"
            type="text"
            value={nodeLabel}
            onChange={onLabelChange}
            placeholder="ノードのラベルを入力"
            disabled={selectedNodeId === null} // ノードが選択されていないときは入力を無効にする
          />
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 2 }}
          nodeOrigin={[0.5, 0]}
          edgeTypes={{ custom: CustomEdge }}
        >
          <Controls />
          <MiniMap />
          <button onClick={zenGamen}>{zenactive ? "全画面" : "小画面"}</button>
        </ReactFlow>
        <div
          className={active ? "node-edge-info sideOutLeft" : "node-edge-info"}
        >
          {/* {nodeEdgeInfo} */}
           <button onClick={classToggle} className="akesimebutton">
            {active ? "◀" : "▶"}
          </button>
          {/*<div className="chatsousin">
            <form ref={formRef} onSubmit={handleSubmit}>
              <textarea
                type="text"
                ref={inputRef}
                name="prompt"
                placeholder="例：分かりました／どうすればいいですか"
                required
              />
              <button onClick={handleClick}>送信</button>
            </form>
          </div>
          <div id="chat_container" ref={chatContainerRef}>
            {loading && !loadingComplete ? (
              <AnimationKomawanPage /> // アニメーションを表示
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`wrapper${msg.isAi ? "ai" : ""}`}>
                  <div className="chat">
                    <div className="message" id={msg.id}>
                      {msg.value.map((line, index) => (
                        <p key={index} className={msg.isAi ? "fade-in" : ""}>
                          <span>{line}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div> */}
          <ChatBot imagemap1={nodeEdgeInfo}/>
        </div>
      </div>
    </div>
  );
};

const ImagemapPage = () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);

export default ImagemapPage;
