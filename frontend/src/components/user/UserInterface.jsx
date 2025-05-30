import React, {  useState } from 'react';
import axios from 'axios';
import Service from './Service';
import Slots from "./Slots"
import logo from '../../assets/kai.png'
import "./user.css"
import flagRU from '../../assets/flag_ru.png'
import flagEN from '../../assets/flag_uk.png'
import { translations } from './translation/translations';
import BookingForm from './BookingForm';

const UserInterface = () => {
  const [step, setStep] = useState('service')
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [language, setLanguage] = useState('ru')

  const apiBase = import.meta.env.VITE_API_BASE

  const handleServiceClick = async (serviceId) => {
    setSelectedSlot(null); // Сбрасываем выбранный слот
    setSlots([]); // Очищаем список слотов
    setActiveService(serviceId); // Устанавливаем активную услугу
    setLoading(true);
    setError(null);
    setStep('slot')
    try {
  
      const response = await axios.get(`${apiBase}/api/user/${serviceId}/status`);
      setSlots(response.data.Data);
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleBackClick = () => {
    if (step === 'slot') {
      setStep('service')
    } else if (step === 'form') {
      setStep('slot')
    }
  }

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setStep('form')
  };

  const handleClose = () => {
    setSelectedSlot(null); // Сбрасываем выбранный слот
    setActiveService(null);
    setSlots([]);
    setStep('service')
  };

  return (
    <div className='userInterface'>
      <div className="container">
        <button className='languageButton' onClick={() => setLanguage('ru')}> <img className="country-image" src={flagRU}/></button>
        <button className='languageButton' onClick={() => setLanguage('en')}> <img className='country-image' src={flagEN}/></button>
        <h1 className="headerTitle">{translations[language].title}</h1>
        {step === 'service' && <Service onServiceClick={handleServiceClick} language={language}/>}
        {step === 'slot' && <Slots
          service={activeService}
          slots={slots}
          loading={loading}
          error={error}
          onSlotClick={handleSlotClick}
          onBackClick={handleBackClick}
          language={language}
        /> }
        {step === 'form' && <BookingForm
            service={activeService}
            slot={selectedSlot}
            serviceId={activeService}
            onClose={handleClose}
            onBackClick={handleBackClick}
            language={language}
          />}

        <img className="logo" src={logo}  />
      </div>
    </div>
  );
};

export default UserInterface;