"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Seller } from "@/types/types";
import axios from "axios";

const CreateSellerPage = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    bulkItemId: "",
    viewItem: "",
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    loremIpsum: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<Seller>({
    legalName: "",
    address: "",
    abn: "",
    mainNgr: "",
    additionalNgrs: [],
    contactName: "",
    email: "",
    phoneNumber: "",
    locationZone: [],
    accountNumber: "",
    authorityActFormPdf: "",
    authorityToAct: "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // Special handling for additionalNgrs
      if (name === "additionalNgrs") {
        return {
          ...prev,
          [name]: value
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== ""), // Remove empty strings
        };
      }

      // Normal handling for other fields
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first selected file
    if (file) {
      setFormData((prev) => ({
        ...prev,
        authorityActFormPdf: file, // Store the File object
      }));
    }
  };

  const handleLocationZoneChange = (zone: string) => {
    setFormData((prev) => {
      if (prev.locationZone.includes(zone)) {
        // Remove zone if already selected
        return {
          ...prev,
          locationZone: prev.locationZone.filter((z) => z !== zone),
        };
      } else {
        // Add zone if not selected
        return {
          ...prev,
          locationZone: [...prev.locationZone, zone],
        };
      }
    });
  };

  // Remove a single zone
  const removeZone = (zone: string) => {
    setFormData((prev) => ({
      ...prev,
      locationZone: prev.locationZone.filter((z) => z !== zone),
    }));
  };

  // Close dropdown when clicking outside
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

  const handlePasswordDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProcessPassword = () => {
    console.log("Password data processed:", passwordData);
    toast.success("Passwords processed successfully!");
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.legalName || !formData.abn || !formData.contactName) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newSeller: Seller = {
      ...formData,
    };

    console.log(newSeller);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/sellers",
        newSeller
      );
      if (res?.data) {
        toast.success("Seller created successfully!");
        router.push("/seller-management");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 md:mt-32 px-4">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {/* Header with Bulk Password Handler Button */}
          <div className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl">Create Seller</h1>
              <p className="text-sm">Fill up the form below</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2A5D36] py-2 px-6 text-white rounded hover:bg-[#1e4728] transition- cursor-pointer"
            >
              Bulk Handler Passwords
            </button>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="space-y-6">
              {/* Row 1 */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    SELLER LEGAL NAME *
                  </label>
                  <input
                    type="text"
                    name="legalName"
                    value={formData.legalName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    SELLER OFFICE ADDRESS *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    SELLER ABN *
                  </label>
                  <input
                    type="text"
                    name="abn"
                    value={formData.abn}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    SELLER CONTACT NAME *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    SELLER EMAIL *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    SELLER PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    SELLER MAIN NGR *
                  </label>
                  <input
                    type="text"
                    name="mainNgr"
                    value={formData.mainNgr}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SELLER ADDITIONAL NGRS (comma separated)
                  </label>
                  <input
                    type="text"
                    name="additionalNgrs"
                    value={formData.additionalNgrs.join(",")}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2A5D36] focus:border-[#2A5D36]"
                    placeholder="NGR1, NGR2, NGR3"
                  />
                </div>
              </div>

              {/* Row 5 - Location Zone and Account Number */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SELLER LOCATION ZONE (Multiple Select)
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    {/* Dropdown Button with Selected Items Inside */}
                    <div
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#2A5D36] focus:border-[#2A5D36] cursor-pointer min-h-[42px] flex items-center justify-between"
                    >
                      <div className="flex-1 flex flex-wrap gap-1 mr-2">
                        {formData.locationZone.length === 0 ? (
                          <span className="text-gray-500 text-sm">
                            Select location zones...
                          </span>
                        ) : (
                          formData.locationZone.map((zone) => (
                            <span
                              key={zone}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#2A5D36] text-white"
                            >
                              <span className="max-w-[100px] truncate">
                                {zone}
                              </span>
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

                    {/* Dropdown Menu */}
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
                                checked={formData.locationZone.includes(zone)}
                                onChange={() => handleLocationZoneChange(zone)}
                                className="mr-3 h-4 w-4 text-[#2A5D36] focus:ring-[#2A5D36] border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700 flex-1">
                                {zone}
                              </span>
                              {formData.locationZone.includes(zone) && (
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

                        {/* Clear All & Select All Actions */}
                        <div className="border-t border-gray-200 px-3 py-2 bg-gray-50">
                          <div className="flex justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
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
                                setFormData((prev) => ({
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

                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    ACCOUNT NUMBER
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Row 6 - Authority to Act Form */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    AUTHORITY TO ACT (FORM)
                  </label>
                  <input
                    type="file"
                    name="authorityActFormPdf"
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
                <div className="w-full md:w-1/2"></div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10 text-center md:text-left">
              <button
                type="submit"
                className="bg-[#2A5D36] py-2 px-6 text-white rounded-md hover:bg-[#1e4728] transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bulk Password Handler Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-4 flex justify-end items-center rounded-t-lg">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xl focus:outline-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body with Scrollable Content */}
            <div className="flex-1 px-20 overflow-y-auto">
              <h3 className="text-base mb-3 text-[#737373]">
                BULK HANDLER PASSWORD
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead>
                    <tr className="text-center">
                      <th className="border border-gray-300 px-4 py-2">
                        Bulk Handler
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Username/Email/PAN No
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Password
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "Viterra",
                      "Graincorp",
                      "GrainFlow",
                      "Tports",
                      "CBH",
                      "Louis Dreyfus",
                    ].map((handler, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-300 px-4 py-2">
                          {handler}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            name={`username-${idx}`}
                            onChange={handlePasswordDataChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-500"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="password"
                            name={`password-${idx}`}
                            onChange={handlePasswordDataChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white p-4 flex justify-center rounded-b-lg">
              <button
                onClick={handleProcessPassword}
                className="bg-[#2A5D36] py-2 px-6 cursor-pointer text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 hover:bg-[#1e4728]"
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

export default CreateSellerPage;
