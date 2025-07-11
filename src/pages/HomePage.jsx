import React from "react";
import { useTranslation } from "react-i18next";
import Tabs from "../component/Tabs";
//⇓おかしくなったらimport style from "../assets/css/styles.module.css"にする
import "../assets/css/styles.module.css";
import SwiperHome from "./SwiperHome";
import { Helmet } from "react-helmet-async";
import Footer from "./Footer";
import "../assets/css/homePage.css"
const HomePage = () => {
  const { t } = useTranslation();
  const items = t('home.items', { returnObjects: true }) || [];
  const originalItems = [
    {
      imgSrc: `/images/sakubunnigate.png`,
      id: "contents-top",
      isKomawan: false
    },
    {
      imgSrc: `/images/wantyan1.png`,
      id: "komawanpoint1",
      isKomawan: true
    },
    {
      imgSrc: `/images/mapwaku.png`,
      url: "/map",
      url2: "/imagemapmake",
      id: "mapfinish",
      isKomawan: false
    },
    {
      imgSrc: `/images/wantyan2.png`,
      id: "komawanpoint2",
      isKomawan: true
    },
    {
      imgSrc: "/images/wakatta.png",
      url: "/danraku",
      id: "uwao",
      isKomawan: false
    },
    {
      imgSrc: "/images/wantyan3.png",
      id: "komawanpoint3",
      isKomawan: true
    },
    {
      imgSrc: "/images/uwao.png",
      url: "/osusume",
      id: "surassura",
      isKomawan: false
    },
    {
      imgSrc: "/images/wantyan4.png",
      id: "komawanpoint4",
      isKomawan: true
    },
    {
      imgSrc: "/images/aseru.png",
      id: "iikaeniodoroki",
      isKomawan: false
    },
    {
      imgSrc: "/images/iikaeniodoroki.png",
      url: "/hyougen",
      url2: "/kimoti",
      url3: "/zinbutsu",
      id: "konoiikaeyoi",
      isKomawan: false
    },
    {
      imgSrc: "/images/sakubunmakasete.png",
      id: "sakubunmakasete",
      isKomawan: false
    },
    {
      url: "/osusume",
      id: "osusume",
      isKomawan: false
    },
  ];

  const translatedItems = items.map((item, index) => ({
    ...item,
    imgSrc: originalItems[index].imgSrc,
    id: originalItems[index].id,
    url: originalItems[index].url,
    url2: originalItems[index].url2,
    url3: originalItems[index].url3,
    isKomawan: originalItems[index]?.isKomawan
  }));

  return (
    <div id="top" className="home-page"> {/* home-page クラスを追加 */}
      <Helmet><title>{t('home.helmet')}</title></Helmet>
      <Tabs contents="home" />
      <section className="hero-section"> {/* 新しいセクションを追加 */}
        <div className="hero-content">
          <img src="/images/coma.png" alt="ロゴ" className="app-logo" /> {/* app-logo クラスを追加 */}
          <h1>{t('homeTitle')}</h1> {/* h2をh1に変更し、より目立たせる */}
          <p>
            {t('homeDescription')}
          </p>
        </div>
      </section>

      <SwiperHome />

      <nav className="navigation">
        <ul className="navigation-list">
          {(t('home.nav', { returnObjects: true }) || []).map((item, index) => (
            <li className="navigation-item" key={index}>
              <a href={`#${['komawanpoint1', 'komawanpoint2', 'komawanpoint4', 'komawanpoint4', 'osusume'][index]}`}>
                <span>{item.line1}</span><br /><span>{item.line2}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      

      <h3 style={{width:"640px",maxWidth:"80%",margin:"160px auto 0px",textAlign:"left"}}>{t("home.InitialQuestionOne")}</h3>
      <p style={{width:"640px",maxWidth:"80%",margin:"0px auto 80px",textAlign:"left"}}>{t("home.InitialQuestionTwo")}</p>

      <div className="contents-wrapper"> {/* container を contents-wrapper に変更 */}
        {translatedItems.map((item, index) => (
          <section className={item.isKomawan ? "content-block" : "content-blocktwo"} key={index} id={item.id}> {/* set を content-block に変更し、idをsectionに移動 */}
            {item.imgSrc && <img src={item.imgSrc} alt={item.altText} className="content-image" />} {/* homepng を content-image に変更 */}
            {item.heading && <h3 className="content-heading" style={{ whiteSpace: 'pre-wrap' }}>{item.heading}</h3>} {/* boldスタイルをCSSで管理 */}
            {item.text && <p className="content-text mini-text">{item.text}</p>}
            <div className="button-group"> {/* ボタンをまとめるdivを追加 */}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="content-button-link">
                  <button className="tobubutton">{item.urlText}</button>
                </a>
              )}
              {item.url2 && (
                <a href={item.url2} target="_blank" rel="noopener noreferrer" className="content-button-link">
                  <button className="tobubutton">{item.urlText2}</button>
                </a>
              )}
              {item.url3 && (
                <a href={item.url3} target="_blank" rel="noopener noreferrer" className="content-button-link">
                  <button className="tobubutton">{item.urlText3}</button>
                </a>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* 下部のクイックナビゲーションは冗長なため削除しました。必要であれば再追加してください。 */}
      <nav className="navigation">
        <ul className="navigation-list">
          {t('home.nav', { returnObjects: true }).map((item, index) => (
            <li className="navigation-item" key={index}>
              <a href={`#${['komawanpoint1', 'komawanpoint2', 'komawanpoint4', 'komawanpoint4', 'osusume'][index]}`}>
                <span>{item.line1}</span><br /><span>{item.line2}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Footer />
    </div>
  );
};

export default HomePage;
