import { Container } from '@mui/material';
import StatBox from './components/StatBox';
import GroupsIcon from '@mui/icons-material/Groups';

const Dashboard: React.FC = () => {
  const styleHandler = (theme, component) => {
    const style = {
      wrapper: { bgcolor: 'pink' },
    };
    return style[component];
  };

  return (
    <Container maxWidth={false} sx={(theme) => styleHandler(theme, 'wrapper')}>
      <StatBox
        name="Total Leads"
        stat="total_leads"
        icon={<GroupsIcon sx={(theme) => ({ color: theme.palette.primary.dark, fontSize: '46px' })} />}
      />
    </Container>
  );
};

export default Dashboard;
