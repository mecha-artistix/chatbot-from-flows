// import { LoaderFunction, useLoaderData } from "react-router-dom";
import { getSessionsStats } from "../services";
import { useEffect, useState } from "react";
import SingleSessionStat from "./SingleSessionStat";
import { Stack } from "@mui/material";

function SessionsStats() {
  // const initData = useLoaderData() as ILoaderData;
  const [stats, setStats] = useState<IStat[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getSessionsStats();
      console.log(data);
      // return data;
      setStats(() => {
        const stats = Object.keys(data.stats).map((key) => {
          return {
            name: key,
            value: data.stats[key],
          };
        });
        return stats;
      });
    }
    fetchData();
  }, []);

  return (
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 2, justifyContent: "center", alignItems: "center", my: 3 }}>
      {stats.map((el, i) => (
        <SingleSessionStat key={i} intent={el} />
      ))}
    </Stack>
  );
}

export default SessionsStats;

// export const loader: LoaderFunction = async ({ params }) => {
//   console.log("params", params);
//   const data = await getSessionsStats();
//   console.log("data", data);
//   return data;
// };

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
