/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

// Type matching the backend schema and table display
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
  hasData: boolean;
  _id?: string;
}

// Grain types matching backend schema
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

interface PortZoneBidsTableProps {
  data: PortZoneTableRow[];
  onDataChange: (
    row: PortZoneTableRow,
    grainType: string,
    value: number | null
  ) => void;
  onSave: (data: PortZoneTableRow[]) => void;
  isLoading?: boolean;
}

const PortZoneBidsTable = ({
  data,
  onDataChange,
  // onSave,
  isLoading = false,
}: PortZoneBidsTableProps) => {
  const [localData, setLocalData] = useState<PortZoneTableRow[]>(data);
  const [changedRows, setChangedRows] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Update local data when prop data changes
  useEffect(() => {
    setLocalData(data);
    setChangedRows(new Set()); // Clear changes when new data arrives
  }, [data]);

  const handleCellEdit = (
    row: PortZoneTableRow,
    grainType: string,
    value: string
  ) => {
    // Convert empty string to null, otherwise parse as number
    const numericValue = value.trim() === "" ? null : parseFloat(value) || null;

    // Update local data
    setLocalData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, [grainType]: numericValue } : item
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

      // Call onDataChange for each changed row and grain type
      for (const row of changedRowsData) {
        const originalRow = data.find((d) => d.id === row.id);

        // Check each grain type for changes
        for (const grainType of grainTypes) {
          const originalValue = originalRow?.[grainType];
          const newValue = row[grainType];

          // If value changed, call onDataChange
          if (originalValue !== newValue) {
            onDataChange(row, grainType, newValue);
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
      name: "Port Zone Bids",
      selector: (row: PortZoneTableRow) => row.label,
      sortable: true,
      width: "10rem",
      cell: (row: PortZoneTableRow) => (
        <div className="w-full h-full flex items-center px-5">
          <span className="font-medium text-gray-700">{row.label}</span>
          {changedRows.has(row.id) && (
            <div
              className="ml-2 size-2 bg-orange-500 rounded-full"
              title="Modified"
            ></div>
          )}
        </div>
      ),
    },
    ...grainTypes.map((grain) => ({
      name: grain,
      width: "120px",
      cell: (row: PortZoneTableRow) => {
        const [isEditing, setIsEditing] = useState(false);
        const [value, setValue] = useState(
          row[grain] !== null ? String(row[grain]) : ""
        );

        const isChanged = changedRows.has(row.id);
        const originalRow = data.find((d) => d.id === row.id);
        const hasOriginalData = originalRow?.[grain] !== null;

        // Update local value when row data changes
        useEffect(() => {
          setValue(row[grain] !== null ? String(row[grain]) : "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [row[grain]]);

        const handleBlur = () => {
          setIsEditing(false);
          if (value !== (row[grain] !== null ? String(row[grain]) : "")) {
            handleCellEdit(row, grain, value);
          }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            handleBlur();
          } else if (e.key === "Escape") {
            // Cancel editing and revert value
            setValue(row[grain] !== null ? String(row[grain]) : "");
            setIsEditing(false);
          }
        };

        const displayValue = row[grain] !== null ? row[grain] : null;

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
          <p className="text-gray-600">Loading port zone bids...</p>
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

export default PortZoneBidsTable;
