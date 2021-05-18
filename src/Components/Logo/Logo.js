import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
  return (
    <div className='ma4 mt0'>
      <Tilt
        className='Tilt br2 shadow-2 flex justify-center items-center'
        options={{ max: 45 }}
        style={{ height: 200, width: 200 }}
      >
        <div className='Tilt-inner pa3'>
          <img src={brain} alt='' />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
