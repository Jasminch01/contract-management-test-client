/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MdArrowDropDown,
  MdCancel,
  MdDelete,
  MdKeyboardBackspace,
  MdSave,
} from "react-icons/md";
import { addDays } from "date-fns";
import {
  BrokeragePayableOption,
  Buyer,
  ContractStatus,
  Seller,
  TContract,
} from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getsellers } from "@/api/sellerApi";
import { getBuyers } from "@/api/buyerApi";
import PreviewContract from "./PreviewContract";
import { createContract } from "@/api/ContractAPi";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// Main Contract Component
interface ContractProps {
  contract: TContract;
}

const EditableContract: React.FC<ContractProps> = ({
  contract: initialContract,
}) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [uploadingBuyerContract, setUploadingBuyerContract] = useState(false);
  const [uploadingSellerContract, setUploadingSellerContract] = useState(false);
  const [preview, setPreview] = useState(false);
  const [contract, setContract] = useState(initialContract);
  const [hasChanges, setHasChanges] = useState(false);
  const [showBuyerDropdown, setShowBuyerDropdown] = useState(false);
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showBrokeragePayableDropdown, setShowBrokeragePayableDropdown] =
    useState(false);
  const [showConveyanceDropdown, setShowConveyanceDropdown] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [startDate, endDate] = dateRange;
  const statusOptions: ContractStatus[] = [
    "Incomplete",
    "Complete",
    "Invoiced",
  ];

  // Cloudinary upload function
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset"
    );
    formData.append("resource_type", "auto");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload file");
    }
  };

  const { data: sellers = [] } = useQuery({
    queryKey: ["sellers"],
    queryFn: getsellers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
  const { data: buyers = [] } = useQuery({
    queryKey: ["buyers"],
    queryFn: getBuyers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Get the selected buyer and seller objects for display
  const selectedBuyer = buyers.find(
    (buyer: Buyer) =>
      buyer._id ===
      (typeof contract.buyer === "string"
        ? contract.buyer
        : contract.buyer?._id)
  );
  const selectedSeller = sellers.find(
    (seller: Seller) =>
      seller._id ===
      (typeof contract.seller === "string"
        ? contract.seller
        : contract.seller?._id)
  );

  const handleRemoveAttachment = (
    field: "attachedBuyerContract" | "attachedSellerContract"
  ) => {
    setContract((prev) => ({
      ...prev,
      [field]: null,
    }));
    setHasChanges(true);
  };

  const generateSeasons = (yearsAhead = 10) => {
    const currentYear = new Date().getFullYear();
    const seasons = [];

    for (let i = 0; i < yearsAhead; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      seasons.push(`${startYear}/${endYear}`);
    }

    return seasons;
  };

  const brokeragePayableOptions = [
    { name: "Buyer", value: "Buyer" },
    { name: "Seller", value: "Seller" },
    { name: "Buyer & Seller", value: "Buyer & Seller" },
    { name: "No Brokerage Payable", value: "No Brokerage Payable" },
  ];

  const conveyanceOptions = [
    { value: "Port Zone", name: "Port Zone" },
    { value: "Del MZ", name: "Del MZ" },
    { value: "Del Destination", name: "Del Destination" },
    { value: "Free On Truck", name: "Free On Truck" },
    { value: "Ex-Farm", name: "Ex-Farm" },
    { value: "Track", name: "Track" },
    { value: "Delivered Site", name: "Delivered Site" },
    { value: "Free In Store", name: "Free In Store" },
    { value: "DCT", name: "DCT" },
    { value: "FOB", name: "FOB" },
  ];

  const handleBrokeragePayableSelect = (
    selectedOption: BrokeragePayableOption
  ) => {
    setContract((prev) => ({
      ...prev,
      brokeragePayableBy: selectedOption.value,
    }));
    setShowBrokeragePayableDropdown(false);
    setHasChanges(true);
  };

  // Store only buyer ID in contract
  const handleBuyerSelect = (selectedBuyer: Buyer) => {
    setContract((prev) => ({
      ...prev,
      buyer: selectedBuyer._id, // Ensure only ID is stored
    }));
    setShowBuyerDropdown(false);
    setHasChanges(true);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  const handleSellerSelect = (selectedSeller: Seller) => {
    setContract((prev) => ({
      ...prev,
      seller: selectedSeller._id, // Store only the ID
    }));
    setShowSellerDropdown(false);
    setHasChanges(true);
  };

  // Update status when a new status is selected
  const handleStatusSelect = (selectedStatus: ContractStatus) => {
    setContract((prev) => ({
      ...prev,
      status: selectedStatus,
    }));
    setShowStatusDropdown(false);
    setHasChanges(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: string,
    nestedObject?: keyof typeof contract // Use keyof to restrict to actual property names
  ) => {
    const { value } = e.target;
    setContract((prev) => {
      const newContract = { ...prev };
      if (nestedObject) {
        // Type assertion for nested object update
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newContract as any)[nestedObject] = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(newContract as any)[nestedObject],
          [field]: value,
        };
      } else {
        // Type assertion for direct property update
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newContract as any)[field] = value;
      }
      return newContract;
    });
    setHasChanges(true);
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    try {
      const [start, end] = update;
      setDateRange(update);

      // Only update contract when both dates are selected and valid
      if (start && end && start instanceof Date && end instanceof Date) {
        // Validate dates are not invalid
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          // Use ISO string for consistent date formatting
          const startStr = start.toISOString().split("T")[0]; // YYYY-MM-DD format
          const endStr = end.toISOString().split("T")[0];

          setContract((prev) => ({
            ...prev,
            deliveryPeriod: { start: startStr, end: endStr },
          }));
          setHasChanges(true);
        }
      } else if (!start && !end) {
        // Clear dates when picker is cleared
        setContract((prev) => ({
          ...prev,
          deliveryPeriod: { start: "", end: "" },
        }));
        setHasChanges(true);
      }
    } catch (error) {
      console.error("Date handling error:", error);
      // Reset to safe state on error
      setDateRange([null, null]);
      setContract((prev) => ({
        ...prev,
        deliveryPeriod: { start: "", end: "" },
      }));
    }
  };
  // Handle buyer contract file upload
  const handleBuyerContractUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    // Validate file size (e.g., max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadingBuyerContract(true);
    try {
      const url = await uploadToCloudinary(file);
      setContract((prev) => ({
        ...prev,
        attachedBuyerContract: url,
      }));
      setHasChanges(true);
      toast.success("Buyer contract uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload buyer contract");
      console.error("Upload error:", error);
    } finally {
      setUploadingBuyerContract(false);
    }
  };

  // Handle seller contract file upload
  const handleSellerContractUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    // Validate file size (e.g., max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadingSellerContract(true);
    try {
      const url = await uploadToCloudinary(file);
      setContract((prev) => ({
        ...prev,
        attachedSellerContract: url,
      }));
      setHasChanges(true);
      toast.success("Seller contract uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload seller contract");
      console.error("Upload error:", error);
    } finally {
      setUploadingSellerContract(false);
    }
  };

  const createContractMutation = useMutation({
    mutationFn: createContract,
    onSuccess: async () => {
      try {
        // Force immediate refetch of all contract-related queries
        await Promise.all([
          queryClient.refetchQueries({ queryKey: ["contracts"] }),
          queryClient.refetchQueries({ queryKey: ["contract"] }),
        ]);

        // Also invalidate to ensure future queries are fresh
        queryClient.invalidateQueries({ queryKey: ["contracts"] });
        queryClient.invalidateQueries({ queryKey: ["contract"] });

        toast.success("Contract duplicated successfully!");
        router.push("/dashboard/contract-management");
      } catch (error) {
        console.error("Error refetching queries:", error);
        // Still navigate even if refetch fails
        router.push("/dashboard/contract-management");
      }
    },
    onError: (error) => {
      console.error("Error creating contract:", error);
      toast.error("Failed to duplicate contract. Please try again.");
    },
  });

  const handleSave = () => {
    const contractToSave = {
      ...contract,
      buyer:
        typeof contract.buyer === "string"
          ? contract.buyer
          : contract.buyer?._id,
      seller:
        typeof contract.seller === "string"
          ? contract.seller
          : contract.seller?._id,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, contractNumber, createdAt, _v, updatedAt, ...contractWithoutId } = contractToSave;
    createContractMutation.mutate(contractWithoutId);
  };

  const handleCancel = () => {
    setContract(initialContract);
    setHasChanges(false);
  };

  // Handle conveyance selection
  const handleConveyanceChange = (value: string) => {
    setContract((prev) => ({
      ...prev,
      conveyance: value,
    }));
    setShowConveyanceDropdown(false);
    setHasChanges(true);
  };

  // Show preview component if preview is true
  if (preview) {
    return (
      <PreviewContract
        contract={contract}
        selectedBuyer={selectedBuyer}
        selectedSeller={selectedSeller}
        onBackToEdit={() => setPreview(false)}
      />
    );
  }

  return (
    <div>
      <div className="my-10 grid grid-cols-3 items-center">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-start ml-20 cursor-pointer"
        >
          <MdKeyboardBackspace size={24} />
        </button>
        <p className="text-lg text-center col-span-1">
          {contract.commodity} - {contract.season}
        </p>
        <div></div> {/* Empty div to balance the grid */}
      </div>

      <div className="flex flex-col items-center mx-auto max-w-6xl gap-6 xl:overflow-y-scroll xl:h-[40rem] xl:scrollbar-hide ">
        {/* Main Contract Details */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col border border-gray-300 rounded-md">
            <div className="flex border-b border-gray-300 w-full">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contract Number
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.contractNumber || ""}
                  // onChange={(e) => handleChange(e, "contractNumber")}
                  className="w-full border border-gray-300 p-1 rounded"
                  readOnly
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contract Date
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={
                    new Date().toISOString().split("T")[0] ||
                    ""
                  }
                  onChange={(e) => handleChange(e, "contractDate")}
                  className="w-full border border-gray-300 p-1 rounded"
                  readOnly
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Commodity
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.commodity || ""}
                  onChange={(e) => handleChange(e, "commodity")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Season</div>
              <div className="w-1/2 p-3">
                <select
                  value={contract.season || ""}
                  onChange={(e) => handleChange(e, "season")}
                  className="w-full border border-gray-300 p-1 rounded"
                >
                  <option value="">Select Season</option>
                  {generateSeasons(10).map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Tolerance
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="number"
                  value={contract.tolerance || ""}
                  onChange={(e) => handleChange(e, "tolerance")}
                  className="w-full border border-gray-300 p-1 rounded appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Tonnes</div>
              <div className="w-1/2 p-3">
                <input
                  type="number"
                  value={contract.tonnes || ""}
                  onChange={(e) => handleChange(e, "tonnes")}
                  className="w-full border border-gray-300 p-1 rounded appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Grade</div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.grade || ""}
                  onChange={(e) => handleChange(e, "grade")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Weights
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="number"
                  value={contract.weights || ""}
                  onChange={(e) => handleChange(e, "weights")}
                  className="w-full border border-gray-300 p-1 roundedappearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Price (ex GST)
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="number"
                  value={contract.priceExGST || ""}
                  onChange={(e) => handleChange(e, "priceExGST")}
                  className="w-full border border-gray-300 p-1 rounded appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Delivered Destination
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.deliveryDestination || ""}
                  onChange={(e) => handleChange(e, "deliveryDestination")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col border border-gray-300 rounded-md">
            <div className="flex border-b border-gray-300 w-full">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Delivery Period
                <div>
                  <p className="text-sm">
                    Start :{" "}
                    {new Date(contract?.deliveryPeriod?.start)
                      .toISOString()
                      .split("T")[0] || "N/A"}
                  </p>
                  <p className="text-sm">
                    End :{" "}
                    {new Date(contract?.deliveryPeriod?.end)
                      .toISOString()
                      .split("T")[0] || "N/A"}
                  </p>
                </div>
              </div>
              <div className="w-1/2 p-3">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate} // This uses the destructured value from dateRange
                  endDate={endDate} // This uses the destructured value from dateRange
                  onChange={handleDateChange}
                  isClearable={true}
                  placeholderText="Select date range"
                  className="mt-1 w-full xl:w-[250px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  calendarClassName="w-full sm:w-auto"
                  dateFormat="MMM d, yyyy"
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 365)}
                  shouldCloseOnSelect={false}
                  selectsDisabledDaysInRange
                  required
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Delivery Option
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.deliveryOption || ""}
                  onChange={(e) => handleChange(e, "deliveryOption")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Payment Terms
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.paymentTerms || ""}
                  onChange={(e) => handleChange(e, "paymentTerms")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Freight
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.freight || ""}
                  onChange={(e) => handleChange(e, "freight")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Certification
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.certificationScheme || ""}
                  onChange={(e) => handleChange(e, "certificationScheme")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Broker</div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={selectedSeller?.legalName || ""}
                  onChange={(e) => handleChange(e, "broker")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Broker Rate
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.brokerRate || ""}
                  onChange={(e) => handleChange(e, "brokerRate")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>

            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Brokerage Payable By
              </div>
              <div className="w-1/2 p-3 relative">
                <div
                  className="w-full border border-gray-300 p-1 rounded flex justify-between items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBrokeragePayableDropdown(
                      !showBrokeragePayableDropdown
                    );
                  }}
                >
                  <span>{contract.brokeragePayableBy || "Select Option"}</span>
                  <MdArrowDropDown className="text-xl" />
                </div>
                {showBrokeragePayableDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                    {brokeragePayableOptions.map((option) => (
                      <div
                        key={option.value}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBrokeragePayableSelect(option);
                        }}
                      >
                        {option.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Conveyance
              </div>
              <div className="w-1/2 p-3 relative">
                <div
                  className="w-full border border-gray-300 p-1 rounded flex justify-between items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConveyanceDropdown(!showConveyanceDropdown);
                  }}
                >
                  <span>
                    {conveyanceOptions.find(
                      (opt) => opt.value === contract.conveyance
                    )?.name || "Select Conveyance"}
                  </span>
                  <MdArrowDropDown className="text-xl" />
                </div>
                {showConveyanceDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                    {conveyanceOptions.map((option) => (
                      <div
                        key={option.value}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConveyanceChange(option.value);
                        }}
                      >
                        {option.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Status</div>
              <div className="w-1/2 p-3 relative">
                <div
                  className="w-full border border-gray-300 p-1 rounded flex justify-between items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusDropdown(!showStatusDropdown);
                  }}
                >
                  <span className="capitalize">{contract.status || ""}</span>
                  <MdArrowDropDown className="text-xl" />
                </div>
                {showStatusDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                    {statusOptions.map((status) => (
                      <div
                        key={status}
                        className="p-2 hover:bg-gray-100 cursor-pointer capitalize"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusSelect(status);
                        }}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Information */}
        <div className="w-full border border-gray-300 rounded-md">
          <div className="border-b border-gray-300 p-3 bg-gray-50">
            <p className="font-semibold">Buyer Information</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Buyer Name
              </div>
              <div className="w-1/2 p-3 relative">
                <div
                  className="w-full border border-gray-300 p-1 rounded flex justify-between items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBuyerDropdown(!showBuyerDropdown);
                  }}
                >
                  <span>{selectedBuyer?.name || "Select Buyer"}</span>
                  <MdArrowDropDown className="text-xl" />
                </div>
                {showBuyerDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                    {buyers.map((buyer) => (
                      <div
                        key={buyer._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyerSelect(buyer);
                        }}
                      >
                        {buyer.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">ABN</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {selectedBuyer?.abn || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Office Address
              </div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {selectedBuyer?.officeAddress || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contact Name
              </div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {selectedBuyer?.contactName || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Email</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {selectedBuyer?.email || ""}
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Phone</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {selectedBuyer?.phoneNumber || ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="w-full border border-gray-300 rounded-md">
          <div className="border-b border-gray-300 p-3 bg-gray-50">
            <p className="font-semibold">Seller Information</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Legal Name
              </div>
              <div className="w-1/2 p-3 relative">
                <div
                  className="w-full border border-gray-300 p-1 rounded flex justify-between items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSellerDropdown(!showSellerDropdown);
                  }}
                >
                  <span>{selectedSeller?.legalName || "Select Seller"}</span>
                  <MdArrowDropDown className="text-xl" />
                </div>
                {showSellerDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                    {sellers.map((seller) => (
                      <div
                        key={seller._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSellerSelect(seller);
                        }}
                      >
                        {seller.legalName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Office Address
              </div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {selectedSeller?.address || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">ABN</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {selectedSeller?.abn || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Main NGR
              </div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {selectedSeller?.mainNgr || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contact Name
              </div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {selectedSeller?.contactName || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Email</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {selectedSeller?.email || ""}
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Phone</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {selectedSeller?.phoneNumber || ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="w-full border border-gray-300 rounded-md">
          <div className="border-b border-gray-300 p-3 bg-gray-50">
            <p className="font-semibold">Additional Information</p>
          </div>
          <div className="grid grid-cols-1">
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Special Conditions
              </div>
              <div className="w-1/2 p-3">
                <textarea
                  value={contract.specialCondition || ""}
                  onChange={(e) => handleChange(e, "specialCondition")}
                  className="w-full border border-gray-300 p-1 rounded"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Terms & Conditions
              </div>
              <div className="w-1/2 p-3">
                <textarea
                  value={contract.termsAndConditions || ""}
                  onChange={(e) => handleChange(e, "termsAndConditions")}
                  className="w-full border border-gray-300 p-1 rounded"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Notes</div>
              <div className="w-1/2 p-3">
                <textarea
                  value={contract.notes || ""}
                  onChange={(e) => handleChange(e, "notes")}
                  className="w-full border border-gray-300 p-1 rounded"
                  rows={3}
                />
              </div>
            </div>
            {/* Updated Attachments Section */}
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Attachments
              </div>
              <div className="w-1/2 p-3">
                <div className="flex flex-col gap-4">
                  {/* Seller Contract */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">
                      Seller Contract
                    </label>
                    {contract.attachedSellerContract ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={contract.attachedSellerContract}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Current File
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveAttachment("attachedSellerContract")
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 relative">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleSellerContractUpload}
                          disabled={uploadingSellerContract}
                          className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-50 file:text-gray-700
                hover:file:bg-gray-100 disabled:opacity-50"
                        />
                        {uploadingSellerContract && (
                          <div className="absolute right-2">
                            <AiOutlineLoading3Quarters className="animate-spin text-gray-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Buyer Contract */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">
                      Buyer Contract
                    </label>
                    {contract.attachedBuyerContract ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={contract.attachedBuyerContract}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Current File
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveAttachment("attachedBuyerContract")
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 relative">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleBuyerContractUpload}
                          disabled={uploadingBuyerContract}
                          className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-50 file:text-gray-700
                hover:file:bg-gray-100 disabled:opacity-50"
                        />
                        {uploadingBuyerContract && (
                          <div className="absolute right-2">
                            <AiOutlineLoading3Quarters className="animate-spin text-gray-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Only show when there are changes */}
        <div className="mt-10 w-full flex justify-center gap-5 sticky bottom-0 bg-white py-4">
          {/* Always show Preview button */}
          <button
            type="button"
            onClick={() => setPreview(true)}
            className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2"
          >
            Preview Contract
          </button>

          {/* Only show Save and Cancel when there are changes */}
          {hasChanges && (
            <>
              <button
                onClick={handleSave}
                disabled={
                  uploadingBuyerContract ||
                  uploadingSellerContract ||
                  createContractMutation.isPending
                }
                className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2 hover:bg-[#1e4a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <MdSave className="text-lg" />
                Duplicate
              </button>
              <button
                onClick={handleCancel}
                className="py-2 px-5 bg-gray-500 text-white rounded flex items-center gap-2 hover:bg-gray-600 transition-colors"
              >
                <MdCancel className="text-lg" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableContract;
