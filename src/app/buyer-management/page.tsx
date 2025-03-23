"use client";
import { Client } from "@/types/types";
import Link from "next/link";
import React from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

const columns = [
  {
    name: "Buyer Name",
    selector: (row: Client) => row.buyerName,
    sortable: true,
  },
  {
    name: "ABN",
    selector: (row: Client) => row.abn,
    sortable: true,
  },
  {
    name: "Main Contract",
    selector: (row: Client) => row.mainContract,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row: Client) => row.email,
    sortable: true,
  },
  {
    name: "Phone",
    selector: (row: Client) => row.phone,
    sortable: true,
  },
];

const data: Client[] = [
  {
    id: "1",
    buyerName: "John Doe",
    abn: "12 345 678 901",
    mainContract: "Contract A",
    email: "john@example.com",
    phone: "+61 400 000 001",
  },
  {
    id: "2",
    buyerName: "Jane Smith",
    abn: "98 765 432 109",
    mainContract: "Contract B",
    email: "jane@example.com",
    phone: "+61 400 000 002",
  },
  {
    id: "3",
    buyerName: "Alice Johnson",
    abn: "11 222 333 444",
    mainContract: "Contract C",
    email: "alice@example.com",
    phone: "+61 400 000 003",
  },
  {
    id: "4",
    buyerName: "Bob Brown",
    abn: "55 666 777 888",
    mainContract: "Contract D",
    email: "bob@example.com",
    phone: "+61 400 000 004",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
];

// Handle selected rows
const handleChange = (selected: {
  allSelected: boolean;
  selectedCount: number;
  selectedRows: Client[];
}) => {
  // Extract the ids of the selected rows
  const selectedIds = selected.selectedRows.map((row) => row.id);
  console.log("Selected Row IDs: ", selectedIds);
};

// BuyerManagementPage component
const BuyerManagementPage = () => {
  return (
    <div className="mt-20">
      <div className="flex items-center justify-between px-5 pb-10">
        <div>
          <Link href={'/buyer-management/create-buyer'}>
            <button className="px-3 py-2 bg-[#2A5D36] text-white text-sm flex items-center gap-2 cursor-pointer">
              Create New Buyer
              <IoIosPersonAdd />
            </button>
          </Link>
        </div>
        <div className="px-5 py-1 rounded border border-gray-400 flex items-center">
          <input
            type="text"
            placeholder="Search Buyer"
            className="focus:outline-none"
          />
          <LuSearch className="text-gray-400" />
        </div>
      </div>
      <div className="flex items-center justify-between px-5">
        <div className="">
          <p>List of Buyers</p>
        </div>
        <div className="flex items-center space-x-5">
          <button className="border px-5 py-1 rounded border-gray-200 flex items-center gap-3 text-sm cursor-pointer">
            <MdOutlineEdit />
            Edit
          </button>
          <button className="border px-5 py-1 rounded border-gray-200 flex items-center gap-3 text-sm cursor-pointer">
            <RiDeleteBin6Fill color="red" />
            Delete
          </button>
          <button className="border px-5 py-1 rounded border-gray-200 flex items-center gap-3 text-sm cursor-pointer">
            <IoFilterSharp />
            Filter
          </button>
        </div>
      </div>
      <div className="mt-10">
        <DataTable
          columns={columns}
          data={data}
          selectableRows
          responsive
          pagination
          onSelectedRowsChange={handleChange}
        />
      </div>
    </div>
  );
};

export default BuyerManagementPage;
