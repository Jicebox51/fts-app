import React from 'react';
import styles from '/src/styles/App.module.css';

const Feeders = ({ sortedFeeders }) => (
  <div>
    <h3 className={`${styles.sensorTitle}`}>Top 10 Feeders:</h3>
    <ul>
      {sortedFeeders.map(([feeder, details]) => (
        <li key={feeder} className={`${styles.feederContainer}`}>
          <span className={`${styles.feederName}`}>{feeder}</span>: {details.count}
        </li>
      ))}
    </ul>
  </div>
);

export default Feeders;