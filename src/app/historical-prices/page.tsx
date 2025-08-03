/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import DeliveredBidsTable from "@/components/Dashboard/DeliverdBidsTable";
import PortZoneBidsTable from "@/components/Dashboard/PortZoneBidsTable";
import DateRangeModal from "@/components/DateRangeModal";
import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPortZoneBid,
  fetchPortZoneBids,
  updatePortZoneBid,
} from "@/api/portZoneApi";
import {
  createDeliveredBid,
  fetchDeliveredBids,
  updateDeliveredBid,
  type DeliveredBid, // Import the DeliveredBid type from API
} from "@/api/deliverdBidsApi";

// Backend schema types for Port Zone Bids
interface PortZoneBid {
  _id?: string;
  label:
    | "Outer Harbor"
    | "Port Lincoln"
    | "Port Giles"
    | "Wallaroo"
    | "Lucky Bay"
    | "Thevenard"
    | "Wallaroo Tports";
  season: string; // format: "24/25"
  date: string; // ISO date string
  APW1?: number | null;
  H1?: number | null;
  H2?: number | null;
  AUH2?: number | null;
  ASW1?: number | null;
  AGP1?: number | null;
  SFW1?: number | null;
  BAR1?: number | null;
  MA1?: number | null;
  CM1?: number | null;
  COMD?: number | null;
  CANS?: number | null;
  FIEV?: number | null;
  "NIP/HAL"?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

// Import the DeliveredBid type from your API file instead of defining it here
// Remove the local interface and use the imported one

// For Port Zone table display - combines static labels with fetched data
interface PortZoneTableRow {
  id: string;
  label: string;
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
  hasData: boolean; // to track if this row has existing data
  _id?: string; // for updates
}

// For Delivered Bids table display
interface DeliveredBidTableRow {
  id: string;
  location: string;
  january: number | null;
  february: number | null;
  march: number | null;
  april: number | null;
  may: number | null;
  june: number | null;
  july: number | null;
  august: number | null;
  september: number | null;
  october: number | null;
  november: number | null;
  december: number | null;
  hasData: boolean;
  _id?: string;
}

// Static data
const portZoneLabels = [
  "Outer Harbor",
  "Port Lincoln",
  "Port Giles",
  "Wallaroo",
  "Lucky Bay",
  "Thevenard",
  "Wallaroo Tports",
] as const;

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
] as const;

const deliveredBidsLocations = [
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

const monthFields = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

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

// Helper functions
// Season logic: A season runs from July 1st to June 30th of the following year
// For example:
// - Season 24/25 runs from July 1, 2024 to June 30, 2025
// - Season 25/26 runs from July 1, 2025 to June 30, 2026

const getSeasonFromDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12

  if (month >= 1 && month <= 6) {
    // January to June: we're in the season that started last July
    const startYear = year - 1;
    const endYear = year;
    return `${String(startYear).slice(-2)}/${String(endYear).slice(-2)}`;
  } else {
    // July to December: we're in the season that started this July
    const startYear = year;
    const endYear = year + 1;
    return `${String(startYear).slice(-2)}/${String(endYear).slice(-2)}`;
  }
};

const getFormattedDates = () => {
  if (typeof window === "undefined") {
    // Return empty array during SSR to avoid hydration mismatch
    return [];
  }

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
  if (typeof window === "undefined") {
    // Return empty array during SSR to avoid hydration mismatch
    return [];
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12

  // Determine the current season year based on the month
  let currentSeasonStartYear;
  if (currentMonth >= 1 && currentMonth <= 6) {
    // January to June: current season started last year
    currentSeasonStartYear = currentYear - 1;
  } else {
    // July to December: current season started this year
    currentSeasonStartYear = currentYear;
  }

  // Generate seasons: current season + 9 previous seasons (10 total)
  return Array.from({ length: 10 }, (_, i) => {
    const startYear = currentSeasonStartYear - i;
    const endYear = startYear + 1;
    return `${String(startYear).slice(-2)}/${String(endYear).slice(-2)}`;
  });
};

const getCurrentDateInputValue = () => {
  if (typeof window === "undefined") {
    // Return a static value during SSR
    return "";
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentSeason = () => {
  if (typeof window === "undefined") {
    // Return a static value during SSR
    return "";
  }

  return getSeasonFromDate(new Date());
};

const formatDateForFilename = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Create empty Port Zone table rows with static labels
const createEmptyPortZoneRows = (
  fetchedData: PortZoneBid[] = []
): PortZoneTableRow[] => {
  return portZoneLabels.map((label, index) => {
    // Find matching data for this label
    const existingData = fetchedData.find((bid) => bid.label === label);

    return {
      id: `pz-${index}`,
      label,
      APW1: existingData?.APW1 || null,
      H1: existingData?.H1 || null,
      H2: existingData?.H2 || null,
      AUH2: existingData?.AUH2 || null,
      ASW1: existingData?.ASW1 || null,
      AGP1: existingData?.AGP1 || null,
      SFW1: existingData?.SFW1 || null,
      BAR1: existingData?.BAR1 || null,
      MA1: existingData?.MA1 || null,
      CM1: existingData?.CM1 || null,
      COMD: existingData?.COMD || null,
      CANS: existingData?.CANS || null,
      FIEV: existingData?.FIEV || null,
      "NIP/HAL": existingData?.["NIP/HAL"] || null,
      hasData: !!existingData,
      _id: existingData?._id,
    };
  });
};

// Create empty Delivered Bids table rows with static locations
const createEmptyDeliveredBidsRows = (
  fetchedData: DeliveredBid[] = []
): DeliveredBidTableRow[] => {
  return deliveredBidsLocations.map((location, index) => {
    // Find matching data for this location
    // Handle both possible field names: label (new API) or location (old API)
    const existingData = fetchedData.find(
      (bid) =>
        (bid as any).label === location || (bid as any).location === location
    );

    // Handle both possible data structures
    const getMonthValue = (monthName: string) => {
      if (!existingData) return null;

      // Try monthlyValues structure first (new API format)
      if ((existingData as any).monthlyValues) {
        return (existingData as any).monthlyValues[monthName] || null;
      }

      // Fallback to direct property access (old API format)
      const lowercaseMonth = monthName.toLowerCase();
      return (existingData as any)[lowercaseMonth] || null;
    };

    return {
      id: `db-${index}`,
      location,
      january: getMonthValue("January"),
      february: getMonthValue("February"),
      march: getMonthValue("March"),
      april: getMonthValue("April"),
      may: getMonthValue("May"),
      june: getMonthValue("June"),
      july: getMonthValue("July"),
      august: getMonthValue("August"),
      september: getMonthValue("September"),
      october: getMonthValue("October"),
      november: getMonthValue("November"),
      december: getMonthValue("December"),
      hasData: !!existingData,
      _id: (existingData as any)?._id,
    };
  });
};

const HistoricalPricesPage = () => {
  const [activeTab, setActiveTab] = useState("historicalPrices");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [currentDateInputValue, setCurrentDateInputValue] = useState("");
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [exportDateRange, setExportDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  // Add state to track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false);

  const queryClient = useQueryClient();

  // Set mounted state to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize with current date and season only after mounting
  useEffect(() => {
    if (isMounted) {
      if (!selectedDate) {
        const currentDate = getCurrentDateInputValue();
        setSelectedDate(currentDate);
        setCurrentDateInputValue(currentDate);
      }
      if (!selectedSeason) {
        setSelectedSeason(getCurrentSeason());
      }
    }
  }, [isMounted, selectedDate, selectedSeason]);

  // Fetch port zone bids
  const {
    data: fetchedPortZoneBids = [],
    isLoading: isLoadingPortZoneBids,
    error: portZoneBidsError,
  } = useQuery({
    queryKey: ["portZoneBids", selectedDate, selectedSeason],
    queryFn: () => fetchPortZoneBids(selectedDate, selectedSeason),
    enabled: !!selectedDate && !!selectedSeason && isMounted,
  });

  // Fetch delivered bids
  const {
    data: fetchedDeliveredBids = [],
    isLoading: isLoadingDeliveredBids,
    error: deliveredBidsError,
  } = useQuery({
    queryKey: ["deliveredBids", selectedDate, selectedSeason],
    queryFn: () => fetchDeliveredBids(selectedDate, selectedSeason),
    enabled: !!selectedDate && !!selectedSeason && isMounted,
  });

  // Use useMemo to ensure data is recalculated when fetched data changes
  const portZoneTableData = useMemo(() => {
    return createEmptyPortZoneRows(fetchedPortZoneBids);
  }, [fetchedPortZoneBids]);

  const deliveredBidsTableData = useMemo(() => {
    return createEmptyDeliveredBidsRows(fetchedDeliveredBids);
  }, [fetchedDeliveredBids]);

  // Port Zone Bid Mutations
  const updatePortZoneBidMutation = useMutation({
    mutationFn: updatePortZoneBid,
    onSuccess: () => {
      toast.success("Port zone bid updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["portZoneBids", selectedDate, selectedSeason],
      });
    },
    onError: (error) => {
      toast.error("Failed to update port zone bid");
      console.error("Port zone update error:", error);
    },
  });

  const createPortZoneBidMutation = useMutation({
    mutationFn: createPortZoneBid,
    onSuccess: () => {
      toast.success("Port zone bid created successfully");
      queryClient.invalidateQueries({
        queryKey: ["portZoneBids", selectedDate, selectedSeason],
      });
    },
    onError: (error) => {
      toast.error("Failed to create port zone bid");
      console.error("Port zone create error:", error);
    },
  });

  // Delivered Bid Mutations
  const updateDeliveredBidMutation = useMutation({
    mutationFn: updateDeliveredBid,
    onSuccess: () => {
      toast.success("Delivered bid updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["deliveredBids", selectedDate, selectedSeason],
      });
    },
    onError: (error) => {
      toast.error("Failed to update delivered bid");
      console.error("Delivered bid update error:", error);
    },
  });

  const createDeliveredBidMutation = useMutation({
    mutationFn: createDeliveredBid,
    onSuccess: () => {
      toast.success("Delivered bid created successfully");
      queryClient.invalidateQueries({
        queryKey: ["deliveredBids", selectedDate, selectedSeason],
      });
    },
    onError: (error) => {
      toast.error("Failed to create delivered bid");
      console.error("Delivered bid create error:", error);
    },
  });

  // Handle Port Zone data changes
  const handlePortZoneDataChange = (
    updatedRow: PortZoneTableRow,
    grainType: string,
    value: number | null
  ) => {
    // Prepare the bid data for API call
    const bidData = {
      label: updatedRow.label as PortZoneBid["label"],
      date: selectedDate,
      season: selectedSeason,
      [grainType]: value,
    };

    if (updatedRow.hasData && updatedRow._id) {
      // Update existing bid
      updatePortZoneBidMutation.mutate({
        ...bidData,
        _id: updatedRow._id,
      });
    } else {
      // Create new bid
      createPortZoneBidMutation.mutate(bidData);
    }
  };

  // Handle Delivered Bids data changes
  const handleDeliveredBidsDataChange = (
    updatedRow: DeliveredBidTableRow,
    month: string,
    value: number | null
  ) => {
    // Convert month field names to match API format (capitalize first letter)
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    // Prepare the bid data for API call
    // Use the structure that matches your API expectations
    const bidData: any = {
      date: selectedDate,
      season: selectedSeason,
    };

    // Check if your API expects 'label' or 'location' field
    // Based on your data structure, it seems to use 'label'
    bidData.label = updatedRow.location;

    // Check if your API expects monthlyValues structure or direct properties
    // Based on your response, it uses monthlyValues
    bidData.monthlyValues = {
      [capitalizedMonth]: value,
    };

    if (updatedRow.hasData && updatedRow._id) {
      // Update existing delivered bid
      updateDeliveredBidMutation.mutate({
        ...bidData,
        _id: updatedRow._id,
      });
    } else {
      // Create new delivered bid
      createDeliveredBidMutation.mutate(bidData);
    }
  };

  const handleSavePortZones = (data: PortZoneTableRow[]) => {
    // This is handled automatically by individual cell updates
    toast.success("All port zone changes saved successfully");
  };

  const handleSaveDeliveredBids = (data: DeliveredBidTableRow[]) => {
    // This is handled automatically by individual cell updates
    toast.success("All delivered bid changes saved successfully");
  };

  const handleExportClick = () => {
    setShowDateRangeModal(true);
  };

  const handleDateRangeConfirm = (startDate: string, endDate: string) => {
    setExportDateRange({ start: startDate, end: endDate });

    const startFormatted = formatDateForFilename(startDate);
    const endFormatted = formatDateForFilename(endDate);
    const filename = `${
      activeTab === "historicalPrices" ? "port-zone-bids" : "delivered-bids"
    }-${startFormatted}-to-${endFormatted}.csv`;

    toast.success(`Exporting data from ${startFormatted} to ${endFormatted}`);

    console.log(`Exporting CSV: ${filename}`, {
      startDate,
      endDate,
      data:
        activeTab === "historicalPrices"
          ? portZoneTableData
          : deliveredBidsTableData,
      type: activeTab,
    });
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    setCurrentDateInputValue(newDate);

    // Auto-update season based on selected date
    if (newDate) {
      const selectedDateObj = new Date(newDate);
      const seasonForDate = getSeasonFromDate(selectedDateObj);
      setSelectedSeason(seasonForDate);
    }
  };

  const handleSeasonChange = (newSeason: string) => {
    setSelectedSeason(newSeason);
    setShowSeasonDropdown(false);
  };

  const tabButtonClass = "py-3 uppercase w-44 text-center relative";
  const tabTextClass = "font-medium";

  // Don't render the component until it's mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="mt-20">
        <div className="text-center mb-10">
          <p className="text-xl">Historical Daily Prices</p>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <Toaster />
      <div className="text-center mb-10">
        <p className="text-xl">Historical Daily Prices</p>
        {isMounted && (
          <p className="text-sm text-gray-600 mt-2">
            Current Season: {getCurrentSeason()} (July - June)
          </p>
        )}
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
            >
              Export CSV
            </button>

            {/* Date Input */}
            <div className="relative">
              <input
                type="date"
                value={currentDateInputValue}
                onChange={(e) => handleDateChange(e.target.value)}
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
                className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 min-w-[80px]"
                title="Season runs from July to June (e.g., 24/25 = July 2024 to June 2025)"
              >
                {selectedSeason || getCurrentSeason()}
                <RiArrowDropDownLine className={"text-2xl"} />
              </button>
              {showSeasonDropdown && (
                <div className="absolute right-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                  <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-200">
                    Season: July - June
                  </div>
                  {getFormattedSeasons().map((season, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${
                        season === getCurrentSeason()
                          ? "bg-blue-50 font-medium"
                          : ""
                      }`}
                      onClick={() => handleSeasonChange(season)}
                    >
                      {season}
                      {season === getCurrentSeason() && (
                        <span className="text-xs text-blue-600 ml-1">
                          (Current)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading and Error states for Port Zone Bids */}
        {isLoadingPortZoneBids && activeTab === "historicalPrices" && (
          <div className="text-center py-8">Loading port zone bids...</div>
        )}

        {portZoneBidsError && activeTab === "historicalPrices" && (
          <div className="text-center py-8 text-red-500">
            Error loading port zone bids: {(portZoneBidsError as Error).message}
          </div>
        )}

        {/* Loading and Error states for Delivered Bids */}
        {isLoadingDeliveredBids && activeTab === "deliveredBids" && (
          <div className="text-center py-8">Loading delivered bids...</div>
        )}

        {deliveredBidsError && activeTab === "deliveredBids" && (
          <div className="text-center py-8 text-red-500">
            Error loading delivered bids:{" "}
            {(deliveredBidsError as Error).message}
          </div>
        )}

        {/* Render appropriate table based on active tab */}
        {activeTab === "historicalPrices" ? (
          <PortZoneBidsTable
            data={portZoneTableData}
            onDataChange={handlePortZoneDataChange}
            onSave={handleSavePortZones}
            isLoading={
              isLoadingPortZoneBids ||
              updatePortZoneBidMutation.isPending ||
              createPortZoneBidMutation.isPending
            }
          />
        ) : (
          <DeliveredBidsTable
            data={deliveredBidsTableData}
            onDataChange={handleDeliveredBidsDataChange}
            onSave={handleSaveDeliveredBids}
            isLoading={
              isLoadingDeliveredBids ||
              updateDeliveredBidMutation.isPending ||
              createDeliveredBidMutation.isPending
            }
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
