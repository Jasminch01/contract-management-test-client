"use client";
import ContractProgress from "./Dashboard/ContractProgress";
import HistoricalDailyCommision from "./Dashboard/HistoricalDailyCommision";
import HistoricalPrices from "./Dashboard/HistoricalPrices";
import HistoycalNotebooks from "./Dashboard/HistoycalNotebooks";

const Dashboard = () => {
  return (
    <div className="mt-20 pl-10 pr-3">
      <div className="2xl:pb-10">
        <p className="font-bold mb-10">Dashboard</p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7 gap-3 2xl:gap-10">
          {/* Card 1 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg p-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Daily Commission</p>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-xl font-bold">$1208</p>
              <p className="text-lg text-green-500">4.05%</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Weekly Commission</p>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-xl font-bold">$120800</p>
              <p className="text-lg text-green-500">4.05%</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Daily Notebook</p>
            <div className="mt-auto">
              <p className="text-xl font-bold">08</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Total Contracts</p>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-xl font-bold">32</p>
              <p className="text-lg text-green-500">0.05%</p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Completed Contracts</p>
            <div className="mt-auto">
              <p className="text-xl font-bold">10</p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Uncomplete Contracts</p>
            <div className="mt-auto">
              <p className="text-xl font-bold">22</p>
            </div>
          </div>

          {/* Card 7 */}
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-2 py-4 flex flex-col h-full">
            <p className="text-base mb-5">Today Contracts</p>
            <div className="mt-auto">
              <p className="text-xl font-bold">7</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 2xl:gap-10 gap-5 2xl:mt-20 mt-5">
          <HistoricalDailyCommision />
          <HistoycalNotebooks />
          <HistoricalPrices />
          <ContractProgress />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
