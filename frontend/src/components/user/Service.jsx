import React from 'react';
import { translations } from './translation/translations';

const Service = ({ onServiceClick, language }) => {
  return (
    <div className="headerContainer">
      
      <div className="buttonContainer">
        <button
          className={'button'}
          onClick={() => onServiceClick(1)}
        >
          
          {translations[language].service1}
        </button>
        <button
          className={`button`}
          onClick={() => onServiceClick(2)}
        >
          {translations[language].service2}
        </button>
        <button
          className={`button`}
          onClick={() => onServiceClick(3)}
        >
          {translations[language].service3}
        </button>
      </div>
    </div>
  );
};

export default Service;