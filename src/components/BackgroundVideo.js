import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const BackgroundVideo = ({ videoSources, applyLumaKey = true }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleCanPlay = () => {
      setVideoLoaded(true);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.addEventListener('canplay', handleCanPlay);

    const renderFrame = () => {
      if (videoLoaded) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (applyLumaKey) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          const lumaMax = 1.0;
          const lumaMaxSmooth = 0.0;
          const lumaMin = 0.0117;
          const lumaMinSmooth = 0.0087;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            // Apply luma key with smoothing, inverting the effect
            if (luminance <= lumaMin + lumaMinSmooth) {
              data[i + 3] = 0; // Fully transparent
            } else if (luminance >= lumaMax - lumaMaxSmooth) {
              data[i + 3] = 255; // Fully opaque
            } else if (luminance > lumaMin + lumaMinSmooth && luminance < lumaMax - lumaMaxSmooth) {
              const alpha = ((luminance - lumaMin) / (lumaMax - lumaMin)) * 255;
              data[i + 3] = alpha;
            }
          }

          ctx.putImageData(imageData, 0, 0);
        }
      }
      requestAnimationFrame(renderFrame);
    };

    if (videoLoaded) {
      renderFrame();
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [applyLumaKey, videoLoaded]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{ display: 'none' }}
      >
        {videoSources.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
      </video>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none', // Ensures canvas does not interfere with other UI interactions
        }}
      />
    </>
  );
};

export default BackgroundVideo;