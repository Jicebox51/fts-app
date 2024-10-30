// Webcams.js
import React, { useState, useEffect, useCallback } from 'react';
import MainWebcam from './MainWebcam';
import AltWebcam from './AltWebcam';

const Webcams = () => {
  const [devices, setDevices] = useState([]);
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    async function getDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices.slice(0, 2)); // Get the first two video devices
    }
    getDevices();
  }, []);

  const swapCameras = useCallback(() => {
    setIsSwapped(prev => !prev);
  }, []);

  return {
    MainWebcam: <MainWebcam deviceId={devices[isSwapped ? 1 : 0]?.deviceId} />,
    AltWebcam: <AltWebcam deviceId={devices[isSwapped ? 0 : 1]?.deviceId} />,
    swapCameras
  };
};

export default Webcams;