import React, { useEffect, useState } from 'react';
import jsonDataWaterTemp from './json/water_temperatures.json';
import jsonDataAirTemp from './json/Air_temperatures.json';
import jsonDataHumidity from './json/humidity.json';
import jsonDataWaterLevel from './json/waterLevel.json';
import jsonDataLastFeed from './json/last_feed_data.json';
import jsonDataTopFeed from './json/feeding_data.json';
import fishData from './json/fish.json';
import triviaData from './json/trivia.json';
import jsonTdsData from './json/tds.json';
import TwitchChat from './TwitchChat';
import './App.css';

import Slideshow from '../components/Slideshow';

const convertFahrenheitToCelsius = (fahrenheit) => {
  return ((fahrenheit - 32) * 5) / 9;
}; // Convert Fahrenheit to Celsius

const AppSensors = () => {

  // const [chatMessage, setChatMessage] = useState('');
  // const [slideshowInterval, setSlideshowInterval] = useState(5000);
  // const [onlyReadChat, setOnlyReadChat] = useState(true); // Set this based on your requirement

  // const handleCommand = ({ user, message }) => {
  //   // Handle specific commands
  //   if (message.toLowerCase() === '!command') {
  //     setChatMessage(`Command received from ${user}`);
  //   } else if (message.toLowerCase().startsWith('!interval ')) {
  //     const newInterval = parseInt(message.split(' ')[1], 10);
  //     if (!isNaN(newInterval)) {
  //       setSlideshowInterval(newInterval);
  //       setChatMessage(`Slideshow interval changed to ${newInterval}ms by ${user}`);
  //     }
  //   }
  // }

  const [forceUpdate, setForceUpdate] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(prevState => !prevState);
    }, 150); // force update interval in ms

    return () => clearInterval(interval);
  }, []); // Force a re-render even if none of the json are updated so the 'xx min.ago' part of the display get updated
  // console.log(forceUpdate);

  const [sensorData, setSensorData] = useState({
    waterTemp: null,
    airTemp: null,
    humidity: null,
    waterLevel: null,
    lastFeed: null,
    topFeed: null,
    tds: null
  });

  useEffect(() => {
    const fetchData = () => {
      try {
        const lastTdsData = jsonTdsData[jsonTdsData.length - 1];
        const lastWaterTemp = jsonDataWaterTemp[jsonDataWaterTemp.length - 1];
        const lastAirTemp = jsonDataAirTemp[jsonDataAirTemp.length - 1];
        const lastHumidity = jsonDataHumidity[jsonDataHumidity.length - 1];
        const lastWaterLevel = jsonDataWaterLevel[jsonDataWaterLevel.length - 1];
        const lastFeedData = jsonDataLastFeed;
        const topFeedData = jsonDataTopFeed;

        setSensorData({
          tds: lastTdsData,
          waterTemp: lastWaterTemp,
          airTemp: lastAirTemp,
          humidity: lastHumidity,
          waterLevel: lastWaterLevel,
          lastFeed: lastFeedData,
          topFeed: topFeedData
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);


  const getTemperatureColorClass = (temperature) => {
    if (temperature < 75) {
      return 'blue-color';
    } else if (temperature > 78) {
      return 'orange-color';
    } else if (temperature >= 80) {
      return 'red-color';
    } else {
      return 'green-color';
    }
  }; // Adjust color based on temp value

  const calculateTimeDifference = (humanDate) => {
    if (!humanDate) {
      return "Invalid Date";
    }
    const currentTime = new Date();
    const [datePart, timePart] = humanDate.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');

    // Months are zero-based in JavaScript Date object, so we subtract 1 from the month
    const dataTime = new Date(year, month - 1, day, hour, minute, second);

    const diffInMilliseconds = currentTime - dataTime;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if ((diffInSeconds - 21600) < 60) {
      return `${diffInSeconds - 21600} sec.`;
    } else {
      return `${diffInMinutes - 360} min.`;
    }
  };

  const calculateTimeDifferenceT = (timestamp) => {
    if (!timestamp) {
      return "Invalid Timestamp";
    }

    const currentTime = new Date();
    const dataTime = new Date(timestamp * 1000);

    const diffInMilliseconds = currentTime - dataTime;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec.`;
    } else {
      return `${Math.floor(diffInSeconds / 60)} min.`;
    }
  };

  const formatCountdownTime = (timestamp) => {
    const cooldownHours = 8;
    const currentTime = new Date();
    const lastActionTime = new Date(timestamp);

    const timeDifference = (currentTime - lastActionTime) / 1000; // Convert milliseconds to seconds
    const remainingSeconds = cooldownHours * 3600 - timeDifference;

    if (remainingSeconds <= 0) {
      return 'Unlocked';
    } else {
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = Math.floor(remainingSeconds % 60);

      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
  };

  const sortedFeeders = Object.entries(jsonDataTopFeed).sort(
    (a, b) => b[1].count - a[1].count
  ).slice(0, 10);
  // console.log(sortedFeeders);

  const orderedList = Object.entries(jsonDataTopFeed)
    .sort((a, b) => b[1].time - a[1].time);

  const entryWithLargestTimestamp = orderedList[0];

  const sortedTrivia = triviaData.sort((a, b) => b.points - a.points).slice(0, 7);

  return (
    <div className="container">
      {/* <TwitchChat onCommand={handleCommand} onlyReadChat={onlyReadChat} /> */}

      <div className="innerContainer">
        <div className="leftColumn">

          {sensorData.waterLevel && (
            <>
              {/* <div className="sensorTitle">
                <h2>Levels</h2>
              </div> */}
              <div className="sensorContainer">
                <div className="sensorColumn">
                  <div className="sensorTitle">
                    <h3>Food: </h3>
                    {/* <span style={{ color: '#ffffff', fontSize: '0.6em' }}>({sensorData.waterLevel.date})</span> */}
                  </div>
                  <div className={`temperature-display ${getTemperatureColorClass(78)}`}>
                    <span className="segmented-digit">{sensorData.waterLevel.level}</span>
                  </div>
                </div>
                <div className="sensorColumn">
                  <div className="sensorTitle">
                    <h3>Water: </h3>
                    {/* <span style={{ color: '#ffffff', fontSize: '0.6em' }}>({sensorData.waterLevel.date})</span> */}
                  </div>
                  <div className={`temperature-display ${getTemperatureColorClass(78)}`}>
                    <span className="segmented-digit">{sensorData.waterLevel.level}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {sensorData.waterTemp && (
            <>
              <div className="sensorTitle">
                <h2>Water Temp.: <span style={{ color: '#ffffff', fontSize: '0.6em' }}>({calculateTimeDifferenceT(sensorData.waterTemp.timestamp)})</span></h2>
              </div>
              <div className={`temperature-display ${getTemperatureColorClass(sensorData.waterTemp.temperature)}`}>
                {sensorData.waterTemp.temperature.toString().split('').map((digit, index) => (
                  <span key={index} className="segmented-digit">{digit}</span>
                ))}
                <span className="segmented-digit">°F</span>
              </div>
              <div className={`temperature-display ${getTemperatureColorClass(sensorData.waterTemp.temperature)}`}>
                {convertFahrenheitToCelsius(sensorData.waterTemp.temperature).toFixed(2).toString().split('').map((digit, index) => (
                  <span key={index} className="segmented-digit">{digit}</span>
                ))}
                <span className="segmented-digit">°C</span>
              </div>
            </>
          )}

          {sensorData.airTemp && (
            <>
              <div className="sensorTitle">
                <h2>Air Temp.: <span style={{ color: '#ffffff', fontSize: '0.6em' }}>({calculateTimeDifference(sensorData.airTemp.Date)})</span></h2>
              </div>
              <div className={`temperature-display ${getTemperatureColorClass(78)}`}>
                {sensorData.airTemp.Temperature.toString().split('').map((digit, index) => (
                  <span key={index} className="segmented-digit">{digit}</span>
                ))}
                <span className="segmented-digit">°F</span>
              </div>
              <div className={`temperature-display ${getTemperatureColorClass(78)}`}>
                {convertFahrenheitToCelsius(sensorData.airTemp.Temperature).toFixed(2).toString().split('').map((digit, index) => (
                  <span key={index} className="segmented-digit">{digit}</span>
                ))}
                <span className="segmented-digit">°C</span>
              </div>
            </>
          )}

          {sensorData.humidity && (
            <>
              <div className="sensorTitle">
                <h2>Humidity: <span style={{ color: '#ffffff', fontSize: '0.6em' }}>({calculateTimeDifference(sensorData.humidity.date)})</span></h2>
              </div>
              <div className={`temperature-display ${getTemperatureColorClass(78)}`}>
                {sensorData.humidity.humidity.toString().split('').map((digit, index) => (
                  <span key={index} className="segmented-digit">{digit}</span>
                ))}
                <span className="segmented-digit">%</span>
              </div>
            </>
          )}

          {sensorData.tds && (
            <>
              <div className="sensorTitle">
                <h2>TDS: <span style={{ color: '#ffffff', fontSize: '0.6em' }}>({calculateTimeDifference(sensorData.tds.date)})</span></h2>
              </div>
              <div className={`temperature-display ${getTemperatureColorClass(78)}`}>
                {sensorData.tds.tds.toString().split('').map((digit, index) => (
                  <span key={index} className="segmented-digit">{digit}</span>
                ))}
                <span className="segmented-digit">_PPM</span>
              </div>
            </>
          )}

          {sensorData.lastFeed && (
            <>
              <div className="sensorTitle">
                <h2>!feedfish:</h2>
              </div>
              <div className={`temperature-display ${getTemperatureColorClass(78)}`}>
                {formatCountdownTime(sensorData.lastFeed.date).split('').map((digit, index) => (
                  <span key={index} className="segmented-digit">{digit}</span>
                ))}
              </div>
              {/* <div className="sensorTitle">
                <h2>Last fed by:</h2>
              </div>
              <div className={`usernameDisplay ${getTemperatureColorClass(78)}`}>
                <div className="usernameContainer">
                  <div className={sensorData.lastFeed.username.length > 10 ? 'scrolling-text' : ''}>
                    {sensorData.lastFeed.username.split('').map((digit, index) => (
                      <span key={index} className="segmented-digit">{digit}</span>
                    ))}
                  </div>
                </div>
              </div> */}
            </>
          )}
          
          <Slideshow interval={5000} />

        </div>

        <div className="centerColumn">
          {/* Add any additional content or components for the center column here */}
        </div>

        <div className="rightColumn">

          <div>
            <h3 className="sensorTitle">Fish List:</h3>
            {fishData.map((fish, index) => (
              <div key={index}>
                <li>{fish.specie} : {fish.quantity}</li>
              </div>
            ))}
          </div>

          <div>
            <><h3 className="sensorTitle">Trivia Leaderboard:</h3></>
            {/* <ol> */}
            {sortedTrivia.map((user, index) => (
              <li key={index}>
                <span> {user.username} </span>
                <span> ({user.points})</span>
              </li>
            ))}
            {/* </ol> */}
          </div>

          <div>
            <><h3 className="sensorTitle">Top 10 Feeders:</h3></>
            {/* <ol> */}
            {sortedFeeders.map(([username, data]) => (
              <li key={username}>
                <span> {username} </span>
                <span> ({data.count})</span>
              </li>
            ))}
            {/* </ol> */}
          </div>

          <div>
            <><h3 className="sensorTitle">Last fed by:</h3></>
            <li>{entryWithLargestTimestamp[0]}</li>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AppSensors;