import React from "react";

const sellerInformationPage = () => {
  return (
    <div>
      <div className="border-b border-gray-300 shadow-lg">
        <p>Seller information </p>
      </div>
      <div>
        <div className="my-10 text-center">
          <p className="text-lg">Commex International</p>
        </div>
        <div className="flex items-center gap-5 mx-auto max-w-6xl">
          <div className="flex flex-col border border-gray-300 rounded-md flex-1">
            {/* Data Rows */}
            <div className="flex border-b border-gray-300 w-full">
              <div className="w-1/2 p-3">Seller Legal Name</div>
              <div className="w-1/2 p-3">William Hanry</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3">Seller ABN</div>
              <div className="w-1/2 p-3">75674</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3">Seller Additional NGR&apos;s</div>
              <div className="w-1/2 p-3">75674</div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3">Seller Email</div>
              <div className="w-1/2 p-3">outlook.mail</div>
            </div>
          </div>
          <div className="flex flex-col border border-gray-300 rounded-md flex-1">
            {/* Data Rows */}
            <div className="flex border-b border-gray-300 w-full">
              <div className="w-1/2 p-3">Seller Legal Name</div>
              <div className="w-1/2 p-3">William Hanry</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3">Seller ABN</div>
              <div className="w-1/2 p-3">75674</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3">Seller Additional NGR&apos;s</div>
              <div className="w-1/2 p-3">75674</div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3">Seller Email</div>
              <div className="w-1/2 p-3">outlook.mail</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default sellerInformationPage;
