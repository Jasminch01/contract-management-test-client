/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

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
  onSave,
  isLoading = false,
}: DeliveredBidsTableProps) => {
  const [localData, setLocalData] = useState<DeliveredBidTableRow[]>(data);
  const [changedRows, setChangedRows] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Define client locations with "Delivered " prefix
  const clientLocations = [
    "Murray Bridge ASW1",
    "Murray Bridge CANO",
    "Wasleys SFW1",
    "Wasleys BAR1",
    "Wasleys CANO",
    "Laucke Daveyston SFW1",
    "Laucke Daveyston BAR1",
    "Laucke Daveyston CANS",
    "Southern Cross Feedlot (TFI) BAR1",
    "Dublin NIP/HAL",
    "Dublin Canola",
    "Semaphore Containers NIP/HAL",
    "Semaphore Containers APW1",
  ].map((loc) => `Delivered ${loc}`);

  useEffect(() => {
    setLocalData(data);
    setChangedRows(new Set());
  }, [data]);

  const handleCellEdit = (
    row: DeliveredBidTableRow,
    field: string,
    value: string
  ) => {
    const numericValue =
      field === "location" ? value : value.trim() === "" ? null : parseFloat(value) || null;

    setLocalData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, [field]: numericValue } : item
      )
    );

    setChangedRows((prev) => new Set([...prev, row.id]));
  };

  const handleSaveChanges = async () => {
    if (changedRows.size === 0) return;

    setIsSaving(true);

    try {
      const changedRowsData = localData.filter((row) => changedRows.has(row.id));
      for (const row of changedRowsData) {
        const originalRow = data.find((d) => d.id === row.id);
        for (const field of [...months, "location"]) {
          const originalValue = originalRow?.[field];
          const newValue = row[field];
          if (originalValue !== newValue) {
            onDataChange(row, field, newValue);
          }
        }
      }
      setChangedRows(new Set());
      if (onSave) onSave(localData);
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
      name: "Delivered Bids",
      selector: (row: DeliveredBidTableRow) => row.location,
      width: "20rem",
      cell: (row: DeliveredBidTableRow) => (
        <div className="w-full h-full flex items-center px-5">
          <select
            value={row.location}
            onChange={(e) => handleCellEdit(row, "location", e.target.value)}
            className="w-full p-1 border rounded"
          >
            {clientLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
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

        useEffect(() => {
          setValue(row[month] !== null ? String(row[month]) : "");
        }, [row[month]]);

        const handleBlur = () => {
          setIsEditing(false);
          if (value !== (row[month] !== null ? String(row[month]) : "")) {
            handleCellEdit(row, month, value);
          }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === "Enter") handleBlur();
          else if (e.key === "Escape") {
            setValue(row[month] !== null ? String(row[month]) : "");
            setIsEditing(false);
          }
        };

        return isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full h-full p-2 text-center border-2 border-blue-500 rounded"
          />
        ) : (
          <div
            onClick={() => !isLoading && !isSaving && setIsEditing(true)}
            className={`w-full h-full flex items-center justify-center p-2 cursor-pointer ${isLoading || isSaving ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            <p>{row[month] !== null ? `$${row[month]}` : " "}</p>
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
            </div>
          }
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        {changedRows.size > 0 && (
          <>
            <button
              onClick={handleDiscardChanges}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-4 py-2 bg-[#108A2B] text-white rounded-md hover:bg-[#0d7224] disabled:opacity-50 flex items-center gap-2"
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
  );
};

export default DeliveredBidsTable;