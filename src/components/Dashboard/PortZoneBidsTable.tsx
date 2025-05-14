/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useState } from "react";
import DataTable from "react-data-table-component";

interface PortZone {
  port: string;
}

interface HistoricalPrice {
  id: string;
  portZones: PortZone[];
  [key: string]: string | PortZone[];
}

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

const PortZoneBidsTable = ({
  data,
  onDataChange,
  onSave,
}: {
  data: HistoricalPrice[];
  onDataChange: (data: HistoricalPrice[]) => void;
  onSave: (data: HistoricalPrice[]) => void;
}) => {
  const [dataModified, setDataModified] = useState(false);

  const handleCellEdit = (rowId: string, columnKey: string, value: string) => {
    setDataModified(true);
    const newData = data.map((item) =>
      item.id === rowId ? { ...item, [columnKey]: value } : item
    );
    onDataChange(newData);
  };

  const handleSave = () => {
    onSave(data);
    setDataModified(false);
  };

  const columns = [
    {
      name: "Port Zone Bids",
      selector: (row: HistoricalPrice) =>
        row.portZones.map((zone) => zone.port).join(", "),
      sortable: true,
      width: "10rem",
      cell: (row: HistoricalPrice) => (
        <div className="w-full h-full flex items-center px-5">
          {row.portZones.map((zone) => zone.port).join(", ")}
        </div>
      ),
    },
    ...grainTypes.map((grain) => ({
      name: grain.toUpperCase(),
      width: "120px",
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
            className="w-full h-full p-2 focus:outline-none"
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

  return (
    <div>
      <div className="overflow-auto rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={data}
          customStyles={customStyles}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          responsive
          pagination
          highlightOnHover
        />
      </div>

      <div className="mt-4 flex justify-center px-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#2A5D36] text-white rounded hover:bg-green-600 transition-colors"
          disabled={!dataModified}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PortZoneBidsTable;
