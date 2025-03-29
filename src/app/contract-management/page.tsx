"use client";
import { Contract } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Changed from next/router
import React from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd, IoIosSend } from "react-icons/io";
import { IoDocumentText, IoFilterSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiCircleFill, RiDeleteBin6Fill } from "react-icons/ri";

const columns = [
  {
    name: "CONTRACT NUMBER",
    selector: (row: Contract) => row.contractNumber,
    sortable: true,
  },
  {
    name: "SEASON",
    selector: (row: Contract) => row.season,
    sortable: true,
  },
  {
    name: "GROWER",
    selector: (row: Contract) => row.grower,
    sortable: true,
  },
  {
    name: "TONNES",
    selector: (row: Contract) => row.tonnes,
    sortable: true,
  },
  {
    name: "BUYER",
    selector: (row: Contract) => row.buyer,
    sortable: true,
  },
  {
    name: "DESTINATION",
    selector: (row: Contract) => row.destination,
    sortable: true,
  },
  {
    name: "CONTRACT PRICE",
    selector: (row: Contract) => row.contractPrice,
    sortable: true,
  },
  {
    name: "STATUS",
    selector: (row: Contract) => row.status,
    sortable: true,
    cell: (row: Contract) => (
      <p className={`text-xs flex items-center gap-x-3`}>
        <RiCircleFill
          className={`${
            row.status !== "Complete" ? "text-[#FAD957]" : "text-[#B1B1B1]"
          }`}
        />
        {row.status}
      </p>
    ),
  },
];

const data: Contract[] = [
  {
    id: "1",
    contractNumber: "CN12345",
    season: "2023",
    grower: "John Doe",
    tonnes: 150,
    buyer: "ABC Foods",
    destination: "Sydney",
    contractPrice: "100",
    status: "Not done",
  },
  {
    id: "2",
    contractNumber: "CN67890",
    season: "2023",
    grower: "Jane Smith",
    tonnes: 200,
    buyer: "XYZ Distributors",
    destination: "Melbourne",
    contractPrice: "299",
    status: "Complete",
  },
  {
    id: "3",
    contractNumber: "CN11223",
    season: "2022",
    grower: "Alice Johnson",
    tonnes: 100,
    buyer: "Fresh Produce Co.",
    destination: "Brisbane",
    contractPrice: "400",
    status: "Not done",
  },
  {
    id: "4",
    contractNumber: "CN44556",
    season: "2023",
    grower: "Bob Brown",
    tonnes: 250,
    buyer: "Global Foods",
    destination: "Perth",
    contractPrice: "200",
    status: "Complete",
  },
  {
    id: "5",
    contractNumber: "CN77889",
    season: "2022",
    grower: "Charlie Davis",
    tonnes: 300,
    buyer: "Organic Farms",
    destination: "Adelaide",
    contractPrice: "123",
    status: "Complete",
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

const ContractManagementPage = () => {
  const router = useRouter();

  const handleRowClicked = (row: Contract) => {
    router.push(`/contract-management/${row.id}`);
  };

  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Contract[];
  }) => {
    const selectedIds = selected.selectedRows.map((row) => row.id);
    console.log("Selected Row IDs: ", selectedIds);
  };

  return (
    <div className="mt-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-300 px-4">
        {/* Create New Contract Button */}
        <div className="w-full md:w-auto">
          <Link href="/contract-management/create-contract">
            <button className="w-full md:w-auto px-3 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-[#1e4728] transition-colors rounded">
              Create New Contract
              <IoIosPersonAdd className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto px-4 py-2 rounded border border-gray-400 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Contract"
            className="w-full focus:outline-none"
          />
          <LuSearch className="text-gray-400" />
        </div>
      </div>

      {/* Table Controls */}
      <div className="mt-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4">
          {/* Title */}
          <div className="w-full md:w-auto">
            <p className="text-lg font-semibold">List of Contracts</p>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex flex-col lg:flex-row gap-2">
            <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <IoDocumentText />
              Export as PDF
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <IoIosSend />
              Email to Buyer
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <IoIosSend />
              Email to Seller
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <MdOutlineEdit />
              Edit
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <RiDeleteBin6Fill className="text-red-500" />
              Delete
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <RiCircleFill className="text-[#FAD957]" />
              Status
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <IoFilterSharp />
              Filter
            </button>
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-x-auto border border-gray-300">
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

export default ContractManagementPage;
