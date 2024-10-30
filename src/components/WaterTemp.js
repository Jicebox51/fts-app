import React from 'react';
import styles from '/src/styles/App.module.css';
import TemperatureDisplay from './TemperatureDisplay';

const WaterTemp = ({ waterTemp, getTemperatureColorClass, calculateTimeDifferenceT }) => {
  return (
    <div>
      <div className={`${styles.sensorTitle}`}>
        <h2>Water Temp.: <span style={{ color: '#ffffff', fontSize: '0.6em' }}>({calculateTimeDifferenceT(waterTemp.timestamp)})</span></h2>
      </div>
      <TemperatureDisplay
        temperature={waterTemp.temperature}
        getTemperatureColorClass={getTemperatureColorClass}
      />
    </div>
  );
};

export default WaterTemp;
