"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { Seller } from "@/types/types";

const columns = [
  {
    name: "SELLER NAME",
    selector: (row: Seller) => row.sellerLegalName,
    sortable: true,
  },
  {
    name: "ABN",
    selector: (row: Seller) => row.sellerABN,
    sortable: true,
  },
  {
    name: "MAIN CONTACT",
    selector: (row: Seller) => row.sellerContactName,
    sortable: true,
  },
  {
    name: "EMAIL",
    selector: (row: Seller) => row.sellerEmail,
    sortable: true,
  },
  {
    name: "PHONE",
    selector: (row: Seller) => row.sellerPhoneNumber,
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
    },
  },
  headCells: {
    style: {
      borderRight: "1px solid #ddd",
      fontWeight: "bold",
      color: "gray",
    },
  },
};

const SellerManagementPage = () => {
  const [data, setData] = useState<Seller[]>([]);
  const router = useRouter();
  useEffect(() => {
    fetch("/buyer.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const handleRowClicked = (row: Seller) => {
    router.push(`/seller-management/${row.id}`);
  };

  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Seller[];
  }) => {
    const selectedIds = selected.selectedRows.map((row) => row.id);
    console.log("Selected Row IDs: ", selectedIds);
  };

  return (
    <div className="mt-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-300 pb-5 px-4">
        {/* Create New Seller Button */}
        <div className="w-full md:w-auto">
          <Link href={`/seller-management/create-seller`}>
            <button className="w-full md:w-auto px-3 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 rounded cursor-pointer hover:bg-[#1e4728] transition-colors">
              Create New Seller
              <IoIosPersonAdd className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto px-4 py-2 rounded border border-gray-400 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Seller"
            className="w-full focus:outline-none"
          />
          <LuSearch className="text-gray-400" />
        </div>
      </div>
      <div className="mt-3">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4">
          {/* Title */}
          <div className="w-full md:w-auto">
            <p className="text-lg font-semibold">List of Sellers</p>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex gap-2">
            <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <MdOutlineEdit />
              Edit
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <RiDeleteBin6Fill className="text-red-500" />
              Delete
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <IoFilterSharp />
              Filter
            </button>
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-x-scroll">
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
            className="border border-gray-200 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default SellerManagementPage;
