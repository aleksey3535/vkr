import React from 'react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel,  text, subtext }) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h3> {text} </h3>
        <p> {subtext} </p>
        <div className="modalButtons">
          <button className="confirmButton" onClick={onConfirm}>
            Да
          </button>
          <button className="cancelButton" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;