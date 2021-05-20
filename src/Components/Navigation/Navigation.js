import React from 'react';

const Navigation = ({ onRouteChange }) => {
  return (
    <nav className='flex justify-end'>
      <p
        className='b br2 ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib ma3'
        onClick={() => onRouteChange('signin')}
      >
        Sign Out
      </p>
    </nav>
  );
};

export default Navigation;
