import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { fetchPortZoneBids } from "@/api/portZoneApi";
import { DeliveredBid, fetchDeliveredBids } from "@/api/deliverdBidsApi";

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
  activeTab: "historicalPrices" | "deliveredBids"; // Pass the active tab from parent
}

const getCurrentDateInputValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to get season from date
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

// Helper function to get all dates in range
const getDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  while (start <= end) {
    const year = start.getFullYear();
    const month = String(start.getMonth() + 1).padStart(2, "0");
    const day = String(start.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
    start.setDate(start.getDate() + 1);
  }

  return dates;
};

// Helper function to get unique seasons in date range
const getSeasonsInRange = (startDate: string, endDate: string): string[] => {
  const dates = getDateRange(startDate, endDate);
  const seasons = new Set<string>();

  dates.forEach((dateStr) => {
    const date = new Date(dateStr);
    const season = getSeasonFromDate(date);
    seasons.add(season);
  });

  return Array.from(seasons);
};

// CSV export functions
const exportPortZoneDataToCSV = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[],
  startDate: string,
  endDate: string
) => {
  if (!data || data.length === 0) {
    toast.error("No Port Zone data found for the selected date range");
    return;
  }

  // Group data by date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedByDate: { [key: string]: any[] } = {};
  data.forEach((item) => {
    const dateKey = item.date;
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(item);
  });

  // Create CSV headers
  const headers = [
    "Date",
    "Season",
    "Location",
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

  // Create CSV rows
  const rows: string[] = [headers.join(",")];

  Object.keys(groupedByDate)
    .sort()
    .forEach((date) => {
      groupedByDate[date].forEach((item) => {
        const row = [
          item.date,
          item.season || "",
          item.label || "",
          item.APW1 || "",
          item.H1 || "",
          item.H2 || "",
          item.AUH2 || "",
          item.ASW1 || "",
          item.AGP1 || "",
          item.SFW1 || "",
          item.BAR1 || "",
          item.MA1 || "",
          item.CM1 || "",
          item.COMD || "",
          item.CANS || "",
          item.FIEV || "",
          item["NIP/HAL"] || "",
        ];
        rows.push(row.join(","));
      });
    });

  // Download CSV
  const csvContent = rows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `port-zone-bids-${startDate}-to-${endDate}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  toast.success(
    `Port Zone data exported successfully (${data.length} records)`
  );
};

const exportDeliveredBidsToCSV = (
  data: any[],
  startDate: string,
  endDate: string
) => {
  // console.log("Data for CSV export:", data); // Log the data array
  if (!data || data.length === 0) {
    toast.error("No Delivered Bids data found for the selected date range");
    return;
  }

  // Group data by date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedByDate: { [key: string]: any[] } = {};
  data.forEach((item) => {
    const dateKey = item.date;
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(item);
  });

  // Create CSV headers
  const headers = [
    "Date",
    "Season",
    "Location",
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

  // Create CSV rows
  const rows: string[] = [headers.join(",")];

  Object.keys(groupedByDate)
    .sort()
    .forEach((date) => {
      groupedByDate[date].forEach((item) => {
        const row = [
          item.date,
          item.season || "",
          item.location || "",
          String(item.january ?? ""), // Explicitly convert to string
          String(item.february ?? ""),
          String(item.march ?? ""),
          String(item.april ?? ""),
          String(item.may ?? ""),
          String(item.june ?? ""),
          String(item.july ?? ""),
          String(item.august ?? ""),
          String(item.september ?? ""),
          String(item.october ?? ""),
          String(item.november ?? ""),
          String(item.december ?? ""),
        ];
        console.log("Row data:", row); // Log each row data
        rows.push(row.join(","));
      });
    });

  // Download CSV
  const csvContent = rows.join("\n");
  // console.log("CSV content:", csvContent); // Log the final CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `delivered-bids-${startDate}-to-${endDate}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  toast.success(
    `Delivered Bids data exported successfully (${data.length} records)`
  );
};

const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  activeTab,
}) => {
  const [startDate, setStartDate] = useState(getCurrentDateInputValue());
  const [endDate, setEndDate] = useState(getCurrentDateInputValue());
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setIsExporting(true);

    try {
      // Get all dates in the range
      const datesInRange = getDateRange(startDate, endDate);
      const seasonsInRange = getSeasonsInRange(startDate, endDate);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let allData: any[] = [];

      // Progress tracking
      let completedRequests = 0;
      const totalRequests = datesInRange.length * seasonsInRange.length;

      toast.loading(`Fetching data... (0/${totalRequests})`, {
        id: "export-progress",
      });

      // Fetch data for each date and season combination
      for (const date of datesInRange) {
        for (const season of seasonsInRange) {
          try {
            let data;
            if (activeTab === "historicalPrices") {
              data = await fetchPortZoneBids(date, season);
            } else {
              data = await fetchDeliveredBids(date, season);
            }

            if (data && data.length > 0) {
              allData = [...allData, ...data];
            }
          } catch (error) {
            console.warn(
              `Failed to fetch data for ${date} - ${season}:`,
              error
            );
          }

          completedRequests++;
          toast.loading(
            `Fetching data... (${completedRequests}/${totalRequests})`,
            {
              id: "export-progress",
            }
          );
        }
      }

      toast.dismiss("export-progress");

      // Remove duplicates based on _id
      const uniqueData = allData.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t._id === item._id)
      );

      // Debug unique 
      console.log("Unique data for export: ", uniqueData);

      if (uniqueData.length === 0) {
        toast.error(
          `No data found for the selected date range (${startDate} to ${endDate})`
        );
        setIsExporting(false);
        return;
      }

      // Export to CSV
      if (activeTab === "historicalPrices") {
        exportPortZoneDataToCSV(uniqueData, startDate, endDate);
      } else {
        exportDeliveredBidsToCSV(uniqueData, startDate, endDate);
      }

      // Close modal and call parent onConfirm
      onConfirm(startDate, endDate);
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
      toast.dismiss("export-progress");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 max-w-[90vw]">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Select Date Range for Export
        </h3>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Export Type:</strong>{" "}
            {activeTab === "historicalPrices"
              ? "Port Zone Bids"
              : "Delivered Bids"}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Data will be fetched for all dates and seasons within the selected
            range.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isExporting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isExporting}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-2 bg-[#2A5D36] hover:bg-[#1e4728] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeModal;
