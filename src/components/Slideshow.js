import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '/src/styles/Slideshow.module.css';

const Slideshow = ({ interval = 10000 }) => {
  const images = [
    '/pictures/image1.jpeg',
    '/pictures/image2.jpeg',
    '/pictures/image3.jpeg',
    '/pictures/tomorrow.png',
    // Add more images as needed
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, images.length]);

  return (
    <div className={styles.slideshowContainer}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${styles.eachSlide} ${index === currentImageIndex ? styles.active : ''}`}
        >
          <div className={styles.imageWrapper}>
            <Image
              src={image}
              alt={`Slide ${index}`}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slideshow;
