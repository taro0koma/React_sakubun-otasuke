// import React, { useState } from "react";
// import { createClient } from "@supabase/supabase-js";
// import Tabs from "../component/Tabs";

// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_API_KEY
// );

// const ContactPage = () => {
//   const [kSelectedOption, setkSelectedOption] = useState("");
//   const [gSelectedOption, setgSelectedOption] = useState("");
//   const [submittedOption, setSubmittedOption] = useState("");
//   const [kimochis, setKimochis] = useState([]);
//   const [aiResponse, setAiResponse] = useState("");

//   const handleChange = (e) => {
//     setkSelectedOption(e.target.value);
//   };

//   const ghandleChange = (e) => {
//     setgSelectedOption(e.target.value);
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmittedOption(kSelectedOption);
//     getKimochis(kSelectedOption);
//     setSubmittedOption(gSelectedOption);
//     getKimochis(gSelectedOption);
//   };

//   async function getKimochis(option) {
//     let { data, error } = await supabase
//       .from("sakubunKimochi")
//       .select("*")
//       .eq("types", option);
//     if (error) {
//       console.error("フェッチでエラーが発生しました：", error);
//     } else {
//       setKimochis(data);
//       if (data.length > 0) {
//         const examples = data.map((kimochi) => kimochi.examples).join("\n");
//         fetchAIResponse(option, examples);
//       }
//     }
//   }

//   async function fetchAIResponse(option, examples) {
//     const userMessage = `下記の言葉に基づいて${option}\nという意味合いで、言葉を10個拡張してください：\n\n${examples}※改行のある箇条書きで書くこと`;
//     try {
//       const response = await fetch(process.env.REACT_APP_API_URL + "/danraku", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: userMessage }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const parsedData = data.bot.trim();
//         setAiResponse(parsedData);
//       } else {
//         console.error("AIのレスポンスの取得に失敗しました。");
//       }
//     } catch (error) {
//       console.error("AIのレスポンス取得中にエラーが発生しました：", error);
//     }
//   }

//   return (
//     <div>
//       <Tabs />
//       <h1>気持ちや感想</h1>
//       <div className="p-4">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="dropdown" className="block mb-2">
//               Select an option:
//             </label>
//             <select
//               id="dropdown"
//               value={kSelectedOption}
//               onChange={handleChange}
//               className="p-2 border border-gray-300 rounded"
//             >
//               <option value="">--Select--</option>
//               <option value="ほっとした">ほっとした</option>
//               <option value="おどろいた">おどろいた</option>
//               <option value="うれしい">うれしい</option>
//               <option value="感激">感激</option>
//               <option value="こわい">こわい</option>
//             </select>
//             <select
//               id="dropdown"
//               value={gSelectedOption}
//               onChange={ghandleChange}
//               className="p-2 border border-gray-300 rounded"
//             >
//               <option value="">--Select--</option>
//               <option value="ほっとした">ほっとした</option>
//               <option value="おどろいた">おどろいた</option>
//               <option value="うれしい">うれしい</option>
//               <option value="感激">感激</option>
//               <option value="こわい">こわい</option>
//             </select>
//           </div>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Submit
//           </button>
//         </form>
//         {submittedOption && (
//           <div>
//             <h2>Supabaseからのデータ:</h2>
//             <ul>
//               {kimochis.map((kimochi) => (
//                 <li key={kimochi.id}>
//                   {kimochi.types} : {kimochi.examples}
//                 </li>
//               ))}
//             </ul>
//             <h2>AIの提案:</h2>
//             <p dangerouslySetInnerHTML={{ __html: aiResponse }}></p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ContactPage;
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Tabs from "../component/Tabs";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API_KEY
);

const ContactPage = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [submittedOption, setSubmittedOption] = useState("");
  const [kimochis, setKimochis] = useState([]);
  const [aiResponse, setAiResponse] = useState("");

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedOption(selectedOption);
    getKimochis(selectedOption);
  };

  async function getKimochis(option) {
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
        fetchAIResponse(option, examples);
      }
    }
  }

  async function fetchAIResponse(option, examples) {
    const userMessage = `下記の言葉を${option}\nをいう意味合いで拡張した言葉を10個つくり、それを改行のある箇条書きにしてください。：\n\n${examples}`;
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/danraku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        setAiResponse(parsedData);
      } else {
        console.error("AIのレスポンスの取得に失敗しました。");
      }
    } catch (error) {
      console.error("AIのレスポンス取得中にエラーが発生しました：", error);
    }
  }

  return (
    <div>
      <Tabs />
      <h1>気持ちや感想</h1>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="dropdown" className="block mb-2">
              Select an option:
            </label>
            <select
              id="dropdown"
              value={selectedOption}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">--Select--</option>
              <option value="ほっとした">ほっとした</option>
              <option value="おどろいた">おどろいた</option>
              <option value="うれしい">うれしい</option>
              <option value="感激">感激</option>
              <option value="こわい">こわい</option>
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
