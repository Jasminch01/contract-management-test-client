import React from "react";

const page = () => {
  return (
    <div className="max-w-7xl mx-auto mt-10 md:mt-32 px-4">
      <div className="flex">
        <div className="w-full">
          {" "}
          {/* Added w-full here to ensure parent div takes full width */}
          <form action="" className="w-full max-w-4xl">
            {/* Heading Section */}
            <div className="mb-10 text-center md:text-left">
              <h1 className="font-bold text-xl">Create Notes</h1>
              <p className="text-sm">Fill up the form below</p>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 w-full">
              {" "}
              {/* Added w-full and space-y-4 for consistent spacing */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  NOTEBOOK NAME
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Write Note
                </label>
                <textarea
                  rows={6}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
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
    </div>
  );
};

export default page;
