"use client";
import { Buyer } from "@/types/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace, MdOutlineEdit } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

const BuyerInformationPage = () => {
  const { buyerId } = useParams();
  const [buyerData, setBuyerData] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/buyer-management");
  };

  useEffect(() => {
    const fetchBuyerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:8000/api/buyers/${buyerId}`
        );

        if (response.data) {
          setBuyerData(response.data);
        } else {
          setError(`Buyer with ID ${buyerId} not found`);
        }
      } catch (err) {
        console.error("Error fetching buyer data:", err);
        setError("Failed to load buyer information");
        toast.error("Failed to load buyer information");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerData();
  }, [buyerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!buyerData) {
    return (
      <div className="text-center py-10">
        <div className="mb-4">No buyer data found</div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="border-b border-gray-300 py-10">
        <div className="mx-auto max-w-6xl flex items-center gap-5">
          <button type="button" onClick={handleBack} className="cursor-pointer">
            <MdKeyboardBackspace size={24} />
          </button>
          <p className="text-xl font-semibold">Buyer Information</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="my-10 text-center">
          <h2 className="text-2xl font-semibold">{buyerData.name}</h2>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-2 w-full border border-gray-300 rounded-md overflow-hidden">
            {/* Information Rows */}
            {[
              { label: "Buyer Legal Name", value: buyerData.name },
              { label: "Buyer ABN", value: buyerData.abn },
              { label: "Buyer Email", value: buyerData.email },
              { label: "Buyer Office Address", value: buyerData.officeAddress },
              { label: "Buyer Contact Name", value: buyerData.contactName },
              { label: "Buyer Phone Number", value: buyerData.phoneNumber },
            ].map((item, index) => (
              <React.Fragment key={index}>
                <div className="border-b border-r border-gray-300 p-4 bg-gray-50 text-gray-700 font-medium">
                  {item.label}
                </div>
                <div className="border-b border-gray-300 p-4">
                  {item.value || "-"}
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Edit Button */}
          <div className="mt-10">
            <Link href={`/buyer-management/edit/${buyerId}`}>
              <button className="py-2 px-5 bg-[#2A5D36] hover:bg-[#1e4728] text-white rounded flex items-center gap-2 transition-colors">
                <MdOutlineEdit className="text-lg" />
                Edit Buyer Information
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerInformationPage;
