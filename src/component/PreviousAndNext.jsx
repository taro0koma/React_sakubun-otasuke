import React from 'react';

const PreviousAndNext = ({ Previous,urlP,Next,urlN }) => {
  return (
    <div className='down'>
      <a href={urlP}><button className='previous'>←{Previous}</button></a>
      <a href={urlN} ><button className='next'>{Next}→</button></a>
    </div>
  );
};

export default PreviousAndNext;