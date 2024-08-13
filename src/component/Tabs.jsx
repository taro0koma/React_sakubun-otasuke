import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import '/src/assets/css/index.css';

const lsStyle = {
  padding: "8px",
  color: "#ffffff",
};
const closeWithClickOutSideMethod = (e, setter) => {
  console.log("e.target", e.target);
  console.log("e.currentTarget", e.currentTarget);
  if (e.target === e.currentTarget) {
    //メニューの外側をクリックしたときだけメニューを閉じる
    console.log("メニューの外側をクリックした");
    setter(false);
  } else {
    console.log("メニューの内側をクリックした");
  }
};
const Tabs = ({ pageTitle,contents }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (e) => {
    if (!isOpen) {
      e.preventDefault(); // メニューが閉じているときにリンクのクリックを防ぐ
    }
  };

  const menuStyles = `
    .menu-container {
      display: flex;
      align-items: center;
      position: relative;
      padding: 10px; /* Optional padding */
      right:20px;
      top:16px;
      z-index: 10000;
    }
    .logo {
      margin-right: auto;
    }
    .${contents}{
      background-color:#ffffff70;
      border-top-right-radius: 70px;
      border-bottom-right-radius: 70px;

    }
    .menu-toggle {
      position: fixed;
      width: 48px;
      height: 48px;
      cursor: pointer;
      right:20px;
      top:30px;
      z-index:10;
      background-color: ${isOpen ? 'white' : 'none'};
      border-radius: 100%;
      box-shadow: ${isOpen ? '0px 0px 10px #0000007a' : "none"};
    }
    .bar {
    position: absolute;
      width: 60%;
      height: 4px;
      background-color: #000;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .bar1 {
      transform: ${isOpen ? 'rotate(45deg) translateY(18.6px) translateX(-1.8px)' : 'translateX(-50%)'};
      top:10px;
      left:50%;
    }
    .bar2 {
      opacity: ${isOpen ? 0 : 1};
      transform:translateX(-50%);
      top:22px;
      left:50%;
    }
    .bar3 {
      transform: ${isOpen ? 'rotate(-45deg) translateY(-18.6px) translateX(-1.8px)' : 'translateX(-50%)'};
      left:50%;
      top:34px;
    }
    .menu-items {
      position: fixed !important;
      backdrop-filter: blur(10px);
      list-style: none;
      padding: 0 0 0 30px !important;
      margin: 0 !important;
      background-color: #333333bf;
      right: 0;
      height:100%;
      width: 100%;
      z-index: 1;
      background-size: cover;
      font-size: 1.8rem !important;
      opacity: ${isOpen ? 1 : 0};
      visibility: ${isOpen ? 'visible' : 'hidden'};
      transform: ${isOpen ? 'translateY(0)' : 'translateY(-20px)'};
      transition: opacity 0.5s ease, transform 0.5s ease, visibility 0.5s ease;
      top:0;
      overflow:scroll;
    }
    .menu-items li {
      padding: 8px;
      color: white;
    }
    .menu-items li a {
      color: #fff;
      text-decoration: none;
      display: block;
      text-align: center;
    }
    .menu-items li a.active-item {
      color: blue;
    }
    .menu-items li a.panding-item {
      color: gray;
    }
    .menu-items li {
    width:17em;
    margin:auto;
    }
    .menu-items h2{
    padding-top:40px;
    font-weight:bold;
    font-size:30px;
    color:white;
    }
  `;
  
  return (
    <div className="tabdesu">
      <header className="main-menu">
      <style>{menuStyles}</style>
        <a href="/" className="logo">
          <h1 className="left-top-logo">
            作文<span className="app">アプリ</span>
            <br />
            <span className="otasuke">おたすけ</span>
          </h1>
        </a>
        <div className="menu-container">
        <div className="menu-toggle" onClick={toggleMenu}>
          <div style={{position:"relative",lineHeight:0,height:"100%",width:"100%"}}>
            <div className={`bar bar1`}></div>
            <div className={`bar bar2`}></div>
            <div className={`bar bar3`}></div>
          </div>
        </div>
        <ul className="menu-items" style={{padding:"5px 30px"}}>
          <h2 style={{textAlign:"center"}}>いちらん</h2>
          <li className="home">
            <NavLink
              to="/"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              ホーム
            </NavLink>
          </li>
          <li className="imagemap">
            <NavLink
              to="/map"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              イメージマップの作り方
            </NavLink>
          </li>
          <li className="danraku">
            <NavLink
              to="/danraku"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              段落の組み立て
            </NavLink>
          </li>
          <li className="kimoti">
            <NavLink
              to="/kimoti"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              気持ちや感想のいいかえ
            </NavLink>
          </li>
          <li className="hyougen">
            <NavLink
              to="/hyougen"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              表現ぴったり探し
            </NavLink>
          </li>
          <li className="kakidashi">
            <NavLink
              to="/omikuji"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              書き出しおみくじ
            </NavLink>
          </li>
          <li className="genkouyoshi">
            <NavLink
              to="/osusume"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              おすすめツール
            </NavLink>
          </li>
        </ul>
      </div>
      </header>
      <h2 className="pagetitle">{pageTitle}</h2>
    </div>
  );
};

export default Tabs;
