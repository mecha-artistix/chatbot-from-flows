import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

const CallBtn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    // Simulate a request or await some async operation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

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
