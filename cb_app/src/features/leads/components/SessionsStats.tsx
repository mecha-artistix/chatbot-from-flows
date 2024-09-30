import { LoaderFunction, useLoaderData } from 'react-router-dom';
import { getSessionsStats } from '../services';
import { useEffect, useState } from 'react';
import SingleSessionStat from './SingleSessionStat';
import { Stack } from '@mui/material';
import All_Calls from '../../../assets/img/icons_sessions/All_Calls.svg';
import { grey } from '@mui/material/colors';

function SessionsStats() {
  const initData = useLoaderData() as ILoaderData;
  const [stats, setStats] = useState<IStat[]>([]);

  useEffect(() => {
    setStats(() => {
      const stats = Object.keys(initData.stats).map((key) => {
        return {
          name: key,
          value: initData.stats[key],
        };
      });
      return stats;
    });
  }, [initData.stats]);

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

export const loader: LoaderFunction = async () => {
  const data = await getSessionsStats();
  return data;
};

interface ILoaderData {
  status: string;
  totalLeads: number;
  stats: TStats;
}

type TStats = { [key: string]: number };

export interface IStat {
  name: string;
  value: number;
  color?: string;
}
