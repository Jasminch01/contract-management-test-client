"use client";
import React, { useState } from "react";
import { MdOutlineEdit, MdSave, MdCancel } from "react-icons/md";

const SellerInformationEditPage = () => {
  // Initial seller data
  const initialSellerData = {
    companyName: "Commex International",
    legalName: "William Hanry",
    abn: "75674",
    additionalNGRs: "75674",
    email: "outlook.mail",
    farmAddress: "$234",
    mainNGR: "Conveyance",
    contactName: "scheme",
    phoneNumber: "0357634"
  };

  const [sellerData, setSellerData] = useState(initialSellerData);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(initialSellerData);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSellerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enable editing mode
  const handleEdit = () => {
    setOriginalData(sellerData);
    setIsEditing(true);
  };

  // Save changes
  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would make an actual API call here
      // await fetch('/api/seller', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(sellerData)
      // });

      setIsEditing(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving seller data:", error);
      setSaveStatus("error");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setSellerData(originalData);
    setIsEditing(false);
    setSaveStatus("idle");
  };

  return (
    <div>
      <div className="border-b border-gray-300 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xl font-semibold">Seller information</p>
        </div>
      </div>
      
      <div>
        <div className="my-10 text-center">
          {isEditing ? (
            <input
              type="text"
              name="companyName"
              value={sellerData.companyName}
              onChange={handleInputChange}
              className="text-lg text-center border-b border-gray-300 focus:outline-none focus:border-[#2A5D36]"
            />
          ) : (
            <p className="text-lg">{sellerData.companyName}</p>
          )}
        </div>

        <div className="flex flex-col items-center mx-auto max-w-6xl">
          <div className="flex items-center gap-3 w-full">
            {/* Left Data Column */}
            <div className="flex flex-col border border-gray-300 rounded-md flex-1">
              <div className="flex border-b border-gray-300 w-full">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Seller Legal Name</div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="legalName"
                      value={sellerData.legalName}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    sellerData.legalName
                  )}
                </div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Seller ABN</div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="abn"
                      value={sellerData.abn}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    sellerData.abn
                  )}
                </div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Seller Additional NGR&apos;s</div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="additionalNGRs"
                      value={sellerData.additionalNGRs}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    sellerData.additionalNGRs
                  )}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Seller Email</div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={sellerData.email}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    sellerData.email
                  )}
                </div>
              </div>
            </div>

            {/* Right Data Column */}
            <div className="flex flex-col border border-gray-300 rounded-md flex-1">
              <div className="flex border-b border-gray-300 w-full">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Seller Farm or PO Address</div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="farmAddress"
                      value={sellerData.farmAddress}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    sellerData.farmAddress
                  )}
                </div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Seller Main NGR</div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="mainNGR"
                      value={sellerData.mainNGR}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    sellerData.mainNGR
                  )}
                </div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Seller Contact Name</div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="contactName"
                      value={sellerData.contactName}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    sellerData.contactName
                  )}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2 p-3 text-[#1A1A1A]">Seller Phone Number</div>
                <div className="w-1/2 p-3">
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={sellerData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-[#2A5D36]"
                    />
                  ) : (
                    sellerData.phoneNumber
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {saveStatus === "success" && (
            <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
              Seller information saved successfully!
            </div>
          )}
          {saveStatus === "error" && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
              Error saving seller information. Please try again.
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

export default SellerInformationEditPage;