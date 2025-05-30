import React, { useState } from 'react';
import axios from 'axios';
import { translations } from './translation/translations';
import { BsArrowLeft } from "react-icons/bs";
import VirtualKeyboard from './VirtualKeyboard';

const BookingForm = ({ slot, service, onClose, language, onBackClick }) => {
  const [fullName, setFullName] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [bookingResult, setBookingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const apiBase = import.meta.env.VITE_API_BASE;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${apiBase}/api/user/register/${slot.id}`,
        { fullName, passportNumber }
      );
      setBookingResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const openKeyboard = (field, currentValue) => {
    setActiveInput(field);
    setTempValue(currentValue);
    setShowKeyboard(true);
  };

  const handleKeyboardSubmit = () => {
    if (activeInput === 'fullName') setFullName(tempValue);
    if (activeInput === 'passportNumber') setPassportNumber(tempValue);
    setShowKeyboard(false);
    setActiveInput(null);
  };

  return (
    <div className="bookingFormContainer">
      {bookingResult ? (
        <div className="bookingResult">
          <h3>{translations[language].success}</h3>
          <h3>{translations[language].queueNumber}: {bookingResult.queueNumber}</h3>
          <p>{translations[language].fullName}: {bookingResult.fullName}</p>
          <p>{translations[language].passportNumber}: {bookingResult.passportNumber}</p>
          <p>{translations[language].time}: {bookingResult.startTime}</p>
          <p>{translations[language].cabinet}: {bookingResult.cabinet}</p>
          <button onClick={onClose}>{translations[language].close}</button>
        </div>
      ) : (
        <>
          <button onClick={onBackClick} className='backButton'>
            <BsArrowLeft className='backButtonIcon' />
          </button>
          <form className="bookingForm" onSubmit={handleSubmit}>
            {service === 1 && <h4>{translations[language].selectedService}: {translations[language].service1}</h4>}
            {service === 2 && <h4>{translations[language].selectedService}: {translations[language].service2}</h4>}
            {service === 3 && <h4>{translations[language].selectedService}: {translations[language].service3}</h4>}
            <p>{translations[language].selectedTime}: {slot.startTime}</p>

            <label>
              {translations[language].fullName}:
              <input
                type="text"
                value={fullName}
                readOnly
                onClick={() => openKeyboard('fullName', fullName)}
                required
              />
            </label>

            <label>
              {translations[language].passportNumber}
              <input
                type="text"
                value={passportNumber}
                readOnly
                onClick={() => openKeyboard('passportNumber', passportNumber)}
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? translations[language].sending : translations[language].make}
            </button>
            {error && <p className="error">{error}</p>}
          </form>

          {showKeyboard && (
            <div className="modal-overlay" onClick={() => setShowKeyboard(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={tempValue}
                  readOnly
                  className="keyboard-input"
                />
                <VirtualKeyboard
                  value={tempValue}
                  onChange={setTempValue}
                  onEnter={handleKeyboardSubmit}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingForm;
