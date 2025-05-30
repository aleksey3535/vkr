import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import UserList from './UserList';
import Cookies from "js-cookie"
import "./operator.css"


const OperatorInterface = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

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


  return (
    <div>
      {isAuthenticated  ? (
        <>
          <UserList
         
          />
          
          
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default OperatorInterface;