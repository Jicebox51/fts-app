"use client";
import React, { useEffect, useState } from 'react';
import '../styles/css-reset.css';
import styles from '../styles/App.module.css';
import AppSensors from '/src/components/AppSensors';
import BackgroundVideo from '../components/BackgroundVideo';

// Need a const for channel(s) and localstorage too

const Home = () => {
  const [twitchClient, setTwitchClient] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const tmi = require("tmi.js");

  const videoSources = [
    { src: '/background/background.mp4', type: 'video/mp4' },
  ];

  useEffect(() => {
    const client = new tmi.Client({
      channels: ['j1c3_']
    });

    setTwitchClient(client);
    client.connect();
  }, []);

  useEffect(() => {
    if (twitchClient) {
      setIsConnecting(true);
      let tryConnection;
      let connectionTries = 0;

      const checkConnection = () => {
        if (twitchClient.channels.length > 0) {
          setIsConnected(true);
          setIsConnecting(false);
          clearInterval(tryConnection);
        } else if (connectionTries >= 5) {
          clearInterval(tryConnection);
          setIsConnecting(false);
          setTwitchClient(null);
        } else {
          connectionTries++;
        }
      };

      tryConnection = setInterval(checkConnection, 500);
    }
  }, [twitchClient]);

  return (
    <div className={styles.body}>
      <BackgroundVideo videoSources={videoSources} applyLumaKey={true} /> {/* Set to false for debugging */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <AppSensors twitchClient={twitchClient} />
      </div>
    </div>
  );
};

export default Home;