/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import DeliveredBidsTable from "@/components/Dashboard/DeliverdBidsTable";
import PortZoneBidsTable from "@/components/Dashboard/PortZoneBidsTable";
import DateRangeModal from "@/components/DateRangeModal";
import React from "react";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { RiArrowDropDownLine } from "react-icons/ri";

// Types from original file
interface PortZone {
  port: string;
}

interface DeliverdBid {
  location: string;
}

// For Port Zone Bids (previously HistoricalPrice)
interface PortZoneBids {
  id: string;
  portZones: PortZone[];
  [key: string]: string | PortZone[];
}

// For Delivered Bids
interface DeliverdBids {
  id: string;
  locations: DeliverdBid[];
  [key: string]: string | DeliverdBid[];
}

// Sample data
const portzones = [
  "Outer Harbor",
  "Port Lincoln",
  "Port Giles",
  "Wallaroo",
  "Lucky Bay",
  "Thevenard",
  "Wallaroo Tports",
];

const grainTypes = [
  "apw1",
  "h1",
  "h2",
  "auh2",
  "asw1",
  "agp1",
  "sfw1",
  "bar1",
  "ma1",
  "cm1",
  "comd",
  "cans",
  "cang",
  "fiev",
  "nip/hal",
];

const deliveredBids = [
  "Delivered Murray Bridge BAR1",
  "Delivered Murray Bridge Canola",
  "Delivered Waslays SFW1",
  "Delivered Waslays Bar1",
  "Delivered Waslaysd Canola",
  "Delivered Laucke Davesyton SFW1",
  "Delivered Laucke Davesyton BAR1",
  "Delivered Laucke Davesyton Canola",
  "Delivered Southern Cross Feedlot SFW1",
  "Delivered Dublin NIP/HAL",
  "Delivered Dublin Canola",
  "Delivered Sempahore Containers NIP/HAL1",
  "Delivered Sempahore Containers APW1",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

const getCurrentDateInputValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateForFilename = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const HistoricalPricesPage = () => {
  const [activeTab, setActiveTab] = useState("historicalPrices");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [portZoneData, setPortZoneData] = useState<PortZoneBids[]>([]);
  const [deliveredBidsData, setDeliveredBidsData] = useState<DeliverdBids[]>(
    []
  );
  const [hasDataToExport, setHasDataToExport] = useState(false);
  const [currentDateInputValue, setCurrentDateInputValue] = useState(
    getCurrentDateInputValue()
  );
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [exportDateRange, setExportDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  // Initialize data
  useEffect(() => {
    // Initialize Port Zone Data
    const initialPortZoneData = portzones.map((port, index) => ({
      id: `hp-${index}`,
      portZones: [{ port }],
      ...grainTypes.reduce((acc, grain) => ({ ...acc, [grain]: "" }), {}),
    }));
    setPortZoneData(initialPortZoneData);

    // Initialize Delivered Bids Data
    const initialDeliveredBidsData = deliveredBids.map((location, index) => ({
      id: `db-${index}`,
      locations: [{ location }],
      ...months.reduce(
        (acc, month) => ({ ...acc, [month.toLowerCase()]: "" }),
        {}
      ),
    }));
    setDeliveredBidsData(initialDeliveredBidsData);
  }, []);

  // Check if there is data to export
  useEffect(() => {
    const currentData =
      activeTab === "historicalPrices" ? portZoneData : deliveredBidsData;
    const keysToCheck =
      activeTab === "historicalPrices"
        ? grainTypes
        : months.map((m) => m.toLowerCase());

    // Check if any data exists
    const hasData = currentData.some((row) => {
      return keysToCheck.some((key) => {
        return (
          typeof row[key] === "string" && (row[key] as string).trim() !== ""
        );
      });
    });

    setHasDataToExport(hasData);
  }, [activeTab, portZoneData, deliveredBidsData]);

  const handleSavePortZones = (data: PortZoneBids[]) => {
    setPortZoneData(data);
    toast.success("Port zone prices saved successfully");
    console.log("Saved port zone prices:", data);
  };

  const handleSaveDeliveredBids = (data: DeliverdBids[]) => {
    setDeliveredBidsData(data);
    toast.success("Delivered bids saved successfully");
    console.log("Saved delivered bids:", data);
  };

  const handlePortZoneDataChange = (data: PortZoneBids[]) => {
    setPortZoneData(data);
  };

  const handleDeliveredBidsDataChange = (data: DeliverdBids[]) => {
    setDeliveredBidsData(data);
  };

  const handleExportClick = () => {
    setShowDateRangeModal(true);
  };

  const handleDateRangeConfirm = (startDate: string, endDate: string) => {
    setExportDateRange({ start: startDate, end: endDate });

    // Generate filename with date range
    const startFormatted = formatDateForFilename(startDate);
    const endFormatted = formatDateForFilename(endDate);
    const filename = `${
      activeTab === "historicalPrices" ? "port-zone-bids" : "delivered-bids"
    }-${startFormatted}-to-${endFormatted}.csv`;

    // Show confirmation toast
    toast.success(`Exporting data from ${startFormatted} to ${endFormatted}`);

    // Here you would trigger the actual CSV export
    // For now, we'll just log the export details
    console.log(`Exporting CSV: ${filename}`, {
      startDate,
      endDate,
      data: activeTab === "historicalPrices" ? portZoneData : deliveredBidsData,
      type: activeTab,
    });
  };

  const tabButtonClass = "py-3 uppercase w-44 text-center relative";
  const tabTextClass = "font-medium";

  return (
    <div className="mt-20">
      <Toaster />
      <div className="text-center mb-10">
        <p className="text-xl">Historical Daily Prices</p>
      </div>

      <div className="">
        <div className="flex flex-col xl:flex-row justify-between border-gray-200">
          <div className="flex gap-x-10">
            <button
              className={tabButtonClass}
              onClick={() => setActiveTab("historicalPrices")}
            >
              <span className={tabTextClass}>Port Zone Bids</span>
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
            {/* Export CSV Button - Now opens date range modal */}
            <button
              onClick={handleExportClick}
              className="px-2 py-1 bg-white border-gray-300 border rounded-md hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Export CSV
            </button>

            {/* Date Input */}
            <div className="relative">
              <input
                type="date"
                value={currentDateInputValue}
                onChange={(e) => setCurrentDateInputValue(e.target.value)}
                className="px-2 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              />
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
          </div>
        </div>

        {activeTab === "historicalPrices" ? (
          <PortZoneBidsTable
            data={portZoneData}
            onDataChange={handlePortZoneDataChange}
            onSave={handleSavePortZones}
          />
        ) : (
          <DeliveredBidsTable
            data={deliveredBidsData}
            onDataChange={handleDeliveredBidsDataChange}
            onSave={handleSaveDeliveredBids}
          />
        )}
      </div>

      {/* Date Range Modal */}
      <DateRangeModal
        isOpen={showDateRangeModal}
        onClose={() => setShowDateRangeModal(false)}
        onConfirm={handleDateRangeConfirm}
      />
    </div>
  );
};

export default HistoricalPricesPage;
