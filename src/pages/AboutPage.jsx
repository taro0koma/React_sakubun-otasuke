import React from 'react';
import Tabs from '../component/Tabs'
import { useParams } from 'react-router-dom';
const AboutPage = () => {
  let {id,name} = useParams();
  return (
    <div>
      <Tabs/>
      <h1>About</h1>
      <p>Id: {id}</p>
      <p>name: {name}</p>
    </div>
  );
};

export default AboutPage;