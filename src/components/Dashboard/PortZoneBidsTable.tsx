/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { TableStyles } from "react-data-table-component/dist/DataTable/types";
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
interface PortZoneBidsDisplay {
  id: string;
  label: string;
  [key: string]: string | number; // grain type prices as strings for form input
}

const PortZoneBidsTable = ({
  data,
  onDataChange,
  onSave,
  loading = false,
  currentDate,
  selectedSeason,
}: {
  data: PortZoneBidsDisplay[];
  onDataChange: (data: PortZoneBidsDisplay[]) => void;
  onSave: (data: PortZoneBidsDisplay[]) => void;
  loading?: boolean;
  currentDate?: string;
  selectedSeason?: string;
}) => {
  const [dataModified, setDataModified] = useState(false);
  const [tableData, setTableData] = useState<PortZoneBidsDisplay[]>([]);

  // Update table data when props data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setTableData(data);
    }
  }, [data]);

  const handleCellEdit = (rowId: string, columnKey: string, value: string) => {
    setDataModified(true);
    const newData = tableData.map((item) =>
      item.id === rowId ? { ...item, [columnKey]: value } : item
    );
    setTableData(newData);
    onDataChange(newData);
  };

  const handleSave = () => {
    console.log("Saving data:", tableData);
    onSave(tableData);
    setDataModified(false);
  };

  // Custom styles for sticky first column
  const customStyles: TableStyles = {
    headRow: {
      style: {
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f8fafc", // Light gray background for header
      },
    },
    headCells: {
      style: {
        borderRight: "1px solid #ddd",
        fontWeight: "bold",
        color: "gray",
        backgroundColor: "#f8fafc", // Match header background
        "&:first-child": {
          position: "sticky",
          left: 0,
          zIndex: 3,
          backgroundColor: "#f8fafc", // Match header background
        },
      },
    },
    cells: {
      style: {
        borderRight: "1px solid #ddd",
        padding: "0",
        "&:first-child": {
          position: "sticky",
          left: 0,
          zIndex: 2,
          backgroundColor: "white", // Cell background
        },
      },
    },
    rows: {
      style: {
        backgroundColor: "white", // Cell background
        "&:hover": {
          backgroundColor: "#E8F2FF",
          "&:first-child": {
            backgroundColor: "#E8F2FF", // Hover color for first cell
          },
        },
      },
    },
  };

  const columns = [
    {
      name: "Port Zone Bids",
      selector: (row: PortZoneBidsDisplay) => row.label,
      sortable: true,
      width: "200px", // Fixed width for the first column
      cell: (row: PortZoneBidsDisplay) => (
        <div className="w-full h-full flex items-center px-4 font-medium">
          {row.label}
        </div>
      ),
    },
    ...grainTypes.map((grain) => ({
      name: grain,
      width: "120px",
      cell: (row: PortZoneBidsDisplay) => {
        const [isEditing, setIsEditing] = useState(false);
        const [value, setValue] = useState(
          row[grain] !== null && row[grain] !== undefined
            ? row[grain].toString()
            : ""
        );

        useEffect(() => {
          setValue(
            row[grain] !== null && row[grain] !== undefined
              ? row[grain].toString()
              : ""
          );
        }, [row[grain]]);

        const handleBlur = () => {
          setIsEditing(false);
          handleCellEdit(row.id, grain, value);
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === "Enter") handleBlur();
          if (e.key === "Escape") {
            setIsEditing(false);
            setValue(
              row[grain] !== null && row[grain] !== undefined
                ? row[grain].toString()
                : ""
            );
          }
        };

        return isEditing ? (
          <div className="w-full h-full flex items-center justify-center">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9.]/g, "");
                setValue(numericValue);
              }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full h-full p-2 focus:outline-none text-center"
              inputMode="decimal"
              placeholder="0"
            />
          </div>
        ) : (
          <div
            onClick={() => {
              if (!loading) {
                setIsEditing(true);
                setValue(
                  row[grain] !== null && row[grain] !== undefined
                    ? row[grain].toString()
                    : ""
                );
              }
            }}
            className={`w-full h-full flex items-center justify-center p-2 ${
              !loading
                ? "hover:bg-gray-100 cursor-pointer"
                : "cursor-not-allowed"
            }`}
          >
            <p className="text-center w-full">
              {value && value !== "" ? `$ ${value}` : loading ? "..." : ""}
            </p>
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
          data={tableData}
          customStyles={customStyles}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          responsive
          pagination
          highlightOnHover
          noDataComponent={
            <div className="py-10 text-center text-gray-500">
              Fill in the form with port zone bid prices
            </div>
          }
        />
      </div>

      <div className="mt-4 flex justify-center px-4">
        <button
          onClick={handleSave}
          className={`px-6 py-2 text-white rounded transition-colors ${
            dataModified && !loading
              ? "bg-[#2A5D36] hover:bg-[#1e4728] cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!dataModified || loading}
        >
          {loading ? "Loading..." : "Save Changes"}
        </button>
      </div>

      {dataModified && (
        <div className="mt-2 text-center text-sm text-amber-600">
          You have unsaved changes
        </div>
      )}

      <div className="mt-2 text-xs text-gray-400 text-center">
        Current Date: {currentDate} | Season: {selectedSeason}
      </div>
    </div>
  );
};

export default PortZoneBidsTable;
