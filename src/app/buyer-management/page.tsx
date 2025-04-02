"use client";
import { Buyer } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

const columns = [
  {
    name: "BUYER NAME",
    selector: (row: Buyer) => row.name,
    sortable: true,
  },
  {
    name: "ABN",
    selector: (row: Buyer) => row.abn,
    sortable: true,
  },
  {
    name: "MAIN CONTACT",
    selector: (row: Buyer) => row.contactName,
    sortable: true,
  },
  {
    name: "EMAIL",
    selector: (row: Buyer) => row.email,
    sortable: true,
  },
  {
    name: "PHONE",
    selector: (row: Buyer) => row.phone,
    sortable: true,
  },
];

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #ddd",
    },
  },
  headCells: {
    style: {
      borderRight: "1px solid #ddd",
      fontWeight: "bold",
      color: "gray",
    },
  },
  cells: {
    style: {
      borderRight: "1px solid #ddd",
      padding: "12px 15px",
    },
  },
  rows: {
    style: {
      "&:hover": {
        backgroundColor: "#E8F2FF",
        cursor: "pointer",
      },
    },
  },
};

const SellerManagementPage = () => {
  const [data, setData] = useState<Buyer[]>([]);
  const router = useRouter();

  const handleRowClicked = (row: Buyer) => {
    router.push(`/buyer-management/${row.id}`);
  };

  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Buyer[];
  }) => {
    const selectedIds = selected.selectedRows.map((row) => row.id);
    console.log("Selected Row IDs: ", selectedIds);
  };
  useEffect(() => {
    fetch("/buyer.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <div className="mt-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-300 px-4">
        {/* Create New Buyer Button */}
        <div className="w-full md:w-auto">
          <Link href="/buyer-management/create-buyer">
            <button className="w-full md:w-auto px-4 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 rounded cursor-pointer hover:bg-[#1e4728] transition-colors shadow-sm">
              Create New Buyer
              <IoIosPersonAdd className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Search Buyer"
            className="w-full focus:outline-none bg-transparent"
          />
          <LuSearch className="text-gray-500" />
        </div>
      </div>
      <div className="mt-3">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4">
          {/* Title */}
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold text-gray-800">
              List of Buyers
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex gap-2">
            <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <MdOutlineEdit />
              Edit
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <RiDeleteBin6Fill className="text-red-500" />
              Delete
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <IoFilterSharp />
              Filter
            </button>
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-auto rounded-lg border border-gray-200">
          <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            onRowClicked={handleRowClicked}
            selectableRows
            onSelectedRowsChange={handleChange}
            fixedHeader
            fixedHeaderScrollHeight="500px"
            responsive
            pagination
            pointerOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default SellerManagementPage;
