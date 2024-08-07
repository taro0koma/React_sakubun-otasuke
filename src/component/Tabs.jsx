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
const Tabs = ({ pageTitle }) => {
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
    .menu-toggle {
      position: fixed;
      justify-content: flex-end
      font-size: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 25px;
      height: 25px;
      cursor: pointer;
      right:20px;
      top:30px;
      z-index:10;
      background-color: ${isOpen ? 'white' : 'none'};
      border-radius: 100%;
      box-shadow: ${isOpen ? '0px 0px 9px white' : "none"};
    }
    .bar {
      width: 100%;
      height: 4px;
      background-color: #000;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .bar1 {

      transform: ${isOpen ? 'rotate(45deg) translateY(7px) translateX(7px)' : 'rotate(0)'};
    }
    .bar2 {

      opacity: ${isOpen ? 0 : 1};
    }
    .bar3 {

      transform: ${isOpen ? 'rotate(-45deg) translateY(-7px) translateX(8px)' : 'rotate(0)'};
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
    }
    .menu-items li a.active-item {
      color: blue;
    }
    .menu-items li a.panding-item {
      color: gray;
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
          <div className={`bar bar1`}></div>
          <div className={`bar bar2`}></div>
          <div className={`bar bar3`}></div>
        </div>
        <ul className="menu-items" style={{padding:"5px 30px"}}>
          <li>
            <NavLink
              to="/"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mapmake"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              イメージマップの作り方
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/kimoti"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              気持ちや感想
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/danraku"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              段落の組み立て
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/genkoyoshi"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              原稿用紙作成シートについて
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/omikuji"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              書き出しおみくじ
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hyougen"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              表現ぴったり探し
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
