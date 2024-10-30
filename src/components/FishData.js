import React from 'react';
import styles from '/src/styles/App.module.css';
import fishData from '/public/json/fish.json';

const FishData = () => {
  return (
    <div>
      <h3 className={`${styles.sensorTitle}`}>Fish List:</h3>
      <ul>
        {fishData.map((fish, index) => (
          <li key={index}>
            {fish.specie}: {fish.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FishData;
