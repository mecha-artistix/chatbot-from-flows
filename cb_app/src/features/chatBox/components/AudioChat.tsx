import { Button, Typography, List, ListItem, ListItemIcon, ListItemText, TextField } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect, useRef, useState } from 'react';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import { Stack } from '@mui/system';
import { useChatBoxStore } from '../chatBoxStore';
import { makeCall, abortCall } from '../services';
import { Message } from '../../../types/bot';
// const { VITE_NODE_WS } = import.meta.env;
const { VITE_SERVER_WS } = import.meta.env;
const AudioChat = () => {
  const { callSid, setCallSid } = useChatBoxStore((state) => ({
    callSid: state.callSid,
    setCallSid: state.setCallSid,
  }));
  const [status, setStatus] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [toNum, setToNum] = useState('+923439107326');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const style = {
    messages: { '& .MuiListItemIcon-root': { minWidth: 32 } },
  };
  const connectWebSocket = () => {
    ws.current = new WebSocket(VITE_SERVER_WS + '/call');
    // ws.current = new WebSocket(VITE_SERVER_WS + '/media-streams');

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
      reconnectAttempts.current = 0;

      ws.current?.send(JSON.stringify({ type: 'register', callSid: callSid }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'status':
          setStatus(data.data.CallStatus);
          break;

        case 'transcription':
          setMessages((prevMessages) => [...prevMessages, data.data[data.data.length - 1]]);
          break;

        case 'stream':
          break;
        default:
          break;
      }

      console.log(data);
    };

    ws.current.onclose = () => {
      console.log('call WebSocket closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.current?.close();
    };
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    console.log('messages', messages);
  }, [messages]);

  const handleCall = async () => {
    const call = await makeCall(toNum);
    console.log('call init - ', call);
    setCallSid(call.callSid);
  };

  const handleAbort = async () => {
    console.log('abort');
    const response = await abortCall(callSid);
    console.log(response);
  };

  useEffect(() => {
    connectWebSocket();
  }, [callSid]);

  return (
    <Stack sx={{ height: '100%', gap: 1 }}>
      <TextField variant="outlined" value={toNum} onChange={(e) => setToNum(e.target.value)} />
      <Typography>Status: {status}</Typography>
      <Stack sx={(theme) => ({ flex: 1, overflowY: 'auto', border: `1px solid ${theme.palette.divider}`, p: 1 })}>
        <List sx={style.messages}>
          {messages.map((message, i) => {
            if (message.role == 'assistant') {
              return (
                <ListItem key={i} disablePadding disableGutters>
                  <ListItemIcon>
                    <SmartToyIcon />
                  </ListItemIcon>
                  <ListItemText primary={message.content} />
                </ListItem>
              );
            } else if (message.role == 'user') {
              return (
                <ListItem key={i} disablePadding disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary={message.content} />
                </ListItem>
              );
            }
          })}
        </List>
        <div ref={messagesEndRef} />
      </Stack>
      <Stack direction="row" justifyContent="space-around">
        <Button variant="contained" color="success" endIcon={<PhoneEnabledIcon />} onClick={handleCall}>
          Call
        </Button>
        <Button variant="contained" color="warning" endIcon={<PhoneDisabledIcon />} onClick={handleAbort}>
          Abort
        </Button>
      </Stack>
    </Stack>
  );
};

export default AudioChat;
