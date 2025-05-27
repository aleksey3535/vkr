import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import UserList from './UserList';
import Cookies from "js-cookie"
import "./operator.css"


const OperatorInterface = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]); // Данные о пользователях

  const apiBase = import.meta.env.VITE_API_BASE

  const handleLogin = async (login, password) => {
    try {
      // Авторизация
      const authResponse = await axios.post(
        `${apiBase}/api/admin/login`,
        {
          login,
          password,
        }
      );

      if (authResponse.status === 200) {
        setIsAuthenticated(true); // Успешная авторизация
        Cookies.set("token", authResponse.data.token, { expires: 1})

        // Получаем данные о пользователях
        await fetchUsers(service);
      } else {
        throw new Error('Ошибка авторизации');
      }
    } catch (err) {
      throw new Error('Повторите попытку');
    }
  };
  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      setIsAuthenticated(true)
    }
  })

  const fetchUsers = async (service) => {
    try {
      const usersResponse = await axios.get(
        `${apiBase}/api/admin/${service}/status`,
      );
      setUsers(usersResponse.data.data); // Сохраняем данные о пользователях
    } catch (err) {
      setUsers([])
    }
  };

  const handleUserDone = async (serviceId, userId) => {
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
    <div>
      {isAuthenticated  ? (
        <>
          <UserList
            users={users}
            onUserDone={handleUserDone}
            handleUser={fetchUsers}
            handleClick={handleClick}
          />
          
          
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default OperatorInterface;