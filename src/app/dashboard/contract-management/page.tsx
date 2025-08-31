"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { IoIosPersonAdd, IoIosSend } from "react-icons/io";
import { IoFilterSharp, IoWarning } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { RiCircleFill, RiDeleteBin6Fill } from "react-icons/ri";
import ExportCsv from "@/components/contract/ExportCsv";
import PdfExportButton from "@/components/contract/PdfExportButton";
import AdvanceSearchFilter from "@/components/contract/AdvanceSearchFilter";
import { fetchContracts, moveContractToTrash } from "@/api/ContractAPi";
import { TContract } from "@/types/types";

const columns = [
  {
    name: "DATE",
    selector: (row: TContract) => {
      if (!row?.createdAt) return "";
      const date = new Date(row.contractDate || row.createdAt);
      return date.toLocaleDateString();
    },
    sortable: true,
  },
  {
    name: "CONTRACT NUMBER",
    selector: (row: TContract) => row?.contractNumber || "",
    sortable: true,
  },
  {
    name: "SEASON",
    selector: (row: TContract) => row?.season || "",
    sortable: true,
  },
  {
    name: "NGR",
    selector: (row: TContract) => row?.ngrNumber || row?.seller?.mainNgr || "",
    sortable: true,
  },
  {
    name: "SELLER",
    selector: (row: TContract) => row?.seller?.legalName || "",
    sortable: true,
  },
  {
    name: "GRADE",
    selector: (row: TContract) => row?.grade || "",
    sortable: true,
  },
  {
    name: "TONNES",
    selector: (row: TContract) => row?.tonnes || 0,
    sortable: true,
  },
  {
    name: "BUYER",
    selector: (row: TContract) => row?.buyer?.name || "",
    sortable: true,
  },
  {
    name: "DESTINATION",
    selector: (row: TContract) => row?.deliveryDestination || "",
    sortable: true,
  },
  {
    name: "CONTRACT PRICE",
    selector: (row: TContract) => row?.priceExGST || 0,
    sortable: true,
  },
  {
    name: "STATUS",
    selector: (row: TContract) => row?.status || "",
    sortable: true,
    cell: (row: TContract) => (
      <p className={`text-xs flex items-center gap-x-3`}>
        <RiCircleFill
          className={`${
            row.status?.toLowerCase() === "complete"
              ? "text-[#108A2B]" // Green for completed
              : row.status?.toLowerCase() === "invoiced"
              ? "text-[#3B82F6]" // Blue for invoiced
              : row.status?.toLowerCase() === "draft"
              ? "text-[#EF4444]" // Red for draft
              : "text-[#FAD957]" // Yellow for incomplete (default)
          }`}
        />
        {row.status || "Unknown"}
      </p>
    ),
  },
  {
    name: "NOTES",
    selector: (row: TContract) => row.notes || "",
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

const statusOptions = [
  { value: "Complete", label: "Complete" },
  { value: "Incomplete", label: "Incomplete" },
  { value: "Invoiced", label: "Invoiced" },
  { value: "Draft", label: "Draft" },
];

const ContractManagementPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // State management with better initialization
  const [isMounted, setIsMounted] = useState(false);
  const [masterData, setMasterData] = useState<TContract[]>([]);
  const [data, setData] = useState<TContract[]>([]);
  const [selectedRows, setSelectedRows] = useState<TContract[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [toggleCleared, setToggleCleared] = useState(false);
  const [searchFilteredData, setSearchFilteredData] = useState<TContract[]>([]);

  // Set mounted state on client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // Fetch contracts using TanStack Query
  const {
    data: contracts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: isMounted, // Only fetch after component is mounted
  });

  // FIXED: Better data synchronization
  useEffect(() => {
    if (contracts && isMounted) {
      // Filter out deleted contracts if needed
      const activeContracts = contracts.filter(
        (contract) => !contract.isDeleted
      );

      setMasterData((prev) => {
        // Only update if data has changed to prevent unnecessary renders
        return JSON.stringify(prev) !== JSON.stringify(activeContracts)
          ? activeContracts
          : prev;
      });
      setSearchFilteredData((prev) => {
        return JSON.stringify(prev) !== JSON.stringify(activeContracts)
          ? activeContracts
          : prev;
      });

      // Apply current filters to new data
      let filteredData = activeContracts;
      if (selectedStatus !== "all") {
        filteredData = filteredData.filter(
          (contract) =>
            contract.status?.toLowerCase() === selectedStatus.toLowerCase()
        );
      }
      setData((prev) => {
        return JSON.stringify(prev) !== JSON.stringify(filteredData)
          ? filteredData
          : prev;
      });
    }
  }, [contracts, isMounted, selectedStatus]); // Added selectedStatus to dependencies

  // FIXED: Delete mutation with better error handling and state management
  const deleteMutation = useMutation({
    mutationFn: moveContractToTrash,
    onSuccess: () => {
      console.log("Delete successful, invalidating queries...");

      // Invalidate and refetch both queries
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["deletedItems"] });

      // Clear selections and close modal
      setSelectedRows([]);
      setToggleCleared((prev) => !prev);
      setIsDeleteConfirmOpen(false);

      toast.success("Contract(s) deleted successfully");

      // Removed refetch() to rely on automatic refetch from invalidateQueries
    },
    onError: (error) => {
      console.error("Error deleting contracts:", error);
      toast.error("Failed to delete contracts. Please try again.");
    },
  });

  // Handle row click to view details
  const handleRowClicked = (row: TContract) => {
    if (row?._id) {
      router.push(`/dashboard/contract-management/${row._id}`);
    }
  };

  // FIXED: Handle row selection with better validation
  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: TContract[];
  }) => {
    const validSelectedRows = selected.selectedRows.filter(
      (row): row is TContract => row != null && row._id != null
    );
    setSelectedRows(validSelectedRows);
  };

  // FIXED: Handle filter change from search component
  const handleFilterChange = useCallback(
    (filteredData: TContract[]) => {
      setSearchFilteredData(filteredData);

      // Apply status filter directly without calling applyFilters
      let finalData = filteredData;
      if (selectedStatus !== "all") {
        finalData = filteredData.filter(
          (contract) =>
            contract.status?.toLowerCase() === selectedStatus.toLowerCase()
        );
      }
      setData(finalData);
    },
    [selectedStatus]
  );

  // FIXED: Handle status change with proper filter application
  const handleStatusChange = useCallback(
    (value: string) => {
      setSelectedStatus(value);
      setIsFilterActive(value !== "all");
      setIsFilterOpen(false);

      // Apply filter directly without calling applyFilters
      let filteredData = searchFilteredData;
      if (value !== "all") {
        filteredData = searchFilteredData.filter(
          (contract) => contract.status?.toLowerCase() === value.toLowerCase()
        );
      }
      setData(filteredData);
    },
    [searchFilteredData]
  );

  // FIXED: Clear filter function
  const clearFilter = useCallback(() => {
    setSelectedStatus("all");
    setIsFilterActive(false);
    setIsFilterOpen(false);
    setData(searchFilteredData); // Just set data directly without filtering
  }, [searchFilteredData]);

  // Handle delete selected contracts
  const handleDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one contract to delete");
      return;
    }
    setIsDeleteConfirmOpen(true);
  };

  // FIXED: Confirm delete with better validation
  const confirmDelete = () => {
    const selectedIds = selectedRows
      .filter((row): row is TContract => row != null && row._id != null)
      .map((row) => row._id!)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    if (selectedIds.length === 0) {
      toast.error("No valid contracts selected for deletion");
      setIsDeleteConfirmOpen(false);
      return;
    }
    deleteMutation.mutate(selectedIds);
  };

  // Handle edit selected contract
  const handleEdit = () => {
    if (selectedRows.length !== 1) {
      toast.error("Please select exactly one contract to edit");
      return;
    }

    const contract = selectedRows[0];
    if (contract?._id) {
      router.push(`/dashboard/contract-management/edit/${contract._id}`);
    } else {
      toast.error("Selected contract is invalid");
    }
  };

  const handleDuplicate = () => {
    if (selectedRows.length !== 1) {
      toast.error("Please select exactly one contract to duplicate");
      return;
    }

    const contract = selectedRows[0];
    if (contract?._id) {
      router.push(`/dashboard/contract-management/duplicate/${contract._id}`);
    } else {
      toast.error("Selected contract is invalid");
    }
  };

  // Updated handleEmail function that uses your existing PDF components
  const handleEmail = async (recipientType: "buyer" | "seller") => {
    if (selectedRows.length === 0) {
      toast.error(
        `Please select at least one contract to email ${recipientType}`
      );
      return;
    }

    try {
      toast.loading("Generating PDF and preparing email...");

      const validRows = selectedRows.filter(
        (row): row is TContract => row != null
      );
      const recipients = validRows
        .map((row) =>
          recipientType === "buyer" ? row.buyer?.email : row.seller?.email
        )
        .filter((email): email is string => Boolean(email));

      if (recipients.length === 0) {
        toast.error(
          `No valid ${recipientType} emails found in selected contracts`
        );
        return;
      }

      // Generate PDF blob using your existing ExportContractPdf component
      const pdfBlob = await generatePDFBlobFromComponent(validRows);

      if (!pdfBlob) {
        throw new Error("Failed to generate PDF");
      }

      // Upload to Cloudinary
      const filename = `contracts_${recipientType}_${Date.now()}.pdf`;
      const cloudinaryResponse = await uploadPDFToCloudinary(pdfBlob, filename);

      // Create subject
      let subject;
      const contract = validRows[0];
      if (recipientType === "seller" && validRows.length === 1) {
        subject = `Broker Note - ${contract.contractNumber || ""} ${
          contract.tonnes || 0
        }mt ${contract.grade || ""} ${contract.deliveryOption || "Delivered"} ${
          contract.deliveryDestination || ""
        }`;
      } else {
        subject = `${validRows.length} Contract(s) - ${
          recipientType === "buyer" ? "Buyer" : "Seller"
        } Documents`;
      }

      // Enhanced email body with PDF link
      const contractSummary = validRows
        .map(
          (contract) =>
            `• ${contract.contractNumber} - ${contract.tonnes}mt ${contract.grade} (${contract.buyer?.name} ↔ ${contract.seller?.legalName})`
        )
        .join("\n");

      const emailBody = `Dear ${
        recipientType.charAt(0).toUpperCase() + recipientType.slice(1)
      },

Please find the contract document(s) attached below:

${contractSummary}

📎 Download PDF: ${cloudinaryResponse.secure_url}

If you have any questions, please don't hesitate to contact us.

Best regards,
Contract Management Team`;

      // const emailParam = recipientType === "seller" ? "to" : "bcc";
      const gmailParams = new URLSearchParams({
        view: "cm",
        fs: "1",
        to: recipients.join(","),
        // [emailParam]: recipients.join(","),
        su: subject,
        body: emailBody,
      });

      const gmailLink = `https://mail.google.com/mail/?${gmailParams.toString()}`;

      toast.dismiss();
      window.open(gmailLink, "_blank");
      toast.success(
        `Email prepared with PDF for ${recipients.length} ${recipientType}(s)`
      );
    } catch (error) {
      toast.dismiss();
      console.error("Error preparing email with PDF:", error);
      toast.error("Failed to generate PDF and prepare email");
    }
  };

  // Function to generate PDF blob using your existing ExportContractPdf component
  const generatePDFBlobFromComponent = async (
    contracts: TContract[]
  ): Promise<Blob | null> => {
    try {
      // Import the pdf function from @react-pdf/renderer
      const { pdf } = await import("@react-pdf/renderer");

      // Dynamically import your ExportContractPdf component to avoid SSR issues
      const ExportContractPdf = (
        await import("@/components/contract/ExportContractPdf")
      ).default;

      // Generate PDF blob using your existing component
      const blob = await pdf(
        <ExportContractPdf contracts={contracts} />
      ).toBlob();

      return blob;
    } catch (error) {
      console.error("Error generating PDF from component:", error);
      return null;
    }
  };

  // Updated utility function for Cloudinary upload (fixed for PDF files)
  const uploadPDFToCloudinary = async (
    pdfBlob: Blob,
    filename: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("file", pdfBlob, filename);
    formData.append("resource_type", "raw"); // Important for PDF files
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload PDF to Cloudinary: ${errorText}`);
    }

    return response.json();
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="mt-20 flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A5D36]"></div>
        <span className="ml-3 text-gray-600">Initializing...</span>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-20 flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A5D36]"></div>
        <span className="ml-3 text-gray-600">Loading contracts...</span>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="mt-20 flex flex-col justify-center items-center min-h-64">
        <div className="text-red-500 text-center">
          <IoWarning className="text-4xl mx-auto mb-2" />
          <p className="text-lg font-semibold">Error loading contracts</p>
          <p className="text-sm text-gray-600 mt-1">
            {error?.message || "Something went wrong"}
          </p>
        </div>
        <button
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
            refetch();
          }}
          className="mt-4 px-4 py-2 bg-[#2A5D36] text-white rounded hover:bg-[#1e4728] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <Toaster />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-300 px-4">
        <div className="w-full md:w-auto">
          <Link href="/dashboard/contract-management/create-contract">
            <button className="w-full md:w-auto px-3 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-[#1e4728] transition-colors rounded">
              Create New Contract
              <IoIosPersonAdd className="text-lg" />
            </button>
          </Link>
        </div>

        <div className="w-full xl:w-[30rem] md:w-64 lg:w-80 relative">
          <AdvanceSearchFilter
            data={masterData}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Table Controls */}
      <div className="mt-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4">
          <div className="w-full md:w-auto">
            <p className="text-lg font-semibold">
              List of Contracts ({data.length})
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto lg:flex lg:flex-row gap-2 grid grid-cols-3">
            <button
              onClick={handleDuplicate}
              className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
                selectedRows.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50 pointer-events-none"
              }`}
            >
              <HiOutlineDocumentDuplicate />
              Duplicate
            </button>
            <ExportCsv selectedRows={selectedRows} />
            <PdfExportButton selectedRows={selectedRows} />

            <button
              onClick={() => handleEmail("buyer")}
              className={`w-full md:w-auto xl:px-3 xl:py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
                selectedRows.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50 pointer-events-none"
              }`}
            >
              <IoIosSend />
              Email to Buyer
            </button>
            <button
              onClick={() => handleEmail("seller")}
              className={`w-full md:w-auto xl:px-3 xl:py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
                selectedRows.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50 pointer-events-none"
              }`}
            >
              <IoIosSend />
              Email to Seller
            </button>
            <button
              onClick={handleEdit}
              className={`w-full md:w-auto xl:px-3 xl:py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
                selectedRows.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50 pointer-events-none"
              }`}
            >
              <MdOutlineEdit />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className={`w-full md:w-auto xl:px-3 xl:py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
                selectedRows.length > 0 && !deleteMutation.isPending
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50 pointer-events-none"
              }`}
            >
              <RiDeleteBin6Fill className="text-red-500" />
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`w-full md:w-auto xl:px-3 xl:py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors`}
              >
                <IoFilterSharp />
                Filter
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 p-3">
                    <p className="font-medium text-gray-700">
                      Filter by Status
                    </p>
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    <div
                      className={`px-4 py-2 text-sm cursor-pointer flex items-center ${
                        selectedStatus === "all"
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleStatusChange("all")}
                    >
                      <span className="flex-grow">All</span>
                      {selectedStatus === "all" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    {statusOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`px-4 py-2 text-sm cursor-pointer flex items-center ${
                          selectedStatus === option.value
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleStatusChange(option.value)}
                      >
                        <span className="flex-grow">{option.label}</span>
                        {selectedStatus === option.value && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>

                  {isFilterActive && (
                    <div
                      className="border-t border-gray-200 px-4 py-2 text-sm cursor-pointer text-red-500 hover:bg-red-50 flex items-center justify-between"
                      onClick={clearFilter}
                    >
                      <span>Clear filter</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
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
            clearSelectedRows={toggleCleared}
            fixedHeader
            fixedHeaderScrollHeight="500px"
            highlightOnHover
            selectableRowsHighlight
            responsive
            pagination
            pointerOnHover
            noDataComponent={
              <div className="p-10 text-center text-gray-500">
                {masterData.length === 0
                  ? "No contracts found. Create your first contract to get started."
                  : "No contracts found matching your current filters."}
              </div>
            }
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="px-5 py-3 border-b border-[#D3D3D3]">
              <h3 className="text-lg font-semibold flex gap-x-5 items-center">
                <IoWarning className="text-red-500" />
                Move to Trash
              </h3>
            </div>
            <div className="mt-5 px-5 pb-5">
              <p className="mb-4 text-center">
                Are you sure you want to move trash{" "}
                {selectedRows.length > 1
                  ? `these ${selectedRows.length} contracts`
                  : "this contract"}
                ?
                <br />
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-[#BF3131] text-white rounded hover:bg-[#a52a2a] disabled:opacity-50 flex items-center gap-2"
                >
                  {deleteMutation.isPending && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {deleteMutation.isPending ? "Moving..." : "Move"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagementPage;
