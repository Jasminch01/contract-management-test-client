"use client";
import { Buyer } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MdSave, MdCancel, MdKeyboardBackspace } from "react-icons/md";
import toast from "react-hot-toast";
import { initialBuyers } from "@/data/data";

const BuyerInformationEditPage = () => {
  const { buyerId } = useParams();
  const router = useRouter();

  const foundBuyer = initialBuyers.find(
    (buyer) => buyer.id.toString() === buyerId
  );

  const [buyerData, setBuyerData] = useState<Buyer | null>(foundBuyer || null);
  const [originalBuyerData] = useState<Buyer | null>(foundBuyer || null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!foundBuyer) {
      toast.error(`Buyer with ID ${buyerId} not found`);
      router.push("/buyer-management");
    }
  }, [foundBuyer, buyerId, router]);

  useEffect(() => {
    if (buyerData && originalBuyerData) {
      setHasChanges(
        JSON.stringify(buyerData) !== JSON.stringify(originalBuyerData)
      );
    }
  }, [buyerData, originalBuyerData]);

  if (!buyerData) return null;

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

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/contract-management");
  };

  const handleSave = () => {
    if (!buyerData) return;

    setSaveStatus("saving");

    try {
      const index = initialBuyers.findIndex(
        (buyer) => buyer.id === buyerData.id
      );
      if (index !== -1) {
        initialBuyers[index] = { ...buyerData };
      }

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
    setSaveStatus("idle");
  };

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

      <div className="mx-auto max-w-6xl mt-10">
        <div className="flex flex-col items-center mx-auto max-w-6xl w-full mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full border border-gray-300 rounded-md p-6 gap-5 bg-white">
            <Field
              label="Buyer Legal Name"
              name="name"
              value={buyerData.name || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Buyer ABN"
              name="abn"
              value={buyerData.abn || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Buyer Email"
              name="email"
              value={buyerData.email || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Buyer Office Address"
              name="officeAddress"
              value={buyerData.officeAddress || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Buyer Contact Name"
              name="contactName"
              value={buyerData.contactName || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Buyer Phone Number"
              name="phone"
              value={buyerData.phone || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Action Buttons */}
          {hasChanges && (
            <div className="mt-10 flex gap-3">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-700"
    />
  </div>
);

export default BuyerInformationEditPage;
