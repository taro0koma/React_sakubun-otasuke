import React from 'react';
import {
  Panel,
  useReactFlow,
  getNodesBounds,
} from '@xyflow/react';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl) {
  const a = document.createElement('a');
  a.setAttribute('download', 'イメージマップ.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

function DownloadButton() {
  const { getNodes } = useReactFlow();

  const onClick = () => {
    // ノード全体の範囲を取得
    const nodesBounds = getNodesBounds(getNodes());

    if (nodesBounds.width === 0 || nodesBounds.height === 0) {
      return;
    }

    // 少し余白(padding)を持たせる
    const padding = 50; 
    const imageWidth = nodesBounds.width + (padding * 2);
    const imageHeight = nodesBounds.height + (padding * 2);

    // 左上の座標に合わせてずらす + 余白分ずらす
    const transform = `translate(${-nodesBounds.x + padding}px, ${-nodesBounds.y + padding}px) scale(1)`;

    const viewportEl = document.querySelector('.react-flow__viewport');

    toPng(viewportEl, {
      backgroundColor: '#ace8d7',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: transform,
      },
      // ▼▼▼ ここがエラー対策の決定打です ▼▼▼
      fontEmbedCSS: '', // フォントの埋め込み処理を強制的に空にする（ダウンロードさせない）
      pixelRatio: 1,    // 画質を「等倍」に固定してメモリ消費を抑える（エラーが出るならここを上げるのは危険）
      skipAutoScale: true,
      cacheBust: false, // キャッシュバスターもOFFにする（余計なリクエストを減らす）
      // ▲▲▲▲▲▲
    })
      .then(downloadImage)
      .catch((err) => {
        console.error('保存失敗:', err);
        alert('画像の保存に失敗しました。ノード数が多すぎるか、メモリが足りません。');
      });
  };

  return (
    <Panel position="top-right">
      <button className="download-btn xy-theme__button" onClick={onClick}>
        イメージマップを保存する！
      </button>
    </Panel>
  );
}

export default DownloadButton;