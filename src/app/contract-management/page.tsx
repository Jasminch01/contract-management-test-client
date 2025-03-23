"use client";
import { Contract } from "@/types/types";
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
    name: "Contract Number",
    selector: (row: Contract) => row.contractNumber,
    sortable: true,
  },
  {
    name: "Season",
    selector: (row: Contract) => row.season,
    sortable: true,
  },
  {
    name: "Grower",
    selector: (row: Contract) => row.grower,
    sortable: true,
  },
  {
    name: "Tonnes",
    selector: (row: Contract) => row.tonnes,
    sortable: true,
  },
  {
    name: "Buyer",
    selector: (row: Contract) => row.buyer,
    sortable: true,
  },
  {
    name: "Destination",
    selector: (row: Contract) => row.destination,
    sortable: true,
  },
  {
    name: "Contract",
    selector: (row: Contract) => row.contract,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: Contract) => row.status,
    sortable: true,
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
    contract: "Active",
    status: "Approved",
  },
  {
    id: "2",
    contractNumber: "CN67890",
    season: "2023",
    grower: "Jane Smith",
    tonnes: 200,
    buyer: "XYZ Distributors",
    destination: "Melbourne",
    contract: "Active",
    status: "Pending",
  },
  {
    id: "3",
    contractNumber: "CN11223",
    season: "2022",
    grower: "Alice Johnson",
    tonnes: 100,
    buyer: "Fresh Produce Co.",
    destination: "Brisbane",
    contract: "Inactive",
    status: "Rejected",
  },
  {
    id: "4",
    contractNumber: "CN44556",
    season: "2023",
    grower: "Bob Brown",
    tonnes: 250,
    buyer: "Global Foods",
    destination: "Perth",
    contract: "Active",
    status: "Approved",
  },
  {
    id: "5",
    contractNumber: "CN77889",
    season: "2022",
    grower: "Charlie Davis",
    tonnes: 300,
    buyer: "Organic Farms",
    destination: "Adelaide",
    contract: "Inactive",
    status: "Pending",
  },
];

// Handle selected rows
const handleChange = (selected: {
  allSelected: boolean;
  selectedCount: number;
  selectedRows: Contract[];
}) => {
  // Extract the ids of the selected rows
  const selectedIds = selected.selectedRows.map((row) => row.id);
  console.log("Selected Row IDs: ", selectedIds);
};

// BuyerManagementPage component
const ContractManagementPage = () => {
  return (
    <div className="mt-20">
      <div className="flex items-center justify-between px-5 pb-10">
        <div>
          <Link href={'/contract-management/create-contract'}>
            <button className="px-3 py-2 bg-[#2A5D36] text-white text-sm flex items-center gap-2 cursor-pointer">
              Create New Conntract
              <IoIosPersonAdd />
            </button>
          </Link>
        </div>
        <div className="px-5 py-1 rounded border border-gray-400 flex items-center">
          <input
            type="text"
            placeholder="Search Contract"
            className="focus:outline-none"
          />
          <LuSearch className="text-gray-400" />
        </div>
      </div>
      <div className="flex items-center justify-between px-5">
        <div className="">
          <p>List of Contract</p>
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
      <div className="mt-10 overflow-x-scroll">
        <DataTable
          columns={columns}
          data={data}
          responsive
          pagination
          selectableRows
          onSelectedRowsChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ContractManagementPage;
