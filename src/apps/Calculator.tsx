import { useState } from 'react';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleInput = (value: string) => {
    if (value === 'C') {
      setDisplay('0');
      setEquation('');
    } else if (value === '=') {
      try {
        const calculate = (expr: string) => {
          return new Function(`return ${expr}`)();
        };
        const result = calculate(equation + display);
        setDisplay(String(result));
        setEquation('');
      } catch {
        setDisplay('Error');
      }
    } else if (['+', '-', '*', '/'].includes(value)) {
      setEquation(display + ' ' + value + ' ');
      setDisplay('0');
    } else {
      setDisplay(display === '0' ? value : display + value);
    }
  };

  const buttons = [
    ['C', '(', ')', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=', '']
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 font-sans select-none">
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex-none text-right">
        <div className="text-gray-500 h-6 text-sm mb-1">{equation}</div>
        <div className="text-4xl font-light text-gray-800 truncate">{display}</div>
      </div>
      
      <div className="flex-1 grid grid-rows-5 gap-2">
        {buttons.map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            {row.map((btn, j) => {
              if (!btn) return <div key={j} />;
              
              const isOperator = ['/', '*', '-', '+', '='].includes(btn);
              const isClear = btn === 'C';
              
              return (
                <button
                  key={j}
                  onClick={() => handleInput(btn)}
                  className={`
                    rounded-lg text-xl font-medium transition-colors
                    ${isOperator ? 'bg-blue-500 text-white hover:bg-blue-600' : 
                      isClear ? 'bg-red-100 text-red-600 hover:bg-red-200' : 
                      'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}
                  `}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
