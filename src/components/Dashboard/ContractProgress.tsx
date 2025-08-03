import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { getProgressReport } from "@/api/dashboardApi";

// Define the type for your API response
interface ContractProgressData {
  done: number;
  notDone: number;
}

const COLORS = ["#9D8EE4", "#EDB348"]; // Purple for Done, Yellow for Not Done

const ContractProgress = () => {
  const { data, isLoading, error } = useQuery<ContractProgressData>({
    queryKey: ["contractProgress"],
    queryFn: getProgressReport,
  });
  if (isLoading) {
    return (
      <div className="w-full h-[22rem] min-2xl:h-[25rem] bg-white rounded-lg shadow-sm border-t-5 border-purple-500 p-4 flex items-center justify-center">
        <div>Loading contract progress...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[22rem] min-2xl:h-[25rem] bg-white rounded-lg shadow-sm border-t-5 border-purple-500 p-4 flex items-center justify-center">
        <div>Error loading contract progress</div>
      </div>
    );
  }

  // Transform the API data to match the chart format
  const chartData = [
    { name: "Done", value: data?.done || 0 },
    { name: "Not Done", value: data?.notDone || 0 },
  ];

  return (
    <div className="w-full h-[22rem] min-2xl:h-[25rem] bg-white rounded-lg shadow-sm border-t-5 border-purple-500 p-4">
      <h2 className="text-lg font-bold text-center text-gray-700 mb-4">
        Contract Progress
      </h2>
      <div className="relative h-[80%]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="70%"
              fill="#EDB348"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "0.375rem",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                padding: "0.5rem",
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="top"
              align="right"
              wrapperStyle={{
                position: "absolute",
                right: 0,
                top: 0,
                gap: "8px",
              }}
              iconSize={10}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs font-medium text-gray-600">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContractProgress;
