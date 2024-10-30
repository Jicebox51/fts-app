import React from 'react';
import styles from '/src/styles/App.module.css';

const convertFahrenheitToCelsius = (fahrenheit) => {
  return ((fahrenheit - 32) * 5) / 9;
};

const AirTemp = ({ airTemp, calculateTimeDifference }) => {
  const temperature = airTemp.Temperature;
  const temperatureCelsius = convertFahrenheitToCelsius(temperature).toFixed(2);
  return (
    <div>
      <div className={`${styles.sensorTitle}`}>
        <h2>Air Temp.: <span style={{ color: '#ffffff', fontSize: '0.6em' }}>({calculateTimeDifference(airTemp.Date)})</span></h2>
      </div>
      <div>
        <div className={`${styles['temperature-display']} ${styles['green-color']}`}>
          {temperature.toString().split('').map((digit, index) => (
            <span key={index} className={`${styles['segmented-digit']}`}>{digit}</span>
          ))}
          <span className={`${styles['segmented-digit']}`}>°F</span>
        </div>
        <div className={`${styles['temperature-display']} ${styles['green-color']}`}>
          {temperatureCelsius.toString().split('').map((digit, index) => (
            <span key={index} className={`${styles['segmented-digit']}`}>{digit}</span>
          ))}
          <span className={`${styles['segmented-digit']}`}>°C</span>
        </div>
      </div>
    </div>
  );
};

export default AirTemp;
