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
      {/* <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/RYrGVCtLXik?si=Hhuu8ZoVJ997pboP" 
        title="YouTube video player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerPolicy="strict-origin-when-cross-origin" 
        allowFullScreen>
      </iframe> */}
      <iframe width="560" height="315" src="https://www.youtube.com/embed/UmVWOEZAq0I?si=uusYe1HjzSuAsgJq&amp;start=74" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
  );
};

export default AboutPage;