"use client";
import { initialBuyers } from "@/data/data";
import { Buyer } from "@/types/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace, MdOutlineEdit } from "react-icons/md";

const BuyerInformationPage = () => {
  const { buyerId } = useParams(); // Get the ID from URL params
  const [buyerData, setBuyerData] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/contract-management");
  };

  useEffect(() => {
    const fetchBuyerData = () => {
      setLoading(true);

      const foundBuyer = initialBuyers.find(
        (buyer) => buyer.id.toString() === buyerId
      );

      if (foundBuyer) {
        setBuyerData(foundBuyer);
        setError(null);
      } else {
        setError(`Buyer with ID ${buyerId} not found`);
      }

      setLoading(false);
    };

    fetchBuyerData();
  }, [buyerId]);

  if (loading) {
    return (
      <div className="text-center py-10">Loading buyer information...</div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!buyerData) {
    return <div className="text-center py-10">No buyer data found</div>;
  }

  return (
    <div>
      <div className="border-b border-gray-300 py-10">
        <div className="mx-auto max-w-6xl flex items-center gap-5">
          <button type="button" onClick={handleBack} className="cursor-pointer">
            <MdKeyboardBackspace size={24} />
          </button>
          <p className="text-xl font-semibold">Buyer Information</p>
        </div>
      </div>
      <div>
        <div className="my-10 text-center">
          <p className="text-lg">{buyerData.name}</p>
        </div>

        <div className="flex flex-col items-center mx-auto max-w-6xl w-full">
          <div className="grid grid-cols-2 w-full border border-gray-300 rounded-md">
            {/* Row 1 */}
            <div className="border-b border-r border-gray-300 p-3 text-[#1A1A1A] flex items-center min-h-[60px]">
              Buyer Legal Name
            </div>
            <div className="border-b border-gray-300 p-3 flex items-center min-h-[60px]">
              {buyerData.name}
            </div>

            {/* Row 2 */}
            <div className="border-b border-r border-gray-300 p-3 text-[#1A1A1A] flex items-center min-h-[60px]">
              Buyer ABN
            </div>
            <div className="border-b border-gray-300 p-3 flex items-center min-h-[60px]">
              {buyerData.abn}
            </div>

            {/* Row 3 */}
            <div className="border-b border-r border-gray-300 p-3 text-[#1A1A1A] flex items-center min-h-[60px]">
              Buyer Email
            </div>
            <div className="border-b border-gray-300 p-3 flex items-center min-h-[60px]">
              {buyerData.email}
            </div>

            {/* Row 4 */}
            <div className="border-b border-r border-gray-300 p-3 text-[#1A1A1A] flex items-center min-h-[60px]">
              Buyer Office Address
            </div>
            <div className="border-b border-gray-300 p-3 flex items-center min-h-[60px]">
              {buyerData.officeAddress}
            </div>

            {/* Row 5 */}
            <div className="border-b border-r border-gray-300 p-3 text-[#1A1A1A] flex items-center min-h-[60px]">
              Buyer Contact Name
            </div>
            <div className="border-b border-gray-300 p-3 flex items-center min-h-[60px]">
              {buyerData.contactName}
            </div>

            {/* Row 6 */}
            <div className="p-3 border-r border-gray-300 text-[#1A1A1A] flex items-center min-h-[60px]">
              Buyer Phone Number
            </div>
            <div className="p-3 flex items-center min-h-[60px]">
              {buyerData.phone}
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-10">
            <Link href={`/buyer-management/edit/${buyerId?.toString()}`}>
              <button className="py-2 cursor-pointer px-5 bg-[#2A5D36] hover:bg-[#1e4728]  text-white rounded flex items-center gap-2">
                <MdOutlineEdit className="text-lg" />
                Edit
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerInformationPage;
