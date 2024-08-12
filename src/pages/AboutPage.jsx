import React,{useState} from 'react';
import Tabs from '../component/Tabs'
import ModalFrame from "../component/ModalFrame";

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
    </div>
  );
};

export default AboutPage;