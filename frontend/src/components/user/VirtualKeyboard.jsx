import React, { useState } from 'react';

const layouts = {
  en: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m'],
    ['Space','Backspace','Lang']
  ],
  ru: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['й','ц','у','к','е','н','г','ш','щ','з'],
    ['ф','ы','в','а','п','р','о','л','д'],
    ['я','ч','с','м','и','т','ь'],
    ['Space','Backspace','Lang']
  ]
};

export default function VirtualKeyboard({ onInput }) {
  const [lang, setLang] = useState('en');

  const handleKeyPress = (key) => {
    if (key === 'Lang') {
      setLang(prev => (prev === 'en' ? 'ru' : 'en'));
    } else if (key === 'Backspace') {
      onInput(prev => prev.slice(0, -1));
    } else if (key === 'Space') {
      onInput(prev => prev + ' ');
    } else {
      onInput(prev => prev + key);
    }
  };

  return (
    <div className="mt-2 p-3 border rounded-xl bg-gray-100 w-full max-w-md mx-auto shadow">
      {layouts[lang].map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="mx-1 px-3 py-2 text-sm rounded bg-white shadow hover:bg-gray-200"
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
