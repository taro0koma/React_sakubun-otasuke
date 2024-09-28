import { useState } from 'react';

const GradeSelection = ({ onSubmit }) => {
  // 学年と年齢の対応リスト
  const grades = [
    { label: "小学1年生", age: "s1" },
    { label: "小学2年生", age: "s2" },
    { label: "小学3年生", age: "s3" },
    { label: "小学4年生", age: "s4" },
    { label: "小学5年生", age: "s5" },
    { label: "小学6年生", age: "s6" },
    { label: "中学1年生", age: "t1" },
    { label: "中学2年生", age: "t2" },
    { label: "中学3年生", age: "t3" },
    { label: "高校1年生", age: "k1" },
    { label: "高校2年生", age: "k2" },
    { label: "高校3年生", age: "k3" },
  ];

  const [selectedGrade, setSelectedGrade] = useState(null); // 選択された学年

  const handleClick = (grade) => {
    setSelectedGrade(grade);  // 選択された学年を保存
    onSubmit(grade.age);  // 対応する年齢を渡す
  };

  return (
    <div style={{paddingTop:"24px",textAlign:"center"}}>
    <div style={{fontSize:"0.9em",lineHeight:"1.5",fontWeight:"bold",marginBottom:"0.5rem",backgroundColor:"#ffffff"}}>イメージマップの<br/>アドバイスをもらおう！</div>
    <div>
      <h2 style={{backgroundColor:"white",fontWeight:"bold"}}>あなたの学年は？</h2>
      <div className="grade-buttons">
        {grades.map(grade => (
          <button
            key={grade.label}
            onClick={() => handleClick(grade)}
            className={`grade-button ${selectedGrade === grade ? 'selected' : ''}`}
          >
            {grade.label}
          </button>
        ))}
      </div>
    </div>
    </div>
  );
};

export default GradeSelection;
