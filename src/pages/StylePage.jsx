import React, { useState, useRef, useEffect } from "react";
import Tabs from "../component/Tabs";
import ModalFrame from "../component/ModalFrame";
import PreviousAndNext from "../component/PreviousAndNext";

const StylePage = () => {

  const copyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard:", textToCopy);
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleCopyClick = (text) => {
    copyToClipboard(text);
  };


  let ok = "no";
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [dataArray, setDataArray] = useState([]);
  const regex = /\[([\s\S]*?)\]/; // 「[」から「]」までの部分にマッチする正規表現

  const gradeJapan = {
    grade: "とくに制限なし",
    s1: "小学１年生",
    s2: "小学２年生",
    s3: "小学３年生",
    s4: "小学４年生",
    s5: "小学５年生",
    s6: "小学６年生",
    t1: "中学１年生",
    t2: "中学２年生",
    t3: "中学３年生",
    k1: "高校１年生",
    k2: "高校２年生",
    k3: "高校３年生",
    d1: "大学１年生",
    d2: "大学２年生",
    d3: "大学３年生",
  };
  const typeJapan = {
    type: "特に制限なし",
    bookReview: "読書感想文",
    composition: "作文",
  };
  const [formObj, setFormObj] = useState({
    fName: "",
    nName: "",
    lName: "",
    grade: " ",
    type: " ",
    bookReviewFirst: "",
    bookReviewSecond: "",
    bookReviewThird: "",
    bookReviewArasuji: "",
    bookReviewThing:"",
    sFirst: "",
    sSecond: "",
    sThird: "",
    sTheme: "",
    sFo: "",
  });
  const [messages, setMessage] = useState("");
  const [answers, setAnswer] = useState("");
  const [visibleRows, setVisibleRows] = useState(0);

  const chatContainerRef = useRef(null);

  const InputOnChange = (property, value) => {
    setFormObj((prevObj) => ({
      ...prevObj,
      [property]: value,
    }));
  };
  let userMessage = ` `; // ${typeJapan[formObj.type]}のための${gradeJapan[formObj.grade]} が作成する作文の準備をするため、主題を ${formObj.fName} に設定し、第2要素は「 ${formObj.nName} 」､第3要素は「 ${formObj.lName} 」として、テーマについて自分の考えや経験を描く1600文字程度の作文のための「PREP+」のフレームワークを５～６個の段落の概要提案になるように構成し（次の5点に必ず対応してください。 1.項目ごと150文字以上にする。2.最初の段落と最終の段落が自分の言いたいことを伝える重要なまとめの段落とする。 3. ${gradeJapan[formObj.grade]} 以下の年齢の子供の文化や世界観を表現できる文章にリライトする。 4. ${gradeJapan[formObj.grade]} 以下の年齢の子供が読んだり書いたりできるようにリライトする。 5.必ず一つ一つの提案の最後に「～～のようなことを書く段落にするのはどうでしょうか」と書く。）、const answer=[];の形式で日本語の値のみの配列を記載してください。配列のコード以外の文章やアドバイスは完全に省いてください。
  const FormSubmit = async (e) => {
    // 送信ボタンを使用不可にする
    e.preventDefault();

    let userMemo = `${typeJapan[formObj.type]}のための${
      gradeJapan[formObj.grade]
    } 向けに${formObj.fName}と ${formObj.nName} と ${
      formObj.lName
    } について書くための段落の組み立てアイデアを作ってみます。`;
    // addAnswer(userMemo, false);
    

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/danraku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage,gakunen: formObj.grade }),
      });

      if (response.ok) {
        ok = "ok";
        console.log(userMemo);
        const data = await response.json();
        const parsedData = data.bot.trim();
        addAnswer(parsedData, true);
      } else {
        const err = await response.text();
        setMessage(
          "段落の組み立て作成がうまくいきませんでした。もう一度入力してください。"
        );
        alert(err);
      }
      // const answerArrayString = result.choices[0].text.trim();
      if (answers.length > 0) {
        const answerArray = JSON.parse(
          // answerArrayString.match(/const answer=\[(.*)\];/)[1]
          answers.value.match(/const answer=\[(.*)\];/)[1]
        );
        setData(answerArray);
      }
    } catch (error) {
      console.error("処理中にエラーが発生しました : ", error);
    }
  };

  const addAnswer = (value) => {
    let match = value.match(regex);
    let extractedArrayString = match[0]; // マッチした部分全体を取得
    let array = eval(extractedArrayString); // evalで文字列を配列として評価
    console.log(array[1]);
    setAnswer(array);
    setDataArray(array);
    scrollChatToBottom();
  };

  const renderAdditionalQuestions = () => {
    if (formObj.type === "composition") {
      userMessage = `こんにちは、ChatGPT。テーマは「${formObj.sTheme
      }」です。構成を考える手助けをお願いしたいです。${
        typeJapan[formObj.type]
      }のための${
        gradeJapan[formObj.grade]
      } が作成する作文をつくります。第1要素は${
        formObj.sFirst
      } に設定し、第2要素は「 ${
        formObj.sSecond
      } 」､第3要素は「 ${
        formObj.sThird
      } 」、第4要素は「${
        formObj.sFo
      }」として、テーマについて自分の考えや経験を描く1600文字程度の作文のための「PREP+」のフレームワークを５～６個の段落の概要提案になるように構成し（次の5点に"必ず"対応してください。 1.項目ごと150文字以上にする。2.最初の段落と最終の段落が自分の言いたいことを伝える重要なまとめの段落とする。 3. ${
        gradeJapan[formObj.grade]
      } 以下の年齢の子供の文化や世界観を表現できる文章にリライトする。 4. ${
        gradeJapan[formObj.grade]
      } 以下の年齢の子供が読んだり書いたりできるようにリライトする。 5.あらすじは下記とする。${
        formObj.bookReviewArasuji
      }6.必ず"一つ一つ"の提案の最後に「～～のようなことを書く段落にするのはどうでしょうか」と書く。）、const answer=[];の形式で日本語の値のみの配列を記載してください。配列のコード以外の文章やアドバイスは”完全に省いて”ください。あまり情報がなかった場合、勝手にお話を作らないでください。大胆でいいんです！`;
      //作文の場合
      return (
        <>
          <h5>テーマを記入してね</h5>
          <textarea 
          onChange={(e) => {
            InputOnChange("sTheme", e.target.value);
          }}
          value={formObj.sTheme}
          placeholder="テーマ"
          />
          <h5>そのテーマに合わせて<br/>どんなことを書きたいか4つ記入してね</h5>
          <textarea
            onChange={(e) => {
              InputOnChange("sFirst", e.target.value);
            }}
            value={formObj.sFirst}
            placeholder="１番目に書きたいこと"
          />
          <br />
          <textarea
            onChange={(e) => {
              InputOnChange("sSecond", e.target.value);
            }}
            value={formObj.sSecond}
            placeholder="２番目にか書きたいこと"
          />
          <br />
          <textarea
            onChange={(e) => {
              InputOnChange("sThird", e.target.value);
            }}
            value={formObj.sThird}
            placeholder="３番目に書きたいこと"
          />
          <textarea
            onChange={(e) => {
              InputOnChange("sFo", e.target.value);
            }}
            value={formObj.sFo}
            placeholder="４番目に書きたいこと"
          />
        </>
      );
    } else if (formObj.type === "bookReview") {
      //読書感想文の場合
      userMessage = `こんにちは、ChatGPT。私が読んだ本について、読書感想文の構成を考える手助けをお願いしたいです。${
        typeJapan[formObj.type]
      }のための${
        gradeJapan[formObj.grade]
      } が作成する作文をつくります。本の内容は ${
        formObj.bookReviewFirst
      } に設定し、第2要素は「 ${formObj.bookReviewSecond} 」､第3要素は「 ${
        formObj.bookReviewThird
      } 」として、テーマについて自分の考えや経験を描く1600文字程度の作文のための「PREP+」のフレームワークを５～６個の段落の概要提案になるように構成し（次の5点に"必ず"対応してください。 1.項目ごと150文字以上にする。2.最初の段落と最終の段落が自分の言いたいことを伝える重要なまとめの段落とする。 3. ${
        gradeJapan[formObj.grade]
      } 以下の年齢の子供の文化や世界観を表現できる文章にリライトする。 4. ${
        gradeJapan[formObj.grade]
      }表紙の様子/本の題名から考えたことは下記です。${
        formObj.bookReviewThing
      }以下の年齢の子供が読んだり書いたりできるようにリライトする。 5.必ず"一つ一つ"の提案の最後に「～～のようなことを書く段落にするのはどうでしょうか」と書く。）、const answer=[];の形式で日本語の値のみの配列を記載してください。配列のコード以外の文章やアドバイスは完全に省いてください。`;
      return (
        <>
        <h5>本の種類を選んでね</h5>
          <select
            onChange={(e) => {
              InputOnChange("bookReviewFirst", e.target.value);
            }}
            value={formObj.bookReviewFirst}
          >
            <option value="">本の種類</option>
            <option value="愉快な内容の本">愉快な内容の本</option>
            <option value="有名な人物の伝記の本">有名な人物の伝記の本</option>
            <option value="実際にあった話">実際にあった話</option>
            <option value="冒険をする本">冒険をする本</option>
            <option value="悲しいことが起こる本">悲しいことが起こる本</option>
            <option value="怖い怪談についての本">怖い怪談についての本</option>
            <option value="困りごとに立ち向かう本">
              困りごとに立ち向かう本
            </option>
            <option value="食べ物の作り方">食べ物の作り方</option>
            <option value="科学について書かれた本">
              科学について書かれた本
            </option>
            <option value="地球や環境について書かれた本">
              地球や環境について書かれた本
            </option>
            <option value="歴史について書かれた本">
              歴史について書かれた本
            </option>
            <option value="ワクワクする本">ワクワクする本</option>
            <option value="自分に似た人物が登場する本">
              自分に似た人物が登場する本
            </option>
            <option value="図鑑">図鑑</option>
            <option value="クイズの本">クイズの本</option>
            <option value="想像上の人物の日常が描かれた本">
              想像上の人物の日常が描かれた本
            </option>
            <option value="不思議な世界に行く話">不思議な世界に行く話</option>
          </select>

          {/* <textarea
          onChange={(e) => {
            InputOnChange("bookReviewFirst", e.target.value);
          }}
          value={formObj.bookReviewFirst}
          placeholder="本の内容"
        /> */}
          <br />
          <h5>その本にはどんなことが書かれていたかな</h5>
          <textarea onChange={(e)=>{
             InputOnChange("bookReviewArasuji", e.target.value);
          }}
          cols="10"//横幅
          rows="5"//行数
          placeholder="あらすじ" />
          <h5>心に残った部分は何かな</h5>
          <textarea
            onChange={(e) => {
              InputOnChange("bookReviewSecond", e.target.value);
            }}
            value={formObj.bookReviewSecond}
            placeholder="印象に残ったところ"
          />
          <br />
          <br />
          <h5>本の表紙または<br/>読む前に題名から考えたこと<br/>について書いてね</h5>
          <textarea
            onChange={(e) => {
              InputOnChange("bookReviewThing", e.target.value);
            }}
            value={formObj.bookReviewThing}
            placeholder="表紙の様子/本の題名から考えたこと"
          />
          <br />
          <br />
          <h5>上のほかに書きたいことを記入してね</h5>
          <textarea
            onChange={(e) => {
              InputOnChange("bookReviewThird", e.target.value);
            }}
            value={formObj.bookReviewThird}
            placeholder="書きたいこと"
          />
        </>
      );
    }
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  }

  const scrollChatToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };
  useEffect(() => {
    if (dataArray.length > 0) {
      const interval = setInterval(() => {
        setVisibleRows((prev) => {
          if (prev < dataArray.length) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 2000); 
    }
  },[dataArray]);
  const hyou = () => {
    if (Array.isArray(dataArray) && dataArray.length > 0) {
      return (
        <table>
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap" }} className="kakusitai">段落番号</th>
              <th>こんな内容をふくらませて段落を書いてみるのがおすすめ！</th>
            </tr>
          </thead>
          <tbody id="danraku-answer">
          {dataArray.slice(0, visibleRows).map((item, index) => (
          <tr key={index} className="animated-row">
            <td className="td-index"><span>{index + 1}</span></td>
                <td className="td-item">
                  {item}
                  <br />
                  <button onClick={() => copyToClipboard(item)} style={{ marginLeft: "10px" }}>この段落をコピーする</button>
                </td>
          </tr>
        ))}
            {/* {dataArray.map((item, index) => (
          // setTimeout(() =>{
            <tr key={index} className={"danrakumoji"+index}>
            <td className="k">{index + 1}</td>
            <td className="d">{item}</td>
          </tr>
          // },1000)
          
        ))} */}
          </tbody>
        </table>
      );
    }
  };
  const honbun = (
    <>
      何を書くかわかんないときはマップがおすすめ！<br />
      試しにやってみよう！
    </>
  );



  return (
    <div className="container">
      <Tabs pageTitle="段落の組み立て" contents="danraku"/>
      <p>イメージマップなどで書きたいことが決まったら<br/>書きたいことをどんな順番で書けばいいか教えてもらおう</p>
      {isModalOpen && (
        <ModalFrame
          title="段落の組み立て"
          text="イメージマップなどで書きたいことが決まったら書きたいことをどんな順番で書けばいいか教えてもらおう"
          onClose={handleModalClose}
          imageSrc="/images/danrakuwan.png"
          midashi="書きたいことが決まったら自分のぴったりの文の書き方を見つけよう"
          />
      )}
      <b><p>気に入ったものはどこかにコピーしておこう！</p></b>
      <br />
      <form onSubmit={FormSubmit}>
        <h5>あなたは何年生ですか？</h5>
        <select
          onChange={(e) => {
            InputOnChange("grade", e.target.value);
          }}
          value={formObj.grade}
          required
        >
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
        <h5>作文のタイプ</h5>
        <select
          onChange={(e) => {
            InputOnChange("type", e.target.value);
          }}
          value={formObj.type}
          required
        >
          <option value="">選択</option>
          <option value="bookReview">読書感想文</option>
          <option value="composition">テーマのある作文</option>
        </select>
        <br />
        {renderAdditionalQuestions()}

        <br />
        <br />
        <button type="submit">段落の組み立て教えて！</button>
        <p>{messages}</p>
      </form>

      {hyou()}
      <PreviousAndNext midashi="書きたいことが決まっていない？" honbun={honbun} buttontext="▶　マップ作ってみる" buttonurl="/map"/>
      <div className="spacer" style={{height:400}}></div>
    </div>
  );
};

export default StylePage;
