import React from "react";
import "./NextPageLink.css";
import { t } from "i18next";
import { step } from "three/tsl";

const NextPageLink = ({ imairu }) => {
  const style = `
  .${imairu}{
    display:none !important;
  }
`;
  const imageList = [
    "/images/imagemapsenden2.png",
    "/images/danrakusenden.png",
    "/images/iikaesenden2.png",
    "/images/iikaesenden.png",
    "/images/iikaeniodoroki2.png",
    "/images/link_omikuji.png",
    "/images/benrituru.png",
    "/images/sakubunkotsu.png"
  ];
  const linkList = [
    "/map",
    "/danraku",
    "/kimoti",
    "/hyougen",
    "/zinbutsu",
    "/omikuji",
    "/osusume",
    "/"
  ];
  const classnameList = [
    "imagemap1",
    "danraku1",
    "kimochi1",
    "hyougen1",
    "zinbutu1",
    "kakidashi1",
    "benri1",
    "home"
  ];

  return (
    <div>
      <style>{style}</style>
      <section className="container" style={{ marginTop: 40 }}>
        <h4>
          <b>{t("thumbnail.title")}</b>
        </h4>
        <div className="row">
          {t("thumbnail.list", { returnObjects: true }).map((step, index) => (
            <div className={`column column-25 ${classnameList[index]}`} key={index}>
              <a href={linkList[index]} className="box-link">
                <div className="box">
                  <img
                    src={imageList[index]}
                    alt={`Page ${index + 1}`}
                    className="box-image"
                  />
                  <p className="contentsmei">{step["title"]}</p>
                  <p className="contentssetumei">{step["text"]}!</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NextPageLink;
