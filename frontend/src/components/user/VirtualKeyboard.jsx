import React, { useState } from 'react';

const en = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m'],
];

const ru = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['й','ц','у','к','е','н','г','ш','щ','з'],
  ['ф','ы','в','а','п','р','о','л','д','ж'],
  ['я','ч','с','м','и','т','ь','б','ю'],
];

const VirtualKeyboard = ({ value, onChange, onEnter }) => {
  const [lang, setLang] = useState('en');
  const [capsLock, setCapsLock] = useState(false);
  const layout = lang === 'en' ? en : ru;

  const handleKey = (key) => {
    const char = capsLock ? key.toUpperCase() : key;
    onChange(value + char);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const toggleCapsLock = () => setCapsLock(!capsLock);

  return (
    <div className="virtualKeyboardContainer">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboardRow">
          {row.map((key, i) => (
            <button
              key={i}
              className="keyboardKey"
              onClick={() => handleKey(key)}
              aria-label={`Key ${capsLock ? key.toUpperCase() : key}`}
            >
              {capsLock ? key.toUpperCase() : key}
            </button>
          ))}
        </div>
      ))}

      <div className="keyboardRow specialKeysRow">
        <button
          className={`keyboardKey capsLockKey ${capsLock ? 'active' : ''}`}
          onClick={toggleCapsLock}
          aria-pressed={capsLock}
          aria-label="Caps Lock"
        >
          Caps
        </button>

        <button
          className="keyboardKey langKey"
          onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
          aria-label="Toggle Language"
        >
          {lang.toUpperCase()}
        </button>

        <button
          className="keyboardKey enterKey"
          onClick={onEnter}
          aria-label="Enter"
        >
          {lang === 'ru' ? 'Ввод' : 'Enter'}

        </button>

        <button
          className="keyboardKey backspaceKey"
          onClick={handleBackspace}
          aria-label="Backspace"
        >
          ←
        </button>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
