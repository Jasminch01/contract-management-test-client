import React from "react";
import { CiExport } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";

const CreateContractForm = () => {
  return (
    <div>
      <form className="space-y-6 mt-6 md:mt-10">
        {/* First Line */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contract Number
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter contract number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tonnes
            </label>
            <input
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter tonnes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Certification Scheme
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter certification scheme"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Broker Rate
            </label>
            <input
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter broker rate"
            />
          </div>
        </div>

        {/* Second Line */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Rate
            </label>
            <input
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter current rate"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Period
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter delivery period"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Commodity Season
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter commodity season"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Buyer Contract Reference
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter buyer contract reference"
            />
          </div>
        </div>

        {/* Third Line */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Broker Reference
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter broker reference"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Option
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter delivery option"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Terms
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter payment terms"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Seller Contract Reference
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter seller contract reference"
            />
          </div>
        </div>

        {/* Fourth Line */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Commodity
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter commodity"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Freight
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter freight"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Special Condition
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter special condition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attach Buyer Contract
            </label>
            <input
              type="file"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Fifth Line */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grade
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter grade"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              WEIGHTS
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter WEIGHTS"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              TERMS & CONDITIONS
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter TERMS & CONDITIONS"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attach Seller Contract
            </label>
            <input
              type="file"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Textarea Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              BUYER
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PRICE (EX-GST)
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              BROKER
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Broker"
            />
          </div>
          <div className="md:col-start-1 md:row-start-2">
            <label className="block text-sm font-medium text-gray-700">
              SELLER
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder=""
            />
          </div>
          <div className="md:col-start-2 md:row-start-2">
            <label className="block text-sm font-medium text-gray-700">
              CONVEYANCE
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Conveyance"
            />
          </div>
          <div className="md:col-start-3 md:row-start-2">
            <label className="block text-sm font-medium text-gray-700">
              BROKER REFERENCE
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Broker Reference"
            />
          </div>
          <div className="md:row-span-2 md:col-start-4 row-start-1">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter notes"
              rows={5}
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
            className="px-6 py-2 text-black border border-gray-300 rounded  focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save Contract
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#2A5D36] text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-3"
          >
            Export as PDF
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
