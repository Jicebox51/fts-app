"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsonDataWaterTemp from '../../public/json/water_temperatures.json';
import jsonDataAirTemp from '../../public/json/Air_temperatures.json';
import jsonDataHumidity from '../../public/json/humidity.json';
import jsonDataWaterLevel from '../../public/json/waterLevel.json';
import jsonDataLastFeed from '../../public/json/last_feed_data.json';
import jsonDataTopFeed from '../../public/json/feeding_data.json';
import fishData from '../../public/json/fish.json';
import triviaData from '../../public/json/trivia.json';
import jsonTdsData from '../../public/json/tds.json';
import WaterTemp from './WaterTemp';
import AirTemp from './AirTemp';
import Humidity from './Humidity';
import Levels from './Levels';
import LastFeed from './LastFeed';
import TopFeeders from './TopFeeders';
import LastFedBy from './LastFedBy';
import TriviaLeaderboard from './TriviaLeaderboard';
import FishData from './FishData';
import Slideshow from './Slideshow';
import Webcams from './Webcams';
import MusicPlayer from './MusicPlayer';
import { PlaylistManager } from './PlaylistManager';
import { useDisplaySettings } from "./DisplaySettings";
// import '../styles/App.css';
import styles from '../styles/App.module.css';
import TDS from './TDS';

const AppSensors = ({ twitchClient }) => {
  const {
    isRightColumnVisible,
    isLeftColumnVisible,
    isSlideshowVisible,
    isSmallWebcamVisible,
    toggleRightPanelVisibility,
    toggleLeftPanelVisibility,
    toggleSlideshowVisibility,
    toggleSmallWebcamVisibility,
  } = useDisplaySettings();

  const { MainWebcam, AltWebcam, swapCameras } = Webcams();

  const playerRef = useRef(null);
  const { playlist, refreshPlaylist } = PlaylistManager();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const handleTwitchCommands = useCallback((message, channel, tags, user) => {

    // Toggle Left Infos Visibility
    if (message.toLowerCase(message) === '!toggleleftpanel' && ('#' + user === channel || user === 'j1c3_' || user === 'shdwtek' || user === 'evandotpro')) {
      toggleLeftPanelVisibility();
      return;
    }

    // Toggle Right Infos Visibility
    if (message.toLowerCase(message) === '!togglerightpanel' && ('#' + user === channel || user === 'j1c3_' || user === 'shdwtek' || user === 'evandotpro')) {
      toggleRightPanelVisibility();
      return;
    }

    // Toggle Left/Right Infos Visibility
    if (message.toLowerCase(message) === '!togglebothpanels' && ('#' + user === channel || user === 'j1c3_' || user === 'shdwtek' || user === 'evandotpro')) {
      toggleLeftPanelVisibility();
      toggleRightPanelVisibility();
      return;
    }

    // Toggle Slideshow Visibility
    if (message.toLowerCase(message) === '!toggleslideshow' && ('#' + user === channel || user === 'j1c3_' || user === 'shdwtek' || user === 'evandotpro')) {
      toggleSlideshowVisibility();
      return;
    }

    // Toggle Smallwebcam Visibility
    if (message.toLowerCase(message) === '!togglesmallwebcam' && ('#' + user === channel || user === 'j1c3_' || user === 'shdwtek' || user === 'evandotpro')) {
      toggleSmallWebcamVisibility();
      return;
    }

    // Swap Webcams
    if (message.toLowerCase(message) === '!swapcams' && ('#' + user === channel || user === 'j1c3_' || user === 'shdwtek' || user === 'evandotpro')) {
      swapCameras();
      return;
    }

    // Music Player
    if (message.toLowerCase() === '!play') {
      playerRef.current.audio.current.play();
      return;
    }

    if (message.toLowerCase() === '!pause') {
      playerRef.current.audio.current.pause();
      return;
    }

    if (message.toLowerCase().startsWith('!vol')) {
      const volume = parseFloat(message.split(' ')[1]);
      if (!isNaN(volume) && volume >= 0 && volume <= 1) {
        playerRef.current.audio.current.volume = volume;
      }
      return;
    }

    if (message.toLowerCase().startsWith('!seek')) {
      const time = parseFloat(message.split(' ')[1]);
      if (!isNaN(time) && time >= 0) {
        playerRef.current.audio.current.currentTime = time;
      }
      return;
    }

    if (message.toLowerCase() === '!next') {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    } [playlist.length];

    if (message.toLowerCase() === '!previous') {
      setCurrentTrackIndex((prevIndex) => {
        const prevIndexCorrected = (prevIndex - 1 + playlist.length) % playlist.length;
        console.log('Previous track index:', prevIndexCorrected);
        return prevIndexCorrected;
      });
      return;
    }

    if (message.toLowerCase().startsWith('!track')) {
      const trackNumber = parseInt(message.split(' ')[1]);
      if (!isNaN(trackNumber) && trackNumber > 0 && trackNumber <= playlist.length) {
        setCurrentTrackIndex(trackNumber - 1);
      }
      return;
    }

    if (message.toLowerCase() === '!refreshplaylist') {
      refreshPlaylist()
        .then(() => console.log('Playlist refreshed successfully.'))
        .catch(() => console.log('Failed to refresh playlist. Check console for errors.'));
      return;
    }
  }, [playlist.length, refreshPlaylist, toggleLeftPanelVisibility, toggleRightPanelVisibility, toggleSlideshowVisibility, toggleSmallWebcamVisibility]);

  const handleTrackEnd = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  }, [playlist.length]);

  useEffect(() => {
    if (twitchClient) {
      twitchClient.on('message', (channel, tags, message, self) => {
        if (self) return;
        const user = tags['display-name'];
        handleTwitchCommands(message, channel, tags, user);
      });
    }
  }, [twitchClient, handleTwitchCommands]);

  const [forceUpdate, setForceUpdate] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(prevState => !prevState);
    }, 150);

    return () => clearInterval(interval);
  }, []);

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
    if (temperature >= 80) {
      return styles['red-color'];
    } else if (temperature > 78) {
      return styles['orange-color'];
    } else if (temperature < 75) {
      return styles['blue-color'];
    } else {
      return styles['green-color'];
    }
  };

  const calculateTimeDifference = (humanDate) => {
    if (!humanDate) {
      return "Invalid Date";
    }
    const currentTime = new Date();
    const [datePart, timePart] = humanDate.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');

    const dataTime = new Date(year, month - 1, day, hour, minute, second);

    const diffInMilliseconds = currentTime - dataTime;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    if ((diffInSeconds - 21600) < 60) {
      return `${diffInSeconds - 21600} sec.`;
    } else if ((diffInMinutes - 360) < 60) {
      return `${diffInMinutes - 360} min.`;
    } else {
      return `${diffInHours - 6} hrs.`;
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
    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec.`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min.`;
    } else {
      return `${Math.floor(diffInMinutes / 60)} hrs.`;
    }
  };

  const formatCountdownTime = (timestamp) => {
    const cooldownHours = 8;
    const currentTime = new Date();
    const lastActionTime = new Date(timestamp);

    const timeDifference = (currentTime - lastActionTime) / 1000;
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

  const orderedList = Object.entries(jsonDataTopFeed)
    .sort((a, b) => b[1].time - a[1].time);

  const entryWithLargestTimestamp = orderedList[0];

  const sortedTrivia = triviaData.sort((a, b) => b.points - a.points).slice(0, 7);

  return (
    <div className={`${styles.mainContainer}`}>
      <div className={`${styles.innerContainer}`}>
        <div className={`${styles.leftColumn} ${isLeftColumnVisible ? styles.visible : ''}`}>
          <div className={`${styles.leftContent}`}>
            {sensorData.waterLevel && (
              <Levels
                waterLevel={sensorData.waterLevel}
                getTemperatureColorClass={getTemperatureColorClass}
              />
            )}

            {sensorData.waterTemp && (
              <WaterTemp
                waterTemp={sensorData.waterTemp}
                getTemperatureColorClass={getTemperatureColorClass}
                calculateTimeDifferenceT={calculateTimeDifferenceT}
              />
            )}

            {sensorData.airTemp && (
              <AirTemp
                airTemp={sensorData.airTemp}
                getTemperatureColorClass={getTemperatureColorClass}
                calculateTimeDifference={calculateTimeDifference}
              />
            )}

            {sensorData.humidity && (
              <Humidity
                humidity={sensorData.humidity}
                calculateTimeDifference={calculateTimeDifference}
              />
            )}

            {sensorData.tds && (
              <TDS
                tds={sensorData.tds}
                calculateTimeDifference={calculateTimeDifference}
              />
            )}

            {sensorData.lastFeed && (
              <LastFeed
                lastFeed={formatCountdownTime(sensorData.lastFeed.date)}
              />
            )}

          </div>
        </div>

        <div className={`${styles.centerColumn}`}>
          <div className={`${styles.centerContent}`}>
            {MainWebcam}
          </div>
        </div>

        <div className={`${styles.rightColumn} ${isRightColumnVisible ? styles.visible : ''}`}>
          <div className={`${styles.leftContent}`}>
            <FishData fishData={fishData} />

            <TriviaLeaderboard sortedTrivia={sortedTrivia} />

            {sensorData.topFeed && (
              <TopFeeders
                topFeeders={sensorData.topFeed}
                sortedFeeders={sortedFeeders}
              />
            )}

            {sensorData.topFeed && (
              <LastFedBy
                topFeeders={sensorData.topFeed}
                entryWithLargestTimestamp={entryWithLargestTimestamp}
              />
            )}

          </div>
        </div>
      </div>

      <div className={`${styles.bottomRow}`}>
        <div className={`${styles.bottomRowContent}`}>

          <div className={`${styles.slideshow} ${styles.column} ${isSlideshowVisible ? styles.visible : ''}`}>
            <Slideshow
              interval={10000}
            />
          </div>

          <div className={`${styles.webcamContainer} ${styles.column} ${isSmallWebcamVisible ? styles.visible : ''}`}>
            {AltWebcam}
          </div>

          <div className={`${styles.webcamContainer} ${styles.column} ${styles.visible}`}>
            <MusicPlayer
              playerRef={playerRef}
              playlist={playlist}
              currentTrackIndex={currentTrackIndex}
              onTrackEnd={handleTrackEnd}
            />
          </div>

        </div>
      </div>

    </div>
  );

};

export default AppSensors;