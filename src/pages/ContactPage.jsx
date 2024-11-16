import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Tabs from "../component/Tabs";
import ModalFrame from "../component/ModalFrame";
import PreviousAndNext from "../component/PreviousAndNext";
import ChatWithOpenAI from './../component/ChatWithOpenAI';
import NextPageLink from "../component/NextPageLink";
import { Helmet } from "react-helmet-async";

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
    const userMessage = `下記の言葉を${option}という意味合いでどんなときにも使える拡張した言葉を10個つくり、それを改行のある1．２．などの表示になるよう箇条書きにしてください。：\n\n${examples}`;
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/danraku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage,gakunen: selectedGrade }),
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
  const honbun = (
    <>
      そんなときは表現ぴったり<br/>どんな言葉でも回答しているよ<br/>試しにやってみよう！
    </>
  );

  //HTML------------------------------------------------------------------
  return (
    <div>
      <Helmet>
        <title>気持ちや感想のいいかえ | 作文おたすけアプリ</title>
      </Helmet>
      <Tabs pageTitle="気持ちや感想のいいかえ" contents="kimoti"/>
      {isModalOpen && (
        <ModalFrame title="気持ちや感想のいいかえの使い方" text="「気持ちや感想のいいかえ」で、 どんないいかえ かをを知ることができます。自分の書いてみた文章の中にいいかえてみたい言葉はありますか？" onClose={handleModalClose} imageSrc="/images/dousiyowan.png"/>
      )}
      <p>自分の使っている言葉のほかにいいかえを知って、<br/>気に入るものがあったら、自分の作文に使ってみよう。</p>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="dropdownOption" className="block mb-2">
              知りたい気持ち・感想はなにか選んでね！
            </label>
            <select
              id="dropdownOption"
              value={selectedOption}
              onChange={handleChangeOption}
              className="p-2 border border-gray-300 rounded !overflow-scroll"
              required
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
              あなたは何年生ですか？
            </label>
            <select
              id="dropdownGrade"
              value={selectedGrade}
              onChange={handleChangeGrade}
              className="p-2 border border-gray-300 rounded"
              required
            >
              <option value="">学年を選択してね</option>
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
              <option value="oldPeople">大人</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            送信！
          </button>
        </form>
        {submittedOption && (
          <div style={{padding:"30px"}}>
            {/* <h2>Supabaseからのデータ:</h2>
            <ul>
              {kimochis.map((kimochi) => (
                <li key={kimochi.id}>
                  {kimochi.types} : {kimochi.examples}
                </li>
              ))}
            </ul> */}
            {/**入力した気持ちを出力する */}
            <h2 style={{padding:10,background:"#4890ff",color:"white",fontWeight:"bold"}}>「<b>{submittedOption}</b>」をいいかえてみる！</h2>
            <p dangerouslySetInnerHTML={{ __html: aiResponse }} style={{textAlign:"left"}}></p>
          </div>
        )}
      </div>
      {/* <PreviousAndNext midashi="知りたい気持ちがなかった！" honbun={honbun} buttontext="▶　使ってみる" buttonurl="/hyougen"/> */}
      <div className="spacer" style={{height:250}}></div>
      <NextPageLink imairu="kimochi1"/>
    </div>
  );
};

export default ContactPage;
