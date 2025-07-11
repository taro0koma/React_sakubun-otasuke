import React,{useState} from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from './../component/Tabs';
import ModalFrame from "../component/ModalFrame";
import SwiperPage from './swiperPage';
import NextPageLink from '../component/NextPageLink';
import { Helmet } from 'react-helmet-async';
import Footer from './Footer';

const GenkoyoshiPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Helmet>
        <title>{t('genkouyoshi.helmet')}</title>
        <meta property="og:title" content={t('genkouyoshi.ogTitle')} />
        <meta property="og:description" content={t('genkouyoshi.ogDescription')} />
        <meta property="og:url" content="https://sakubun-otasuke.com/images/benrituru.png" />
      </Helmet>
      <Tabs pageTitle={t('genkouyoshi.title')} contents="genkouyoshi"/>
      {isModalOpen && (
        <ModalFrame title={t('genkouyoshi.modalTitle')} text={t('genkouyoshi.modalText')} onClose={handleModalClose} imageSrc="/vite.svg" buttonName={t('genkouyoshi.modalButton')}/>
      )}
      <p>{t('genkouyoshi.intro')}</p>
      <br />
      <h4 style={{padding:"0 10px"}}>{t('genkouyoshi.tool1Title')}</h4>
      <p style={{textAlign:"left",maxWidth:"650px",margin:"auto"}}>{t('genkouyoshi.tool1Text')}</p>
      
      <div style={{display:"flex",textAlign:"center",justifyContent:"center"}}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Google_Sheets_2020_Logo.svg/140px-Google_Sheets_2020_Logo.svg.png" alt="logo" style={{width:"2rem",margin:"0 1rem 0 0"}}/>
      <p style={{color:"blue",textDecoration: "underline"}}><a href="https://seipsg.main.jp/service/manuscriptpaper_gs" target='_blank' className='linkosusume'>{t('genkouyoshi.tool1Link')}</a></p>
      </div>
      <img src="/images/genkouyousisakuseTukatta.png" alt="コマワンちゃんが操作中" style={{maxWidth:640}} />
      <div className='genkouimage'>
      <br />
      </div> 
      <h4 style={{padding:"0 10px"}}>{t('genkouyoshi.tool2Title')}</h4>
      <p style={{textAlign:"left",maxWidth:"650px",margin:"auto"}}>{t('genkouyoshi.tool2Text')}</p>
      <div style={{display:"flex",textAlign:"center",justifyContent:"center"}}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/300px-Figma-logo.svg.png" alt="logo" style={{width:"2rem",margin:"0 1rem 0 0"}}/>
      <p style={{color:"blue",textDecoration: "underline"}}><a href="https://www.figma.com/" target='_blank' className='linkosusume'>{t('genkouyoshi.tool2Link')}</a></p>
      </div>
      <div className='genkouimage'>
      <SwiperPage gazou1="/images/sakubunMap1.png" gazou2="/images/sakubunMap2.png" gazou3="/images/sakubunMap3.png" gazou4="/images/dokushokansouMap.png"/>
      <NextPageLink imairu="benri1"/>
      <br />
      <Footer/>
      </div>
    </div>
  );
};

export default GenkoyoshiPage;
