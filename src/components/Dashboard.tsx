/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client"
import ContractProgress from "./Dashboard/ContractProgress";
import HistoricalDailyCommision from "./Dashboard/HistoricalDailyCommision";
import HistoricalPrices from "./Dashboard/HistoricalPrices";
import HistoycalNotebooks from "./Dashboard/HistoycalNotebooks";
import { getSummeryReport, getHistoricalReport } from "@/api/dashboardApi";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  // Fetch summary data
  const { 
    data: summaryData, 
    isLoading: summaryLoading, 
    error: summaryError 
  } = useQuery({
    queryKey: ["summeryReport"],
    queryFn: getSummeryReport,
  });
  // Fetch historical data
  const { 
    data: historicalData, 
    isLoading: historicalLoading, 
    error: historicalError 
  } = useQuery({
    queryKey: ["historicalReport"],
    queryFn: getHistoricalReport,
  });

  // Show loading if either request is loading
  if (summaryLoading || historicalLoading) return <div>Loading...</div>;
  
  // Show error if either request has an error
  if (summaryError) return <div>Error loading summary: {summaryError.message}</div>;
  if (historicalError) return <div>Error loading historical data: {historicalError.message}</div>;

  // Destructure the summary data when it's available
  const {
    dailyCommission,
    weeklyCommssion,
    totalContracts,
    completedContracts,
    uncompleteContracts,
    todayContracts,
  } = summaryData || {};

  // Destructure the historical data when it's available
  const {
    historicalCommissions,
    historicalContracts,
    historicalPrices,
  } = historicalData || {};

  return (
    <div className="mt-20 pl-10 pr-3">
      <div className="">
        <p className="font-bold mb-10">Dashboard</p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-5">
          {/* Card 1 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg p-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Daily Commission</p>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-xl font-bold">${dailyCommission}</p>
              {/* <p className="text-lg text-green-500">4.05%</p> */}
            </div>
          </div>

          {/* Card 2 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Weekly Commission</p>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-xl font-bold">${weeklyCommssion}</p>
              {/* <p className="text-lg text-green-500">4.05%</p> */}
            </div>
          </div>

          {/* Card 3 */}
          {/* <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Daily Notebook</p>
            <div className="mt-auto">
              <p className="text-xl font-bold">08</p>
            </div>
          </div> */}

          {/* Card 4 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Total Contracts</p>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-xl font-bold">{totalContracts}</p>
              {/* <p className="text-lg text-green-500">0.05%</p> */}
            </div>
          </div>

          {/* Card 5 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Completed Contracts</p>
            <div className="mt-auto">
              <p className="text-xl font-bold">{completedContracts}</p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Uncomplete Contracts</p>
            <div className="mt-auto">
              <p className="text-xl font-bold">{uncompleteContracts}</p>
            </div>
          </div>

          {/* Card 7 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Today Contracts</p>
            <div className="mt-auto">
              <p className="text-xl font-bold">{todayContracts}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 2xl:gap-10 gap-5 max-2xl:mt-10 mt-5 2xl:mt-40">
          <HistoricalDailyCommision data={historicalCommissions} />
          <HistoycalNotebooks data={historicalContracts} />
          <HistoricalPrices data={historicalPrices} />
          <ContractProgress />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;