"use client";
import { Note } from "@/types/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp, IoWarning } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const columns = [
  {
    name: "NOTEBOOK NAME",
    selector: (row: Note) => row.noteName,
    sortable: true,
  },
  {
    name: "NOTES",
    selector: (row: Note) => row.notes,
    sortable: true,
  },
  {
    name: "BROKER REFERANCE",
    selector: (row: Note) => row.br,
    sortable: true,
  },
  {
    name: "DATE",
    selector: (row: Note) => row.date,
    sortable: true,
  },
  {
    name: "TIME",
    selector: (row: Note) => row.time,
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

const NotesPage = () => {
  const router = useRouter();
  const [data, setData] = useState<Note[]>([]);
  const [selectedRows, setSelectedRows] = useState<Note[]>([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Note[]>([]);

  const handleRowClicked = (row: Note) => {
    router.push(`/notes/${row.id}`);
  };

  const handleEdit = () => {
    if (selectedRows.length === 0) {
      toast("Please select at least one note to edit");
      return;
    }
    if (selectedRows.length > 1) {
      toast("Please select only one note to edit");
      return;
    }
    router.push(`/notes/edit/${selectedRows[0].id}`);
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      toast("Please select at least one note to delete");
      return;
    }
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    const newData = data.filter(
      (item) => !selectedRows.some((row) => row.id === item.id)
    );
    setData(newData);
    setFilteredData(newData);
    setIsDeleteConfirmOpen(false);
    toast.success(`${selectedRows.length} note(s) deleted successfully`);
    setSelectedRows([]);
  };

  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Note[];
  }) => {
    setSelectedRows(selected.selectedRows);
  };

  useEffect(() => {
    fetch("/notes.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      });
  }, []);

  useEffect(() => {
    const result = data.filter((item) => {
      return (
        item.noteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.br.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.time.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(result);
  }, [searchTerm, data]);

  return (
    <div className="mt-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-300 pb-5 px-4">
        {/* Create New note Button */}
        <div className="w-full md:w-auto">
          <Link href={`/notes/create-note`}>
            <button className="w-full md:w-auto px-3 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 rounded cursor-pointer hover:bg-[#1e4728] transition-colors">
              Create New Note
              <IoIosPersonAdd className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto px-4 py-2 rounded border border-gray-400 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Notes"
            className="w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <LuSearch className="text-gray-400" />
        </div>
      </div>
      <div className="mt-3">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4">
          {/* Title */}
          <div className="w-full md:w-auto">
            <p className="text-lg font-semibold">List of Notes</p>
            <p className="text-sm text-gray-500">
              {filteredData.length} notes found
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex gap-2">
            <button
              onClick={handleEdit}
              className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <MdOutlineEdit />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
            >
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
            data={filteredData}
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

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="px-5 py-3 border-b border-[#D3D3D3]">
              <h3 className="text-lg font-semibold flex gap-x-5 items-center">
                <IoWarning color="red" />
                Delete selected notes?
              </h3>
            </div>
            <div className="mt-5 px-5 pb-5">
              <p className="mb-4 text-center">
                Are you sure you want to delete {selectedRows.length} selected
                note(s)?
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

export default NotesPage;
