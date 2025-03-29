"use client"
import ContractProgress from "./Dashboard/ContractProgress";
import HistoricalPrices from "./Dashboard/HistoricalPrices";
import HistoycalNotebooks from "./Dashboard/HistoycalNotebooks";

const Dashboard = () => {
  return (
    <div className="mt-20 px-10">
      <div className="2xl:pb-10">
        <p className="font-bold mb-10">Dashboard</p>
        <div className="grid-cols-1 grid md:grid-cols-3 2xl:grid-cols-6 lg:grid-cols-3 2xl:gap-10 gap-5">
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-5 py-7">
            <p className="text-base mb-5">Daily Prices</p>
            <div className="flex items-center gap-10">
              <p className="text-xl font-bold">$1208</p>
              <p className="text-lg text-green-500">4.05%</p>
            </div>
          </div>
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-10 py-7">
            <p className="text-base mb-5">Daily Notebook</p>
            <div className="">
              <p className="text-xl font-bold">08</p>
            </div>
          </div>
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-10 py-7">
            <p className="text-base mb-5">Total Contracts</p>
            <div className="flex items-center gap-10">
              <p className="text-xl font-bold">32</p>
              <p className="text-lg text-green-500">0.05%</p>
            </div>
          </div>
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-5 py-7">
            <p className="text-base mb-5">Completed Contracts</p>
            <div className="">
              <p className="text-xl font-bold">10</p>
            </div>
          </div>
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-5 py-7">
            <p className="text-base mb-5">Uncomplete Contracts</p>
            <div className="">
              <p className="text-xl font-bold">22</p>
            </div>
          </div>
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-10 py-7">
            <p className="text-base mb-5">Today Contracts</p>
            <div className="">
              <p className="text-xl font-bold">7</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row 2xl:gap-20 gap-5 2xl:mt-20 mt-5">
          <HistoricalPrices />
          <HistoycalNotebooks />
          <ContractProgress/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
