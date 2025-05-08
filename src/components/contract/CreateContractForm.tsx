"use client";
// @ts-nocheck
import { CiExport } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";
import BuyerSelect from "./BuyerSelect";
import SellerSelect from "./SellerSelect";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { useState } from "react";
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
  const [formData, setFormData] = useState<Omit<Contract, "id" | "isDeleted">>({
    contractPrice: "",
    destination: "",
    grower: "",
    season: "",
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
    status: "not done",
    createdAt: "",
    updatedAt: "",
  });
  const [startDate, endDate] = dateRange;
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/contract-management");
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    // You can add additional logic here to handle the dates in your form state
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    contracts.push(newContract);
    toast.success("Seller created successfully!");
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
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
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              DELIVERY DESTINATION
            </label>
            <input
              type="text"
              name="destination"
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div>
            <SelectContractType />
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
              name="spcialCondition"
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
              name="sellerContractReferance"
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
              name="buyerContractReferance"
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
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div className="md:row-start-4">
            <SelectBuyerSeller />
          </div>
          <div className="md:row-span-2 md:row-start-4">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              TERMS & CONDITIONS
            </label>
            <textarea
              readOnly
              className="mt-1 block w-full resize-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
              rows={4}
            />
          </div>
          <div>
            <BuyerSelect />
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
              type="text"
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div className="md:row-start-6">
            <SellerSelect />
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
              readOnly
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
              type="text"
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Seller Contract Reference"
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
            />
          </div>
          <div className="md:row-start-8">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              NGR NUMBER
            </label>
            <input
              readOnly
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center gap-3"
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
          <button className="px-6 py-2 bg-[#2A5D36] text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            Create Contract
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContractForm;
