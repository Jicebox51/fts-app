import React from 'react';
import styles from '/src/styles/App.module.css';

const convertFahrenheitToCelsius = (fahrenheit) => {
  return ((fahrenheit - 32) * 5) / 9;
};

const TemperatureDisplay = ({ temperature, getTemperatureColorClass }) => {
  const temperatureCelsius = convertFahrenheitToCelsius(temperature).toFixed(2);

  return (
    <div>
      <div className={`${styles['temperature-display']} ${getTemperatureColorClass(temperature)}`}>
        {temperature.toString().split('').map((digit, index) => (
          <span key={index} className={`${styles['segmented-digit']}`}>{digit}</span>
        ))}
        <span className={`${styles['segmented-digit']}`}>°F</span>
      </div>
      <div className={`${styles['temperature-display']} ${getTemperatureColorClass(temperature)}`}>
        {temperatureCelsius.toString().split('').map((digit, index) => (
          <span key={index} className={`${styles['segmented-digit']}`}>{digit}</span>
        ))}
        <span className={`${styles['segmented-digit']}`}>°C</span>
      </div>
    </div>
  );
};

export default TemperatureDisplay;