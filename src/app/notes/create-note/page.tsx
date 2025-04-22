import React from "react";

const page = () => {
  return (
    <div className="max-w-7xl mx-auto mt-10 md:mt-32 px-4">
      <div className="w-full flex justify-center">
        <form action="" className="w-full max-w-4xl">
          <div className="mb-10 text-center md:text-left">
            <h1 className="font-bold text-xl">Create Notes</h1>
            <p className="text-sm">Fill up the form below</p>
          </div>

          <div className="space-y-4 w-full">
            <div className="w-full flex gap-5">
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
                  BROKER REFERENCE
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 uppercase">
                Write Note
              </label>
              <textarea
                rows={8}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

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

export default page;
