"use client";

import { useState } from "react";
import DataTable from "react-data-table-component";

interface DeliveredBid {
  location: string;
}

interface DeliveredBids {
  id: string;
  locations: DeliveredBid[];
  [key: string]: string | DeliveredBid[];
}

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

const customStyles = {
  headRow: {
    style: {
      borderBottom: "1px solid #ddd",
    },
  },
  headCells: {
    style: {
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

const DeliveredBidsTable = ({
  data,
  onDataChange,
  onSave,
}: {
  data: DeliveredBids[];
  onDataChange: (data: DeliveredBids[]) => void;
  onSave: (data: DeliveredBids[]) => void;
}) => {
  const [dataModified, setDataModified] = useState(false);
  const [editing, setEditing] = useState<{
    rowId: string;
    columnKey: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");

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
      name: "Delivered Bids",
      selector: (row: DeliveredBids) => row.locations?.[0]?.location || "",
      sortable: true,
      width: "20rem",
      cell: (row: DeliveredBids) => (
        <div className="w-full h-full flex items-center px-5">
          {row.locations?.[0]?.location || " "}
        </div>
      ),
    },
    ...months.map((month) => {
      const monthKey = month.toLowerCase();
      return {
        name: month,
        width: "120px",
        cell: (row: DeliveredBids) => {
          const isEditing =
            editing?.rowId === row.id && editing?.columnKey === monthKey;
          const value =
            typeof row[monthKey] === "string" ? (row[monthKey] as string) : "";

          const handleBlur = () => {
            setEditing(null);
            handleCellEdit(row.id, monthKey, editValue);
          };

          const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === "Enter") handleBlur();
          };

          return isEditing ? (
            <div className="w-full h-full flex items-center justify-center hover:bg-gray-100 cursor-pointer">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full h-full px-2 focus:outline-none text-center"
              />
            </div>
          ) : (
            <div
              onClick={() => {
                setEditing({ rowId: row.id, columnKey: monthKey });
                setEditValue(value);
              }}
              className="w-full h-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
            >
              <p className="text-center w-full">{value ? `$ ${value}` : " "}</p>
            </div>
          );
        },
      };
    }),
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
          className="px-6 py-2 bg-[#2A5D36] text-white rounded hover:bg-[#1e4728]  transition-colors"
          disabled={!dataModified}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default DeliveredBidsTable;
