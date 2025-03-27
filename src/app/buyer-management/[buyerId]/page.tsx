import React from "react";
import { MdOutlineEdit } from "react-icons/md";

const buyerInformationPage = () => {
  return (
    <div>
      <div className="border-b border-gray-300 py-10">
        <div className=" mx-auto max-w-6xl">
          <p className="text-xl font-semibold">Buyer information </p>
        </div>
      </div>
      <div>
        <div className="my-10 text-center">
          <p className="text-lg">Commex International</p>
        </div>

        <div className="flex flex-col items-center mx-auto max-w-6xl">
          <div className="flex items-center gap-3 w-full">
            <div className="flex flex-col border border-gray-300 rounded-md flex-1">
              {/* Left Data Rows */}
              <div className="flex border-b border-gray-300 w-full">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Buyer Legal Name</div>
                <div className="w-1/2 p-3">William Hanry</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Seller ABN</div>
                <div className="w-1/2 p-3">75674</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">
                  Buyer Additional NGR&apos;s
                </div>
                <div className="w-1/2 p-3">75674</div>
              </div>
              <div className="flex">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Buyer Email</div>
                <div className="w-1/2 p-3">outlook.mail</div>
              </div>
            </div>

            <div className="flex flex-col border border-gray-300 rounded-md flex-1">
              {/* Right Data Rows */}
              <div className="flex border-b border-gray-300 w-full">
                <div className="w-1/2 p-3 text-[#1A1A1A]">
                  Seller Farm or PO Address:
                </div>
                <div className="w-1/2 p-3">$234</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Seller Main NGR:</div>
                <div className="w-1/2 p-3">Conveyance</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">
                  Seller Contact Name:
                </div>
                <div className="w-1/2 p-3">scheme</div>
              </div>
              <div className="flex">
                <div className="w-1/2 p-3 text-[#1A1A1A]">
                  Buyer Phone Number:
                </div>
                <div className="w-1/2 p-3">0357634</div>
              </div>
            </div>
          </div>

          {/* Centered Edit Button */}
          <div className="mt-10">
            <button className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2">
              <MdOutlineEdit className="text-lg" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default buyerInformationPage;
