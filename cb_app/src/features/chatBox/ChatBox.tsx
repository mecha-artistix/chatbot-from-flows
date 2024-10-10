import { Box, Button, IconButton, Paper, Slide, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { getBot } from './services';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IBotData } from '../../types/bot';
import { useChatBoxStore } from './chatBoxStore';
import ChooseModal from './components/ChooseModal';
import AudioChat from './components/AudioChat';
import TextChat from './components/TextChat';

interface IChatBox {
  // openChatBox: boolean;
  // setOpenChatBox: React.Dispatch<React.SetStateAction<boolean>>;
}

const steps = ['Choose a model', 'Test the Model'];

const ChatBox: React.FC<IChatBox> = () => {
  const [data, setData] = useState<IBotData>();

  const { openChatBox, chatBoxId, closeChatBox, activeStep, setActiveStep, handleReset } = useChatBoxStore((state) => ({
    openChatBox: state.openChatBox,
    setOpenChatBox: state.setOpenChatBox,
    chatBoxId: state.chatBoxId,
    closeChatBox: state.closeChatBox,
    activeStep: state.activeStep,
    setActiveStep: state.setActiveStep,
    handleReset: state.handleReset,
  }));
  const style = {
    wrapper: { position: 'absolute', bottom: 50, right: 50 },
    container: {
      width: '400px',
      height: '600px',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
    },
    chatBox: { flex: 1, height: 'calc(100% - 72px)' },
    stepHeader: { '& .MuiStepLabel-label': { mt: 1 }, flexShrink: 0 },
  };
  // const [activeStep, setActiveStep] = useState(0);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ChooseModal />;
      case 1:
        return <TestModel />;
      default:
        return (
          <div>
            <Typography variant="h6">All steps completed</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await getBot(chatBoxId)
        .then((response) => setData(response.data.data))
        .then(() => {
          console.log(data);
        });
    };
    loadData();
  }, [openChatBox]);

  return (
    <Slide direction="up" in={openChatBox} mountOnEnter unmountOnExit>
      <Paper sx={style.wrapper}>
        <Stack sx={style.container} className="container">
          <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
            <IconButton aria-label="close" onClick={() => closeChatBox()}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Stepper Header */}
          <Stepper activeStep={activeStep} alternativeLabel sx={style.stepHeader}>
            {steps.map((label, i) => (
              <Step key={i}>
                <StepLabel onClick={() => setActiveStep('+')} sx={{ my: 0 }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Stepper Content */}
          <Stack sx={style.chatBox} className="parentCont">
            {getStepContent(activeStep)}
          </Stack>
        </Stack>
      </Paper>
    </Slide>
  );
};

export default ChatBox;

function TestModel() {
  const { testMethod } = useChatBoxStore((state) => ({ testMethod: state.testMethod }));
  return testMethod === 'phone' ? <AudioChat /> : <TextChat />;
}
