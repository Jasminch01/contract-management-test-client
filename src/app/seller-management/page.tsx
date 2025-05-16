"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp, IoWarning } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { Seller } from "@/types/types";
import toast, { Toaster } from "react-hot-toast";
import { sellers } from "@/data/data";

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
      padding: "12px 15px",
    },
  },
  headCells: {
    style: {
      borderRight: "1px solid #ddd",
      fontWeight: "bold",
      color: "gray",
      padding: "12px 15px",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #ddd",
    },
  },
};

const SellerManagementPage = () => {
  const [data, setData] = useState<Seller[]>(
    sellers.filter((s) => !s.isDeleted)
  );
  const [filteredData, setFilteredData] = useState<Seller[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Seller[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const result = data.filter((seller) => {
      return (
        seller.sellerLegalName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        seller.sellerABN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.sellerContactName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        seller.sellerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.sellerPhoneNumber
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(result);
  }, [searchTerm, data]);

  const handleRowClicked = (row: Seller) => {
    router.push(`/seller-management/${row.id}`);
  };

  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Seller[];
  }) => {
    setSelectedRows(selected.selectedRows);
  };

  const handleEdit = () => {
    if (selectedRows.length === 0) {
      toast("Please select at least one seller to edit");
      return;
    }
    if (selectedRows.length > 1) {
      toast("Please select only one seller to edit");
      return;
    }
    router.push(`/seller-management/edit/${selectedRows[0].id}`);
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      toast("Please select at least one seller to delete");
      return;
    }
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    const newData = data.filter(
      (item) => !selectedRows.some((row) => row.id === item.id)
    );
    setData(newData);
    setSelectedRows([]);
    setFilteredData(newData);
    setToggleCleared(!toggleCleared);
    setIsDeleteConfirmOpen(false);
    toast.success(`${selectedRows.length} seller(s) deleted successfully`);
  };

  const handleFilter = () => {
    setSearchTerm("");
    // toast("Advanced filter functionality can be added here");
  };

  return (
    <div className="mt-20 bg-green-50">
      <Toaster />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-300 pb-5 px-4">
        {/* Create New Seller Button */}
        <div className="w-full md:w-auto">
          <Link href={`/seller-management/create-seller`}>
            <button className="w-full md:w-auto px-4 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 rounded cursor-pointer hover:bg-[#1e4728] transition-colors shadow-sm">
              Create New Seller
              <IoIosPersonAdd className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Search Seller"
            className="w-full focus:outline-none bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              List of Sellers
            </h2>
            <p className="text-sm text-gray-500">
              {filteredData.length} seller(s) found
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex gap-2">
            <button
              onClick={handleEdit}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
            >
              <MdOutlineEdit />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RiDeleteBin6Fill className="text-red-500" />
              Delete
            </button>
            <button
              onClick={handleFilter}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
            >
              <IoFilterSharp />
              Filter
            </button>
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-auto rounded-lg border border-gray-200 shadow-sm">
          <DataTable
            columns={columns}
            data={filteredData}
            customStyles={customStyles}
            onRowClicked={handleRowClicked}
            selectableRows
            onSelectedRowsChange={handleChange}
            clearSelectedRows={toggleCleared}
            fixedHeader
            fixedHeaderScrollHeight="500px"
            responsive
            pagination
            pointerOnHover
            selectableRowsHighlight
            highlightOnHover
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="px-5 py-3 border-b border-[#D3D3D3]">
              <h3 className="text-lg font-semibold flex gap-x-5 items-center">
                <IoWarning color="red" />
                Delete selected sellers?
              </h3>
            </div>
            <div className="mt-5 px-5 pb-5">
              <p className="mb-4 text-center">
                Are you sure you want to delete {selectedRows.length} selected
                seller(s)? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-[#BF3131] text-white rounded hover:bg-[#ff7e7e]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManagementPage;
