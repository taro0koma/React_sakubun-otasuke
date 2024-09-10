import React from 'react';
import './NextPageLink.css';

const NextPageLink = ({image1,text1,image2,text2,image3,text3}) => {
  return (
    <div>
      <section className="container">
      <div className="row">
        <div className="column column-25">
          <a href="/page1" className="box-link">
            <div className="box">
              <img src={image1} alt="Page 1" className="box-image" />
              <p>{text1}</p>
            </div>
          </a>
        </div>
        <div className="colum column-25n">
          <a href="/page2" className="box-link">
            <div className="box">
              <img src={image2} alt="Page 2" className="box-image" />
              <p>{text2}</p>
            </div>
          </a>
        </div>
        <div className="column column-25">
          <a href="/page3" className="box-link">
            <div className="box">
              <img src={image3} alt="Page 3" className="box-image" />
              <p>{text3}</p>
            </div>
          </a>
        </div>
      </div>
    </section>
    </div>
  );
};

export default NextPageLink;