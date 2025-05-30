import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './status.css';

const StatusInterface = () => {
  const [queue, setQueue] = useState([]);

  const apiBase = import.meta.env.VITE_API_BASE

  const fetchQueue = async () => {
    
    try {
      const response = await axios.get(`${apiBase}/api/admin/status`);
      setQueue(Array.isArray(response.data.data) ? response.data.data : []);

    } catch (error) {
      console.error('Ошибка загрузки очереди:', error);
      setQueue([]); // Очистка очереди в случае ошибки
    } 
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000); // Обновление каждую минуту
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="queue-screen">
      <div className="queue-list">
        {queue.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>ФАМИЛИЯ / SURNAME</th>
                <th>КАБИНЕТ / CABINET</th>
                <th>ВРЕМЯ / TIME</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => (
                <tr key={item.id}>
                  <td className="queue-number">{item.queueNumber}</td>
                  <td className="user-name">{item.surname}</td>
                  <td className="cabinet-number">{item.cabinet}</td>
                  <td className="arrival-time">{item.startTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-message">Очередь пуста</p>
        )}
      </div>
    </div>
  );
};

export default StatusInterface;