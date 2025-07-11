import React, { useCallback, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import "./map.css"; // 必要なCSSファイルのパスを指定
import Tabs from "./../component/Tabs";
import ChatBot from "./ChatBot";
import DownloadButton from "../component/DownloadButton";
import FloatingFrame from "../component/FloatingFrame";
import NextPageLink from "../component/NextPageLink";
import { Helmet } from "react-helmet-async";
import Footer from "./Footer";

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
    data: { label: "アイデア" },
    position: { x: 0, y: 50 },
  },
];

let id = 1;
const getId = () => `${id++}`;

const AddNodeOnEdgeDrop = () => {
  const { t } = useTranslation();
  const steps = t('imagemapPage.steps', { returnObjects: true }).map((step, index) => ({
    ...step,
    gif: `/images/anm_image${index + 1}.gif`
  }));
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
  const [nodeAdded, setNodeAdded] = useState(false);
  const [showFrame, setShowFrame] = useState(false); // フレームの表示状態を管理

  const handleShowFrame = () => {
    setShowFrame(true); // ボタンを押したらフレームを表示
  };
  const handleCloseFrame = () => {
    setShowFrame(false);
  }

  const classToggle = () => {
    setActive(!active);
  };
  const zenGamen = () => {
    setZenactive(!zenactive);
  };
  const onConnect = useCallback((params) => {
    connectingNodeId.current = null;
    setEdges((eds) => addEdge(params, eds));
    setNodeAdded(false);
  }, []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current || nodeAdded) return;
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
          data: { label: `アイデア ${id}` },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id: `e${connectingNodeId.current}-${id}`,
            source: connectingNodeId.current,
            target: id,
          })
        );
        setNodeAdded(true);
      }
    },
    [screenToFlowPosition,nodeAdded]
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
      if (nodeAdded) return;
      const targetIsPane = event.target.classList.contains("react-flow__pane");
      if (targetIsPane) {
        const { clientX, clientY } = event;
        const newNode = {
          id: getId(),
          position: screenToFlowPosition({ x: clientX, y: clientY }),
          data: { label: `アイデア ${id}` },
        };
        setNodes((nds) => nds.concat(newNode));
        setNodeAdded(true);
      }
    },
    [screenToFlowPosition,nodeAdded]
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
  useEffect(() => {
    setNodeAdded(false);
  },[nodes,edges]);

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
  const style = `
   .notimagemap{
    display: ${zenactive ? "none" : ""};
  }
  .react-flow{
    width:${zenactive ? "100%" :"100%"} !important;
    height:${zenactive ? "110%" :"100%"} !important;
    max-width:300%;
  }
  `

  return (
    <div style={{position:"absolute"}} className={`imagemapimagemap ${zenactive ? "zengamen" : ""}`}>
      <Helmet><title>{t('imagemapPage.helmet')}</title></Helmet>
      <style>{style}</style>
      <div className={showFrame ? "background" : ""}>
      {showFrame && <FloatingFrame steps={steps} onClose={handleCloseFrame}/>}</div>
      <div className="notimagemap">
      <Tabs pageTitle={t('imagemapPage.title')} contents="imagemapmake" />
      </div>
      <div
        className="wrapper"
        ref={reactFlowWrapper}
        style={{ width: "100%", height: "500px", position: "relative" }}
      > <div className={`notimagemap app-container ${showFrame ? 'blur-background' : ''}`} style={{textAlign:"center"}}>
        <button onClick={handleShowFrame} className="howa">
          {t('imagemapPage.howToButton')}
        </button>
        </div>
        <div className="node-input" style={{textAlign:"center"}}>
          <label htmlFor="node-label" style={{ textAlign: "center" }}>
            {t('imagemapPage.inputLabel')}
          </label>
          <input
            id="node-label"
            type="text"
            value={nodeLabel}
            onChange={onLabelChange}
            placeholder={t('imagemapPage.inputPlaceholder')}
            disabled={selectedNodeId === null} // ノードが選択されていないときは入力を無効にする
            className="nodebox"
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
          <DownloadButton/>
          <button onClick={zenGamen} style={{left:0,zIndex:"2147483647",position:"absolute"}}>{zenactive ? t('imagemapPage.exitFullscreenButton') : t('imagemapPage.fullscreenButton')}</button>
        </ReactFlow>
        <div className="notimagemap">
        <div
          className={active ? "node-edge-info sideOutLeft" : "node-edge-info sideOutRight"} style={{borderRadius:"1em",boxShadow:"0 0 8px #00000033",border:"1px solid #ffffff"}}
        >
          {/* {nodeEdgeInfo} */}
           <button onClick={classToggle} className="akesimebutton" style={{height:"100%",textAlign:"center",position:"relative"}}>
            <div style={{display:"inline-block",writingMode:"vertical-rl",position:"absolute",left:"50%",transform:"translateX(-50%)"}}>{active ? <>{t('imagemapPage.openButton')}</> : <>{t('imagemapPage.closeButton')}</>}</div>
          </button>
          
          <ChatBot imagemap1={nodeEdgeInfo}/>
        </div></div>
      </div>
      <br />
      <div style={{marginTop:300}}>
      <NextPageLink imairu="hyougen1"/>
      </div>
      <Footer/>
    </div>
  );
};

const ImagemapPage = () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);

export default ImagemapPage;
