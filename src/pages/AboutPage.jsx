import React,{useState} from 'react';
import Tabs from '../component/Tabs'
import ModalFrame from "../component/ModalFrame";
import SwiperPage from './swiperPage';
import NextPageLink from './../component/NextPageLink';
import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Helmet><title>イメージマップの作り方 | 作文おたすけアプリ</title></Helmet>
      <Tabs pageTitle="「イメージマップ」の作り方" contents="imagemap"/>
      {isModalOpen && (
        <div className='saisyonihyouzisuruhurothinghuremu'><ModalFrame title="イメージマップの作り方について" text="頭で考えても思いつかないのに紙に書いてみると、ふしぎなくらいイメージがわいてくる！何を書けばいいか思いつかないときは、紙の真ん中に1つだけ気持ちを書いてスタートしよう（「面白かった」「面白くなかった」からでもだいじょうぶ）" onClose={handleModalClose} imageSrc="/vite.svg"/></div>
      )}
      <p style={{textAlign:"center"}}>書くことがぜんぜん思いつかない！<br/>そんな時はイメージマップを書いてみよう。</p>
      <video controls src="/images/figjamvideo.mp4" style={{width:"80%"}} poster='/images/thumbnail.png'></video>
      <p>上のようなものを紙などに書いてみよう</p>
      <a href="/imagemapmake"><button>イメージマップ作成ツールで作ってみる▶</button></a>
      <br />
      <div style={{marginBottom:"3rem"}}/>
      <h4>イメージマップの例</h4>
        <p>Kさんの作ったイメージマップもあります。<br/>参考にしてくださいね</p>
      <SwiperPage gazou1="/images/sakubunMap1.png" gazou2="/images/sakubunMap2.png" gazou3="/images/sakubunMap3.png" gazou4="/images/dokushokansouMap.png"/>
      <br />
      <br />
      <p>段落の組み立てで作文のそれぞれの段落に何を書くか決めよう。</p>
      <a href="/danraku"><button>▶ 段落の組み立てを使ってみる</button></a>
      <div className="spacer" style={{height:100}}></div>
      <NextPageLink imairu="imagemap1"/>
    </div>
  );
};

export default AboutPage;