"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
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

const HistoricalPricesColumns = (
  handleCellEdit: (rowId: string, columnKey: string, value: string) => void
) => [
  {
    name: "Port Zone Bids",
    selector: (row: HistoricalPrice) =>
      row.portZones.map((zone) => zone.port).join(", "),
    sortable: true,
    cell: (row: HistoricalPrice) => (
      <div className="w-full h-full flex items-center px-5">
        {row.portZones.map((zone) => zone.port).join(", ")}
      </div>
    ),
  },
  ...grainTypes.map((grain) => ({
    name: grain.toUpperCase(),
    cell: (row: HistoricalPrice) => {
      const [isEditing, setIsEditing] = useState(false);
      const [value, setValue] = useState((row[grain] as string) || "");

      const handleBlur = () => {
        setIsEditing(false);
        handleCellEdit(row.id, grain, value);
      };

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleBlur();
      };

      return isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full h-full p-2 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="w-full h-full p-2 hover:bg-gray-100 cursor-pointer"
        >
          {value}
        </div>
      );
    },
  })),
];

const DeliveredBidsColumns = (
  handleCellEdit: (rowId: string, columnKey: string, value: string) => void
) => [
  {
    name: "Port Zone",
    selector: (row: HistoricalPrice) =>
      row.portZones.map((zone) => zone.port).join(", "),
    sortable: true,
    cell: (row: HistoricalPrice) => (
      <div className="w-full h-full flex items-center px-5">
        {row.portZones.map((zone) => zone.port).join(", ")}
      </div>
    ),
  },
  ...months.map((month) => {
    const monthKey = month.toLowerCase();
    return {
      name: month,
      cell: (row: HistoricalPrice) => {
        const [isEditing, setIsEditing] = useState(false);
        const [value, setValue] = useState((row[monthKey] as string) || "");

        const handleBlur = () => {
          setIsEditing(false);
          handleCellEdit(row.id, monthKey, value);
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === "Enter") handleBlur();
        };

        return isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full h-full p-2 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="w-full h-full p-2 hover:bg-gray-100 cursor-pointer"
          >
            {value}
          </div>
        );
      },
    };
  }),
];

const customStyles = {
  headRow: {
    style: {
      borderBottom: "1px solid #ddd",
    },
  },
  headCells: {
    style: {
      borderRight: "",
      fontWeight: "bold",
      color: "gray",
    },
  },
  cells: {
    style: {
      borderRight: "1px solid #ddd",
      padding: "0",
    },
  },
  rows: {
    style: {
      "&:hover": {
        backgroundColor: "#E8F2FF",
      },
    },
  },
};

const HistoricalPricesPage = () => {
  const [data, setData] = useState<HistoricalPrice[]>([]);
  const [deliveredBidsData, setDeliveredBidsData] = useState<HistoricalPrice[]>(
    []
  );
  const [activeTab, setActiveTab] = useState("historicalPrices");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    const initialHistoricalPrices = portzones.map((port, index) => ({
      id: `hp-${index}`,
      portZones: [{ port }],
      ...grainTypes.reduce((acc, grain) => ({ ...acc, [grain]: "" }), {}),
    }));

    const initialDeliveredBids = portzones.map((port, index) => ({
      id: `db-${index}`,
      portZones: [{ port }],
      ...months.reduce(
        (acc, month) => ({ ...acc, [month.toLowerCase()]: "" }),
        {}
      ),
    }));

    setData(initialHistoricalPrices);
    setDeliveredBidsData(initialDeliveredBids);
  }, []);

  const handleCellEdit = (rowId: string, columnKey: string, value: string) => {
    if (activeTab === "historicalPrices") {
      setData(
        data.map((item) =>
          item.id === rowId ? { ...item, [columnKey]: value } : item
        )
      );
    } else {
      setDeliveredBidsData(
        deliveredBidsData.map((item) =>
          item.id === rowId ? { ...item, [columnKey]: value } : item
        )
      );
    }
  };

  const handleSaveChanges = () => {
    // In a real app, you would send the data to your API here
    if (activeTab === "historicalPrices") {
      toast.success("Historical prices saved successfully");
      console.log("Saved historical prices:", data);
    } else {
      toast.success("Delivered bids saved successfully");
      console.log("Saved delivered bids:", deliveredBidsData);
    }
  };

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

  // Generate season list like 23/24, 22/23, ...
  const getFormattedSeasons = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => {
      const startYear = currentYear - i - 1;
      const endYear = startYear + 1;
      return `${String(startYear).slice(-2)}/${String(endYear).slice(-2)}`;
    });
  };

  return (
    <div className="mt-20">
      <Toaster />
      <div className="text-center mb-10">
        <p className="text-xl">Historical Daily Prices</p>
      </div>

      <div className="mt-3">
        <div className="flex justify-between border-b-2 border-gray-200 pl-4">
          <div className="flex gap-x-10">
            <button
              className={`py-3 uppercase font-medium ${
                activeTab === "historicalPrices"
                  ? "font-bold border-b-2 border-[#108A2B]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("historicalPrices")}
            >
              Historical Prices
            </button>
            <button
              className={`py-3 uppercase font-medium ${
                activeTab === "deliveredBids"
                  ? "font-bold border-b-2 border-[#108A2B]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("deliveredBids")}
            >
              Delivered Bids
            </button>
          </div>

          <div className="flex gap-4 items-center pr-5">
            <button className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
              Export as CSV
            </button>
            {/* Date Dropdown */}
            <div className="">
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
                <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
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
            <div className="">
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
                <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
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

        <div className="overflow-auto rounded-lg border border-gray-200">
          {activeTab === "historicalPrices" ? (
            <DataTable
              columns={HistoricalPricesColumns(handleCellEdit)}
              data={data}
              customStyles={customStyles}
              fixedHeader
              fixedHeaderScrollHeight="500px"
              responsive
              pagination
              highlightOnHover
            />
          ) : (
            <DataTable
              columns={DeliveredBidsColumns(handleCellEdit)}
              data={deliveredBidsData}
              customStyles={customStyles}
              fixedHeader
              fixedHeaderScrollHeight="500px"
              responsive
              pagination
              highlightOnHover
            />
          )}
        </div>

        <div className="mt-4 flex justify-center px-4">
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-[#2A5D36] text-white rounded hover:bg-green-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoricalPricesPage;
