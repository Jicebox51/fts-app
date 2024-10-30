import { useState } from 'react';

export const useDisplaySettings = () => {
  const [isRightColumnVisible, setIsRightColumnVisible] = useState(true);
  const [isLeftColumnVisible, setIsLeftColumnVisible] = useState(true);
  const [isSlideshowVisible, setIsSlideshowVisible] = useState(true);
  const [isSmallWebcamVisible, setIsSmallWebcamVisible] = useState(true);

  const toggleRightPanelVisibility = () => {
    setIsRightColumnVisible((prevState) => !prevState);
    console.log('Right Panel Toggle has been requested');
  };

  const toggleLeftPanelVisibility = () => {
    setIsLeftColumnVisible((prevState) => !prevState);
    console.log('Left Panel Toggle has been requested');
  };

  const toggleSlideshowVisibility = () => {
    setIsSlideshowVisible((prevState) => !prevState);
    console.log('Slideshow Toggle has been requested');
  };

  const toggleSmallWebcamVisibility = () => {
    setIsSmallWebcamVisible((prevState) => !prevState);
    console.log('Small Webcam Toggle has been requested');
  };

  return {
    isRightColumnVisible,
    isLeftColumnVisible,
    isSlideshowVisible,
    isSmallWebcamVisible,
    toggleRightPanelVisibility,
    toggleLeftPanelVisibility,
    toggleSlideshowVisibility,
    toggleSmallWebcamVisibility,
  };
};
