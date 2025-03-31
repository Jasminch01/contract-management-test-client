"use client";
import { Note } from "@/types/types";
import Link from "next/link";
import React from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";

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

const data: Note[] = [
  {
    id: "1",
    noteName: "Notebook 1456",
    notes:
      "It is a long established fact that a reader will be distracted by the readable content of a page",
    br: "JZ02088",
    date: "2/4/2025",
    time: "10:45AM",
  },
  {
    id: "2",
    noteName: "Notebook 1456",
    notes:
      "It is a long established fact that a reader will be distracted by the readable content of a page",
    br: "JZ02088",
    date: "2/4/2025",
    time: "10:45AM",
  },
  {
    id: "3",
    noteName: "Notebook 1456",
    notes:
      "It is a long established fact that a reader will be distracted by the readable content of a page",
    br: "JZ02088",
    date: "2/4/2025",
    time: "10:45AM",
  },
  {
    id: "4",
    noteName: "Notebook 1456",
    notes:
      "It is a long established fact that a reader will be distracted by the readable content of a page",
    br: "JZ02088",
    date: "2/4/2025",
    time: "10:45AM",
  },
  {
    id: "5",
    noteName: "Notebook 1456",
    notes:
      "It is a long established fact that a reader will be distracted by the readable content of a page",
    br: "JZ02088",
    date: "2/4/2025",
    time: "10:45AM",
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

  const handleRowClicked = (row: Note) => {
    router.push(`/notes/${row.id}`);
  };

  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Note[];
  }) => {
    const selectedIds = selected.selectedRows.map((row) => row.id);
    console.log("Selected Row IDs: ", selectedIds);
  };

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
            <p className="text-lg font-semibold">List of Notes</p>
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

export default NotesPage;
