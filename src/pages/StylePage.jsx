import React, { useState } from 'react';
import Tabs from '../component/Tabs';

const StylePage = () => {

  let [FormObj,SetFromObj] = useState({fName:"",nName:"",lName:"",city:" ",gender:""})

  const InputOnChange = (property,value) => {
    SetFromObj( prevObj => ({
      ...prevObj,
      [property]:value
    }))
  }

  const FormSubmit = (e)=> {
    e.preventDefault();
    console.log(FormObj);
  }

  return (
    <div className='container'>

      <Tabs/>
      <h3>段落の組み立て</h3>
      <form onSubmit={FormSubmit}>
        <h5>学年</h5>
      <select onChange={(e) => {InputOnChange("city",e.target.value)}} value={FormObj.city}>
          <option value="grade">学年</option>
          <option value="s1">小学1年生</option>
          <option value="s2">小学2年生</option>
          <option value="s3">小学3年生</option>
          <option value="s4">小学4年生</option>
          <option value="s5">小学5年生</option>
          <option value="s6">小学6年生</option>
          <option value="t1">中学1年生</option>
          <option value="t2">中学2年生</option>
          <option value="t3">中学3年生</option>
          <option value="k1">高校1年生</option>
          <option value="k2">高校2年生</option>
          <option value="k3">高校3年生</option>
        </select>
        <h5>入力欄</h5>

        <input onChange={(e) => {InputOnChange("fName",e.target.value)}} value={FormObj.fName} placeholder='first Name' />
        <input onChange={(e) => {InputOnChange("nName",e.target.value)}} value={FormObj.nName} placeholder='next Name' />
        <input onChange={(e) => {InputOnChange("lName",e.target.value)}} value={FormObj.lName} placeholder='Last Name' />
        <h5>性別</h5>
        <input onChange={() => {InputOnChange("gender","Male")}} checked={FormObj.gender === "Male"} type="radio" name="gender"/>Male
        <input onChange={() => {InputOnChange("gender","Female")}} checked={FormObj.gender === "Female"} type="radio" name="gender"/>Fremale
        <br />
        <button type='submit'>送信</button>
      </form>
    </div>
  );
};

export default StylePage;