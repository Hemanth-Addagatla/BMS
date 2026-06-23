import React from 'react';

const Title = ({text1,text2}) => {
  return (
    <h1 className='font-bold'>
        {text1} <span className='underline text-rose-500'>{text2}</span>
    </h1>
  );
}

export default Title;
