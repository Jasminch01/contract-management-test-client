/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

// Type matching the backend schema and table display
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

// Month types matching backend schema
const months = [
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

const monthDisplayNames = [
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

interface DeliveredBidsTableProps {
  data: DeliveredBidTableRow[];
  onDataChange: (
    row: DeliveredBidTableRow,
    month: string,
    value: number | null
  ) => void;
  onSave: (data: DeliveredBidTableRow[]) => void;
  isLoading?: boolean;
}
const DeliveredBidsTable = ({
  data,
  onDataChange,
  // onSave,
  isLoading = false,
}: DeliveredBidsTableProps) => {
  const [localData, setLocalData] = useState<DeliveredBidTableRow[]>(data);
  const [changedRows, setChangedRows] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  // Update local data when prop data changes
  useEffect(() => {
    setLocalData(data);
    setChangedRows(new Set()); // Clear changes when new data arrives
  }, [data]);

  const handleCellEdit = (
    row: DeliveredBidTableRow,
    month: string,
    value: string
  ) => {
    // Convert empty string to null, otherwise parse as number
    const numericValue = value.trim() === "" ? null : parseFloat(value) || null;

    // Update local data
    setLocalData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, [month]: numericValue } : item
      )
    );

    // Mark this row as changed
    setChangedRows((prev) => new Set([...prev, row.id]));
  };

  const handleSaveChanges = async () => {
    if (changedRows.size === 0) return;

    setIsSaving(true);

    try {
      // Get all changed rows
      const changedRowsData = localData.filter((row) =>
        changedRows.has(row.id)
      );

      // Call onDataChange for each changed row and month
      for (const row of changedRowsData) {
        const originalRow = data.find((d) => d.id === row.id);

        // Check each month for changes
        for (const month of months) {
          const originalValue = originalRow?.[month];
          const newValue = row[month];

          // If value changed, call onDataChange
          if (originalValue !== newValue) {
            onDataChange(row, month, newValue);
          }
        }
      }

      // Clear changed rows after successful save
      setChangedRows(new Set());
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setLocalData(data);
    setChangedRows(new Set());
  };

  const columns = [
    {
      name: "Delivery Destination",
      selector: (row: DeliveredBidTableRow) => row.location,
      sortable: true,
      width: "20rem",
      cell: (row: DeliveredBidTableRow) => (
        <div className="w-full h-full flex items-center px-5">
          <span className="font-medium text-gray-700">{row.location}</span>
          {changedRows.has(row.id) && (
            <div
              className="ml-2 size-2 bg-orange-500 rounded-full"
              title="Modified"
            ></div>
          )}
        </div>
      ),
    },
    ...months.map((month, index) => ({
      name: monthDisplayNames[index],
      width: "120px",
      cell: (row: DeliveredBidTableRow) => {
        const [isEditing, setIsEditing] = useState(false);
        const [value, setValue] = useState(
          row[month] !== null ? String(row[month]) : ""
        );

        const isChanged = changedRows.has(row.id);
        const originalRow = data.find((d) => d.id === row.id);
        const hasOriginalData = originalRow?.[month] !== null;

        // Update local value when row data changes
        useEffect(() => {
          setValue(row[month] !== null ? String(row[month]) : "");
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [row[month]]);

        const handleBlur = () => {
          setIsEditing(false);
          if (value !== (row[month] !== null ? String(row[month]) : "")) {
            handleCellEdit(row, month, value);
          }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            handleBlur();
          } else if (e.key === "Escape") {
            // Cancel editing and revert value
            setValue(row[month] !== null ? String(row[month]) : "");
            setIsEditing(false);
          }
        };

        const displayValue = row[month] !== null ? row[month] : null;

        return isEditing ? (
          <div className="w-full h-full flex items-center justify-center">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                // Allow numbers, decimal point, and empty string
                const inputValue = e.target.value;
                if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
                  setValue(inputValue);
                }
              }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full h-full p-2 focus:outline-none text-center border-2 border-blue-500 rounded"
              placeholder="Enter value"
            />
          </div>
        ) : (
          <div
            onClick={() => {
              if (!isLoading && !isSaving) {
                setIsEditing(true);
              }
            }}
            className={`w-full h-full flex items-center justify-center p-2 cursor-pointer transition-colors relative ${
              isLoading || isSaving
                ? "bg-gray-100 cursor-not-allowed"
                : "hover:bg-gray-100"
            } ${isChanged ? "bg-orange-50" : ""} ${
              hasOriginalData && !isChanged ? "bg-green-50" : ""
            }`}
            title={
              isLoading
                ? "Loading..."
                : isSaving
                ? "Saving..."
                : isChanged
                ? "Modified - click Save Changes to persist"
                : "Click to edit"
            }
          >
            <p
              className={`text-center w-full ${
                displayValue !== null
                  ? isChanged
                    ? "text-orange-900 font-medium"
                    : "text-gray-900 font-medium"
                  : "text-gray-400"
              }`}
            >
              {displayValue !== null ? `$ ${displayValue}` : " "}
            </p>
          </div>
        );
      },
    })),
  ];

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A5D36] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivered bids...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-auto rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={localData}
          customStyles={customStyles}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          responsive
          highlightOnHover
          noDataComponent={
            <div className="py-8 text-center text-gray-500">
              <p>No data available for the selected date and season.</p>
              <p className="text-sm">
                Click on any cell to start entering values.
              </p>
            </div>
          }
        />
      </div>
      <div className="mt-4 flex flex-col justify-center items-center px-4">
        {changedRows.size > 0 && (
          <div className="text-sm text-orange-600 font-medium">
            {changedRows.size} row{changedRows.size !== 1 ? "s" : ""} modified
          </div>
        )}
        <div className="flex gap-2 mt-5">
          {changedRows.size > 0 && (
            <>
              <button
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Discard Changes
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-4 py-2 text-sm bg-[#108A2B] text-white rounded-md hover:bg-[#0d7224] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSaving && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveredBidsTable;
