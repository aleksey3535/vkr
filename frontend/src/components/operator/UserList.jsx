import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserItem from './UserItem';
import ConfirmationModal from './ConfirmationModal';
import logo from "../../assets/kai.png"

const UserList = ( ) => {
  const [serviceId, setServiceId] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [users, setUsers] = useState([]);
  const apiBase = import.meta.env.VITE_API_BASE

  const handleRestartButton = () => {
    handleClick(serviceId)
    setIsModalOpen(false)
    
  }
  const fetchUsers = async () => {
    try {
      const usersResponse = await axios.get(
        `${apiBase}/api/admin/${serviceId}/status`,
      );

      setUsers(Array.isArray(usersResponse.data.data) ? usersResponse.data.data : [])
    } catch (err) {
      console.error('Ошибка при загрузке пользователей:', err);
    }
  };
  useEffect(() => {
    fetchUsers()
    const interval = setInterval(fetchUsers, 10000); // Обновление каждую минуту
    return () => clearInterval(interval);
  }, [serviceId]);


   const onUserDone = async (serviceId, userId) => {
    try {
      // Отправляем запрос на сервер для отметки пользователя как "обслуженного"
      await axios.get(
        `${apiBase}/api/admin/${serviceId}/done/${userId}`
      );

      // Обновляем список пользователей
      await fetchUsers(serviceId);
    } catch (err) {
      console.error('Ошибка при отметке пользователя:', err);
    }
  };
  
  const handleClick = async (serviceId) => {
    try {
      await axios.get(
        `${apiBase}/api/admin/restart`
      )
      await fetchUsers(serviceId)
    }
    catch (err) {
      console.error("Ошибка обновления" + err)
    } 
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