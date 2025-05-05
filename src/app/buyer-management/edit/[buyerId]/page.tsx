"use client";
import { Buyer } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdOutlineEdit, MdSave, MdCancel } from "react-icons/md";
import toast from "react-hot-toast";
import { initialBuyers } from "@/data/data";

const BuyerInformationEditPage = () => {
  const { buyerId } = useParams();
  const router = useRouter();

  // Find the buyer directly from the array
  const foundBuyer = initialBuyers.find(
    (buyer) => buyer.id.toString() === buyerId
  );

  const [buyerData, setBuyerData] = useState<Buyer | null>(foundBuyer || null);
  const [originalBuyerData] = useState<Buyer | null>(foundBuyer || null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  if (!buyerData) {
    toast.error(`Buyer with ID ${buyerId} not found`);
    router.push("/buyer-management");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!buyerData) return;

    setSaveStatus("saving");

    try {
      // Update the buyer in the initialBuyers array
      const index = initialBuyers.findIndex(
        (buyer) => buyer.id === buyerData.id
      );
      if (index !== -1) {
        initialBuyers[index] = { ...buyerData };
      }

      setIsEditing(false);
      setSaveStatus("success");
      toast.success("Buyer updated successfully!");
      router.push(`/buyer-management`);
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("Error saving buyer:", err);
      setSaveStatus("error");
      toast.error("Failed to update buyer");
    }
  };

  const handleCancel = () => {
    if (originalBuyerData) {
      setBuyerData({ ...originalBuyerData });
    }
    setIsEditing(false);
    setSaveStatus("idle");
  };

  return (
    <div>
      <div className="border-b border-gray-300 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xl font-semibold">Buyer information</p>
        </div>
      </div>

      <div>
        <div className="my-10 text-center">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={buyerData.name || ""}
              onChange={handleInputChange}
              className="text-lg text-center border-b border-gray-300 focus:outline-none focus:border-[#2A5D36]"
            />
          ) : (
            <p className="text-lg">
              {buyerData.name || "Commex International"}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center mx-auto max-w-6xl">
          <div className="flex items-center gap-3 w-full">
            {/* Left Data Column */}
            <div className="flex flex-col border border-gray-300 rounded-md flex-1">
              <div className="flex border-b border-gray-300 w-full">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Buyer Legal Name</div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={buyerData.name}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    buyerData.name
                  )}
                </div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Buyer ABN</div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="abn"
                      value={buyerData.abn}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    buyerData.abn
                  )}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Buyer Email</div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={buyerData.email}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    buyerData.email
                  )}
                </div>
              </div>
            </div>

            {/* Right Data Column */}
            <div className="flex flex-col border border-gray-300 rounded-md flex-1">
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">
                  Buyer Office Address
                </div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="officeAddress"
                      value={buyerData.officeAddress}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    buyerData.officeAddress
                  )}
                </div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">
                  Buyer Contact Name
                </div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="contactName"
                      value={buyerData.contactName}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    buyerData.contactName
                  )}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2 p-3 text-[#1A1A1A]">
                  Buyer Phone Number
                </div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={buyerData.phone}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    buyerData.phone
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {saveStatus === "success" && (
            <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
              Buyer information saved successfully!
            </div>
          )}
          {saveStatus === "error" && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
              Error saving buyer information. Please try again.
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-10 flex gap-3">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2 hover:bg-[#1e4a2a] transition-colors"
              >
                <MdOutlineEdit className="text-lg" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="py-2 px-5 bg-gray-500 text-white rounded flex items-center gap-2 hover:bg-gray-600 transition-colors"
                >
                  <MdCancel className="text-lg" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveStatus === "saving"}
                  className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2 hover:bg-[#1e4a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <MdSave className="text-lg" />
                  {saveStatus === "saving" ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerInformationEditPage;
