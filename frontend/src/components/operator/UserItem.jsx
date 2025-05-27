import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const UserItem = ({ user, serviceId, onUserDone }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDone = async () => {
    try {
      await onUserDone(serviceId, user.id); // Отправляем запрос на сервер
    } catch (err) {
      console.error('Ошибка при отметке пользователя:', err);
    } finally {
      setIsModalOpen(false); // Закрываем модальное окно
    }
  };

  return (
    <li className="userItem">
      <p>Номер в очереди: {user.queueNumber}</p>
      <p>ФИО: {user.fullName}</p>
      <p>Номер паспорта: {user.passportNumber}</p>
      <p>Время обращения: {user.startTime}</p>
      {user.status == 'done'? <p className='statusInfo'> Обслужен</p> : <button className="doneButton" onClick={() => setIsModalOpen(true)}>
          Обслужить
        </button>}
        

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleDone}
        onCancel={() => setIsModalOpen(false)}
        text="Завершить запись?"
      />
    </li>
  );
};

export default UserItem;