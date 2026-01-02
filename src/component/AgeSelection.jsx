import { t } from "i18next";
import { useState } from "react";

const GradeSelection = ({ onSubmit }) => {
  // 学年と年齢の対応リスト
  const grades = [
    { label: t("imagemapPage.s1"), age: "s1" },
    { label: t("imagemapPage.s2"), age: "s2" },
    { label: t("imagemapPage.s3"), age: "s3" },
    { label: t("imagemapPage.s4"), age: "s4" },
    { label: t("imagemapPage.s5"), age: "s5" },
    { label: t("imagemapPage.s6"), age: "s6" },
    { label: t("imagemapPage.t1"), age: "t1" },
    { label: t("imagemapPage.t2"), age: "t2" },
    { label: t("imagemapPage.t3"), age: "t3" },
    { label: t("imagemapPage.k1"), age: "k1" },
    { label: t("imagemapPage.k2"), age: "k2" },
    { label: t("imagemapPage.k3"), age: "k3" },
  ];

  const [selectedGrade, setSelectedGrade] = useState(null); // 選択された学年

  const handleClick = (grade) => {
    setSelectedGrade(grade); // 選択された学年を保存
    onSubmit(grade.age); // 対応する年齢を渡す
  };

  return (
    <div style={{ paddingTop: "24px", textAlign: "center" }}>
      <div
        style={{
          fontSize: "0.9em",
          lineHeight: "1.5",
          fontWeight: "bold",
          marginBottom: "0.5rem",
          backgroundColor: "#ffffff",
        }}
      >
        {t("imagemapPage.subWindowSubTitle")}
      </div>
      <div>
        <h2 style={{ backgroundColor: "white", fontWeight: "bold",fontSize:"25px",color:"black" }}>
          {t("imagemapPage.subWindowTitle")}
        </h2>
        <div className="grade-buttons">
          {grades.map((grade) => (
            <button
              key={grade.label}
              onClick={() => handleClick(grade)}
              className={`grade-button ${
                selectedGrade === grade ? "selected" : ""
              }`}
              style={{
                margin:"8px 8px"
              }}
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
