import { Container, Paper, Stack } from "@mui/material";
import LineChart from "./components/LineChart";
import SessionsStats from "../leads/components/SessionsStats";
import CallsChart from "./components/CallsChart";

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth={false} sx={{}}>
      <Stack sx={{ height: 200 }} direction="row">
        <Paper sx={{ height: 150, width: 450 }}>
          <CallsChart />
        </Paper>
        <CallsChart />
        <CallsChart />
        <CallsChart />
      </Stack>
      <SessionsStats />
      <LineChart />
    </Container>
  );
};

export default Dashboard;
