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
  return (
    <div>
      <style>{style}</style>
      <section className="container" style={{ marginTop: 40 }}>
        <h4>
          <b>{t("thumbnail.title")}</b>
        </h4>
        <div className="row">
          {t("thumbnail.list", { returnObjects: true }).map((step, index) => (
            <div className="column column-25 imagemap1" key={index}>
              <a href="/map" className="box-link">
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
