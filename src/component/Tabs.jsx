import React,{ useState } from 'react';
import { NavLink } from 'react-router-dom';

const lsStyle = {
  padding:"8px",
  color:"#6d6d6d"
}
const Tabs = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuStyles = `
  .menu-container {
    position: relative;
  }
  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  .menu-header h1 {
    margin: 0;
  }
  .menu-toggle {
    font-size: 24px;
  }
  .menu-items {
    list-style: none;
    padding: 0;
    margin: 0;
    display: none;
    transition: max-height 0.3s ease-out;
    overflow: hidden;
  }
  .menu-items.open {
    display: block;
  }
  .active-item {
    color: blue;
  }
  .pending-item {
    color: gray;
  }
`;

  return (
    <div>
      
      <a href="/">
      <h1>作文アプリ<br/>お助け</h1>
      </a>
      <style jsx="true">
        
      </style>
      <div className="menu-container">
        <style>{menuStyles}</style>
        <div className="menu-header" onClick={toggleMenu}>
         <div className="menu-toggle">メニュー {isOpen ? '▲' : '▼'}</div>
        </div>
        <ul className={`menu-items ${isOpen ? 'open' : ''}`}>
          <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/" style={lsStyle}>Home</NavLink></li>
          <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/about/10/ariyan" style={lsStyle}>about</NavLink></li>
          <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/contact" style={lsStyle}>気持ちや感想</NavLink></li>
          <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/image" style={lsStyle}>image</NavLink></li>
          <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/headline" style={lsStyle}>headline</NavLink></li>
          <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/number" style={lsStyle}>number</NavLink></li>
          <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/key" style={lsStyle}>key</NavLink></li>
          <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/todo" style={lsStyle}>todo</NavLink></li>
          <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/style" style={lsStyle}>段落の組み立て</NavLink></li>
          <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/console" style={lsStyle}>書き出しおみくじ</NavLink></li>
          <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/hyougen" style={lsStyle}>表現ぴったり探し</NavLink></li>

        </ul>
      </div>
    </div>
  );
};

export default Tabs;