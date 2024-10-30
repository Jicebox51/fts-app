import React from 'react';
import styles from '/src/styles/App.module.css';

const WaterLevel = ({ waterLevel }) => (
  <>
    <div className={`${styles.sensorContainer}`}>
      <div className={`${styles.sensorColumn}`}>
        <div className={`${styles.sensorTitle}`}>
          <h3>Water: </h3>
        </div>
        <div className={`${styles['temperature-display']} ${styles['green-color']}`}>
          <span className={`${styles['segmented-digit']}`}>{waterLevel.level}</span>
        </div>
      </div>
    </div>
  </>
);

export default WaterLevel;
