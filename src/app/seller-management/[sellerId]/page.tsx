"use client";
import { getseller } from "@/api/sellerApi";
import { Seller } from "@/types/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace, MdOutlineEdit } from "react-icons/md";

const SellerInformationPage = () => {
  const { sellerId } = useParams();
  const [sellerData, setSellerData] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const sellerIdStr = sellerId?.toString() as string;
  const router = useRouter();
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/seller-management");
  };

  useEffect(() => {
    const getSellerData = async () => {
      try {
        const res = await getseller(sellerIdStr);
        setSellerData(res);
        if (res) {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSellerData();
  }, [sellerIdStr]);

  if (loading) {
    return (
      <div className="text-center py-10">Loading seller information...</div>
    );
  }

  // if (error) {
  //   return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  // }

  if (!sellerData) {
    return <div className="text-center py-10">No seller data found</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="border-b border-gray-300 py-10">
        <div className="mx-auto max-w-6xl flex items-center gap-5">
          <button type="button" onClick={handleBack} className="cursor-pointer">
            <MdKeyboardBackspace size={24} />
          </button>
          <p className="text-xl font-semibold">Seller Information</p>
        </div>
      </div>

      {/* Title */}
      <div className="my-10 text-center">
        <p className="text-lg">{sellerData.legalName}</p>
      </div>

      {/* Info Grid */}
      <div className="flex flex-col items-center mx-auto max-w-6xl w-full">
        <div className="grid grid-cols-2 w-full border border-gray-300 rounded-md">
          <InfoRow label="Seller Legal Name" value={sellerData.legalName} />
          <InfoRow label="Seller ABN" value={sellerData.abn} />
          <InfoRow
            label="Seller Additional NGRs"
            value={sellerData.additionalNgrs.join(", ")}
          />
          <InfoRow label="Seller Email" value={sellerData.email} />
          <InfoRow
            label="Seller Farm or PO Address"
            value={sellerData.address}
          />
          <InfoRow label="Seller Main NGR" value={sellerData.mainNgr} />
          <InfoRow label="Seller Contact Name" value={sellerData.contactName} />
          <InfoRow label="Seller Phone Number" value={sellerData.phoneNumber} />
        </div>

        {/* Edit Button */}
        <div className="mt-10">
          <Link href={`/seller-management/edit/${sellerId?.toString()}`}>
            <button className="py-2 cursor-pointer px-5 bg-[#2A5D36] text-white rounded flex items-center gap- hover:bg-[#1e4728] ">
              <MdOutlineEdit className="text-lg" />
              Edit
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Extracted row component for cleaner code
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <>
    <div className="border-b border-r border-gray-300 p-3 text-[#1A1A1A] flex items-center min-h-[60px]">
      {label}
    </div>
    <div className="border-b border-gray-300 p-3 flex items-center min-h-[60px]">
      {value}
    </div>
  </>
);

export default SellerInformationPage;
