"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Buyer } from "@/types/types"; // Import from types
import { createBuyer } from "@/api/buyerApi";

const CreateBuyerPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Buyer>({
    name: "",
    abn: "",
    officeAddress: "",
    contactName: "",
    email: "",
    phoneNumber: "",
    accountNumber: "",
  });

  // TanStack Query mutation for creating buyer
  const createBuyerMutation = useMutation({
    mutationFn: createBuyer,
    onSuccess: (data) => {
      // Invalidate and refetch the buyers list
      queryClient.invalidateQueries({ queryKey: ["buyers"] });
      // This provides instant feedback without waiting for refetch
      queryClient.setQueryData(["buyers"], (oldData: Buyer[] | undefined) => {
        if (oldData) {
          return [data, ...oldData];
        }
        return [data];
      });

      toast.success("Buyer created successfully!");
      router.push("/buyer-management");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Create buyer error:", error);
      toast.error(error?.message || "Failed to create buyer");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.abn ||
      !formData.contactName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.officeAddress
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const newBuyer: Buyer = {
      ...formData,
    };

    // Use the mutation instead of direct API call
    createBuyerMutation.mutate(newBuyer);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 md:mt-32 px-4">
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-4xl">
          {/* Heading Section */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="font-bold text-xl">Create Buyer</h1>
            <p className="text-sm">Fill up the form below</p>
          </div>

          {/* Input Fields */}
          <div className="space-y-6">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  BUYER LEGAL NAME *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                  required
                  disabled={createBuyerMutation.isPending}
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  BUYER OFFICE ADDRESS *
                </label>
                <input
                  type="text"
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                  required
                  disabled={createBuyerMutation.isPending}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  BUYER ABN *
                </label>
                <input
                  type="text"
                  name="abn"
                  value={formData.abn}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                  required
                  disabled={createBuyerMutation.isPending}
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  BUYER CONTACT NAME *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                  required
                  disabled={createBuyerMutation.isPending}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  BUYER EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                  required
                  disabled={createBuyerMutation.isPending}
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  BUYER PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                  required
                  disabled={createBuyerMutation.isPending}
                />
              </div>
            </div>

            {/* Row 4 - Account Number */}
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                ACCOUNT NUMBER
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                disabled={createBuyerMutation.isPending}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 text-center md:text-left">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/buyer-management")}
                className="bg-gray-500 cursor-pointer py-2 px-6 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createBuyerMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#2A5D36] cursor-pointer py-2 px-6 text-white rounded-md hover:bg-[#1e4728] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createBuyerMutation.isPending}
              >
                {createBuyerMutation.isPending && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {createBuyerMutation.isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {createBuyerMutation.isError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">
                {createBuyerMutation.error?.message ||
                  "An error occurred while creating the buyer"}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateBuyerPage;
