import { useLoaderData } from 'react-router-dom';
import { getSessionsStats } from '../services';
import { useEffect, useState } from 'react';
import StatBox from './StatBox';
import SingleSessionStat from './SingleSessionStat';
import { Stack } from '@mui/material';
import All_Calls from '../../../assets/img/icons_sessions/All_Calls.svg';
import { grey } from '@mui/material/colors';

function SessionsStats() {
  const initData = useLoaderData();
  console.log(initData);
  const [data, setData] = useState(initData.stats);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    setStats((prev) => {
      const stats = Object.keys(data).map((key, index) => {
        return {
          name: key,
          value: data[key],
        };
      });
      return stats;
    });
  }, [data]);

  useEffect(() => {
    console.log('stats', stats);
  }, [stats]);

  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center', my: 3 }}>
      <SingleSessionStat
        total={initData.totalLeads}
        intent={{
          name: 'All Calls',
          value: initData.totalLeads,
          color: grey[200],
        }}
        icon={All_Calls}
      />
      {stats.map((el, i) => (
        <SingleSessionStat key={i} total={initData.totalLeads} intent={el} />
      ))}
    </Stack>
  );
}

export default SessionsStats;

export async function loader() {
  const data = await getSessionsStats();
  return data;
}
