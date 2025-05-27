import React from 'react';
import SlotButton from './SlotButton';
import { translations } from './translation/translations';
import { BsArrowLeft, BsTypeH1 } from "react-icons/bs";

const Slots = ({
  service,
  slots,
  loading,
  error,
  onSlotClick,
  onBackClick,
  language
}) => {
  if (loading) return <p className="loading">{translations[language].loading} </p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <button onClick={onBackClick} className='backButton'> <BsArrowLeft className='backButtonIcon' /></button>
      {service === 1 && <h4>{translations[language].selectedService}: {translations[language].service1}</h4>}
      {service === 2 && <h4>{translations[language].selectedService}: {translations[language].service2}</h4>}
      {service === 3 && <h4>{translations[language].selectedService}: {translations[language].service3}</h4>}
      <p> {translations[language].selectTime}:</p>
      <div className="slotList">
        
          {slots.map((slot) => (
            <SlotButton key={slot.id} slot={slot} onSlotClick={onSlotClick} />
          ))}
    </div>
    </div>
  );
};

export default Slots;