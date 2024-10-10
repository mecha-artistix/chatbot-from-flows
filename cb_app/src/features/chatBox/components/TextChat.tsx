import {
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Message } from '../../../types/bot';
const { VITE_NODE_WS } = import.meta.env;



const TextChat = () => {
  const [input, setInput] = useState('');
  // const [response, setResponse] = useState('');
  // const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 5;
  // const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef<boolean>(false);
  const ws = useRef<WebSocket | null>(null);
  const style = {
    messages: { '& .MuiListItemIcon-root': { minWidth: 32 } },
  };
  const connectWebSocket = () => {
    ws.current = new WebSocket(VITE_NODE_WS + '/chat');

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
      // setConnectionStatus('Connected');
      reconnectAttempts.current = 0;
      // Optionally, send a welcome message or authenticate
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Message received:', message);
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: message.payload }]);
        // Handle other message types if necessary
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      if (isMounted.current && reconnectAttempts.current < maxReconnectAttempts) {
        const timeout = Math.pow(2, reconnectAttempts.current) * 1000;
        setTimeout(() => {
          connectWebSocket();
        }, timeout);
        // reconnectTimeout.current = setTimeout(() => {
        //   reconnectAttempts.current += 1;
        //   connectWebSocket();
        // }, timeout);
      } else {
        console.error('Max reconnection attempts reached');
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.current?.close();
    };
  };

  useEffect(() => {
    isMounted.current = true;
    connectWebSocket();
    // Cleanup on component unmount
    return () => {
      isMounted.current = false;
      // if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.length == 0) return;
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message: Message = {
        role: 'user',
        content: input,
      };
      // ws.current.send(JSON.stringify(message));
      ws.current.send(JSON.stringify([...messages, message]));
      console.log('Message sent:', message);
      setMessages((prevMessages) => [...prevMessages, { role: 'user', content: input }]);
      setInput('');
    } else {
      console.error('WebSocket is not open');
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'server', content: 'Error: WebSocket is not connected.' },
      ]);
    }
  };
  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Stack sx={{ width: '100%', height: '100%', overflow: 'hidden', gap: 1 }} className="messageCont">
      <Stack
        direction="column"
        sx={(theme) => ({ flexGrow: 1, overflowY: 'auto', border: `1px solid ${theme.palette.divider}`, p: 1 })}
        className="messageStack"
      >
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

      <form onSubmit={handleSubmit} style={{ flexShrink: 0 }}>
        <TextField
          variant="filled"
          fullWidth
          id="input"
          name="input"
          value={input}
          size="medium"
          onChange={(e) => setInput(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="send message" type="submit">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Stack>
  );
};
export default TextChat;
