import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({
  imageUrl,
  boundingBoxes,
  isThereAnyFace,
  numberOfFaces,
  isImageFetched,
}) => {
  return (
    <>
      {isImageFetched ? (
        <div className='flex justify-center'>
          <div className='mt4 image-container flex justify-center mb4'>
            <img id='inputImage' src={imageUrl} alt='' width='500px' />
            {isThereAnyFace && numberOfFaces >= 1 ? (
              <>
                <>
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
                </>
              </>
            ) : (
              <div className='ph4 f2 w-30'>
                There are no faces in this image. <br />
                Try for some images including faces!
              </div>
            )}
          </div>
          <div className='f2 mt4 w-20 self-center'>
            {numberOfFaces === 1
              ? `I can identify ${numberOfFaces} face in this image.`
              : `I can identify ${numberOfFaces} faces in this image.`}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default FaceRecognition;
