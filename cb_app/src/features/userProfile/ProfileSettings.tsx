import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

function ProfileSettings() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

export default ProfileSettings;
