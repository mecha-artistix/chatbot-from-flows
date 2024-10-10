import { Button } from '@mui/material';
import { useEffect, useRef } from 'react';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import { Stack } from '@mui/system';
const { VITE_NODE_WS } = import.meta.env;
const AudioChat = () => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const connectWebSocket = () => {
    ws.current = new WebSocket(VITE_NODE_WS + '/call');

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
      reconnectAttempts.current = 0;
    };

    ws.current.onmessage = (event) => {
      console.log(event);
    };

    ws.current.onclose = () => {
      console.log('call WebSocket closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.current?.close();
    };
  };

  // const handleCall = () => {};

  // const handleAbort = () => {};

  useEffect(() => {
    connectWebSocket();
  }, []);

  return (
    <Stack sx={{ height: '100%', gap: 1 }}>
      <Stack
        sx={(theme) => ({ flex: 1, overflowY: 'auto', border: `1px solid ${theme.palette.divider}`, p: 1 })}
      ></Stack>
      <Stack direction="row" justifyContent="space-around">
        <Button variant="contained" color="success" endIcon={<PhoneEnabledIcon />}>
          Call
        </Button>
        <Button variant="contained" color="warning" endIcon={<PhoneDisabledIcon />}>
          Abort
        </Button>
      </Stack>
    </Stack>
  );
};

export default AudioChat;
