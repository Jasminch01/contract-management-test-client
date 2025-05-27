"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { initialBuyers } from "@/data/data";
import { Buyer } from "@/types/types"; // Import from types

const CreateBuyerPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<
    Omit<Buyer, "id" | "isDeleted" | "createdAt" | "updatedAt">
  >({
    name: "",
    abn: "",
    officeAddress: "",
    contactName: "",
    email: "",
    phone: "", // Keep this field even though it's optional in the interface
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.abn || !formData.contactName) {
      toast.error("Please fill in all required fields");
      return;
    }

    const currentTimestamp = new Date().toISOString();

    // Generate a new ID (in a real app, this would come from your backend)
    const newId = (
      Math.max(...initialBuyers.map((b) => parseInt(b.id))) + 1
    ).toString();

    // Create new buyer object with required timestamp fields
    const newBuyer: Buyer = {
      id: newId,
      ...formData,
      isDeleted: false,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    };

    initialBuyers.push(newBuyer);

    // In a real app, you would send this to your API
    console.log("New buyer to be added:", newBuyer);
    console.log(initialBuyers);

    // For demo purposes, we'll just show a success message
    toast.success("Buyer created successfully!");

    // Redirect to buyer list page after creation
    setTimeout(() => {
      router.push("/buyer-management");
    }, 1000);
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="BUYER LEGAL NAME"
                  required
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="48 Pirrama Rd, Pyrmont Sydney NSW 2009"
                  required
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder=""
                  required
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder=""
                  required
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder=""
                  required
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  BUYER PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder=""
                  required
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                ACCOUNT NUMBER
              </label>
              <input
                type="text"
                name="accountNumber"
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder=""
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 text-center md:text-left">
            <button
              type="submit"
              className="bg-[#2A5D36] cursor-pointer py-2 px-6 text-white rounded-md hover:bg-[#1e4728] transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBuyerPage;
