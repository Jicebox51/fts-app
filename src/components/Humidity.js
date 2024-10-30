import React from 'react';
import styles from '/src/styles/App.module.css';

const Humidity = ({ humidity, calculateTimeDifference }) => (
  <>
    <div className={`${styles.sensorTitle}`}>
      <h2>Humidity: <span style={{ color: '#ffffff', fontSize: '0.6em' }}>({calculateTimeDifference(humidity.date)})</span></h2>
    </div>
    <div className={`${styles.sensorContainer}`}>
      <div className={`${styles.sensorColumn}`}>
        <div className={`${styles['temperature-display']} ${styles['green-color']}`}>
          <span className={`${styles['segmented-digit']}`}>{humidity.humidity}%</span>
        </div>
      </div>
    </div>
  </>
);

export default Humidity;