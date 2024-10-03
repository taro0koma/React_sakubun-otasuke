import React from 'react';
import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl) {
  const a = document.createElement('a');
  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadButton() {
  const { getNodes } = useReactFlow();

  const animateToDownloadIcon = (dataUrl) => {
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.position = 'fixed';
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.left = '50%';
    img.style.top = '50%';
    img.style.transform = 'translate(-50%, -50%)';
    img.style.transition = 'all 1s ease-in-out';
    img.style.zIndex = 1000;
    document.body.appendChild(img);

    // Force a layout reflow to ensure the animation starts
    window.getComputedStyle(img).left;

    // Move the image towards the top right (like the download icon area)
    img.style.left = 'calc(100% - 50px)';
    img.style.top = '0px';
    img.style.opacity = '0';

    // Remove the image after the animation completes
    img.addEventListener('transitionend', () => {
      img.remove();
      downloadImage(dataUrl); // Actual download triggered after animation
    });
  };

  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );

    toPng(document.querySelector('.react-flow__viewport'), {
      backgroundColor: '#DCDCDC',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then(animateToDownloadIcon);
  };

  return (
    <Panel position="top">
      <button className="download-btn" onClick={onClick}>
        イメージマップを保存する！
      </button>
    </Panel>
  );
}

export default DownloadButton;
