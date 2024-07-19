// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import '/src/assets/css/index.css'
// import { FaBars,FaTimes } from "react-icons/fa";

// const lsStyle = {
//   padding: "8px",
//   color: "#ffffff",
// };
// const Tabs = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const menuStyles = `
//     .menu-container {
//       display: flex;
//       align-items: center;
//       position: relative;
//       padding: 10px; /* Optional padding */
//     }
//     .logo {
//       margin-right: auto;
//     }
//     .menu-toggle {
//       font-size: 24px;
//       display: flex;
//       flex-direction: column;
//       justify-content: space-between;
//       width: 30px;
//       height: 24px;
//       cursor: pointer;
//     }
//     .bar {
//       width: 100%;
//       height: 4px;
//       background-color: #000;
//       transition: transform 0.3s ease, opacity 0.3s ease;
//     }
//     .bar1 {
//       transform: ${isOpen ? 'rotate(45deg) translateY(10px)' : 'rotate(0)'};
//     }
//     .bar2 {
//       opacity: ${isOpen ? 0 : 1};
//     }
//     .bar3 {
//       transform: ${isOpen ? 'rotate(-45deg) translateY(-10px)' : 'rotate(0)'};
//     }
//     .menu-items {
//       backdrop-filter: blur(10px);
//       list-style: none;
//       min-height: 100vh;
//       padding: 0 !important;
//       margin: 0 !important;
//       display: block;
//       background-color: #333333bf;
//       position: absolute;
//       top: 100%;
//       right: 0;
//       width: 100%;
//       z-index: 1;
//       background-size: cover;
//       font-size: 20px !important;
//       opacity: ${isOpen ? 1 : 0};
//       transform: ${isOpen ? 'translateY(0)' : 'translateY(-20px)'};
//       transition: opacity 0.5s ease, transform 0.5s ease;
//     }
//     .menu-items li {
//       padding: 8px;
//       color: white;
//     }
//     .menu-items li a {
//       color: #fff;
//       text-decoration: none;
//       display: block;
//     }
//     .menu-items li a.active-item {
//       color: blue;
//     }
//     .menu-items li a.panding-item {
//       color: gray;
//     }
//   `;


//   // return (
//   //   <div>
//   //     <a href="/">
//   //       <h1 className="left-top-logo">
//   //         作文<span className="app">アプリ</span>
//   //         <br />
//   //         <span className="otasuke">おたすけ</span>
//   //       </h1>
//   //     </a>
//   //     <style jsx="true"></style>
//   //     <div className="menu-container" style={{fontSize:"20px"}}>
//   //       <style>{menuStyles}</style>
//   //       <div className="menu-header" onClick={toggleMenu}>
//   //         <div className="menu-toggle">メニュー {isOpen ? "▲" : "▼"}</div>
//   //       </div>
//   //       <ul className={`menu-items ${isOpen ? "open" : ""}`}>
//   //         <li>
//   //           <NavLink
//   //             className={({ isActive }) =>
//   //               isActive ? "active-item" : "panding-item"
//   //             }
//   //             to="/"
//   //             style={lsStyle}
//   //           >
//   //             Home
//   //           </NavLink>
//   //         </li>
//   //         <li>
//   //           <NavLink
//   //             className={({ isActive }) =>
//   //               isActive ? "active-item" : "panding-item"
//   //             }
//   //             to="/mapmake"
//   //             style={lsStyle}
//   //           >
//   //             イメージマップの作り方
//   //           </NavLink>
//   //         </li>
//   //         <li>
//   //           <NavLink
//   //             className={({ isActive }) =>
//   //               isActive ? "active-item" : "panding-item"
//   //             }
//   //             to="/contact"
//   //             style={lsStyle}
//   //           >
//   //             気持ちや感想
//   //           </NavLink>
//   //         </li>
//   //         <li>
//   //           <NavLink
//   //             className={({ isActive }) =>
//   //               isActive ? "active-item" : "panding-item"
//   //             }
//   //             to="/image"
//   //             style={lsStyle}
//   //           >
//   //             image
//   //           </NavLink>
//   //         </li>
//   //         <li>
//   //           <NavLink
//   //             className={({ isActive }) =>
//   //               isActive ? "active-item" : "panding-item"
//   //             }
//   //             to="/headline"
//   //             style={lsStyle}
//   //           >
//   //             headline
//   //           </NavLink>
//   //         </li>
//   //         <li>
//   //           <NavLink
//   //             className={({ isActive }) =>
//   //               isActive ? "active-item" : "panding-item"
//   //             }
//   //             to="/number"
//   //             style={lsStyle}
//   //           >
//   //             number
//   //           </NavLink>
//   //         </li>
//   //         <li>
//   //           <NavLink
//   //             className={({ isActive }) =>
//   //               isActive ? "active-item" : "panding-item"
//   //             }
//   //             to="/key"
//   //             style={lsStyle}
//   //           >
//   //             key
//   //           </NavLink>
//   //         </li>
//   //         <li>
//   //           <NavLink
//   //             className={({ isActive }) =>
//   //               isActive ? "active-item" : "panding-item"
//   //             }
//   //             to="/todo"
//   //             style={lsStyle}
//   //           >
//   //             todo
//   //           </NavLink>
//   //         </li>
//   //         <li>
//   //           <NavLink
//   //             className={({ isActive }) =>
//   //               isActive ? "active-item" : "panding-item"
//   //             }
//   //             to="/style"
//   //             style={lsStyle}
//   //           >
//   //             段落の組み立て
//   //           </NavLink>
//   //         </li>
//   //         <li>
//   //           <NavLink
//   //             className={({ isActive }) =>
//   //               isActive ? "active-item" : "panding-item"
//   //             }
//   //             to="/console"
//   //             style={lsStyle}
//   //           >
//   //             書き出しおみくじ
//   //           </NavLink>
//   //         </li>
//   //         <li>
//   //           <NavLink
//   //             className={({ isActive }) =>
//   //               isActive ? "active-item" : "panding-item"
//   //             }
//   //             to="/hyougen"
//   //             style={lsStyle}
//   //           >
//   //             表現ぴったり探し
//   //           </NavLink>
//   //         </li>
//   //       </ul>
//   //     </div>
//   //   </div>
//   // );
//   return(
//     <div>
//     <style>{menuStyles}</style>
//     <div className="menu-container">
//       <a href="/" className="logo">
//         <h1 className="left-top-logo">
//           作文<span className="app">アプリ</span>
//           <br />
//           <span className="otasuke">おたすけ</span>
//         </h1>
//       </a>
//       <div className="menu-toggle" onClick={toggleMenu}>
//         <div className={`bar bar1`}></div>
//         <div className={`bar bar2`}></div>
//         <div className={`bar bar3`}></div>
//       </div>
//       <ul className={`menu-items ${isOpen ? "open" : ""}`}>
//         <li>
//           <NavLink
//             className={({ isActive }) =>
//               isActive ? "active-item" : "panding-item"
//             }
//             to="/"
//             style={lsStyle}
//           >
//             Home
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             className={({ isActive }) =>
//               isActive ? "active-item" : "panding-item"
//             }
//             to="/mapmake"
//             style={lsStyle}
//           >
//             イメージマップの作り方
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             className={({ isActive }) =>
//               isActive ? "active-item" : "panding-item"
//             }
//             to="/contact"
//             style={lsStyle}
//           >
//             気持ちや感想
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             className={({ isActive }) =>
//               isActive ? "active-item" : "panding-item"
//             }
//             to="/image"
//             style={lsStyle}
//           >
//             image
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             className={({ isActive }) =>
//               isActive ? "active-item" : "panding-item"
//             }
//             to="/headline"
//             style={lsStyle}
//           >
//             headline
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             className={({ isActive }) =>
//               isActive ? "active-item" : "panding-item"
//             }
//             to="/number"
//             style={lsStyle}
//           >
//             number
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             className={({ isActive }) =>
//               isActive ? "active-item" : "panding-item"
//             }
//             to="/key"
//             style={lsStyle}
//           >
//             key
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             className={({ isActive }) =>
//               isActive ? "active-item" : "panding-item"
//             }
//             to="/todo"
//             style={lsStyle}
//           >
//             todo
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             className={({ isActive }) =>
//               isActive ? "active-item" : "panding-item"
//             }
//             to="/style"
//             style={lsStyle}
//           >
//             段落の組み立て
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             className={({ isActive }) =>
//               isActive ? "active-item" : "panding-item"
//             }
//             to="/console"
//             style={lsStyle}
//           >
//             書き出しおみくじ
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             className={({ isActive }) =>
//               isActive ? "active-item" : "panding-item"
//             }
//             to="/hyougen"
//             style={lsStyle}
//           >
//             表現ぴったり探し
//           </NavLink>
//         </li>
//       </ul>
//     </div>
//   </div>
//   )
// };

// export default Tabs;
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import '/src/assets/css/index.css';
import { FaBars, FaTimes } from "react-icons/fa";

const lsStyle = {
  padding: "8px",
  color: "#ffffff",
};

const Tabs = () => {
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
    }
    .logo {
      margin-right: auto;
    }
    .menu-toggle {
      font-size: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 24px;
      cursor: pointer;
    }
    .bar {
      width: 100%;
      height: 4px;
      background-color: #000;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .bar1 {
      transform: ${isOpen ? 'rotate(45deg) translateY(10px)' : 'rotate(0)'};
    }
    .bar2 {
      opacity: ${isOpen ? 0 : 1};
    }
    .bar3 {
      transform: ${isOpen ? 'rotate(-45deg) translateY(-10px)' : 'rotate(0)'};
    }
    .menu-items {
      backdrop-filter: blur(10px);
      list-style: none;
      padding: 0 !important;
      margin: 0 !important;
      background-color: #333333bf;
      position: absolute;
      top: 100%;
      right: 0;
      width: 100%;
      z-index: 1;
      background-size: cover;
      font-size: 20px !important;
      opacity: ${isOpen ? 1 : 0};
      visibility: ${isOpen ? 'visible' : 'hidden'};
      transform: ${isOpen ? 'translateY(0)' : 'translateY(-20px)'};
      transition: opacity 0.5s ease, transform 0.5s ease, visibility 0.5s ease;
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
    <div>
      <style>{menuStyles}</style>
      <div className="menu-container">
        <a href="/" className="logo">
          <h1 className="left-top-logo">
            作文<span className="app">アプリ</span>
            <br />
            <span className="otasuke">おたすけ</span>
          </h1>
        </a>
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className={`bar bar1`}></div>
          <div className={`bar bar2`}></div>
          <div className={`bar bar3`}></div>
        </div>
        <ul className="menu-items">
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
              to="/contact"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              気持ちや感想
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/style"
              style={lsStyle}
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active-item" : "panding-item")}
            >
              段落の組み立て
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/console"
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
    </div>
  );
};

export default Tabs;
