import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
} from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Handle,
  ReactFlowProvider,
  useReactFlow,
  NodeResizer,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { t } from "i18next";
import Joyride from "react-joyride";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import ChatBot from './../ChatBot';
import DownloadButton from './../../component/DownloadButton';

// カスタムノードコンポーネント - 上下のハンドルを両方source/targetに！
const CustomNode = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const { deleteElements } = useReactFlow();

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  // ハンドルのスタイル
  const handleStyle = { 
    borderRadius: "50%", 
    backgroundColor: "#555",
    width: 10,
    height: 10,
  };

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        handleStyle={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
        }}
        lineStyle={{
          borderWidth: 2,
          borderColor: "#3b82f6",
        }}
      />
      <div
        style={{
          padding: 10,
          border: selected ? "3px solid #3b82f6" : "2px solid #555",
          borderRadius: 8,
          background: "white",
          width: "100%",
          height: "100%",
          textAlign: "center",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* 上のハンドル - sourceとtargetの両方 */}
        <Handle 
          type="source" 
          position="top" 
          id="top-source"
          style={handleStyle} 
        />
        <Handle 
          type="target" 
          position="top" 
          id="top-target"
          style={handleStyle} 
        />
        
        {/* 下のハンドル - sourceとtargetの両方 */}
        <Handle 
          type="source" 
          position="bottom" 
          id="bottom-source"
          style={handleStyle} 
        />
        <Handle 
          type="target" 
          position="bottom" 
          id="bottom-target"
          style={handleStyle} 
        />

        {isEditing ? (
          <textarea
            autoFocus
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              data.label = e.target.value;
            }}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setIsEditing(false);
              }
            }}
            style={{
              border: "none",
              outline: "none",
              textAlign: "center",
              width: "100%",
              height: "100%",
              background: "transparent",
              resize: "none",
              fontFamily: "inherit",
              fontSize: "inherit",
              padding: 0,
              boxSizing: "border-box",
            }}
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            style={{
              cursor: "text",
              width: "100%",
              height: "100%",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
              overflow: "hidden",
            }}
          >
            {label}
          </div>
        )}

        {selected && (
          <button
            onClick={handleDelete}
            className="trash"
          >
            <img src="images\trash_icon.svg" alt="" width="64" height="64" />
          </button>
        )}
      </div>
    </>
  );
};

let id = 1;
const getId = () => `${id++}`;

function MindMapFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "0",
      type: "custom",
      position: { x: 250, y: 250 },
      data: { label: "メインアイデア\n" },
      style: { width: 180, height: 100 },
    },
  ]);
  const [edges, setEdges, onEdgesState] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const connectingNodeId = useRef(null);
  const [nodeAdded, setNodeAdded] = useState(false);
  
  // ドラッグ状態の管理
  const [isDraggingNewNode, setIsDraggingNewNode] = useState(false);
  const [dragGhostPosition, setDragGhostPosition] = useState({ x: 0, y: 0 });
  const dragStartButtonPos = useRef({ x: 0, y: 0 });

  // チャットパネルの状態管理
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const CHAT_PANEL_WIDTH = 400;
  const TOGGLE_BUTTON_WIDTH_OPEN = 40;
  const TOGGLE_BUTTON_WIDTH_CLOSED = 50;
  const TOGGLE_BUTTON_HEIGHT = 100;

  // ノードとエッジ情報を文字列化する関数
  const getNodeEdgeInfo = useCallback(() => {
    const nodesInfo = nodes
      .map(
        (node) =>
          `Node ID: ${node.id}, Label: ${node.data.label}, Position: (${node.position.x}, ${node.position.y})`
      )
      .join("\n");
    const edgesInfo = edges
      .map(
        (edge) =>
          `Edge ID: ${edge.id}, Source: ${edge.source}, Target: ${edge.target}`
      )
      .join("\n");
    return `${nodesInfo}\n\n${edgesInfo}`;
  }, [nodes, edges]);

  const onNodeClick = useCallback(
    (event, node) => {
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: n.id === node.id,
        }))
      );
    },
    [setNodes]
  );

  const onConnect = useCallback(
    (params) => {
      connectingNodeId.current = null;
      setEdges((eds) => addEdge({ ...params, animated: true, type: "smoothstep" }, eds));
      setNodeAdded(false);
    },
    [setEdges]
  );

  const onConnectStart = useCallback((_, { nodeId, handleId, handleType }) => {
    connectingNodeId.current = { nodeId, handleId, handleType };
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current || nodeAdded) return;

      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        const { nodeId, handleId, handleType } = connectingNodeId.current;
        const newId = getId();
        const newNode = {
          id: newId,
          type: "custom",
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label: `アイデア ${newId}` },
          style: { width: 150, height: 80 },
          selected: true,
        };

        setNodes((nds) =>
          nds.map((n) => ({ ...n, selected: false })).concat(newNode)
        );

        // 接続元のハンドル位置に基づいて新しいノードの適切なハンドルを選択
        const sourceHandleId = handleId || (handleType === "source" ? "top-source" : "top-target");
        const targetHandleId = sourceHandleId.includes("top") ? "bottom-target" : "top-target";

        const newEdge =
          handleType === "source"
            ? {
                id: `e${nodeId}-${newId}`,
                source: nodeId,
                sourceHandle: sourceHandleId,
                target: newId,
                targetHandle: targetHandleId,
                animated: true,
                type: "smoothstep",
              }
            : {
                id: `e${newId}-${nodeId}`,
                source: newId,
                sourceHandle: targetHandleId.replace("target", "source"),
                target: nodeId,
                targetHandle: sourceHandleId.replace("source", "target"),
                animated: true,
                type: "smoothstep",
              };

        setEdges((eds) => eds.concat(newEdge));
        setNodeAdded(true);
      }

      connectingNodeId.current = null;
    },
    [screenToFlowPosition, setNodes, setEdges, nodeAdded]
  );

  // 新規ノード追加ボタンのドラッグ開始
  const handleNewNodeDragStart = useCallback((e) => {
    e.preventDefault();
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    dragStartButtonPos.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    setIsDraggingNewNode(true);
    setDragGhostPosition({ x: clientX, y: clientY });
  }, []);

  // ドラッグ中
  const handleNewNodeDragMove = useCallback((e) => {
    if (!isDraggingNewNode) return;
    
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    setDragGhostPosition({ x: clientX, y: clientY });
  }, [isDraggingNewNode]);

  // ドラッグ終了
  const handleNewNodeDragEnd = useCallback((e) => {
    if (!isDraggingNewNode) return;
    
    const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;
    
    // ReactFlowキャンバス内かチェック
    const reactFlowPane = document.querySelector('.react-flow__pane');
    if (reactFlowPane) {
      const rect = reactFlowPane.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        // ノードを作成
        const flowPosition = screenToFlowPosition({ x: clientX, y: clientY });
        const newId = getId();
        const newNode = {
          id: newId,
          type: "custom",
          position: flowPosition,
          data: { label: `アイデア ${newId}` },
          style: { width: 150, height: 80 },
          selected: true,
        };

        setNodes((nds) =>
          nds.map((n) => ({ ...n, selected: false })).concat(newNode)
        );
      }
    }
    
    setIsDraggingNewNode(false);
  }, [isDraggingNewNode, screenToFlowPosition, setNodes]);

  // グローバルイベントリスナー
  useEffect(() => {
    if (isDraggingNewNode) {
      const handleMove = (e) => {
        e.preventDefault();
        handleNewNodeDragMove(e);
      };
      const handleEnd = (e) => {
        e.preventDefault();
        handleNewNodeDragEnd(e);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd, { passive: false });

      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDraggingNewNode, handleNewNodeDragMove, handleNewNodeDragEnd]);

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "Backspace" || event.key === "Delete") {
        const selectedEdges = edges.filter((edge) => edge.selected);
        if (selectedEdges.length) {
          setEdges((eds) =>
            eds.filter((edge) => !selectedEdges.includes(edge))
          );
        }
      }
    },
    [edges, setEdges]
  );

  useEffect(() => {
    setNodeAdded(false);
  }, [nodes, edges]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  // ページ読み込み時にReactFlowキャンバスへ自動スクロール
  useEffect(() => {
    const reactFlowElement = document.querySelector('.react-flow');
    if (reactFlowElement) {
      setTimeout(() => {
        reactFlowElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, []);

  const handleChatToggle = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
    } else {
      setIsChatVisible(true);
      requestAnimationFrame(() => {
        setIsChatOpen(true);
      }, 0);
    }
  };

  const onChatPanelTransitionEnd = (event) => {
    if (event.propertyName === "width") {
      if (!isChatOpen) {
        setIsChatVisible(false);
      }
    }
  };

  const nodeTypes = {
    custom: CustomNode,
  };

  const dragBlockHandleStyle = {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#555",
  };

  // Joyride用のステップとスタイル
  const steps = [
    {
      target: ".ideabutton",
      content: "これを上にひっぱる",
    },
    {
      target: ".react-flow__node.react-flow__node-custom.nopan.draggable",
      content: "クリックして文字をうってみよう！",
    },
  ];

  const pulse = keyframes`
    0% {
      transform: scale(1);
    }
    55% {
      background-color: rgba(255, 100, 100, 0.9);
      transform: scale(1.6);
    }
  `;

  const Beacon = styled.span`
    animation: ${pulse} 1s ease-in-out infinite;
    background-color: rgba(255, 27, 14, 0.6);
    border-radius: 50%;
    display: inline-block;
    height: 3rem;
    width: 3rem;
  `;

  const BeaconComponent = forwardRef((props, ref) => {
    return <Beacon ref={ref} {...props} />;
  });

  // Joyride の実行状態を管理
  const [run, setRun] = useState(true);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (["finished", "skipped"].includes(status)) {
      setRun(false);
    }
  };

  const handleRestartTutorial = () => {
    setRun(true);
  };

  return (
    <>
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "relative",
        display: "flex",
      }}
    >
      <Joyride
        steps={steps}
        run={run}
        callback={handleJoyrideCallback}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        beaconComponent={BeaconComponent}
      />
      {/* 左パネル - 新規ノード追加ボタン */}
      <div
        style={{
          background: "#f4f4f4ff",
          padding: 20,
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          zIndex: 1,
          position: "absolute",
          bottom: "20px",
          left: "100px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          <div
            onMouseDown={handleNewNodeDragStart}
            onTouchStart={handleNewNodeDragStart}
            className="ideabutton"
            style={{
              padding: "15px 20px",
              background: "white",
              borderRadius: 8,
              cursor: isDraggingNewNode ? "grabbing" : "grab",
              textAlign: "center",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: isDraggingNewNode ? "none" : "transform 0.2s",
              width: "150px",
              border: "solid #555 2px",
              position: "relative",
              boxSizing: "border-box",
              height: "70px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              userSelect: "none",
              touchAction: "none",
              transform: isDraggingNewNode ? "scale(0.95)" : "scale(1)",
            }}
          >
            <div
              style={{
                ...dragBlockHandleStyle,
                top: -4,
                left: "50%",
                transform: "translateX(-50%)",
                border: "1px solid white",
              }}
            />
            <div
              style={{
                ...dragBlockHandleStyle,
                bottom: -4,
                left: "50%",
                transform: "translateX(-50%)",
                border: "1px solid white",
              }}
            />
            アイデア
          </div>
          <button
            onClick={handleRestartTutorial}
            style={{ padding: "10px 5px" }}
          >
            {t("imagemapPage.howToUseButton")}
          </button>
        </div>
      </div>

      {/* ドラッグ中のゴーストノード */}
      {isDraggingNewNode && (
        <div
          style={{
            position: "fixed",
            left: dragGhostPosition.x,
            top: dragGhostPosition.y,
            transform: "translate(-50%, -50%)",
            width: "150px",
            height: "80px",
            padding: "10px",
            background: "rgba(255, 255, 255, 0.95)",
            border: "3px dashed #3b82f6",
            borderRadius: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            pointerEvents: "none",
            zIndex: 10000,
            boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)",
            animation: "pulse 1s ease-in-out infinite",
          }}
        >
          新しいアイデア
        </div>
      )}

      {/* ReactFlowメインキャンバス */}
      <div style={{ flexGrow: 1, position: "relative", zIndex: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesState}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          style={{ background: "#f5f5f5" }}
          snapToGrid={true}
          snapGrid={[15, 15]}
          elevateNodesOnSelect={true}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#ddd" variant="lines" />
          <Controls />
          <DownloadButton/>
        </ReactFlow>
      </div>

      {/* チャットパネル - ChatBotコンポーネントを使用 */}
      <div
        style={{
          width: isChatOpen ? CHAT_PANEL_WIDTH : 0,
          minWidth: isChatOpen ? CHAT_PANEL_WIDTH : 0,
          background: "white",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
          zIndex: 1,
          position: "relative",
          transition: "width 0.3s ease-in-out",
          overflow: "hidden",
          display: isChatVisible ? "block" : "none",
          padding: "60px 0px",
        }}
        onTransitionEnd={onChatPanelTransitionEnd}
        className="node-edge-info"
      >
        {isChatVisible && isChatOpen && (
          <ChatBot imagemap1={getNodeEdgeInfo()} />
        )}
      </div>

      {/* チャット開閉ボタン */}
      <button
        onClick={handleChatToggle}
        style={{
          position: "absolute",
          top: "50%",
          right: isChatOpen ? CHAT_PANEL_WIDTH : 0,
          transform: "translateY(-50%)",
          width: isChatOpen
            ? TOGGLE_BUTTON_WIDTH_OPEN
            : TOGGLE_BUTTON_WIDTH_CLOSED,
          height: TOGGLE_BUTTON_HEIGHT,
          border: "none",
          backgroundColor: "#3b82f6",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          zIndex: 2,
          borderRadius: isChatOpen ? "8px 0 0 8px" : "8px 0 0 8px",
          transition:
            "right 0.3s ease-in-out, width 0.3s ease-in-out, background-color 0.2s",
          writingMode: "vertical-rl",
          textOrientation: "upright",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isChatOpen ? "チャットを閉じる" : "チャットを開く"}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }
      `}</style>
    </div>
    </>
  );
}

export default function MindMapTool() {
  return (
    <ReactFlowProvider>
      <MindMapFlow />
    </ReactFlowProvider>
  );
}