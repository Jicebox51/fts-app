import { useState, useEffect } from 'react';

export const PlaylistManager = () => {
  const [playlist, setPlaylist] = useState([]);

  const fetchPlaylist = async () => {
    try {
      const response = await fetch('/json/audioFiles.json');
      const audioFiles = await response.json();

      return audioFiles.map(file => ({
        title: file.split('.').slice(0, -1).join('.'),
        url: `/audio/${file}`
      }));
    } catch (error) {
      console.error('Error fetching playlist:', error);
      return [];
    }
  };

  const refreshPlaylist = () => {
    return new Promise((resolve, reject) => {
      fetch('/api/refreshPlaylist')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to refresh playlist');
          }
          return response.json();
        })
        .then(() => fetchPlaylist())
        .then(updatedPlaylist => {
          setPlaylist(updatedPlaylist);
          resolve(updatedPlaylist);
        })
        .catch(error => {
          console.error('Error refreshing playlist:', error);
          reject(error);
        });
    });
  };

  useEffect(() => {
    fetchPlaylist().then(setPlaylist);
  }, []);

  return { playlist, refreshPlaylist };
};