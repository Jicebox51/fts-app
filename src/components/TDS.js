import React from 'react';
import styles from '/src/styles/App.module.css';

const TDS = ({ tds, calculateTimeDifference }) => (
  <>
    <div className={`${styles.sensorTitle}`}>
      <h2>TDS: <span style={{ color: '#ffffff', fontSize: '0.6em' }}>({calculateTimeDifference(tds.date)})</span></h2>
    </div>
    <div className={`${styles.sensorContainer}`}>
      <div className={`${styles.sensorColumn}`}>
        <div className={`${styles['temperature-display']} ${styles['green-color']}`}>
          <span className={`${styles['segmented-digit']}`}>{tds.tds}_PPM</span>
        </div>
      </div>
    </div>
  </>
);

export default TDS;
