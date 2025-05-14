/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

// Common constants
interface DeliveredBid {
  id: string;
  location: string;
  [key: string]: string; // Allow dynamic properties for months
}

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

// Custom styles for both tables
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
const DeliveredBidsTable = ({
  onSave,
}: {
  onSave: (data: DeliveredBid[]) => void;
}) => {
  const [data, setData] = useState<DeliveredBid[]>([]);
  const [dataModified, setDataModified] = useState(false);

  useEffect(() => {
    // Initialize with default data
    const initialData = deliveredBids.map((location, index) => ({
      id: `db-${index}`,
      location,
      ...months.reduce(
        (acc, month) => ({ ...acc, [month.toLowerCase()]: "" }),
        {}
      ),
    }));
    setData(initialData);
  }, []);

  const handleCellEdit = (rowId: string, columnKey: string, value: string) => {
    setDataModified(true);
    setData(
      data.map((item) =>
        item.id === rowId ? { ...item, [columnKey]: value } : item
      )
    );
  };

  const handleSave = () => {
    onSave(data);
    setDataModified(false);
  };

  const columns = [
    {
      name: "Delivered Bids",
      selector: (row: DeliveredBid) => row.location,
      sortable: true,
      width: "250px",
      cell: (row: DeliveredBid) => (
        <div className="w-full h-full flex items-center px-5">
          {row.location}
        </div>
      ),
    },
    ...months.map((month) => {
      const monthKey = month.toLowerCase();
      return {
        name: month,
        width: "120px",
        cell: (row: DeliveredBid) => {
          const [isEditing, setIsEditing] = useState(false);
          const [value, setValue] = useState(row[monthKey] || "");

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

export default DeliveredBidsTable;
