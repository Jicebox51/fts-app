// MainWebcam.js
import React from 'react';
import Webcam from 'react-webcam';
import styles from '/src/styles/App.module.css';

const MainWebcam = ({ deviceId }) => {
  if (!deviceId) return null;

  const videoConstraints = {
    width: 1280,
    height: 720,
    deviceId: deviceId
  };

  return (
    <div className={`${styles['main-webcam']}`}>
      <Webcam
        audio={false}
        height={720}
        width={1280}
        videoConstraints={videoConstraints}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default MainWebcam;