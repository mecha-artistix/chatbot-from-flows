import WebSocket from 'ws';

export const initializeMediaStreamsWebSocket = (wss: WebSocket.Server) => {
  wss.on('connection', (ws) => {
    console.log('Client connected to media stream socket');

    // Handle incoming messages from Twilio
    ws.on('message', async (message) => {
      try {
        console.log('Data received from Twilio:', message);
        // const transcriptionData = JSON.parse(message);
        // const { CallSid, text, timestamp } = transcriptionData;
        // 1. Broadcast transcription data to all connected clients
        // broadcastTranscription(wss, transcriptionData);
      } catch (error) {
        console.error('Error processing media stream message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format sent to media streams socket' }));
      }
    });

    // Handle WebSocket disconnection
    ws.on('close', () => {
      console.log('Twilio Media Stream WebSocket disconnected');
    });

    // Handle WebSocket errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
};

// Broadcast transcription data to all connected clients
const broadcastTranscription = (wss, transcriptionData) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'transcription', data: transcriptionData }));
    }
  });
};

/*




// Save transcription to the session in MongoDB

const saveTranscriptionToSession = async (callSid, transcription) => {
    try {
      // Update the session with the CallSid and add the new transcription
      const session = await Session.findOneAndUpdate(
        { callSid },
        { $push: { transcriptions: transcription } },
        { new: true, upsert: true } // Create session if it doesn't exist
      );
  
      if (session) {
        console.log(`Transcription saved to session with CallSid: ${callSid}`);
      } else {
        console.log(`No session found with CallSid: ${callSid}, but created a new one`);
      }
    } catch (error) {
      console.error('Error saving transcription to session:', error);
    }
  };

  */
