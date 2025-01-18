import React from 'react';

const Footer = () => {
  return (
    <div >
      <footer
            style={{
                backgroundColor: "#000", // 背景色
                color: "#fff", // 文字色
                textAlign: "center", // テキスト中央寄せ
                padding: "15px 0", // 上下の余白
                marginTop: "40px", // 上部に余白（デザイン調整用）
                marginBottom:0
            }}
        >            <p>
                <a
                    href="https://note.com/con_cat/n/ncb414fe57979" // あなたのnote記事URL
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "#fff", // リンク色
                        textDecoration: "none", // 下線なし
                    }}
                    onMouseOver={(e) => (e.target.style.color = "#00acee")} // ホバー時の色
                    onMouseOut={(e) => (e.target.style.color = "#fff")} // 元の色に戻す
                >
                    『作文おたすけアプリ』 developed by comaco
                </a>
            </p>
        </footer>

    </div>
  );
};

export default Footer;