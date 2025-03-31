import { CiExport } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";
import BuyerSelect from "./BuyerSelect";
import SellerSelect from "./SellerSelect";

const CreateContractForm = () => {
  return (
    <div className="xl:overflow-scroll xl:h-[35rem] 2xl:h-full 2xl:overflow-visible">
      <form className="space-y-6 mt-6 md:mt-10">
        <div className="grid grid-cols-4v grid-rows-8 gap-x-10">
          <div className="">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              Contract Number
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter contract number"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              TONNES
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Tonnes"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              CERTIFICATION SCHEME
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Certification Scheme"
            />
          </div>
          <div className="row-span-2">
            <div className="md:row-span-2 md:col-start-4 row-start-1">
              <label className="block text-xs font-medium text-gray-700 uppercase">
                TERMS & CONDITIONS
              </label>
              <textarea
                className="mt-1 block w-full resize-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder=""
                rows={5}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              CONTRACT DATE
            </label>
            <input
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              DELIVERY PERIOD
            </label>
            <input
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              COMMODITY SEASON
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Commodity Season"
            />
          </div>
          <div className="row-start-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase">
                BROKER REFERENCE
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="BR 001"
              />
            </div>
          </div>
          <div className="row-start-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase">
                DELIVERY OPTION
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="PDF File"
              />
            </div>
          </div>
          <div className="row-start-3">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              PAYMENT TERMS
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Bank"
            />
          </div>
          <div className="col-start-1 row-start-4">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              COMMODITY
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Commodity"
            />
          </div>
          <div className="col-start-2 row-start-4">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              FREIGHT
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Freight"
            />
          </div>
          <div className="col-start-3 row-start-4">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              BROKER RATE
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Broker Rate"
            />
          </div>
          <div className="row-span-2 col-start-4 row-start-3">
            <div className="md:row-span-2 md:col-start-4 row-start-1">
              <label className="block text-xs font-medium text-gray-700 uppercase">
                SPECIAL CONDITION
              </label>
              <textarea
                className="mt-1 block resize-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder=""
                rows={5}
              />
            </div>
          </div>
          <div className="row-start-5">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              GRADE
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Grade"
            />
          </div>
          <div className="row-start-5">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              WEIGHTS
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Weights"
            />
          </div>
          <div className="row-start-5">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              BUYER CONTRACT REFERENCE
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Buyer Contract Reference"
            />
          </div>
          <div className="row-span-2 row-start-5">
            <div className="md:row-span-2 md:col-start-4 row-start-1">
              <label className="block text-xs font-medium text-gray-700 uppercase">
                NOTES
              </label>
              <textarea
                className="mt-1 block w-full resize-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder=""
                rows={5}
              />
            </div>
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
              placeholder="Price"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase">
              BROKER
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Broker"
            />
          </div>
          <div className="row-start-7">
            <SellerSelect />
          </div>
          <div className="row-start-7">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              CONVEYANCE
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Conveyance"
            />
          </div>
          <div className="row-start-7">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              BROKER REFERENCE
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Broker Reference"
            />
          </div>
          <div className="row-start-8">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              ATTACH SELLERS CONTRACT
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Sellers Contract (PDF/XLSX etc)"
            />
          </div>
          <div className="row-start-8">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              SELLER CONTRACT REFERENCE
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Seller Contract Reference"
            />
          </div>
          <div className="row-start-8">
            <label className="block text-xs font-medium text-gray-700 uppercase">
              ATTACH BUYERS CONTRACT
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Buyers Contract (PDF/XLSX etc)"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-end">
          <button
            type="submit"
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
