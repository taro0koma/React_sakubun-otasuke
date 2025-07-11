import React,{useState} from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from '../component/Tabs'
import ModalFrame from "../component/ModalFrame";
import SwiperPage from './swiperPage';
import NextPageLink from './../component/NextPageLink';
import { Helmet } from 'react-helmet-async';
import Footer from './Footer';

const AboutPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Helmet><title>{t('about.helmet')}</title></Helmet>
      <Tabs pageTitle={t('about.title')} contents="imagemap"/>
      {isModalOpen && (
        <ModalFrame title={t('about.modalTitle')} text={t('about.modalText')} onClose={handleModalClose} imageSrc="/vite.svg"/>
      )}
      <p style={{textAlign:"center"}}>{t('about.mainText1')}<br/>{t('about.mainText2')}</p>
      <video controls src="/images/figjamvideo.mp4" style={{width:"80%"}} poster='/images/thumbnail.png'></video>
      <p>{t('about.mainText3')}</p>
      <a href="/imagemapmake"><button>{t('about.button1')}</button></a>
      <br />
      <div style={{marginBottom:"3rem"}}/>
      <h4>{t('about.exampleTitle')}</h4>
        <p dangerouslySetInnerHTML={{ __html: t('about.exampleText') }} />
      <SwiperPage gazou1="/images/sakubunMap1.png" gazou2="/images/sakubunMap2.png" gazou3="/images/sakubunMap3.png" gazou4="/images/dokushokansouMap.png"/>
      <br />
      <br />
      <p>{t('about.mainText4')}</p>
      <a href="/danraku"><button>{t('about.button2')}</button></a>
      <div className="spacer" style={{height:100}}></div>
      <NextPageLink imairu="imagemap1"/>
      <Footer/>
    </div>
  );
};

export default AboutPage;
