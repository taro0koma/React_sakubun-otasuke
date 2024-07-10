import React from 'react';
import Hero from '../component/Hero';
import Tabs from '../component/Tabs';
const HomePage = () => {
  return (
    <div>
      <Tabs/>
      <h1>Home</h1>
      <Hero/>
    </div>
  );
};

export default HomePage;