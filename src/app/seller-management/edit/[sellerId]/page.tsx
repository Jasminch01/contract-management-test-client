"use client";
import { Seller } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdSave, MdCancel } from "react-icons/md";
import toast from "react-hot-toast";
import { sellers } from "@/data/data";

const SellerInformationEditPage = () => {
  const { sellerId } = useParams();
  const router = useRouter();

  const foundSeller = sellers.find(
    (seller) => seller.id.toString() === sellerId
  );

  const [sellerData, setSellerData] = useState<Seller | null>(
    foundSeller || null
  );
  const [originalSellerData] = useState<Seller | null>(foundSeller || null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const [hasChanges, setHasChanges] = useState(false);

  if (!sellerData) {
    toast.error(`Seller with ID ${sellerId} not found`);
    router.push("/seller-management");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSellerData((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [name]: value };
      if (JSON.stringify(updated) !== JSON.stringify(originalSellerData)) {
        setHasChanges(true);
      }
      return updated;
    });
  };

  const handleAdditionalNGRChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSellerData((prev) => {
      if (!prev) return null;
      const updated = { ...prev, sellerAdditionalNGRs: value.split(",") };
      if (JSON.stringify(updated) !== JSON.stringify(originalSellerData)) {
        setHasChanges(true);
      }
      return updated;
    });
  };

  const handleCancel = () => {
    if (originalSellerData) {
      setSellerData({ ...originalSellerData });
    }
    setHasChanges(false);
    setSaveStatus("idle");
  };

  const handleSave = () => {
    if (!sellerData) return;

    setSaveStatus("saving");
    try {
      const index = sellers.findIndex((s) => s.id === sellerData.id);
      if (index !== -1) {
        sellers[index] = { ...sellerData };
      }

      setHasChanges(false);
      setSaveStatus("success");
      toast.success("Seller updated successfully!");
      router.push("/seller-management");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("Error saving seller:", err);
      setSaveStatus("error");
      toast.error("Failed to update seller");
    }
  };

  return (
    <div>
      <div className="border-b border-gray-300 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xl font-semibold">Seller Information</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl mt-10">
        <div className="flex flex-col items-center mx-auto max-w-6xl w-full mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full border border-gray-300 rounded-md p-6 gap-5 bg-white">
            <Field
              label="Seller Legal Name"
              name="sellerLegalName"
              value={sellerData.sellerLegalName}
              onChange={handleInputChange}
            />
            <Field
              label="Office Address"
              name="sellerOfficeAddress"
              value={sellerData.sellerOfficeAddress}
              onChange={handleInputChange}
            />
            <Field
              label="ABN"
              name="sellerABN"
              value={sellerData.sellerABN}
              onChange={handleInputChange}
            />
            <Field
              label="Main NGR"
              name="sellerMainNGR"
              value={sellerData.sellerMainNGR}
              onChange={handleInputChange}
            />
            <Field
              label="Contact Name"
              name="sellerContactName"
              value={sellerData.sellerContactName}
              onChange={handleInputChange}
            />
            <Field
              label="Email"
              name="sellerEmail"
              value={sellerData.sellerEmail}
              onChange={handleInputChange}
            />
            <Field
              label="Phone Number"
              name="sellerPhoneNumber"
              value={sellerData.sellerPhoneNumber}
              onChange={handleInputChange}
            />

            {/* Additional NGRs */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Additional NGRs
              </label>
              <input
                type="text"
                value={sellerData.sellerAdditionalNGRs.join(",")}
                onChange={handleAdditionalNGRChange}
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-green-700"
                placeholder="Enter NGRs separated by commas"
              />
            </div>
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
                className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2 hover:bg-[#1e4a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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

export default SellerInformationEditPage;
