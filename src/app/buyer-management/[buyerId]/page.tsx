"use client";
import { Buyer } from "@/types/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";

const BuyerInformationPage = () => {
  const { buyerId } = useParams(); // Get the ID from URL params
  const [buyerData, setBuyerData] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuyerData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/buyer.json");
        const buyers: Buyer[] = await response.json();

        // Find the buyer with matching ID
        const foundBuyer = buyers.find(
          (buyer) => buyer.id.toString() === buyerId
        );

        if (foundBuyer) {
          setBuyerData(foundBuyer);
        } else {
          setError(`Buyer with ID ${buyerId} not found`);
        }
      } catch (err) {
        setError("Failed to load buyer data");
        console.error("Error fetching buyer:", err);
      } finally {
        setLoading(false);
      }
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
                <div className="w-1/2 p-3">{buyerData.name}</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Buyer ABN</div>
                <div className="w-1/2 p-3">{buyerData.abn}</div>
              </div>
              <div className="flex">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Buyer Email</div>
                <div className="w-1/2 p-3">{buyerData.email}</div>
              </div>
            </div>

            <div className="flex flex-col border border-gray-300 rounded-md flex-1">
              {/* Right Data Rows */}
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">
                  Buyer Office Address
                </div>
                <div className="w-1/2 p-3">{buyerData.officeAddress}</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">
                  Buyer Contact Name:
                </div>
                <div className="w-1/2 p-3">{buyerData.contactName}</div>
              </div>
              <div className="flex">
                <div className="w-1/2 p-3 text-[#1A1A1A]">
                  Buyer Phone Number:
                </div>
                <div className="w-1/2 p-3">{buyerData.phone}</div>
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

export default BuyerInformationPage;
