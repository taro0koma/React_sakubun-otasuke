import React from 'react';
import Tabs from '../component/Tabs'
const AboutPage = () => {
  return (
    <div>
      <Tabs/>
      <h1>イメージマップの<br/>作り方の動画</h1>
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