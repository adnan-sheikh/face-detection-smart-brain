import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boundingBoxes }) => {
  return (
    <div className='flex justify-center'>
      <div className='mt4 image-container'>
        <img id='inputImage' src={imageUrl} alt='' width='500px' />
        {boundingBoxes.map((boundingBox, index) => {
          return (
            <div
              className='bounding-box'
              key={index + 1}
              style={{
                top: boundingBox.topRow,
                right: boundingBox.rightCol,
                bottom: boundingBox.bottomRow,
                left: boundingBox.leftCol,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
