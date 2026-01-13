import React from "react";
import { Helmet } from "react-helmet-async";

export default function TepiaHome() {
  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <Helmet>
        <title>Tepia</title>
      </Helmet>
      <div>
        <h1>Tepia用</h1>
        <div style={{
          display:"flex",
          flexFlow: "column"
        }}>
          <a href="/tepia/danraku">
            <button>段落の組み立て</button>
          </a>
          <a href="/tepia/omikuji">
            <button>おみくじ</button>
          </a>
          <a href="/tepia/imagemap">
            <button>イメージマップ</button>
          </a>
        </div>
      </div>
    </div>
  );
}
