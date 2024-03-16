import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./App.css"

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await axios.get('http://localhost:8000/logs');
      setLogs(response.data);
    };

    fetchLogs();

    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      console.log('WebSocket is connected');
    };

    ws.onmessage = (event) => {
      const newLogs = JSON.parse(event.data);
      setLogs(newLogs);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className='App'>
      <h1 className='heading'>Log Watcher</h1>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
