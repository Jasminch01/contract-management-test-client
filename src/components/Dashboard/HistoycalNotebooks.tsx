import React from "react";

const HistoycalNotebooks = () => {
  return (
    <div>
      <div className=" 2xl:p-10 p-5 rounded border-t-5 border-purple-500 shadow-sm flex flex-col h-[22rem] w-full min-2xl:h-[25rem]">
        {/* Fixed Heading */}
        <div className="2xl:pb-4">
          <p className="text-lg">Historical Daily Contracts</p>
        </div>

        {/* Scrollable Content with bottom padding */}
        <div className="flex-1 overflow-y-auto">
          <div className="mt-5">
            <ul>
              <li className="relative pb-6">
                <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                  <div className="w-5 h-6 rounded-full border-purple-500 border-2"></div>
                  <div className="h-full w-px bg-[#A7A7A7]"></div>
                </div>
                <div className="pl-10">
                  <div className="flex items-center space-x-8">
                    <p>Contract </p>
                    <p>#123456</p>
                  </div>
                  <div className="flex items-center space-x-8">
                    <p className="text-xs">Contract name</p>
                    <p className="text-sm">10:12 AM</p>
                  </div>
                </div>
              </li>

              {/* Repeat other list items */}
              <li className="relative pb-6">
                <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                  <div className="w-5 h-6 rounded-full border-purple-500 border-2"></div>
                  <div className="h-full w-px bg-[#A7A7A7]"></div>
                </div>
                <div className="pl-10">
                  <div className="flex items-center space-x-8">
                    <p>Contract </p>
                    <p>#123456</p>
                  </div>
                  <div className="flex items-center space-x-8">
                    <p className="text-xs">Contract name</p>
                    <p className="text-sm">10:12 AM</p>
                  </div>
                </div>
              </li>

              <li className="relative pb-6">
                <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                  <div className="w-5 h-6 rounded-full border-purple-500 border-2"></div>
                  <div className="h-full w-px bg-[#A7A7A7]"></div>
                </div>
                <div className="pl-10">
                  <div className="flex items-center space-x-8">
                    <p>Contract </p>
                    <p>#123456</p>
                  </div>
                  <div className="flex items-center space-x-8">
                    <p className="text-xs">Contract name</p>
                    <p className="text-sm">10:12 AM</p>
                  </div>
                </div>
              </li>

              <li className="relative pb-6">
                <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                  <div className="w-5 h-6 rounded-full border-purple-500 border-2"></div>
                  <div className="h-full w-px bg-[#A7A7A7]"></div>
                </div>
                <div className="pl-10">
                  <div className="flex items-center space-x-8">
                    <p>Contract </p>
                    <p>#123456</p>
                  </div>
                  <div className="flex items-center space-x-8">
                    <p className="text-xs">Contract name</p>
                    <p className="text-sm">10:12 AM</p>
                  </div>
                </div>
              </li>

              <li className="relative pb-6">
                <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                  <div className="w-5 h-6 rounded-full border-purple-500 border-2"></div>
                  <div className="h-full w-px bg-[#A7A7A7]"></div>
                </div>
                <div className="pl-10">
                  <div className="flex items-center space-x-8">
                    <p>Contract k </p>
                    <p>#123456</p>
                  </div>
                  <div className="flex items-center space-x-8">
                    <p className="text-xs">Contract name</p>
                    <p className="text-sm">10:12 AM</p>
                  </div>
                </div>
              </li>

              {/* Last item without the vertical line */}
              <li className="relative pb-6">
                <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full border-purple-500 border-2"></div>
                </div>
                <div className="pl-10">
                  <div className="flex items-center space-x-8">
                    <p>Contract </p>
                    <p>#123456</p>
                  </div>
                  <div className="flex items-center space-x-8">
                    <p className="text-xs">Contract name</p>
                    <p className="text-sm">10:12 AM</p>
                  </div>
                </div>
              </li>

              {/* Extra padding at the bottom */}
              <div className="pb-10"></div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoycalNotebooks;
