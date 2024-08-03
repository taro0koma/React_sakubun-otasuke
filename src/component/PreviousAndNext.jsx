import React from 'react';

const PreviousAndNext = ({ midashi,honbun,buttontext,buttonurl }) => {
  return (
    <div className='down'>
      <h4 style={{fontWeight:"bold"}}>{midashi}</h4>
      <p>{honbun}</p>
      <a href={buttonurl}><button>{buttontext}</button></a>
      <br />
    </div>
  );
};

export default PreviousAndNext;