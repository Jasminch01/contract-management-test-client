"use client";
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

const CreateContractForm = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
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
  return (
    <div className="xl:overflow-scroll xl:h-[35rem] 2xl:h-full 2xl:overflow-visible">
      <form className="space-y-6 mt-7 md:mt-10">
        <div className="grid grid-cols-1 xl:grid-cols-4 xl:grid-rows-8 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              Contract Number
            </label>
            <input
              type="text"
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
              className="mt-1 block w-full xl:w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              calendarClassName="w-full sm:w-auto" // Makes calendar responsive
              monthsShown={window.innerWidth < 640 ? 1 : 2} // Shows 1 month on mobile, 2 on desktop
              dateFormat="MMM d, yyyy"
              minDate={new Date()}
              maxDate={addDays(new Date(), 365)}
              shouldCloseOnSelect={false}
              selectsDisabledDaysInRange
              withPortal={window.innerWidth < 640} // Uses portal on mobile for better UX
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              PAYMENT TERMS
            </label>
            <input
              type="text"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              BUYER CONTRACT REFERENCE
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              DELIVERY OPTION
            </label>
            <input
              type="text"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div className="xl:row-span-2">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              SPECIAL CONDITION
            </label>
            <textarea
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              BUYER CONTRACT REFERENCE
            </label>
            <input
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              TONNES
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder=""
            />
          </div>
          <div className="md:row-start-8">
            <SelectContractType />
          </div>
          <div className="md:row-start-8">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              NGR NUMBER
            </label>
            <input
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
            className="px-6 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-3"
          >
            <IoArrowBack /> Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#2A5D36] text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-3"
          >
            Preview Contract
            <CiExport />
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#2A5D36] text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Create Contract
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContractForm;
