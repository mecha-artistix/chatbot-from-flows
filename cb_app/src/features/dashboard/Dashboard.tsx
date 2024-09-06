import { ReactDOM } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from '../authentication/components/LoginForm';
import UserAuthPage from '../authentication/components/UserAuthPage';
import RegistrationForm from '../authentication/components/RegistrationForm';

const Dashboard: React.FC = () => {
  return (
    <>
      This is dashboard
      {/* <Routes>
        <Route path="/login" element={<UserAuthPage />}>
          <Route index element={<LoginForm />} />
          <Route path="/sign-up" element={<RegistrationForm />} />
        </Route>
      </Routes> */}
    </>
  );
};

export default Dashboard;
