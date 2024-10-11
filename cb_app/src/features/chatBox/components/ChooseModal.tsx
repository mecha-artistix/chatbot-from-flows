import { Button, Chip, Stack } from '@mui/material';
import { useChatBoxStore } from '../chatBoxStore';
import { patchBot } from '../services';
import { useState } from 'react';
import Loader from '../../../components/Loader';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import ForumIcon from '@mui/icons-material/Forum';
const modals = ['llama3', 'GPT-3.5', 'GPT-4o', 'GPT-4o mini', 'GPT-o1'];

const ChooseModal = () => {
  const { setActiveStep, chatBoxId, setTestMethod } = useChatBoxStore((state) => ({
    setActiveStep: state.setActiveStep,
    chatBoxId: state.chatBoxId,
    setTestMethod: state.setTestMethod,
    setCallSid: state.setCallSid,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('pending');
  const handleModelSelect = async (modal: string) => {
    console.log(modal);
    setIsLoading(true);
    await patchBot(chatBoxId, { modal });
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(false);
    setStatus('success');
  };
  const handleModelTest = async (method: 'phone' | 'message') => {
    setTestMethod(method);
    setActiveStep('+');
  };
  const style = {
    chip: {},
  };
  const handleCallTest = async () => {
    handleModelTest('phone');
  };
  return (
    <Stack alignItems="center">
      <Stack direction="row" gap={2} justifyContent="center" my={3} flexWrap="wrap">
        {modals.map((modal, i) => (
          <Chip
            key={i}
            label={modal}
            color="primary"
            sx={style.chip}
            clickable
            onClick={() => handleModelSelect(modal)}
          />
        ))}
      </Stack>
      {isLoading && <Loader />}
      {status == 'success' && (
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', m: 5, gap: 5 }}>
          <Button variant="outlined" startIcon={<PhoneInTalkIcon />} onClick={handleCallTest}>
            Test with Call
          </Button>
          <Button variant="outlined" startIcon={<ForumIcon />} onClick={() => handleModelTest('message')}>
            Test with Chat
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default ChooseModal;
