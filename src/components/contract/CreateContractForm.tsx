/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
// import { CiExport } from "react-icons/ci";
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
import { Contract } from "@/types/types";
import { contracts } from "@/data/data";
import toast from "react-hot-toast";

const CreateContractForm = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const currentTimestamp = new Date().toISOString();
  const [formData, setFormData] = useState<Omit<Contract, "id" | "isDeleted">>({
    contractPrice: "",
    destination: "",
    grower: "",
    contractNumber: "",
    tonnes: "",
    certificationScheme: "",
    termsAndConditions: "",
    contractDate: "",
    deliveryPeriod: "",
    commoditySeason: "",
    deliveryOption: "",
    paymentTerms: "",
    commodity: "",
    freight: "",
    brokerRate: "",
    specialCondition: " ",
    grade: "",
    weights: "",
    buyerContractReference: "",
    notes: "",
    buyer: {
      id: "",
      name: "",
      abn: "",
      officeAddress: "",
      contactName: "",
      email: "",
      phone: "",
      isDeleted: false,
    },
    seller: {
      id: 1,
      sellerLegalName: "",
      sellerOfficeAddress: "",
      sellerABN: "",
      sellerMainNGR: "",
      sellerAdditionalNGRs: [""],
      sellerContactName: "",
      sellerEmail: "",
      sellerPhoneNumber: "",
      isDeleted: false,
    },
    priceExGst: "",
    broker: "",
    conveyance: "",
    brokerReference: "",
    sellerContractReference: "",
    attachments: {
      sellersContract: "",
      buyersContract: "",
    },
    status: "incompleted",
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    contractType: "", // Added for contract type
    brokeragePayableBy: "", // Added for brokerage payable by
  });

  const [isGrowerContract, setIsGrowerContract] = useState(false);
  const [startDate, endDate] = dateRange;
  const router = useRouter();

  // Generate a contract number when the component mounts
  useEffect(() => {
    generateContractNumber();
  }, []);

  // Update isGrowerContract when contractType changes
  useEffect(() => {
    setIsGrowerContract(formData.contractType === "Grower");
  }, [formData.contractType]);

  // Function to generate a unique contract number
  const generateContractNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    const contractNumber = `CNT-${year}${month}${day}-${random}`;

    setFormData((prev) => ({
      ...prev,
      contractNumber: contractNumber,
    }));
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/contract-management");
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);

    // Convert date range to string for storage in formData
    if (update[0] && update[1]) {
      const formattedDateRange = `${update[0].toLocaleDateString()} - ${update[1].toLocaleDateString()}`;
      setFormData((prev) => ({
        ...prev,
        deliveryPeriod: formattedDateRange,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        deliveryPeriod: "",
      }));
    }
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
  const handleBuyerSelect = (buyer) => {
    setFormData((prev) => ({
      ...prev,
      buyer: {
        ...prev.buyer,
        id: buyer.id,
        name: buyer.name,
      },
    }));
  };

  // For updating seller information
  const handleSellerSelect = (seller) => {
    setFormData((prev) => ({
      ...prev,
      seller: {
        ...prev.seller,
        id: seller.id,
        sellerLegalName: seller.name,
      },
    }));
  };

  // For updating contract type
  const handleContractTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      contractType: type.name,
    }));
  };

  // For updating brokerage payable by
  const handleBrokerageSelect = (option) => {
    setFormData((prev) => ({
      ...prev,
      brokeragePayableBy: option.name,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = Math.max(...contracts.map((s) => s.id), 0) + 1;

    const newContract: Contract = {
      id: newId,
      ...formData,
      isDeleted: false,
    };
    console.log(newContract);

    contracts.unshift(newContract);
    toast.success("Contract created successfully!");
    router.push("/contract-management");
  };

  return (
    <div className="xl:overflow-scroll xl:h-[35rem] 2xl:h-full 2xl:overflow-visible">
      <form className="space-y-6 mt-7 md:mt-10" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-4 xl:grid-rows-8 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              Contract Number
            </label>
            <input
              type="text"
              name="contractNumber"
              value={formData.contractNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-100"
              placeholder=""
              readOnly
            />
          </div>
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
              name="destination"
              value={formData.destination}
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
              type="text"
              name="brokerRate"
              value={formData.brokerRate}
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
              rows={4}
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
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
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
              value={formData.priceExGst}
              onChange={handleChange}
              name="priceExGst"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              ATTACH BUYERS CONTRACT
            </label>
            <input
              type="file"
              accept="application/pdf"
              name="attachments.buyersContract"
              value={formData.attachments.buyersContract}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  attachments: {
                    ...prev.attachments,
                    buyersContract: e.target.value,
                  },
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div className="md:row-start-6">
            <SellerSelect onSelect={handleSellerSelect} />
          </div>
          <div className="md:row-start-6">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              CONVEYANCE
            </label>
            <input
              onChange={handleChange}
              name="conveyance"
              value={formData.conveyance}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              required
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
              name="attachments.sellersContract"
              value={formData.attachments.sellersContract}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  attachments: {
                    ...prev.attachments,
                    sellersContract: e.target.value,
                  },
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              required
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
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                name="seller.sellerMainNGR"
                value={formData.seller.sellerMainNGR}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seller: {
                      ...prev.seller,
                      sellerMainNGR: e.target.value,
                    },
                  }))
                }
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
              name="commoditySeason"
              value={formData.season}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            >
              <option value="">Select Season</option>
              <option value="2023/2024">2023/2024</option>
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
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
          {/* <button
            type="button"
            className="px-6 py-2 bg-[#2A5D36] text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center gap-3"
          >
            Preview Contract
            <CiExport />
          </button> */}
          <button
            type="submit"
            className="px-6 py-2 bg-[#2A5D36] text-white rounded hover:hover:bg-[#1e4728] focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            Create Contract
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContractForm;
