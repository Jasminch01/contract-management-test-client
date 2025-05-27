"use client";
import { Seller } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { MdSave, MdCancel } from "react-icons/md";
import toast from "react-hot-toast";
import { sellers } from "@/data/data";

const SellerInformationEditPage = () => {
  const { sellerId } = useParams();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const foundSeller = sellers.find(
    (seller) => seller.id.toString() === sellerId
  );

  const [sellerData, setSellerData] = useState<
    Seller & {
      sellerLocationZone: string[];
      accountNumber: string;
    }
  >(
    foundSeller
      ? {
          ...foundSeller,
          sellerLocationZone: foundSeller.sellerLocationZone || [],
          accountNumber: foundSeller.accountNumber || "",
        }
      : {
          id: 0,
          sellerLegalName: "",
          sellerOfficeAddress: "",
          sellerABN: "",
          sellerMainNGR: "",
          sellerAdditionalNGRs: [],
          sellerContactName: "",
          sellerEmail: "",
          sellerPhoneNumber: "",
          sellerLocationZone: [],
          accountNumber: "",
          isDeleted: false,
          createdAt: "",
          updatedAt: "",
        }
  );

  const [originalSellerData] = useState<Seller | null>(foundSeller || null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [hasChanges, setHasChanges] = useState(false);

  // Bulk Handler Password state
  const [passwordData, setPasswordData] = useState<{
    [key: string]: { username: string; password: string };
  }>({
    Viterra: { username: "", password: "" },
    Graincorp: { username: "", password: "" },
    GrainFlow: { username: "", password: "" },
    Tports: { username: "", password: "" },
    CBH: { username: "", password: "" },
    "Local Depots": { username: "", password: "" },
  });

  const locationZones = [
    "Eyre Peninsula",
    "Northern Adelaide",
    "Yorke Peninsular",
    "Southern Adelaide",
    "Riverland/Mallee",
    "Victoria",
    "TRADE",
  ];

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!sellerData) {
    toast.error(`Seller with ID ${sellerId} not found`);
    router.push("/seller-management");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSellerData((prev) => {
      if (!prev) return prev;
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
      if (!prev) return prev;
      const updated = {
        ...prev,
        sellerAdditionalNGRs: value.split(",").map((s) => s.trim()),
      };
      if (JSON.stringify(updated) !== JSON.stringify(originalSellerData)) {
        setHasChanges(true);
      }
      return updated;
    });
  };

  const handleLocationZoneChange = (zone: string) => {
    setSellerData((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        sellerLocationZone: prev.sellerLocationZone.includes(zone)
          ? prev.sellerLocationZone.filter((z) => z !== zone)
          : [...prev.sellerLocationZone, zone],
      };
      if (JSON.stringify(updated) !== JSON.stringify(originalSellerData)) {
        setHasChanges(true);
      }
      return updated;
    });
  };

  const removeZone = (zoneToRemove: string) => {
    setSellerData((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        sellerLocationZone: prev.sellerLocationZone.filter(
          (z) => z !== zoneToRemove
        ),
      };
      if (JSON.stringify(updated) !== JSON.stringify(originalSellerData)) {
        setHasChanges(true);
      }
      return updated;
    });
  };

  const handlePasswordDataChange = (
    handler: string,
    field: "username" | "password",
    value: string
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [handler]: {
        ...prev[handler],
        [field]: value,
      },
    }));
  };

  const handleProcessPassword = () => {
    console.log("Password data processed:", passwordData);
    toast.success("Bulk handler passwords updated successfully!");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    if (originalSellerData) {
      setSellerData({
        ...originalSellerData,
        sellerLocationZone: originalSellerData.sellerLocationZone || [],
        accountNumber: originalSellerData.accountNumber || "",
      });
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
        <div className="mx-auto max-w-6xl flex justify-between items-center">
          <p className="text-xl font-semibold">Seller Information</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2A5D36] py-2 px-6 text-white rounded hover:bg-[#1e4728] transition-colors cursor-pointer"
          >
            Bulk Handler Password
          </button>
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
            <Field
              label="Account Number"
              name="accountNumber"
              value={sellerData.accountNumber}
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

            {/* Location Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SELLER LOCATION ZONE
              </label>
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#2A5D36] focus:border-[#2A5D36] cursor-pointer min-h-[42px] flex items-center justify-between"
                >
                  <div className="flex-1 flex flex-wrap gap-1 mr-2">
                    {sellerData.sellerLocationZone.length === 0 ? (
                      <span className="text-gray-500 text-sm">
                        Select location zones...
                      </span>
                    ) : (
                      sellerData.sellerLocationZone.map((zone) => (
                        <span
                          key={zone}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#2A5D36] text-white"
                        >
                          <span className="max-w-[100px] truncate">{zone}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeZone(zone);
                            }}
                            className="ml-1 inline-flex items-center justify-center w-3 h-3 rounded-full hover:bg-[#1e4728] focus:outline-none transition-colors text-xs cursor-pointer"
                            title={`Remove ${zone}`}
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-1">
                      {locationZones.map((zone) => (
                        <label
                          key={zone}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={sellerData.sellerLocationZone.includes(
                              zone
                            )}
                            onChange={() => handleLocationZoneChange(zone)}
                            className="mr-3 h-4 w-4 text-[#2A5D36] focus:ring-[#2A5D36] border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 flex-1">
                            {zone}
                          </span>
                          {sellerData.sellerLocationZone.includes(zone) && (
                            <svg
                              className="w-4 h-4 text-[#2A5D36]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </label>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 px-3 py-2 bg-gray-50">
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setSellerData((prev) => ({
                              ...prev,
                              sellerLocationZone: [],
                            }));
                          }}
                          className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Clear All
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSellerData((prev) => ({
                              ...prev,
                              sellerLocationZone: [...locationZones],
                            }));
                          }}
                          className="text-xs text-[#2A5D36] hover:text-[#1e4728] transition-colors"
                        >
                          Select All
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Authority to Act Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                AUTHORITY TO ACT (FORM)
              </label>
              <input
                type="file"
                accept="application/pdf"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
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

      {/* Bulk Password Handler Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-4 flex justify-between items-center rounded-t-lg border-b">
              <h3 className="text-lg font-semibold text-center text-gray-900">
                Bulk Handler Passwords
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Body with Scrollable Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                        Bulk Handler
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                        Username/Email/Regos No
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                        Password
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(passwordData).map((handler) => (
                      <tr key={handler} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">
                          {handler}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <input
                            type="text"
                            value={passwordData[handler].username}
                            onChange={(e) =>
                              handlePasswordDataChange(
                                handler,
                                "username",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#2A5D36] focus:border-[#2A5D36]"
                            placeholder="Enter username/email"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <input
                            type="password"
                            value={passwordData[handler].password}
                            onChange={(e) =>
                              handlePasswordDataChange(
                                handler,
                                "password",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#2A5D36] focus:border-[#2A5D36]"
                            placeholder="Enter password"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white p-4 flex justify-center rounded-b-lg border-t">
              <button
                onClick={handleProcessPassword}
                className="bg-[#2A5D36] py-2 px-6 cursor-pointer text-white rounded hover:bg-[#1e4728] transition-colors focus:outline-none focus:ring-2 focus:ring-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
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
