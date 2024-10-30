import React from 'react';
import styles from '/src/styles/App.module.css';

const LastFedBy = ({ entryWithLargestTimestamp }) => (

    <div>
        <h2 className={`${styles.sensorTitle}`}>Last Fed By: </h2>
        <ul>
            <li>
                <span>{entryWithLargestTimestamp[0]} ({entryWithLargestTimestamp[1].count})</span>
            </li>
        </ul>
    </div>

);

export default LastFedBy;