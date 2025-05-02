"use client";
import { HistoricalPrice } from "@/types/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";

const HistoricalPriceDetailsPage = () => {
  const { priceId } = useParams(); // Get the ID from URL params
  const router = useRouter();
  const [priceData, setPriceData] = useState<HistoricalPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/historicalPrices.json");
        const prices: HistoricalPrice[] = await response.json();

        // Find the price with matching ID
        const foundPrice = prices.find(
          (price) => price.id.toString() === priceId
        );

        if (foundPrice) {
          setPriceData(foundPrice);
        } else {
          setError(`Price with ID ${priceId}} not found`);
        }
      } catch (err) {
        setError("Failed to load price data");
        console.error("Error fetching price:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [priceId]);

  const handleEdit = () => {
    router.push(`/historical-prices/edit/${priceId}`);
  };

  if (loading) {
    return (
      <div className="text-center py-10">Loading price information...</div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!priceData) {
    return <div className="text-center py-10">No price data found</div>;
  }

  return (
    <div>
      <div className="border-b border-gray-300 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xl font-semibold">Historical Price Details</p>
        </div>
      </div>

      <div className="my-10 text-center">
        <p className="text-lg">{priceData.commodity} Price</p>
      </div>

      <div className="flex flex-col items-center mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-2 w-full">
          <div className="flex flex-col border border-gray-300 rounded-md w-full md:w-1/2">
            {/* Left Data Rows */}
            <div className="flex border-b border-gray-300 w-full">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Commodity
              </div>
              <div className="w-1/2 p-3">{priceData.commodity}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Price</div>
              <div className="w-1/2 p-3">${priceData.price.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex flex-col border border-gray-300 rounded-md w-full md:w-1/2">
            {/* Right Data Rows */}
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Date</div>
              <div className="w-1/2 p-3">{priceData.date}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Quality
              </div>
              <div className="w-1/2 p-3">{priceData.quality}</div>
            </div>
          </div>
        </div>
        <div className="flex border w-full border-t-0 border-gray-300">
          <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Comment</div>
          <div className="w-1/2 p-3">{priceData.comment || "-"}</div>
        </div>

        {/* Centered Edit Button */}
        <div className="mt-10">
          <Link
            href={`/historical-prices/edit/${priceId}`}
            onClick={handleEdit}
            className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2 hover:bg-[#1e4728] transition-colors"
          >
            <MdOutlineEdit className="text-lg" />
            Edit Price
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HistoricalPriceDetailsPage;
