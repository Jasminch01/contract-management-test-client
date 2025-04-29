"use client";
import { Buyer, Contract, Note, Seller } from "@/types/types";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoFilterSharp } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";

interface DeletedItem {
  id: string;
  name: string;
  noteName: string;
  sellerLegalName: string;
  contractNumber: string;
  type: "Contract" | "Note" | "Seller" | "Buyer";
  isDeleted: boolean;
  deletedAt: string;
  // Add other fields as needed
}

const RubbishBin = () => {
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);
  const [loading, setLoading] = useState(true);
  //   const [selectedRows, setSelectedRows] = useState<DeletedItem[]>([]);
  //   const [toggleCleared, setToggleCleared] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch contracts data
        const contractsRes = await fetch("contracts.json");
        const contracts = await contractsRes.json();

        console.log(contracts);
        // Fetch notes data
        const notesRes = await fetch("notes.json");
        const notes = await notesRes.json();
        // Fetch sellers data
        const sellersRes = await fetch("seller.json");
        const sellers = await sellersRes.json();

        // Fetch buyers data
        const buyersRes = await fetch("buyer.json");
        const buyers = await buyersRes.json();

        // Process and combine all data
        const allItems = [
          ...contracts.map((c: Contract) => ({ ...c, type: "Contract" })),
          ...notes.map((n: Note) => ({ ...n, type: "Note" })),
          ...sellers.map((s: Seller) => ({ ...s, type: "Seller" })),
          ...buyers.map((b: Buyer) => ({ ...b, type: "Buyer" })),
        ];

        // Filter only deleted items
        const deleted = allItems.filter((item) => item.isDeleted);
        setDeletedItems(deleted);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const columns = [
    {
      name: "Name",
      selector: (row: DeletedItem) =>
        row.name || row.sellerLegalName || row.contractNumber || row.noteName,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row: DeletedItem) => row.type,
      sortable: true,
    },
    {
      name: "Deleted At",
      selector: (row: DeletedItem) =>
        new Date(row.deletedAt).toLocaleDateString(),
      sortable: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#E8F2FF",
        },
      },
    },
    cells: {
      style: {
        borderRight: "1px solid #ddd",
        padding: "12px",
      },
    },
    headCells: {
      style: {
        borderRight: "1px solid #ddd",
        fontWeight: "bold",
        color: "gray",
        padding: "12px",
      },
    },
  };

  return (
    <div className="mt-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-300 px-4">
        {/* Create New Buyer Button */}
        <div className="w-full md:w-auto">
          <p className="">Rubbish bin</p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 bg-white shadow-sm">
          <button>Empty Rubbish Bin</button>
        </div>
      </div>
      <div className="mt-3">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4">
          {/* Title */}
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold text-gray-800">
              List of deleted itmes
            </h2>
            <p className="text-sm text-gray-500">
              {deletedItems.length}deleted items found
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex gap-2">
            <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              Restore
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <RiDeleteBin6Fill className="text-red-500" />
              Parmanent Delete
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <IoFilterSharp />
              Filter
            </button>
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-auto border border-gray-200">
          <DataTable
            columns={columns}
            data={deletedItems}
            progressPending={loading}
            pagination
            highlightOnHover
            noDataComponent={<div className="p-4">No deleted items found</div>}
            fixedHeader
            fixedHeaderScrollHeight="500px"
            selectableRowsHighlight
            responsive
            pointerOnHover
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default RubbishBin;
