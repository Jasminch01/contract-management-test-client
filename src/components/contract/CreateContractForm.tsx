"use client";
import { IoArrowBack } from "react-icons/io5";
import BuyerSelect from "./BuyerSelect";
import SellerSelect from "./SellerSelect";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { useState, useEffect } from "react";
import SelectBuyerSeller from "./SelectBuyerSeller";
import SelectContractType from "./SelectContractType";
import {
  Buyer,
  ContractType,
  Seller,
  TContract,
  TUpdateContract,
} from "@/types/types";
import toast from "react-hot-toast";
import ConveyanceSelect from "./ConveyanceSelect";
import { createContract } from "@/api/ContractAPi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CiExport } from "react-icons/ci";

const CreateContractForm = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [formData, setFormData] = useState<TUpdateContract>({
    buyerContractReference: "",
    sellerContractReference: "",
    grade: "",
    buyer: "",
    seller: "",
    contractType: "",
    deliveryOption: "",
    deliveryPeriod: {
      start: "",
      end: "",
    },
    freight: "",
    weights: "",
    priceExGST: "",
    conveyance: "",
    attachedSellerContract: "",
    attachedBuyerContract: "",
    commodity: "",
    certificationScheme: "",
    paymentTerms: "",
    brokerRate: "",
    deliveryDestination: "",
    brokeragePayableBy: "",
    specialCondition: "",
    termsAndConditions: "",
    notes: "",
    tonnes: 0,
    ngrNumber: "",
    tolerance: "",
    season: "",
  });

  const [isGrowerContract, setIsGrowerContract] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const [startDate, endDate] = dateRange;
  const router = useRouter();
  const queryClient = useQueryClient();

  const createContractMutation = useMutation({
    mutationFn: createContract,
    onSuccess: (data) => {
      // Invalidate and refetch contracts list
      queryClient.invalidateQueries({ queryKey: ["contracts"] });

      // Or optimistically update the cache - with null check
      queryClient.setQueryData(
        ["contracts"],
        (old: TContract[] | undefined) => {
          // Handle case where old data doesn't exist
          const existingContracts = old || [];
          return [data, ...existingContracts];
        }
      );
      toast.success("Contract created successfully!");
      router.push("/contract-management");
    },
    onError: (error) => {
      console.error("Error creating contract:", error);
      toast.error("Failed to create contract. Please try again.");
    },
  });

  // Update isGrowerContract when contractType changes
  useEffect(() => {
    setIsGrowerContract(formData.contractType === "Grower");
  }, [formData.contractType]);

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);

    // Convert date range to string for storage in formData
    if (update[0] && update[1]) {
      const start = `${update[0].toLocaleDateString()}`;
      const end = `${update[1].toLocaleDateString()}`;
      setFormData((prev) => ({
        ...prev,
        deliveryPeriod: {
          start,
          end,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        deliveryPeriod: {
          start: "",
          end: "",
        },
      }));
    }
  };
  const getFormattedSeasons = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => {
      const startYear = currentYear - i - 1;
      const endYear = startYear + 1;
      return `${startYear}/${endYear}`;
    });
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For updating buyer information
  const handleBuyerSelect = (buyer: Buyer) => {
    setFormData((prev) => ({
      ...prev,
      buyer: buyer._id as string,
    }));
  };

  // For updating seller information
  const handleSellerSelect = (seller: Seller) => {
    setFormData((prev) => ({
      ...prev,
      seller: seller._id as string,
    }));
  };

  // For updating contract type
  const handleContractTypeSelect = (type: ContractType) => {
    setFormData((prev) => ({
      ...prev,
      contractType: type.name,
    }));
  };

  // For updating brokerage payable by
  const handleBrokerageSelect = (option: ContractType) => {
    setFormData((prev) => ({
      ...prev,
      brokeragePayableBy: option.name,
    }));
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type: "", visible: false });
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission first

    let hasError = false;

    if (!formData.seller) {
      showNotification("Please select a seller", "error");
      hasError = true;
    }

    if (!formData.buyer) {
      showNotification("Please select a buyer", "error");
      hasError = true;
    }

    if (!formData.brokeragePayableBy) {
      showNotification(
        "Please select who the brokerage is payable by",
        "error"
      );
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Only proceed if all validations pass
    const newContract: TUpdateContract = {
      ...formData,
    };

    createContractMutation.mutate(newContract);
  };

  return (
    <div className="xl:overflow-scroll xl:h-[35rem] 2xl:h-full 2xl:overflow-visible">
      <form className="space-y-6 mt-7 md:mt-10" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-4 xl:grid-rows-8 gap-5">
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              DELIVERY PERIOD
            </label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              isClearable={true}
              placeholderText="Select date range"
              className="mt-1 w-full xl:w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              calendarClassName="w-full sm:w-auto" // Makes calendar responsive
              dateFormat="MMM d, yyyy"
              minDate={new Date()}
              maxDate={addDays(new Date(), 365)}
              shouldCloseOnSelect={false}
              selectsDisabledDaysInRange
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              PAYMENT TERMS
            </label>
            <input
              type="text"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              DELIVERY DESTINATION
            </label>
            <input
              type="text"
              name="deliveryDestination"
              value={formData.deliveryDestination}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              required
            />
          </div>
          <div>
            <SelectContractType onSelect={handleContractTypeSelect} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              DELIVERY OPTION
            </label>
            <input
              type="text"
              name="deliveryOption"
              value={formData.deliveryOption}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              BROKER RATE
            </label>
            <input
              type="number"
              name="brokerRate"
              value={formData.brokerRate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder=""
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              SELLER CONTRACT REFERENCE
            </label>
            <input
              type="text"
              name="sellerContractReference"
              value={formData.sellerContractReference}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div className="xl:row-span-2">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              SPECIAL CONDITION
            </label>
            <textarea
              name="specialCondition"
              value={formData.specialCondition}
              onChange={handleChange}
              className="mt-1 block resize-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              rows={5}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              FREIGHT
            </label>
            <input
              type="text"
              onChange={handleChange}
              name="freight"
              value={formData.freight}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              BUYER CONTRACT REFERENCE
            </label>
            <input
              onChange={handleChange}
              name="buyerContractReference"
              value={formData.buyerContractReference}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div className="md:row-start-4">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              GRADE
            </label>
            <input
              onChange={handleChange}
              name="grade"
              value={formData.grade}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              required
            />
          </div>

          <div className="md:row-start-4">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              WEIGHTS
            </label>
            <input
              onChange={handleChange}
              name="weights"
              value={formData.weights}
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder=""
              required
            />
          </div>
          <div className="md:row-start-4">
            <SelectBuyerSeller onSelect={handleBrokerageSelect} />
          </div>
          <div className="md:row-span-2 md:row-start-4">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              TERMS & CONDITIONS
            </label>
            <textarea
              name="termsAndConditions"
              value={formData.termsAndConditions}
              onChange={handleChange}
              className="mt-1 block w-full resize-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              rows={4}
            />
          </div>
          <div>
            <BuyerSelect onSelect={handleBuyerSelect} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              PRICE (EX-GST)
            </label>
            <input
              value={formData.priceExGST}
              onChange={handleChange}
              name="priceExGST"
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder=""
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              ATTACH BUYERS CONTRACT
            </label>
            <input
              type="file"
              accept="application/pdf"
              name="attachedBuyersContract"
              value={formData.attachedBuyerContract}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div className="md:row-start-6">
            <SellerSelect onSelect={handleSellerSelect} />
          </div>
          <div className="md:row-start-6">
            <ConveyanceSelect
              value={formData.conveyance}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, conveyance: value }))
              }
            />
          </div>

          <div className="md:row-start-6">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              CERTIFICATION SCHEME
            </label>
            <input
              onChange={handleChange}
              name="certificationScheme"
              value={formData.certificationScheme}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div className="md:row-span-2 md:row-start-6">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              NOTES
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full resize-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              rows={5}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              ATTACH SELLERS CONTRACT
            </label>
            <input
              type="file"
              accept="application/pdf"
              name="attachedSellersContract"
              value={formData.attachedSellerContract}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              COMMODITY
            </label>
            <input
              type="text"
              onChange={handleChange}
              name="commodity"
              value={formData.commodity}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              TONNES
            </label>
            <input
              onChange={handleChange}
              name="tonnes"
              value={formData.tonnes}
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder=""
              required
            />
          </div>
          {isGrowerContract && (
            <div className="md:row-start-8">
              <label className="block text-xs font-medium text-gray-700 uppercase">
                NGR NUMBER
              </label>
              <input
                type="text"
                name="ngrNumber"
                onChange={handleChange}
                value={formData.ngrNumber}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder=""
                required
              />
            </div>
          )}

          {/* Added Season Dropdown */}
          <div className="md:row-start-8">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              SEASON
            </label>
            <select
              name="season"
              value={formData.season}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            >
              <option value="">Select Season</option>
              {getFormattedSeasons().map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              tolerance
            </label>
            <input
              onChange={handleChange}
              name="tolerance"
              value={formData.tolerance}
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder=""
              required
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center gap-3 cursor-pointer"
          >
            <IoArrowBack /> Back
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-[#2A5D36] text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center gap-3"
          >
            Preview Contract
            <CiExport />
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#2A5D36] text-white rounded hover:hover:bg-[#1e4728] focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            Create Contract
          </button>
        </div>
      </form>
      {notification.visible && (
        <div className="fixed top-4 right-4 max-w-md z-50">
          <div
            className={`rounded-md shadow-lg p-4 ${
              notification.type === "success"
                ? "bg-green-50 border-l-4 border-green-500"
                : notification.type === "error"
                ? "bg-red-50 border-l-4 border-red-500"
                : "bg-blue-50 border-l-4 border-blue-500"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`mr-3 ${
                  notification.type === "success"
                    ? "text-green-500"
                    : notification.type === "error"
                    ? "text-red-500"
                    : "text-blue-500"
                }`}
              >
                {notification.type === "error" && (
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateContractForm;
