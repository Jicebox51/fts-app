import React, { useState, useEffect } from 'react';
const tmi = require('tmi.js');
const channelName = 'j1c3_'; // Define your channel name here

const TwitchChat = ({ onCommand, onlyReadChat }) => {
    const [client, setClient] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionAttempts, setConnectionAttempts] = useState(0);

    console.log('will try to connect to channel:', channelName)
  
    useEffect(() => {
      const connectClient = () => {
        setIsConnecting(true);
        const clientInstance = new tmi.Client({
          options: { debug: true },
          connection: {
            reconnect: true,
            secure: true,
          },
          channels: [channelName],
        });
  
        clientInstance.connect()
          .then(() => {
            setIsConnected(true);
            setIsConnecting(false);
            setConnectionAttempts(0);
            console.log('Connected to Twitch chat');
          })
          .catch(err => {
            console.error('Connection error:', err);
            setIsConnecting(false);
            setConnectionAttempts(prev => prev + 1);
            if (connectionAttempts < 5) {
              setTimeout(connectClient, 5000); // Retry connection after 5 seconds
            } else {
              console.error('Maximum connection attempts reached. Please check your configuration.');
            }
          });
  
        clientInstance.on('message', (channel, tags, message, self) => {
          if (self) return;
  
          console.log(`[${tags['display-name']}] ${message}`);
  
          if (message.toLowerCase().startsWith('!')) {
            onCommand({ user: tags['display-name'], message });
          }
        });
  
        clientInstance.on('disconnected', (reason) => {
          console.error('Disconnected:', reason);
          setIsConnected(false);
          setIsConnecting(false);
          setConnectionAttempts(prev => prev + 1);
          if (connectionAttempts < 5) {
            setTimeout(connectClient, 5000); // Retry connection after 5 seconds
          } else {
            console.error('Maximum disconnection attempts reached. Please check your connection.');
          }
        });
  
        setClient(clientInstance);
      };
  
      connectClient();
  
      return () => {
        if (client) {
          client.removeAllListeners();
          client.disconnect();
        }
      };
    }, [onCommand]);
  
    return (
      <div>
        {isConnecting ? <span>Connecting...</span> : null}
        {isConnected ? <span>Connected</span> : null}
      </div>
    );
  };
  
  export default TwitchChat;