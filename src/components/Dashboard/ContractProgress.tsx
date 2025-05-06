import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const ContractProgress = () => {
  // Sample data
  const data = [
    { name: "Done", value: 25 },
    { name: "Not Done", value: 75 },
  ];

  const COLORS = ["#9D8EE4", "#EDB348"]; // Purple for Done, Yellow for Not Done

  return (
    <div className="w-full 2xl:h-[400px] h-[20rem] bg-white rounded-lg shadow-sm border-t-5 border-purple-500 p-4">
      <h2 className="text-lg font-bold text-center text-gray-700 mb-4">
        Contract Progress
      </h2>
      <div className="relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#EDB348"
              dataKey="value"
            >
              {data.map((entry, index) => (
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
