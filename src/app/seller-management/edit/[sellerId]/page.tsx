"use client";
import { Seller } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { MdSave, MdCancel, MdKeyboardBackspace } from "react-icons/md";
import toast from "react-hot-toast";
import { getseller, updateSeller } from "@/api/sellerApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SellerInformationEditPage = () => {
  const { sellerId } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [sellerData, setSellerData] = useState<Seller | null>(null);
  const [originalSellerData, setOriginalSellerData] = useState<Seller | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [hasChanges, setHasChanges] = useState(false);

  // Fix: Ensure sellerId is properly handled
  const sellerIdStr = Array.isArray(sellerId)
    ? sellerId[0]
    : sellerId?.toString();

  const {
    data: fetchSellerData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["seller", sellerIdStr],
    queryFn: () => getseller(sellerIdStr!) as Promise<Seller>,
    enabled: !!sellerIdStr,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

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

  // Mutation to update seller data
  const updateSellerMutation = useMutation({
    mutationFn: (updatedSeller: Seller) =>
      updateSeller(updatedSeller, sellerIdStr!),
    onMutate: async (updatedSeller) => {
      setSaveStatus("saving");
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["seller", sellerIdStr] });

      // Snapshot the previous value
      const previousSeller = queryClient.getQueryData(["seller", sellerIdStr]);

      // Optimistically update to the new value
      queryClient.setQueryData(["seller", sellerIdStr], updatedSeller);

      return { previousSeller };
    },
    onError: (error, updatedSeller, context) => {
      setSaveStatus("error");
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSeller) {
        queryClient.setQueryData(
          ["seller", sellerIdStr],
          context.previousSeller
        );
      }
      console.error("Update seller error:", error);
      toast.error("Failed to update seller information");
    },
    onSuccess: () => {
      setSaveStatus("success");
      toast.success("Seller information updated successfully");
      setHasChanges(false);

      // Invalidate and refetch seller data to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["seller", sellerIdStr] });

      // Also invalidate the sellers list if you have one
      queryClient.invalidateQueries({ queryKey: ["sellers"] });

      // Navigate back to seller management after a short delay
      setTimeout(() => {
        router.push(`/seller-management`);
      }, 1000);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state consistency
      queryClient.invalidateQueries({ queryKey: ["seller", sellerIdStr] });
    },
  });

  useEffect(() => {
    if (fetchSellerData) {
      // Fix: Ensure proper initialization with default values
      const initializedData = {
        ...fetchSellerData,
        locationZone: fetchSellerData.locationZone || [],
        additionalNgrs: fetchSellerData.additionalNgrs || [],
        accountNumber: fetchSellerData.accountNumber || "",
        contactName:
          fetchSellerData.contactName || fetchSellerData.legalName || "",
      };

      setSellerData(initializedData);
      setOriginalSellerData(initializedData);
    }
  }, [fetchSellerData]);

  // Fix: Utility function to check for changes
  const checkForChanges = (updatedData: Seller) => {
    if (!originalSellerData) return false;
    return JSON.stringify(updatedData) !== JSON.stringify(originalSellerData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSellerData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [name]: value };
      setHasChanges(checkForChanges(updated));
      return updated;
    });
  };

  // Fix: Handle Additional NGRs change properly
  const handleAdditionalNGRChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSellerData((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        additionalNgrs: value
          ? value
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
      };
      setHasChanges(checkForChanges(updated));
      return updated;
    });
  };

  // Fix: Handle Location Zone change properly
  const handleLocationZoneChange = (zone: string) => {
    setSellerData((prev) => {
      if (!prev) return prev;
      const currentZones = prev.locationZone || [];
      const updated = {
        ...prev,
        locationZone: currentZones.includes(zone)
          ? currentZones.filter((z) => z !== zone)
          : [...currentZones, zone],
      };
      setHasChanges(checkForChanges(updated));
      return updated;
    });
  };

  const removeZone = (zoneToRemove: string) => {
    setSellerData((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        locationZone: (prev.locationZone || []).filter(
          (z) => z !== zoneToRemove
        ),
      };
      setHasChanges(checkForChanges(updated));
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
      setSellerData({ ...originalSellerData });
    }
    setHasChanges(false);
    setSaveStatus("idle");
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (hasChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    router.push("/seller-management");
  };

  const handleSave = async () => {
    if (!sellerData || !sellerIdStr) return;
    updateSellerMutation.mutate(sellerData);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="text-gray-600">Loading seller data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error instanceof Error
              ? error.message
              : "Failed to load seller data"}
          </p>
          <div className="space-x-4">
            <button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["seller", sellerIdStr],
                })
              }
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            >
              Retry
            </button>
            <button
              onClick={() => router.push("/seller-management")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Seller Management
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fix: Better handling of seller not found case
  if (!sellerData && !isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Seller with ID {sellerId} not found
          </p>
          <button
            onClick={() => router.push("/seller-management")}
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          >
            Back to Seller Management
          </button>
        </div>
      </div>
    );
  }

  if (!sellerData) {
    return null;
  }

  return (
    <div>
      <div className="border-b border-gray-300 py-10">
        <div className="mx-auto max-w-6xl flex justify-between items-center">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer"
            >
              <MdKeyboardBackspace size={24} />
            </button>
            <p className="text-xl font-semibold">Seller Information</p>
          </div>
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
              name="legalName"
              value={sellerData?.legalName || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Office Address"
              name="address"
              value={sellerData.address || ""}
              onChange={handleInputChange}
            />
            <Field
              label="ABN"
              name="abn"
              value={sellerData.abn || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Main NGR"
              name="mainNgr"
              value={sellerData.mainNgr || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Contact Name"
              name="contactName"
              value={sellerData.contactName || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Email"
              name="email"
              value={sellerData.email || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Phone Number"
              name="phoneNumber"
              value={sellerData.phoneNumber || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Account Number"
              name="accountNumber"
              value={sellerData.accountNumber || ""}
              onChange={handleInputChange}
            />

            {/* Fix: Location Zone Selector */}
            <div className="w-full">
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
                    {(sellerData.locationZone || []).length === 0 ? (
                      <span className="text-gray-500 text-sm">
                        Select location zones...
                      </span>
                    ) : (
                      (sellerData.locationZone || []).map((zone) => (
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
                            checked={(sellerData.locationZone || []).includes(
                              zone
                            )}
                            onChange={() => handleLocationZoneChange(zone)}
                            className="mr-3 h-4 w-4 text-[#2A5D36] focus:ring-[#2A5D36] border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 flex-1">
                            {zone}
                          </span>
                          {(sellerData.locationZone || []).includes(zone) && (
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
                  </div>
                )}
              </div>
            </div>

            {/* Fix: Additional NGRs */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Additional NGRs
              </label>
              <input
                type="text"
                name="additionalNgrs"
                value={(sellerData.additionalNgrs || []).join(", ")}
                onChange={handleAdditionalNGRChange}
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-green-700"
                placeholder="Enter NGRs separated by commas"
              />
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
                disabled={saveStatus === "saving"}
                className="py-2 px-5 bg-gray-500 text-white rounded flex items-center gap-2 hover:bg-gray-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
