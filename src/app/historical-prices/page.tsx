/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import DeliveredBidsTable from "@/components/Dashboard/DeliverdBidsTable";
import PortZoneBidsTable from "@/components/Dashboard/PortZoneBidsTable";
import DateRangeModal from "@/components/DateRangeModal";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { RiArrowDropDownLine } from "react-icons/ri";

// Types
interface DeliveredBid {
  location: string;
}

// Port Zone Bid type - matching backend schema
export interface PortZoneBid {
  _id?: string; // MongoDB _id mapped to this
  label:
    | "Outer Harbor"
    | "Port Lincoln"
    | "Port Giles"
    | "Wallaroo"
    | "Lucky Bay"
    | "Thevenard"
    | "Wallaroo Tports";
  season: string;
  date: string; // Adding date field

  // Bid types - matching backend schema exactly
  APW1: number | null;
  H1: number | null;
  H2: number | null;
  AUH2: number | null;
  ASW1: number | null;
  AGP1: number | null;
  SFW1: number | null;
  BAR1: number | null;
  MA1: number | null;
  CM1: number | null;
  COMD: number | null;
  CANS: number | null;
  FIEV: number | null;
  "NIP/HAL": number | null;

  // Timestamps (handled by MongoDB)
  createdAt?: Date;
  updatedAt?: Date;
}

// For display in the table - simplified for form usage
interface PortZoneBidsDisplay {
  id: string;
  label: string;
  [key: string]: string | number; // grain type prices as strings for form input
}

// For Delivered Bids (keeping original structure)
interface DeliveredBids {
  id: string;
  locations: DeliveredBid[];
  [key: string]: string | DeliveredBid[];
}

// Sample data
const portzones: PortZoneBid["label"][] = [
  "Outer Harbor",
  "Port Lincoln",
  "Port Giles",
  "Wallaroo",
  "Lucky Bay",
  "Thevenard",
  "Wallaroo Tports",
];

const grainTypes = [
  "APW1",
  "H1",
  "H2",
  "AUH2",
  "ASW1",
  "AGP1",
  "SFW1",
  "BAR1",
  "MA1",
  "CM1",
  "COMD",
  "CANS",
  "FIEV",
  "NIP/HAL",
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

// Convert date input to display format
const formatDateForDisplay = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const HistoricalPricesPage = () => {
  const [activeTab, setActiveTab] = useState("historicalPrices");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(
    getFormattedSeasons()[0]
  );
  const [portZoneData, setPortZoneData] = useState<PortZoneBidsDisplay[]>([]);
  const [deliveredBidsData, setDeliveredBidsData] = useState<DeliveredBids[]>(
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
  const [loading, setLoading] = useState(false);

  // Create empty form structure for port zones
  const createEmptyPortZoneForm = (): PortZoneBidsDisplay[] => {
    return portzones.map((port, index) => ({
      id: `hp-${index}`,
      label: port,
      ...grainTypes.reduce((acc, grain) => ({ ...acc, [grain]: "" }), {}),
    }));
  };

  // Convert PortZoneBid to display format
  const convertToDisplayFormat = (
    backendData: PortZoneBid[]
  ): PortZoneBidsDisplay[] => {
    const currentDate = formatDateForDisplay(currentDateInputValue);

    return portzones.map((port, index) => {
      const portBid = backendData.find(
        (bid) =>
          bid.label === port &&
          bid.date === currentDate &&
          bid.season === selectedSeason
      );

      const displayRow: PortZoneBidsDisplay = {
        id: portBid?._id || `hp-${index}`,
        label: port,
      };

      // Convert each grain type from backend format
      grainTypes.forEach((grain) => {
        const value = portBid?.[grain as keyof PortZoneBid];
        displayRow[grain] =
          value !== null && value !== undefined ? value.toString() : "";
      });

      return displayRow;
    });
  };

  // Convert display format to PortZoneBid for backend
  const convertToBackendFormat = (
    displayData: PortZoneBidsDisplay[],
    date: string,
    season: string
  ): PortZoneBid[] => {
    return displayData.map((row) => {
      const backendRow: PortZoneBid = {
        _id: row.id.startsWith("hp-") ? undefined : row.id, // Only include _id if it's from MongoDB
        label: row.label as PortZoneBid["label"],
        date,
        season,
        APW1: null,
        H1: null,
        H2: null,
        AUH2: null,
        ASW1: null,
        AGP1: null,
        SFW1: null,
        BAR1: null,
        MA1: null,
        CM1: null,
        COMD: null,
        CANS: null,
        FIEV: null,
        "NIP/HAL": null,
      };

      // Convert each grain type to number or null
      grainTypes.forEach((grain) => {
        const value = row[grain];
        if (typeof value === "string" && value.trim() !== "") {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (backendRow as any)[grain] = numValue;
          }
        }
      });

      return backendRow;
    });
  };

  // Initialize empty delivered bids data
  const initializeEmptyDeliveredBidsData = (): DeliveredBids[] => {
    const emptyData = deliveredBids.map((location, index) => ({
      id: `db-${index}`,
      locations: [{ location }],
      ...months.reduce(
        (acc, month) => ({ ...acc, [month.toLowerCase()]: "" }),
        {}
      ),
    }));
    return emptyData;
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchPortZoneData()
    setPortZoneData(createEmptyPortZoneForm());
    setDeliveredBidsData(initializeEmptyDeliveredBidsData());
    // Load all data from API on component mount
    // loadAllPortZoneData();
  }, []);

  // Load all port zone data from API
  // const loadAllPortZoneData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8000/api/portZone-bids"
  //     );
  //     console.log("all data ", response.data);
  //   } catch (error) {
  //     console.error("Error loading all port zone data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Update display data when date or season changes
  useEffect(() => {
    const currentDate = formatDateForDisplay(currentDateInputValue);
  }, [currentDateInputValue, selectedSeason]);

  // API Functions
  const fetchPortZoneData = async () => {
    // If not found locally, fetch from API
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/portZone-bids`
      );
      setPortZoneData(response.data)
    } catch (error) {
      console.error("Error fetching port zone data:", error);
      setPortZoneData(createEmptyPortZoneForm());
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const savePortZoneData = async (data: PortZoneBidsDisplay) => {
    const currentDate = formatDateForDisplay(currentDateInputValue);
    const backendData = convertToBackendFormat(
      data,
      currentDate,
      selectedSeason
    );
    console.log(backendData);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/portZone-bids",
        backendData
      );
      console.log(response.data);
      if (response) {
        toast.success("Port zone prices saved successfully");
        // console.log("Saved port zone prices:", savedData);
      } else {
        toast.error("Failed to save port zone prices");
      }
    } catch (error) {
      console.error("Error saving port zone data:", error);
      toast.error("Failed to save port zone prices");
    } finally {
      setLoading(false);
    }
  };

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
        const value = row[key];
        return typeof value === "string" && value.trim() !== "";
      });
    });

    setHasDataToExport(hasData);
  }, [activeTab, portZoneData, deliveredBidsData]);

  const handleSavePortZones = (data: PortZoneBidsDisplay[]) => {
    setPortZoneData(data);
    savePortZoneData(data);
  };

  const handleSaveDeliveredBids = (data: DeliveredBids[]) => {
    setDeliveredBidsData(data);
    toast.success("Delivered bids saved successfully");
    console.log("Saved delivered bids:", data);
  };

  const handlePortZoneDataChange = (data: PortZoneBidsDisplay[]) => {
    setPortZoneData(data);
  };

  const handleDeliveredBidsDataChange = (data: DeliveredBids[]) => {
    setDeliveredBidsData(data);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDateInputValue(e.target.value);
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    setShowSeasonDropdown(false);
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
            {/* Export CSV Button */}
            <button
              onClick={handleExportClick}
              className="px-2 py-1 bg-white border-gray-300 border rounded-md hover:bg-gray-50 transition-colors font-medium text-gray-700"
              disabled={!hasDataToExport}
            >
              Export CSV
            </button>

            {/* Date Input */}
            <div className="relative">
              <input
                type="date"
                value={currentDateInputValue}
                onChange={handleDateChange}
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
                {selectedSeason}
                <RiArrowDropDownLine className={"text-2xl"} />
              </button>
              {showSeasonDropdown && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {getFormattedSeasons().map((season, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSeasonChange(season)}
                    >
                      {season}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <p>Loading...</p>
          </div>
        )}

        {activeTab === "historicalPrices" ? (
          <PortZoneBidsTable
            data={portZoneData}
            onDataChange={handlePortZoneDataChange}
            onSave={handleSavePortZones}
            loading={loading}
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
