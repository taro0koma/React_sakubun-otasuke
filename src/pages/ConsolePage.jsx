// import Contact from "./../component/Contact";
// import Tabs from "../component/Tabs";
// import React, { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_API_KEY,
// );
// const gradeJapan = {
//   s1: "小学１年生",
//   s2: "小学２年生",
//   s3: "小学３年生",
//   s4: "小学４年生",
//   s5: "小学５年生",
//   s6: "小学６年生",
//   t1: "中学１年生",
//   t2: "中学２年生",
//   t3: "中学３年生",
//   k1: "高校１年生",
//   k2: "高校２年生",
//   k3: "高校３年生",
// };

// const ConsolePage = () => {
//   const [kakidashis, setKakidashis] = useState([]);

//   useEffect(() => {
//     getKakidashis();
//   }, []);
//   async function getKakidashis() {
//     const { data, error } = await supabase.from("sakubunKakidashi").select();
//     if (error) {
//       console.error("フェッチでエラーが発生しました：", error);
//     } else {
//       // console.log("取得したデータ：", data); // 取得したデータを確認
//       setKakidashis(data);
//     }
//   }

//   return (
//     <div>
//       <Tabs />
//       <h1>書き出しおみくじ</h1>
//       <ul>
//         {kakidashis.map((kakidashi) => (
//           <li key={kakidashi.id}>
//             {gradeJapan[kakidashi.grade]} : {kakidashi.types} :{" "}
//             {kakidashi.examplesentence}
//           </li>
//         ))}
//       </ul>
//       <Contact />
//     </div>
//   );
// };

// export default ConsolePage;
