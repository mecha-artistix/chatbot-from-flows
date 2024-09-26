import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { makeCall } from '../services';

const { VITE_NODE_WS } = import.meta.env;

const CallBtn = ({ numbersToCall }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleClick = async () => {
    console.log(VITE_NODE_WS);

    const ws = new WebSocket(VITE_NODE_WS);
    ws.onopen = () => {
      console.log('web socket open');

      // Send the call request to the server via WebSocket
      ws.send(
        JSON.stringify({
          type: 'makeCall',
          payload: { numbersToCall },
        }),
      );
    };

    // Listen for messages from the server
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === 'callResponse') {
        console.log('Call response received:', message.payload);
        setResponse(message.payload);
        setLoading(false);
      }
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setLoading(false);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };
  useEffect(() => {
    console.log(response);
  }, [response]);
  return (
    <Button
      variant="contained"
      onClick={handleClick}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={20} /> : null}
    >
      {loading ? 'Calling...' : 'Call'}
    </Button>
  );
};

export default CallBtn;

/*

  const handleClick = async () => {
    setLoading(true);
    // Simulate a request or await some async operation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };
    const res = await makeCall(numbersToCall);
    setLoading(false);

  */
