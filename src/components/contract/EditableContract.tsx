/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
  TUpdateContract,
} from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getsellers } from "@/api/sellerApi";
import { getBuyers } from "@/api/buyerApi";
import PreviewContract from "./PreviewContract";
import { updateContract } from "@/api/ContractAPi";
import toast from "react-hot-toast";
import BuyerSelect from "./BuyerSelect"; 
import SellerSelect from "./SellerSelect"; 

// Main Contract Component
interface ContractProps {
  contract: TContract;
}

const getFormattedSeasons = () => {
  if (typeof window === "undefined") {
    // Return empty array during SSR to avoid hydration mismatch
    return [];
  }

  // This gets the current year every time the function is called
  // So it automatically updates when the year changes
  const currentYear = new Date().getFullYear();

  // Generate seasons: 1 future season + current season + previous seasons back to 2021/2022
  // But filter out any seasons below 2021/2022
  const seasons = [];

  // Start from next year (future season) and go backwards
  for (let i = 0; i < 20; i++) {
    // 20 is a safe upper limit to ensure we capture all needed seasons
    const startYear = currentYear + 1 - i; // +1 for future season, then go backwards
    const endYear = startYear + 1;

    // Stop if we go below 2021/2022 season
    if (startYear < 2021) {
      break;
    }

    seasons.push(`${String(startYear)}/${String(endYear)}`);
  }

  return seasons;
};

const EditableContract: React.FC<ContractProps> = ({
  contract: initialContract,
}) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [showSellerContactDropdown, setShowSellerContactDropdown] =
    useState(false);
  const [selectedBuyerContactName, setSelectedBuyerContactName] = useState(
    initialContract.buyerContactName || ""
  );
  const [selectedSellerContactName, setSelectedSellerContactName] = useState(
    initialContract.sellerContactName || ""
  );
  const [uploadingBuyerContract, setUploadingBuyerContract] = useState(false);
  const [uploadingSellerContract, setUploadingSellerContract] = useState(false);
  const [preview, setPreview] = useState(false);
  const [contract, setContract] = useState({
    ...initialContract,
    deliveryPeriod: initialContract.deliveryPeriod || { start: "", end: "" },
  });
  const [hasChanges, setHasChanges] = useState(false);
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
    "Draft",
  ];

  const { data: sellersResponse } = useQuery({
    queryKey: ["sellers"],
    queryFn: () => getsellers({ limit: 100 }), // Pass parameters and call as function
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  const { data: buyersResponse } = useQuery({
    queryKey: ["buyers"],
    queryFn: () => getBuyers({ limit: 100 }), // Pass parameters and call as function
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
  const sellers = sellersResponse?.data || [];
  const buyers = buyersResponse?.data || [];

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

  const handleRemoveAttachment = (
    field: "attachedBuyerContract" | "attachedSellerContract"
  ) => {
    setContract((prev) => ({
      ...prev,
      [field]: null,
    }));
    setHasChanges(true);
  };

  const brokeragePayableOptions = [
    { name: "Buyer", value: "Buyer" },
    { name: "Seller", value: "Seller" },
    { name: "Seller & Buyer", value: "Seller & Buyer" },
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

  // Handle buyer selection from BuyerSelect component
  const handleBuyerSelect = (selectedBuyer: Buyer) => {
    setContract((prev) => ({
      ...prev,
      buyer: selectedBuyer._id,
    }));
    setHasChanges(true);
    
    // Auto-select first contact name if available
    if (selectedBuyer.contactName && selectedBuyer.contactName.length > 0) {
      const firstContactName = selectedBuyer.contactName[0];
      setSelectedBuyerContactName(firstContactName);
      setContract((prev) => ({
        ...prev,
        buyerContactName: firstContactName,
      }));
    } else {
      setSelectedBuyerContactName("");
      setContract((prev) => ({
        ...prev,
        buyerContactName: "",
      }));
    }
  };

  // Handle seller selection from SellerSelect component
const handleSellerSelect = (selectedSeller: Seller) => {
  setContract((prev) => ({
    ...prev,
    seller: selectedSeller._id,
    ngrNumber: selectedSeller.mainNgr,
  }));
  setHasChanges(true);
  
  // Auto-select first contact name if available - ADD THIS SECTION:
  if (selectedSeller.contactName && selectedSeller.contactName.length > 0) {
    const firstContactName = selectedSeller.contactName[0];
    setSelectedSellerContactName(firstContactName);
    setContract((prev) => ({
      ...prev,
      sellerContactName: firstContactName,
    }));
  } else {
    setSelectedSellerContactName("");
    setContract((prev) => ({
      ...prev,
      sellerContactName: "",
    }));
  }
};

  const handleContactSelect = (contactName) => {
    if (contactName !== contract.buyerContactName) {
      setSelectedBuyerContactName(contactName);
      setHasChanges(true);
    }
    setShowContactDropdown(false);
  };

const handleSellerContact = (contactName) => {
  if (contactName !== contract.sellerContactName) {
    setSelectedSellerContactName(contactName);
    setContract((prev) => ({
      ...prev,
      sellerContactName: contactName, // Add this line
    }));
    setHasChanges(true);
  }
  setShowSellerContactDropdown(false);
};

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
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
    field?: string, // Make field optional
    nestedObject?: keyof typeof contract
  ) => {
    const { name, value } = e.target;

    // Use provided field parameter, or fall back to the name attribute
    const fieldName = field || name;

    // Validate that we have a field name to work with
    if (!fieldName) {
      console.error("No field name provided for handleChange");
      return;
    }

    setContract((prev) => {
      const newContract = { ...prev };

      if (nestedObject) {
        // Handle nested object updates (like deliveryPeriod.start)
        (newContract as any)[nestedObject] = {
          ...(newContract as any)[nestedObject],
          [fieldName]: value,
        };
      } else {
        // Handle direct property updates
        (newContract as any)[fieldName] = value;
      }

      return newContract;
    });

    setHasChanges(true);
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);

    // Convert date range to string for storage in contract
    if (update[0] && update[1]) {
      const start = `${update[0].toLocaleDateString()}`;
      const end = `${update[1].toLocaleDateString()}`;

      setContract((prev) => ({
        ...prev,
        deliveryPeriod: { start, end },
      }));
      setHasChanges(true);
    } else {
      setContract((prev) => ({
        ...prev,
        deliveryPeriod: { start: "", end: "" },
      }));
    }
  };

  const contractId = contract._id as string;

  const updateContractMutation = useMutation({
    mutationFn: (updatedContract: TUpdateContract) =>
      updateContract(updatedContract, contractId),
    onSuccess: () => {
      // Refetch the specific contract
      queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
      // Also refetch the contracts list if you have one
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      router.push("/dashboard/contract-management");
    },
    onError: (error, variables, context) => {
      // Rollback on error if you were doing optimistic updates
      if (context?.previousContract) {
        queryClient.setQueryData(
          ["contract", contractId],
          context.previousContract
        );
      }
    },
  });

  const handleSave = async () => {
    // Extract buyer and seller IDs with proper validation
    const buyerId =
      typeof contract.buyer === "string" ? contract.buyer : contract.buyer?._id;

    const sellerId =
      typeof contract.seller === "string"
        ? contract.seller
        : contract.seller?._id;

    // Validate required fields before proceeding
    if (!buyerId || !sellerId) {
      toast.error("Buyer and seller information is required");
      return;
    }

    const contractToSave = {
      ...contract,
      buyer: buyerId,
      seller: sellerId,
      buyerContactName: selectedBuyerContactName || contract.buyerContactName,
      sellerContactName:
        selectedSellerContactName || contract.sellerContactName,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, updatedAt, _v, contractNumber, ...updatedContract } =
      contractToSave;
    updateContractMutation.mutate(updatedContract);
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

      <div className="flex flex-col items-center mx-auto max-w-6xl gap-6 xl:overflow-y-scroll xl:h-[40rem]">
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
                  value={contract?.contractNumber || ""}
                  readOnly
                  className="w-full font-semibold focus:outline-none p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                <p>Contract Date :</p>
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="date"
                  value={
                    contract?.contractDate
                      ? new Date(contract.contractDate)
                          .toISOString()
                          .split("T")[0]
                      : new Date(initialContract.createdAt)
                          .toISOString()
                          .split("T")[0]
                  }
                  onChange={(e) => handleChange(e, "contractDate")}
                  className="w-full border border-gray-300 p-1 rounded"
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
                  {getFormattedSeasons().map((season) => (
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
                  value={contract.weights || ""}
                  onChange={(e) => handleChange(e, "weights")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Price (ex GST)
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.priceExGST || ""}
                  onChange={(e) => handleChange(e, "priceExGST")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
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
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Buyer Contract Reference
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract?.buyerContractReference || ""}
                  onChange={(e) => handleChange(e, "buyerContractReference")}
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
                    {contract?.deliveryPeriod?.start &&
                    !isNaN(Date.parse(contract.deliveryPeriod.start))
                      ? new Date(contract.deliveryPeriod.start)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"}
                  </p>
                  <p className="text-sm">
                    End :{" "}
                    {contract?.deliveryPeriod?.end &&
                    !isNaN(Date.parse(contract.deliveryPeriod.end))
                      ? new Date(contract.deliveryPeriod.end)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="w-1/2 p-3">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
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
                  value={"Growth Grain Services"}
                  readOnly
                  className="w-full border border-gray-300 p-1 rounded focus:outline-none"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Broker Rate
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="number"
                  value={contract.brokerRate || ""}
                  onChange={(e) => handleChange(e, "brokerRate")}
                  className="w-full border border-gray-300 p-1 rounded appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
            <div className="flex border-b border-gray-300">
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

            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Seller Contract Reference
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  name="sellerContractReference" // Added name attribute
                  value={contract?.sellerContractReference || ""}
                  onChange={(e) => handleChange(e)} // Simplified onChange
                  className="w-full border border-gray-300 p-1 rounded"
                />
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
              <div className="w-1/2 p-3">
                {/* Use BuyerSelect component */}
                <BuyerSelect onSelect={handleBuyerSelect} />
                {/* Show selected buyer name */}
                {selectedBuyer && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                    <span className="text-blue-800 font-medium">Selected: </span>
                    <span className="text-blue-700">{selectedBuyer.name}</span>
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
              <div className="w-1/2 p-3 relative">
                <div
                  className="w-full p-2 rounded bg-gray-50 border border-gray-300 cursor-pointer flex items-center justify-between hover:bg-gray-100"
                  onClick={() => setShowContactDropdown(!showContactDropdown)}
                >
                  <span className="text-gray-700">
                    {selectedBuyerContactName || contract.buyerContactName || "No contact selected"}
                  </span>
                  {selectedBuyer?.contactName && selectedBuyer.contactName.length > 0 && (
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        showContactDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>

                {showContactDropdown && selectedBuyer?.contactName && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                    {selectedBuyer.contactName.map((contactName, index) => {
                      // Check if this contact name is the currently selected/existing one
                      const isSelected =
                        contactName === (selectedBuyerContactName || contract.buyerContactName);

                      return (
                        <div
                          key={index}
                          className={`p-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            isSelected
                              ? "bg-blue-100 text-blue-800 font-medium hover:bg-blue-200"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactSelect(contactName);
                          }}
                        >
                          {contactName}
                          {isSelected && (
                            <span className="ml-2 text-xs text-blue-600">
                              (Selected)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Click outside to close dropdown */}
                {showContactDropdown && (
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowContactDropdown(false)}
                  />
                )}

                {/* Show info if no contact names available */}
                {selectedBuyer && (!selectedBuyer.contactName || selectedBuyer.contactName.length === 0) && (
                  <div className="mt-1 text-xs text-gray-500">
                    No contact names available for this buyer
                  </div>
                )}
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
              <div className="w-1/2 p-3">
                {/* Use SellerSelect component */}
                <SellerSelect onSelect={handleSellerSelect} />
                {/* Show selected seller name */}
                {selectedSeller && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <span className="text-green-800 font-medium">Selected: </span>
                    <span className="text-green-700">{selectedSeller.legalName}</span>
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
                  <label className="block text-xs font-medium text-gray-700 uppercase">
                    NGR NUMBER
                  </label>
                  <select
                    name="ngrNumber"
                    onChange={(e) => handleChange(e, "ngrNumber")} // Fixed: use direct field name
                    value={contract.ngrNumber || selectedSeller?.mainNgr || ""} // Use contract.ngrNumber with fallback
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
                    required
                  >
                    <option value="">Select NGR Number</option>

                    {/* Main NGR - Always show if available */}
                    {selectedSeller?.mainNgr && (
                      <option
                        value={selectedSeller.mainNgr}
                        className="bg-blue-50 text-blue-800"
                      >
                        {selectedSeller.mainNgr} (Main NGR)
                      </option>
                    )}

                    {/* Additional NGRs */}
                    {selectedSeller?.additionalNgrs?.map((ngr, index) => (
                      <option key={index} value={ngr} className="text-gray-700">
                        {ngr} (Additional NGR)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contact Name
              </div>
              <div className="w-1/2 p-3 relative">
                <div
                  className="w-full p-2 rounded bg-gray-50 border border-gray-300 cursor-pointer flex items-center justify-between hover:bg-gray-100"
                  onClick={() =>
                    setShowSellerContactDropdown(!showSellerContactDropdown)
                  }
                >
                  <span className="text-gray-700">
  {selectedSellerContactName || contract.sellerContactName || "No contact selected"}
</span>
                 
                </div>

                {showSellerContactDropdown && selectedSeller?.contactName && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                    {selectedSeller.contactName.map((contactName, index) => {
                      // Check if this contact name is the currently selected/existing one
                      const isSelected =
                        contactName === contract.sellerContactName;

                      return (
                        <div
                          key={index}
                          className={`p-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            isSelected
                              ? "bg-blue-100 text-blue-800 font-medium hover:bg-blue-200"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSellerContact(contactName);
                          }}
                        >
                          {contactName}
                          {isSelected && (
                            <span className="ml-2 text-xs text-blue-600">
                              (Selected)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Click outside to close dropdown */}
                {showSellerContactDropdown && (
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowSellerContactDropdown(false)}
                  />
                )}
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
                  updateContractMutation.isPending
                }
                className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2 hover:bg-[#1e4a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <MdSave className="text-lg" />
                Save Changes
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