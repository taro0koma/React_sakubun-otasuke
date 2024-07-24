import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Tabs from "../component/Tabs";
import ModalFrame from "../component/ModalFrame";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API_KEY
);

const ContactPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [submittedOption, setSubmittedOption] = useState("");
  const [submittedGrade, setSubmittedGrade] = useState("");
  const [kimochis, setKimochis] = useState([]);
  const [aiResponse, setAiResponse] = useState("");

  const handleChangeOption = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleChangeGrade = (e) => {
    setSelectedGrade(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedOption(selectedOption);
    setSubmittedGrade(selectedGrade);
    getKimochis(selectedOption, selectedGrade);
  };

  async function getKimochis(option, grade) {
    let { data, error } = await supabase
      .from("sakubunKimochi")
      .select("*")
      .eq("types", option);
    if (error) {
      console.error("フェッチでエラーが発生しました：", error);
    } else {
      setKimochis(data);
      if (data.length > 0) {
        const examples = data.map((kimochi) => kimochi.examples).join("\n");
        fetchAIResponse(option, grade, examples);
      }
    }
  }

  async function fetchAIResponse(option, grade, examples) {
    const userMessage = `下記の言葉を${option}という意味合いで${grade}向けにどんなときにも使える拡張した言葉を10個つくり、それを改行のある1．２．などの表示になるよう箇条書きにしてください。〇〇を埋めずに載せてください！！：\n\n${examples}`;
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/danraku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        const formattedData = parsedData.replace(/\n/g, "<br />");
        setAiResponse(formattedData);
      } else {
        console.error("AIのレスポンスの取得に失敗しました。");
      }
    } catch (error) {
      console.error("AIのレスポンス取得中にエラーが発生しました：", error);
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Tabs />
      <h1>気持ちや感想</h1>
      {isModalOpen && (
        <ModalFrame title="気持ちや感想の使い方" text="～～～～～～" onClose={handleModalClose} />
      )}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="dropdownOption" className="block mb-2">
              Select an option:
            </label>
            <select
              id="dropdownOption"
              value={selectedOption}
              onChange={handleChangeOption}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">気持ちや感想を選択してください</option>
              <option value="ほっとした">ほっとした</option>
              <option value="おどろいた">おどろいた</option>
              <option value="うれしい">うれしい</option>
              <option value="感激">感激</option>
              <option value="こわい">こわい</option>
            </select>
          </div>
          <div>
            <label htmlFor="dropdownGrade" className="block mb-2">
              学年を選択してください:
            </label>
            <select
              id="dropdownGrade"
              value={selectedGrade}
              onChange={handleChangeGrade}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">学年を選択してください</option>
              <option value="小学1年生">小学1年生</option>
              <option value="小学2年生">小学2年生</option>
              <option value="小学3年生">小学3年生</option>
              <option value="小学4年生">小学4年生</option>
              <option value="小学5年生">小学5年生</option>
              <option value="小学6年生">小学6年生</option>
              <option value="中学1年生">中学1年生</option>
              <option value="中学2年生">中学2年生</option>
              <option value="中学3年生">中学3年生</option>
              <option value="高校1年生">高校1年生</option>
              <option value="高校2年生">高校2年生</option>
              <option value="高校3年生">高校3年生</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </form>
        {submittedOption && (
          <div>
            <h2>Supabaseからのデータ:</h2>
            <ul>
              {kimochis.map((kimochi) => (
                <li key={kimochi.id}>
                  {kimochi.types} : {kimochi.examples}
                </li>
              ))}
            </ul>
            <h2>AIの提案:</h2>
            <p dangerouslySetInnerHTML={{ __html: aiResponse }}></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
