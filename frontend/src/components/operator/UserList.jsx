import React, { useEffect, useState } from 'react';
import UserItem from './UserItem';
import ConfirmationModal from './ConfirmationModal';
import logo from "../../assets/kai.png"

const UserList = ({ users, onUserDone, handleUser, handleClick }) => {
  const [serviceId, setServiceId] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRestartButton = () => {
    handleClick(serviceId)
    setIsModalOpen(false)
    
  }

 
  return (
    <div className="operatorDashboard">
      <form className='header'> 
        <label>
            Услуга:
            <select value={serviceId} onChange={(e) => setServiceId(Number(e.target.value))}>
              <option value={1}>Продление визы</option>
              <option value={2}>Продление миграционного учета</option>
              <option value={3}>Подача документов на приглашение</option>
            </select>
          </label>
        <button className='updateButton' onClick={() => handleUser(serviceId)} type='button'> Обновить</button>
        <button className='restartButton' onClick={() => setIsModalOpen(true)} type='button'> Очистить</button>
      </form>
        

      <ul className="userList">
        {!users.length && <h2>Список пуст</h2>}
        {users.map((user) => (
          <UserItem
            key={user.id}
            user={user}
            serviceId={serviceId}
            onUserDone={onUserDone}
          />
        ))}
      </ul>
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleRestartButton}
        onCancel={() => setIsModalOpen(false)}
        text="Вы уверены?"
        subtext="Это приведет к потере текущих записей."
      />
      <img className='logo'  src={logo}  />
    </div>
  );
};

export default UserList;