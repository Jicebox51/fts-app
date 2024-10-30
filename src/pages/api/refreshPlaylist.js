import { exec } from 'child_process';

export default function handler(req, res) {
  exec('./update_playlist.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      res.status(500).json({ error: 'Failed to refresh playlist' });
      return;
    }
    if (stderr) {
      console.error(`Script error: ${stderr}`);
      res.status(500).json({ error: 'Script error' });
      return;
    }
    console.log(`Script output: ${stdout}`);
    res.status(200).json({ message: 'Playlist refreshed successfully' });
  });
}