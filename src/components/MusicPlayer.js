'use client';

import React, { useRef, useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import '../styles/MusicPlayer.css';

const MusicPlayer = ({ playerRef, playlist, currentTrackIndex, onTrackEnd }) => {
  const canvasRef = useRef(null);
  const [p5, setP5] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    import('p5').then((p5Module) => {
      setP5(() => p5Module.default);
    });
  }, []);

  useEffect(() => {
    if (!p5 || !canvasRef.current || !playerRef.current) return;

    const sketch = (p) => {
      let analyzer;
      let bubbles = [];

      p.setup = () => {
        const canvas = p.createCanvas(445, 275);
        canvas.parent(canvasRef.current);

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(playerRef.current.audio.current);
        analyzer = audioContext.createAnalyser();
        source.connect(analyzer);
        analyzer.connect(audioContext.destination);
        analyzer.fftSize = 256;
      };

      p.draw = () => {
        p.background(0, 0, 15);
        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzer.getByteFrequencyData(dataArray);

        const lowFrequency = dataArray.slice(0, bufferLength / 2).reduce((a, b) => a + b) / (bufferLength / 2);
        const highFrequency = dataArray.slice(bufferLength / 2).reduce((a, b) => a + b) / (bufferLength / 2);

        if (lowFrequency > 128 || highFrequency > 128) {
          const size = lowFrequency > highFrequency ? p.map(lowFrequency, 0, 255, 10, 100) : p.map(highFrequency, 0, 255, 10, 100);
          bubbles.push(new Bubble(p, size));
        }

        bubbles.forEach((bubble, index) => {
          bubble.update();
          bubble.show();
          if (bubble.isOffScreen()) {
            bubbles.splice(index, 1);
          }
        });
      };

      class Bubble {
        constructor(p, size) {
          this.p = p;
          this.pos = p.createVector(p.random(p.width), p.height + size);
          this.size = size;
          this.vel = p.createVector(p.random(-0.5, 0.5), p.random(-1, -3));
        }

        update() {
          this.pos.add(this.vel);
          this.vel.add(p.createVector(p.random(-0.05, 0.05), p.random(-0.05, 0.05)));
        }

        show() {
          this.p.fill(173, 216, 230, 150); // Light blue with transparency
          this.p.noStroke();
          this.p.ellipse(this.pos.x, this.pos.y, this.size);
        }

        isOffScreen() {
          return (this.pos.y < -this.size);
        }
      }
    };

    new p5(sketch);

    return () => {
      canvasRef.current.innerHTML = '';
    };
  }, [p5, playerRef]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (playerRef.current && playerRef.current.audio) {
        setCurrentTime(playerRef.current.audio.current.currentTime);
        setDuration(playerRef.current.audio.current.duration);
      }
    };

    const audioEl = playerRef.current ? playerRef.current.audio.current : null;

    if (audioEl) {
      audioEl.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (audioEl) {
        audioEl.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [playerRef]);

  const handleTrackEnd = () => {
    onTrackEnd();
  };

  const currentTrack = playlist[currentTrackIndex];

  return (
    <div className="music-player">
      <h2 className="track-title">{currentTrack ? currentTrack.title : 'No track selected'}</h2>
      <div className="time-info">
        {currentTrack && (
          <>
            <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
            /
            <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
          </>
        )}
      </div>
      <AudioPlayer
        ref={playerRef}
        src={currentTrack ? currentTrack.url : ''}
        showJumpControls={false}
        showSkipControls={false}
        showDownloadProgress={false}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        customProgressBarSection={[]}
        onEnded={handleTrackEnd}
        autoPlayAfterSrcChange={true}
        customIcons={{
          play: null,
          pause: null,
          rewind: null,
          forward: null,
        }}
        style={{ display: 'none' }}
        controls={false}
      />
      <div ref={canvasRef}></div>
    </div>
  );
};

export default MusicPlayer;
