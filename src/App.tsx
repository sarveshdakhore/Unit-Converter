import React, { useState, useEffect } from 'react';
import { Moon, Sun, Ruler, Thermometer, Square, Weight } from 'lucide-react';
import './App.css';

// Conversion types and their units
const conversionTypes = {
  length: {
    name: 'Length',
    icon: <Ruler className="w-5 h-5" />,
    color: 'bg-gradient-to-r from-green-400 to-blue-500',
    units: [
      { id: 'meter', name: 'Meter (m)', factor: 1 },
      { id: 'km', name: 'Kilometer (km)', factor: 0.001 },
      { id: 'cm', name: 'Centimeter (cm)', factor: 100 },
      { id: 'mm', name: 'Millimeter (mm)', factor: 1000 },
      { id: 'mile', name: 'Mile (mi)', factor: 0.000621371 },
      { id: 'yard', name: 'Yard (yd)', factor: 1.09361 },
      { id: 'foot', name: 'Foot (ft)', factor: 3.28084 },
      { id: 'inch', name: 'Inch (in)', factor: 39.3701 }
    ]
  },
  temperature: {
    name: 'Temperature',
    icon: <Thermometer className="w-5 h-5" />,
    color: 'bg-gradient-to-r from-red-400 to-yellow-500',
    units: [
      { id: 'celsius', name: 'Celsius (°C)', factor: 1 },
      { id: 'fahrenheit', name: 'Fahrenheit (°F)', factor: 1 },
      { id: 'kelvin', name: 'Kelvin (K)', factor: 1 }
    ]
  },
  area: {
    name: 'Area',
    icon: <Square className="w-5 h-5" />,
    color: 'bg-gradient-to-r from-purple-400 to-pink-500',
    units: [
      { id: 'sqmeter', name: 'Square Meter (m²)', factor: 1 },
      { id: 'sqkm', name: 'Square Kilometer (km²)', factor: 0.000001 },
      { id: 'sqft', name: 'Square Foot (ft²)', factor: 10.7639 },
      { id: 'acre', name: 'Acre', factor: 0.000247105 },
      { id: 'hectare', name: 'Hectare', factor: 0.0001 },
      { id: 'cent', name: 'Cent', factor: 0.01 }
    ]
  },
  weight: {
    name: 'Weight',
    icon: <Weight className="w-5 h-5" />,
    color: 'bg-gradient-to-r from-blue-400 to-indigo-500',
    units: [
      { id: 'kg', name: 'Kilogram (kg)', factor: 1 },
      { id: 'g', name: 'Gram (g)', factor: 1000 },
      { id: 'mg', name: 'Milligram (mg)', factor: 1000000 },
      { id: 'pound', name: 'Pound (lb)', factor: 2.20462 },
      { id: 'ounce', name: 'Ounce (oz)', factor: 35.274 },
      { id: 'ton', name: 'Metric Ton (t)', factor: 0.001 }
    ]
  }
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeType, setActiveType] = useState('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState(conversionTypes.length.units[0].id);
  const [toUnit, setToUnit] = useState(conversionTypes.length.units[1].id);
  const [result, setResult] = useState('');

  // Set dark mode based on user preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // Update document body class when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Reset units when conversion type changes
  useEffect(() => {
    setFromUnit(conversionTypes[activeType].units[0].id);
    setToUnit(conversionTypes[activeType].units[1].id);
    convert();
  }, [activeType]);

  // Convert values
  const convert = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setResult('Please enter a valid number');
      return;
    }

    const value = parseFloat(inputValue);
    const type = conversionTypes[activeType];
    const from = type.units.find(u => u.id === fromUnit);
    const to = type.units.find(u => u.id === toUnit);

    if (!from || !to) return;

    let resultValue;

    // Special case for temperature
    if (activeType === 'temperature') {
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        resultValue = (value * 9/5) + 32;
      } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
        resultValue = value + 273.15;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        resultValue = (value - 32) * 5/9;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
        resultValue = (value - 32) * 5/9 + 273.15;
      } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
        resultValue = value - 273.15;
      } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
        resultValue = (value - 273.15) * 9/5 + 32;
      } else {
        resultValue = value; // Same unit
      }
    } else {
      // For other conversion types
      const baseValue = value / from.factor;
      resultValue = baseValue * to.factor;
    }

    // Format the result
    setResult(resultValue.toLocaleString('en-US', {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0
    }));
  };

  // Convert when inputs change
  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">
            Unit Conversion
          </h1>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className={`md:col-span-1 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <h2 className="text-xl font-semibold mb-4">Conversion Type</h2>
            <nav className="space-y-2">
              {Object.entries(conversionTypes).map(([type, data]) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    activeType === type 
                      ? `${data.color} text-white` 
                      : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{data.icon}</span>
                  {data.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className={`md:col-span-3 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <div className="mb-6">
              <h2 className={`text-2xl font-semibold mb-4 ${conversionTypes[activeType].color} bg-clip-text text-transparent`}>
                {conversionTypes[activeType].name} Conversion
              </h2>
              
              {/* Input Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">From</label>
                  <div className="flex">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className={`w-full p-3 rounded-l-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                    <select
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className={`p-3 rounded-r-lg border-l-0 border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      {conversionTypes[activeType].units.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium">To</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={result}
                      readOnly
                      className={`w-full p-3 rounded-l-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                    <select
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className={`p-3 rounded-r-lg border-l-0 border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      {conversionTypes[activeType].units.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Formula Display */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className="text-sm font-medium mb-2">Conversion Formula:</h3>
                <p className="font-mono text-sm">
                  {activeType === 'temperature' ? (
                    fromUnit === 'celsius' && toUnit === 'fahrenheit' ? '(°C × 9/5) + 32 = °F' :
                    fromUnit === 'celsius' && toUnit === 'kelvin' ? '°C + 273.15 = K' :
                    fromUnit === 'fahrenheit' && toUnit === 'celsius' ? '(°F - 32) × 5/9 = °C' :
                    fromUnit === 'fahrenheit' && toUnit === 'kelvin' ? '(°F - 32) × 5/9 + 273.15 = K' :
                    fromUnit === 'kelvin' && toUnit === 'celsius' ? 'K - 273.15 = °C' :
                    fromUnit === 'kelvin' && toUnit === 'fahrenheit' ? '(K - 273.15) × 9/5 + 32 = °F' :
                    'No conversion needed'
                  ) : (
                    `1 ${conversionTypes[activeType].units.find(u => u.id === fromUnit)?.name.split(' ')[0]} = 
                    ${(conversionTypes[activeType].units.find(u => u.id === toUnit)?.factor / 
                      conversionTypes[activeType].units.find(u => u.id === fromUnit)?.factor).toLocaleString('en-US', {
                        maximumFractionDigits: 6
                      })} ${conversionTypes[activeType].units.find(u => u.id === toUnit)?.name.split(' ')[0]}`
                  )}
                </p>
              </div>
            </div>
            
            {/* Unit Information */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Available Units</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {conversionTypes[activeType].units.map(unit => (
                  <div 
                    key={unit.id} 
                    className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <span className="font-medium">{unit.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;