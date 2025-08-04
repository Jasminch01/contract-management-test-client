/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import React from "react";

const HistoricalPrices = ({ data = [] }) => {
  return (
    <div>
      <div className="2xl:p-10 p-5 rounded border-t-5 border-purple-500 shadow-sm h-[22rem] flex w-full flex-col min-2xl:h-[25rem]">
        {/* Fixed Heading */}
        <div className="2xl:pb-4">
          <p className="text-lg">Historical Daily Prices</p>
        </div>

        {/* Scrollable Content with bottom padding */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar">
          <div className="mt-5">
            {data.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>No price data available</p>
              </div>
            ) : (
              <ul>
                {data.map((price, index) => (
                  <li
                    key={`${price.contractNumber}-${index}`}
                    className="relative pb-6"
                  >
                    <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full border-purple-500 border-2 bg-white flex-shrink-0 min-w-[1rem] min-h-[1rem]"></div>
                      {/* Don't show the line for the last item */}
                      {index !== data.length - 1 && (
                        <div className="h-full w-px bg-[#A7A7A7]"></div>
                      )}
                    </div>
                    <div className="pl-14">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {price.contractName}
                        </p>
                        <p className="text-xs text-gray-500">
                          #{price.contractNumber}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-green-500 font-bold">
                          {price.price}
                        </p>
                        <p className="text-sm text-gray-500">{price.time}</p>
                      </div>
                    </div>
                  </li>
                ))}

                {/* Extra padding at the bottom */}
                <div className="pb-10"></div>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalPrices;
