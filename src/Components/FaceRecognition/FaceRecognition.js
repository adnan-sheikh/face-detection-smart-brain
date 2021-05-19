import React from 'react';

const FaceRecognition = ({ imageUrl }) => {
  return (
    <div className='flex justify-center'>
      <div className='mt4'>
        <img src={imageUrl} alt='' width='500px' />
      </div>
    </div>
  );
};

export default FaceRecognition;
