import Contact from "./../component/Contact";
import Tabs from "../component/Tabs";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API_KEY
);

const ContactPage = () => {
  const [kimochis, setKimochis] = useState([]);

  useEffect(() => {
    getKimochis();
  }, []);

  async function getKimochis() {
    const { data, error } = await supabase.from("sakubunKimochi").select();
    if (error) {
      console.error("フェッチでエラーが発生しました：", error);
    } else {
      // console.log("取得したデータ：", data); // 取得したデータを確認
      setKimochis(data);
    }
  }

  return (
    <div>
      <Tabs />
      <h1>気持ちや感想</h1>
      <ul>
        {kimochis.map((kimochi) => (
          <li key={kimochi.id}>{kimochi.types} : {kimochi.examples}</li>
        ))}
      </ul>
      <Contact />
    </div>
  );
};

export default ContactPage;
