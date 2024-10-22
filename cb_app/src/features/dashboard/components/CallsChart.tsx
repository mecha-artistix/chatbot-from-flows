import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Paper, useTheme } from "@mui/material";
import { DefaultizedPieValueType } from "@mui/x-charts";

interface ICallsChart {}

// Sample Data
const data = [
  { id: 0, value: 10, label: "Successful Calls" },
  { id: 1, value: 15, label: "Failed Calls" },
  { id: 2, value: 20, label: "Not Answered" },
];

// Helper Function to Calculate Percentages
const total = data.reduce((acc, item) => acc + item.value, 0);
const calculatePercentages = (data: { id: number; value: number; label: string }[]) => {
  return data.map((item) => ({
    ...item,
    percentage: total ? ((item.value / total) * 100).toFixed(1) : "0.0",
  }));
};

const getArcLabel = (params: DefaultizedPieValueType) => {
  const percent = params.value / total;
  return `${(percent * 100).toFixed(0)}%`;
};

const CallsChart: React.FC<ICallsChart> = () => {
  const theme = useTheme();
  // const dataWithPercentages = calculatePercentages(data);

  // Define colors for each slice
  const colors = [theme.palette.primary.main, theme.palette.error.main, theme.palette.warning.main];

  return (
    <Box>
      <PieChart
        series={[
          {
            data: data,
            arcLabel: getArcLabel,
            valueFormatter: (v) => {
              return ` ${v.value}`;
            },
          },
        ]}
        margin={{ top: 5, bottom: 30 }}
        // width={300}
        // height={300}
        colors={colors}
        slotProps={{
          legend: { direction: "row", position: { vertical: "bottom", horizontal: "middle" }, padding: 0 },
        }}
      />
    </Box>
  );
};

export default CallsChart;
