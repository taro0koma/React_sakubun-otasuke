import { useState } from 'react';
import ChatWithOpenAI from '../component/ChatWithOpenAI';  // ChatWithOpenAI コンポーネントをインポート
import GradeSelection from '../component/AgeSelection';  // GradeSelection コンポーネントをインポート
import { t } from 'i18next';

const ChatBot = ({imagemap1}) => {
  const [age, setAge] = useState(null);
  const [theme, setTheme] = useState('');
  const [goal, setGoal] = useState('');
  const [step, setStep] = useState(0);

  const handleGradeSubmit = (selectedAge) => {
    setAge(selectedAge);
    setStep(1);  // 次の質問へ
  };

  const handleThemeSubmit = (e) => {
    e.preventDefault();
    setStep(2);  // 次の質問へ
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    setStep(3);  // チャット開始
  };

  const backSubmit = (e) => {
    setStep(step-1);
  }

  return (
    <div>
      {step === 0 && (
        <GradeSelection onSubmit={handleGradeSubmit} />
      )}
      {step === 1 && (
        <form onSubmit={handleThemeSubmit}>
          <label>{t("imagemapPage.chatBot.label")}</label>
          <button value={theme} onClick={(e) => setTheme("作文")} type="submit">{t("imagemapPage.chatBot.select1")}</button>
          <button value={theme} onClick={(e) => setTheme("読書感想文")} type="submit">{t("imagemapPage.chatBot.select2")}</button>
          <br />
          <button type="submit" onClick={backSubmit}>{t("imagemapPage.chatBot.backSelectGrade")}</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleGoalSubmit}>
          <label>
            {theme === "作文"
            ? 'あなたの書きたいテーマを聞かせてね'
            : <>あなたの読んだ本の題名、または、<br/>どんな本か聞かせてね</>
            }
          </label>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} />
          <button type="submit">一緒にイメージマップを作る</button>
          <br />
          <button type="submit" onClick={backSubmit}>前にもどる</button>
        </form>
      )}
      {step === 3 &&(
        <ChatWithOpenAI age={age} theme={theme} goal={goal} imagemap1={imagemap1}/>
      )}
    </div>
  );
};

export default ChatBot;
