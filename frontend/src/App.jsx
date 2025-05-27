import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserInterface from './components/user/UserInterface';
import OperatorInterface from './components/operator/OperatorInterface';
import StatusInterface from './components/status/StatusInterface';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserInterface />} /> {/* Основной интерфейс */}
        <Route path="/operator" element={<OperatorInterface />} /> {/* Интерфейс оператора */}
        <Route path="/status" element={<StatusInterface />} /> { /* Интерфейс статуса очереди*/ }
      </Routes>
    </Router>
  );
};

export default App;