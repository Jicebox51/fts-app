import React from 'react';
import styles from '/src/styles/App.module.css';

const Trivia = ({ sortedTrivia }) => (
  <div>
    <h3 className={`${styles.sensorTitle}`}>Trivia Leaderboard:</h3>
    <ul>
      {sortedTrivia.map((trivia, index) => (
        <li key={index}>
          <span> {trivia.username} </span>
          <span> ({trivia.points})</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Trivia;