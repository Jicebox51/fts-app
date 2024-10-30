import React from 'react';
import styles from '/src/styles/App.module.css';

const LastFeed = ({ lastFeed }) => (
  <>
    <div className={`${styles.sensorTitle}`}>
      <h2>!feedfish</h2>
    </div>
    <div className={`${styles.sensorContainer}`}>
      <div className={`${styles.sensorColumn}`}>
        <div className={`${styles['temperature-display']} ${styles['green-color']}`}>
          <span className={`${styles['segmented-digit']}`}>{lastFeed}</span>
        </div>
      </div>
    </div>
  </>
);

export default LastFeed;
