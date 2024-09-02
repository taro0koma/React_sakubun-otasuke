import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './map.css'; // 必要なCSSファイルのパスを指定
import Tabs from './../component/Tabs';
const materialColors = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E',
  '#607D8B'
];

const getColorById = (id) => materialColors[Math.abs(parseInt(id, 10)) % materialColors.length];

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
    id: '0',
    type: 'input',
    data: { label: 'Node' },
    position: { x: 0, y: 50 },
  },
];

let id = 1;
const getId = () => `${id++}`;

const AddNodeOnEdgeDrop = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null); // 選択されたノードのID
  const [nodeLabel, setNodeLabel] = useState(''); // ノードのラベルを管理するステート
  const { screenToFlowPosition, getEdges, getNodes } = useReactFlow();
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodeEdgeInfo, setNodeEdgeInfo] = useState(''); // ノードとエッジ情報を表示するためのステート
  const [active, setActive] = useState(false);

  const classToggle = () => {
    setActive(!active)
  }
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

      const targetIsPane = event.target.classList.contains('react-flow__pane');

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
          eds.concat({ id: `e${connectingNodeId.current}-${id}`, source: connectingNodeId.current, target: id }),
        );
      }
    },
    [screenToFlowPosition],
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    setNodeLabel(node.data.label); // 選択されたノードのラベルを設定
  }, []);

  const onLabelChange = useCallback((event) => {
    setNodeLabel(event.target.value);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNodeId ? { ...node, data: { label: event.target.value } } : node
      )
    );
  }, [selectedNodeId, setNodes]);

  const onPaneClick = useCallback((event) => {
    const targetIsPane = event.target.classList.contains('react-flow__pane');
    if (targetIsPane) {
      const { clientX, clientY } = event;
      const newNode = {
        id: getId(),
        position: screenToFlowPosition({ x: clientX, y: clientY }),
        data: { label: `Node ${id}` },
      };
      setNodes((nds) => nds.concat(newNode));
    }
  }, [screenToFlowPosition]);

  const onKeyDown = useCallback((event) => {
    if (event.key === 'Backspace') {
      const selectedEdges = getEdges().filter(edge => edge.selected);
      if (selectedEdges.length) {
        setEdges((eds) => eds.filter(edge => !selectedEdges.includes(edge)));
      }
    }
  }, [getEdges]);

  // 定期的にノードとエッジの情報を更新
  useEffect(() => {
    const intervalId = setInterval(() => {
      const nodesInfo = getNodes()
        .map(node => `Node ID: ${node.id}, Label: ${node.data.label}, Position: (${node.position.x}, ${node.position.y})`)
        .join('\n');
      const edgesInfo = getEdges()
        .map(edge => `Edge ID: ${edge.id}, Source: ${edge.source}, Target: ${edge.target}`)
        .join('\n');
      setNodeEdgeInfo(`${nodesInfo}\n\n${edgesInfo}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [getNodes, getEdges]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nodesInfo = getNodes()
        .map(node => `Node ID: ${node.id}, Label: ${node.data.label}, Position: (${node.position.x}, ${node.position.y})`)
        .join('\n');
      const edgesInfo = getEdges()
        .map(edge => `Edge ID: ${edge.id}, Source: ${edge.source}, Target: ${edge.target}`)
        .join('\n');
      setNodeEdgeInfo(`${nodesInfo}\n\n${edgesInfo}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [getNodes,getEdges]);


  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Chromeでの警告表示に必要
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <Tabs pageTitle="イメージマップ作成ツール" contents="genkouyoshi"/>
    <div className="wrapper" ref={reactFlowWrapper} style={{ width: '100%', height: '500px', position: 'relative' }} >
      <button style={{marginRight:"100%"}} onClick>使い方</button>
      <div className="node-input">
        <label htmlFor="node-label" style={{ textAlign: 'center' }}>思いついたことを入力</label>
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
      />
      <div className={active ? "node-edge-info sideOutLeft" : "node-edge-info"}>
        {nodeEdgeInfo}
        <button onClick={classToggle} className='akesimebutton'>{active ? "◀" : "▶"}</button>
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
