import React from "react";

const CreateSellerPage = () => {
  return (
    <div className="max-w-7xl mx-auto mt-10 md:mt-32 px-4">
      <div className="flex justify-center">
        <form action="" className="w-full max-w-4xl">
          {/* Heading Section */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="font-bold text-xl">Create Seller</h1>
            <p className="text-sm">Fill up the form below</p>
          </div>

          {/* Input Fields */}
          <div className="space-y-6">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER LEGAL NAME
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="BUYER LEGAL NAME"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER OFFICE ADDRESS
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="48 Pirrama Rd, Pyrmont Sydney NSW 2009"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER ABN
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder=""
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER MAIN NGR
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder=""
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER ADDITIONAL NGR’S
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder=""
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER CONTACT NAME
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder=""
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER EMAIL
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder=""
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER PHONE NUMBER
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 text-center md:text-left">
            <button
              type="submit"
              className="bg-[#2A5D36] py-2 px-6 text-white rounded-md hover:bg-[#1e4728] transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSellerPage;
