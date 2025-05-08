// "use client";
// import { HistoricalPrice } from "@/types/types";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import toast, { Toaster } from "react-hot-toast";
// import { IoIosAdd } from "react-icons/io";
// import { IoFilterSharp } from "react-icons/io5";
// import { IoWarning } from "react-icons/io5";
// import { LuSearch } from "react-icons/lu";
// import { MdOutlineEdit } from "react-icons/md";
// import { RiDeleteBin6Fill } from "react-icons/ri";

// const columns = [
//   {
//     name: "COMMODITY",
//     selector: (row: HistoricalPrice) => row.commodity,
//     sortable: true,
//   },
//   {
//     name: "DATE",
//     selector: (row: HistoricalPrice) => row.date,
//     sortable: true,
//   },
//   {
//     name: "PRICE",
//     selector: (row: HistoricalPrice) => row.price,
//     sortable: true,
//     format: (row: HistoricalPrice) => `$${row.price.toFixed(2)}`,
//   },
//   {
//     name: "QUALITY",
//     selector: (row: HistoricalPrice) => row.quality,
//     sortable: true,
//   },
//   {
//     name: "COMMENT",
//     selector: (row: HistoricalPrice) => row.comment || "-",
//     sortable: false,
//   },
// ];

// const customStyles = {
//   headRow: {
//     style: {
//       backgroundColor: "#f8f9fa",
//       borderBottom: "1px solid #ddd",
//     },
//   },
//   headCells: {
//     style: {
//       borderRight: "1px solid #ddd",
//       fontWeight: "bold",
//       color: "gray",
//     },
//   },
//   cells: {
//     style: {
//       borderRight: "1px solid #ddd",
//       padding: "12px 15px",
//     },
//   },
//   rows: {
//     style: {
//       "&:hover": {
//         backgroundColor: "#E8F2FF",
//         cursor: "pointer",
//       },
//     },
//   },
// };

// const HistoricalPricesPage = () => {
//   const [data, setData] = useState<HistoricalPrice[]>([]);
//   const [filteredData, setFilteredData] = useState<HistoricalPrice[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRows, setSelectedRows] = useState<HistoricalPrice[]>([]);
//   const [toggleCleared, setToggleCleared] = useState(false);
//   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     fetch("/historicalPrices.json")
//       .then((res) => res.json())
//       .then((data) => {
//         setData(data);
//         setFilteredData(data);
//       });
//   }, []);

//   useEffect(() => {
//     const result = data.filter((item) => {
//       return (
//         item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.quality.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (item.comment &&
//           item.comment.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     });
//     setFilteredData(result);
//   }, [searchTerm, data]);

//   const handleRowClicked = (row: HistoricalPrice) => {
//     router.push(`/historical-prices/${row.id}`);
//   };

//   const handleChange = (selected: {
//     allSelected: boolean;
//     selectedCount: number;
//     selectedRows: HistoricalPrice[];
//   }) => {
//     setSelectedRows(selected.selectedRows);
//   };

//   const handleEdit = () => {
//     if (selectedRows.length === 0) {
//       toast.error("Please select at least one row to edit");
//       return;
//     }
//     if (selectedRows.length > 1) {
//       toast.error("Please select only one row to edit");
//       return;
//     }
//     router.push(`/historical-prices/edit/${selectedRows[0].id}`);
//   };

//   const confirmDelete = () => {
//     const newData = data.filter(
//       (item) => !selectedRows.some((row) => row.id === item.id)
//     );
//     setData(newData);
//     setFilteredData(newData);
//     setToggleCleared(!toggleCleared);
//     setIsDeleteConfirmOpen(false);
//     toast.success("Selected prices deleted successfully");
//   };

//   const handleDelete = () => {
//     if (selectedRows.length === 0) {
//       toast("Please select at least one row to delete");
//       return;
//     }
//     setIsDeleteConfirmOpen(true);
//   };

//   const handleFilter = () => {
//     toast("Filter functionality will be implemented here");
//     // Implement your filter logic or open a filter modal
//   };

//   return (
//     <div className="mt-20">
//       <Toaster />
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-300 px-4">
//         {/* Create New Button */}
//         <div className="w-full md:w-auto">
//           <Link href="/historical-prices/add-historical-price">
//             <button className="w-full md:w-auto px-4 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 rounded cursor-pointer hover:bg-[#1e4728] transition-colors shadow-sm">
//               Add New Price
//               <IoIosAdd className="text-lg" />
//             </button>
//           </Link>
//         </div>

//         {/* Search Input */}
//         <div className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 bg-white shadow-sm">
//           <input
//             type="text"
//             placeholder="Search historical prices..."
//             className="w-full focus:outline-none bg-transparent"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <LuSearch className="text-gray-500" />
//         </div>
//       </div>

//       <div className="mt-3">
//         {/* Table Controls */}
//         <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4">
//           {/* Title */}
//           <div className="w-full md:w-auto">
//             <h2 className="text-lg font-semibold text-gray-800">
//               Historical Prices
//             </h2>
//             <p className="text-sm text-gray-500">
//               {/* {filteredData.length} records found */}
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="w-full md:w-auto flex gap-2">
//             <button
//               onClick={handleEdit}
//               className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
//             >
//               <MdOutlineEdit />
//               Edit
//             </button>
//             <button
//               onClick={handleDelete}
//               className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
//             >
//               <RiDeleteBin6Fill className="text-red-500" />
//               Delete
//             </button>
//             <button
//               onClick={handleFilter}
//               className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
//             >
//               <IoFilterSharp />
//               Filter
//             </button>
//           </div>
//         </div>

//         {/* DataTable */}
//         <div className="overflow-auto rounded-lg border border-gray-200">
//           <DataTable
//             columns={columns}
//             data={filteredData}
//             customStyles={customStyles}
//             onRowClicked={handleRowClicked}
//             selectableRows
//             onSelectedRowsChange={handleChange}
//             clearSelectedRows={toggleCleared}
//             fixedHeader
//             fixedHeaderScrollHeight="500px"
//             responsive
//             pagination
//             pointerOnHover
//             selectableRowsHighlight
//             highlightOnHover
//           />
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {isDeleteConfirmOpen && (
//         <div className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
//             <div className="px-5 py-3 border-b border-[#D3D3D3]">
//               <h3 className="text-lg font-semibold flex gap-x-5 items-center">
//                 <IoWarning color="red" />
//                 Delete selected prices?
//               </h3>
//             </div>
//             <div className="mt-5 px-5 pb-5">
//               <p className="mb-4 text-center">
//                 Are you sure you want to delete {selectedRows.length} selected
//                 price(s)?
//               </p>
//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => setIsDeleteConfirmOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDelete}
//                   className="px-4 py-2 bg-[#BF3131] text-white rounded hover:bg-[#ff7e7e]"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HistoricalPricesPage;

import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <p>PROCESSING</p>
    </div>
  );
};

export default page;
