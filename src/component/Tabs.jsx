import React from 'react';
import { NavLink } from 'react-router-dom';
const lsStyle = {
  padding:"8px",
  color:"#6d6d6d"
}
const Tabs = () => {
  return (
    <div>
      
      <a href="/">
      <h1>作文アプリ<br/>お助け</h1>
      </a>
      <style jsx="true">
        
      </style>
      <p>※仮バージョン</p>
      <ul>
        <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/" style={lsStyle}>Home</NavLink></li>
        <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/about/10/ariyan" style={lsStyle}>about</NavLink></li>
        <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/contact" style={lsStyle}>contact</NavLink></li>
        <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/image" style={lsStyle}>image</NavLink></li>
        <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/headline" style={lsStyle}>headline</NavLink></li>
        <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/number" style={lsStyle}>number</NavLink></li>
        <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/key" style={lsStyle}>key</NavLink></li>
        <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/todo" style={lsStyle}>todo</NavLink></li>
        <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/style" style={lsStyle}>style</NavLink></li>
        <li><NavLink className={({isActive})=>isActive?"active-item":"panding-item"} to="/console" style={lsStyle}>ConsolePage</NavLink></li>
      </ul>
    </div>
  );
};

export default Tabs;