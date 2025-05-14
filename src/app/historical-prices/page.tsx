"use client";
import DeliveredBidsTable from "@/components/Dashboard/DeliverdBidsTable";
import PortZoneBidsTable from "@/components/Dashboard/PortZoneBidsTable";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { RiArrowDropDownLine } from "react-icons/ri";

interface PortZone {
  port: string;
}

interface HistoricalPrice {
  id: string;
  portZones: PortZone[];
  [key: string]: string | PortZone[]; // Allow dynamic properties for grain types
}
interface DeliveredBid {
  id: string;
  location: string;
  [key: string]: string;
}

const getFormattedDates = () => {
  const today = new Date();
  return Array.from({ length: 10 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const day = date.getDate();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  });
};

const getFormattedSeasons = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => {
    const startYear = currentYear - i - 1;
    const endYear = startYear + 1;
    return `${String(startYear).slice(-2)}/${String(endYear).slice(-2)}`;
  });
};

const HistoricalPricesPage = () => {
  const [activeTab, setActiveTab] = useState("historicalPrices");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");

  const handleSavePortZones = (data: HistoricalPrice[]) => {
    toast.success("Historical prices saved successfully");
    console.log("Saved historical prices:", data);
  };

  const handleSaveDeliveredBids = (data: DeliveredBid[]) => {
    toast.success("Delivered bids saved successfully");
    console.log("Saved delivered bids:", data);
  };

  const tabButtonClass = "py-3 uppercase w-44 text-center relative";
  const tabTextClass = "font-medium";

  return (
    <div className="mt-20">
      <Toaster />
      <div className="text-center mb-10">
        <p className="text-xl">Historical Daily Prices</p>
      </div>

      <div className="mt-3">
        <div className="flex flex-col xl:flex-row justify-between border-b-2 border-gray-200 pl-4">
          <div className="flex gap-x-10">
            <button
              className={tabButtonClass}
              onClick={() => setActiveTab("historicalPrices")}
            >
              <span className={tabTextClass}>Historical Prices</span>
              {activeTab === "historicalPrices" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#108A2B]"></div>
              )}
            </button>
            <button
              className={tabButtonClass}
              onClick={() => setActiveTab("deliveredBids")}
            >
              <span className={tabTextClass}>Delivered Bids</span>
              {activeTab === "deliveredBids" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#108A2B]"></div>
              )}
            </button>
          </div>

          <div className="flex gap-4 items-center pr-5 my-5">
            <button className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
              Export as CSV
            </button>

            {/* Date Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDateDropdown(!showDateDropdown);
                  setShowSeasonDropdown(false);
                }}
                className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              >
                {selectedDate || getFormattedDates()[0]}
                <RiArrowDropDownLine className={"text-2xl"} />
              </button>
              {showDateDropdown && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {getFormattedDates().map((date, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setSelectedDate(date);
                        setShowDateDropdown(false);
                      }}
                    >
                      {date}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Season Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSeasonDropdown(!showSeasonDropdown);
                  setShowDateDropdown(false);
                }}
                className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              >
                {selectedSeason || getFormattedSeasons()[0]}
                <RiArrowDropDownLine className={"text-2xl"} />
              </button>
              {showSeasonDropdown && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {getFormattedSeasons().map((season, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setSelectedSeason(season);
                        setShowSeasonDropdown(false);
                      }}
                    >
                      {season}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sort by Button */}
            <button className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
              Sort by
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4 mt-4">
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold text-gray-800">
              {activeTab === "historicalPrices"
                ? "Historical Prices"
                : "Delivered Bids"}
            </h2>
          </div>
        </div>

        {/* Render the active table based on tab selection */}
        {activeTab === "historicalPrices" ? (
          <PortZoneBidsTable onSave={handleSavePortZones} />
        ) : (
          <DeliveredBidsTable onSave={handleSaveDeliveredBids} />
        )}
      </div>
    </div>
  );
};

export default HistoricalPricesPage;
