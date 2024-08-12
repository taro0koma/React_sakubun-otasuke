import React,{useState} from 'react';
import Tabs from '../component/Tabs'
import ModalFrame from "../component/ModalFrame";
import PreviousAndNext from '../component/PreviousAndNext';

const AboutPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Tabs pageTitle="イメージマップの作り方" contents="imagemap"/>
      {isModalOpen && (
        <ModalFrame title="イメージマップの作り方について" text="頭で考えても思いつかないのに紙に書いてみると、ふしぎなくらいイメージがわいてくる！何を書けばいいか思いつかないときは、紙の真ん中に1つだけ気持ちを書いてスタートしよう（「面白かった」「面白くなかった」からでもだいじょうぶ）" onClose={handleModalClose} imageSrc="/vite.svg"/>
      )}
      <p></p>
      <video controls src="/images/figjamvideo.mp4" style={{width:"100%"}}></video>
      <br />
      <br />
      <p>段落の組み立てで作文のそれぞれの段落に何を書くか決めよう。</p>
      <a href="/danraku"><button>▶ 段落の組み立てを使ってみる</button></a>
      <PreviousAndNext midashi="思いつかないときは3でも大丈夫！" honbun="「もう思いつかないー！」となったら次へ進もう" buttontext="▶　段落の組み立てを使ってみる" buttonurl="/hyougen"/>
      <div className="spacer" style={{height:250}}></div>
    </div>
  );
};

export default AboutPage;