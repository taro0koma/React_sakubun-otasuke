import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
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
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ChatBot from "./ChatBot"; // ChatBotコンポーネントをインポート
import { t } from "i18next";
import Joyride from "react-joyride";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { RectangleNode } from "../component/RectangleNode";
import { RectangleTool } from "../component/RectangleTool";
import { div } from "three/tsl";
// カスタムノードコンポーネント (変更なし)
const CustomNode = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const { deleteElements } = useReactFlow();

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  const handleStyle = { borderRadius: "50%", backgroundColor: "#555" };

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
        <Handle type="target" position="top" style={handleStyle} />
        <Handle type="target" position="left" style={handleStyle} />
        <Handle type="target" position="right" style={handleStyle} />
        <Handle type="target" position="bottom" style={handleStyle} />

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
              WebkitMaskImage:
                "linear-gradient(to bottom, black 85%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 85%, transparent 100%)",
            }}
          >
            {label}
          </div>
        )}

        {selected && (
          <button
            onClick={handleDelete}
            className="delete"
            style={{
              position: "absolute",
              top: -30,
              left: "100%",
              transform: "translateX(-50%)",
              width: "70px",
              border: "none",
              borderRadius: 4,
              backgroundColor: "#4e4e4eff",
              color: "white",
              fontSize: 10,
              fontWeight: "bold",
              cursor: "pointer",
              zIndex: 100,
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              whiteSpace: "nowrap",
            }}
          >
            けす
          </button>
        )}

        <Handle type="source" position="bottom" style={handleStyle} />
        <Handle type="source" position="left" style={handleStyle} />
        <Handle type="source" position="right" style={handleStyle} />
        <Handle type="source" position="top" style={handleStyle} />
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
  const { screenToFlowPosition, deleteElements } = useReactFlow();
  const connectingNodeId = useRef(null);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [deletingNodeId, setDeletingNodeId] = useState(null);
  const reactFlowWrapper = useRef(null);
  const draggingNodeId = useRef(null);
  const deleteTimeoutRef = useRef(null);
  const [nodeAdded, setNodeAdded] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const CHAT_PANEL_WIDTH = 400;
  const TOGGLE_BUTTON_WIDTH_OPEN = 40;
  const TOGGLE_BUTTON_WIDTH_CLOSED = 50;
  const TOGGLE_BUTTON_HEIGHT = 100;
  const [showFrame, setShowFrame] = useState(false);
  const [isRectangleActive, setIsRectangleActive] = useState(true);

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
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
      setNodeAdded(false);
    },
    [setEdges]
  );

  const onConnectStart = useCallback((_, { nodeId, handleType }) => {
    connectingNodeId.current = { nodeId, handleType };
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current || nodeAdded) return;

      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        const { nodeId, handleType } = connectingNodeId.current;
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

        const newEdge =
          handleType === "source"
            ? {
                id: `e${nodeId}-${newId}`,
                source: nodeId,
                target: newId,
                animated: true,
                type: "smoothstep",
              }
            : {
                id: `e${newId}-${nodeId}`,
                source: newId,
                target: nodeId,
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

  const onNodeDragStart = useCallback((event, node) => {
    draggingNodeId.current = node.id;
  }, []);

  const onNodeDrag = useCallback(
    (event) => {
      if (!draggingNodeId.current) return;

      const leftPanelRect = document
        .getElementById("left-panel")
        ?.getBoundingClientRect();
      if (leftPanelRect) {
        const isOver = event.clientX < leftPanelRect.right;

        if (isOver && !isOverTrash) {
          setIsOverTrash(true);
        } else if (!isOver && isOverTrash) {
          setIsOverTrash(false);
        }
      }
    },
    [isOverTrash]
  );

  const onNodeDragStop = useCallback((event, node) => {
    // if (!draggingNodeId.current) return;

    // const leftPanelRect = document.getElementById('left-panel')?.getBoundingClientRect();
    // if (leftPanelRect && event.clientX < leftPanelRect.right) {
    //   setDeletingNodeId(node.id);
    //   setNodes((nds) => nds.map(n =>
    //     n.id === node.id
    //       ? { ...n, style: { ...n.style, transition: 'all 0.6s ease-out', transform: 'scale(0)', opacity: 0 } }
    //       : n
    //   ));

    //   deleteTimeoutRef.current = setTimeout(() => {
    //     deleteElements({ nodes: [{ id: node.id }] });
    //     setDeletingNodeId(null);
    //   }, 600);
    // }

    setIsOverTrash(false);
    draggingNodeId.current = null;
    // }, [setNodes, deleteElements]);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newId = getId();
      const newNode = {
        id: newId,
        type,
        position,
        data: { label: `アイデア ${newId}` },
        style: { width: 150, height: 80 },
        selected: true,
      };

      setNodes((nds) =>
        nds.map((n) => ({ ...n, selected: false })).concat(newNode)
      );
    },
    [screenToFlowPosition, setNodes]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  // const handleShowFrame = () => {
  //   setShowFrame(true);
  // };
  // const handleCloseFrame = () => {
  //   setShowFrame(false);
  // };
  const steps = [
    {
      target: ".ideabutton",
      content: "これを上にひっぱる",
    },
    {
      target:
        ".react-flow__node.react-flow__node-custom.nopan.selectable.draggable",
      content: "This another awesome feature!",
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
    // チュートリアルの完了やスキップを処理
    if (["finished", "skipped"].includes(status)) {
      setRun(false);
    }
  };

  const handleRestartTutorial = () => {
    setRun(true);
  };

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

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  const trashIconStyle = {
    fontSize: 80,
    textAlign: "center",
    fontFamily: 'Noto Emoji, "Segoe UI Emoji", "Apple Color Emoji", sans-serif',
  };

  const dragBlockHandleStyle = {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#555",
  };
  const nodeTypes = {
    rectangle: RectangleNode,
    custom: CustomNode,
  };

  return (
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
      <div className={showFrame ? "background" : ""}>
        {showFrame && (
          <FloatingFrame steps={steps} onClose={handleCloseFrame} />
        )}
      </div>
      {/* 左パネル */}
      <div
        id="left-panel"
        style={{
          // width: 180,
          background: "#f4f4f4ff",
          padding: 20,
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          zIndex: 1,
          position: "relative",
          overflowY: "auto",
          transition: "background 0.3s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: isOverTrash ? "center" : "flex-start",
          pointerEvents: "auto",
          position: "absolute",
          bottom: "20px",
          width: "400px",
          left: "100px",
          borderRadius: "10px"
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
            onDragStart={(event) => onDragStart(event, "custom")}
            // onPointerDown={(event) => {setType('input'); onDragStart(event, createAddNewNode('input'));}}
            draggable
            style={{
              padding: "15px 0px",
              background: "white",
              borderRadius: 8,
              marginBottom: 10,
              cursor: "grab",
              textAlign: "center",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "transform 0.2s",
              width: "150px",
              border: "solid #555 2px",
              position: "relative",
              boxSizing: "border-box",
              maxWidth: "400px",
              flex: 1 /* 同じサイズに伸ばす */,
              height: "70px" /* 必要に応じて調整OK */,
              display: "flex",
              justifyContent: "center" /* テキスト横中央 */,
              alignItems: "center" /* テキスト縦中央 */,
              textAlign: "center",
            }}
            className="ideabutton"
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
            <div
              style={{
                ...dragBlockHandleStyle,
                left: -4,
                top: "50%",
                transform: "translateY(-50%)",
                border: "1px solid white",
              }}
            />
            <div
              style={{
                ...dragBlockHandleStyle,
                right: -4,
                top: "50%",
                transform: "translateY(-50%)",
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

      {/* ReactFlowメインキャンバス */}
      <div
        ref={reactFlowWrapper}
        style={{ flexGrow: 1, position: "relative", zIndex: 0 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesState}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodeClick={onNodeClick}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onDrop={onDrop}
          onDragOver={onDragOver}
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
          {/* {isRectangleActive && <RectangleTool />}

          <Panel position="top-left">
            <div className="xy-theme__button-group">
              <button
                className={`xy-theme__button ${
                  isRectangleActive ? "active" : ""
                }`}
                onClick={() => setIsRectangleActive(true)}
              >
                Rectangle Mode
              </button>
              <button
                className={`xy-theme__button ${
                  !isRectangleActive ? "active" : ""
                }`}
                onClick={() => setIsRectangleActive(false)}
              >
                Selection Mode
              </button>
            </div>
          </Panel> */}
          {/* <Background color="#ddd" gap={20} /> */}
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
          zIndex: 0,
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
    </div>
  );
}

export default function MindMapTool() {
  return (
    <ReactFlowProvider>
      <MindMapFlow />
    </ReactFlowProvider>
  );
}
