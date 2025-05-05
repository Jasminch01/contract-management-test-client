"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Seller } from "@/types/types";
import { sellers } from "@/data/data";

const CreateSellerPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Seller, "id" | "isDeleted">>({
    sellerLegalName: "",
    sellerOfficeAddress: "",
    sellerABN: "",
    sellerMainNGR: "",
    sellerAdditionalNGRs: [],
    sellerContactName: "",
    sellerEmail: "",
    sellerPhoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle comma-separated input for additional NGRs
    if (name === "sellerAdditionalNGRs") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((s) => s.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.sellerLegalName ||
      !formData.sellerOfficeAddress ||
      !formData.sellerABN ||
      !formData.sellerMainNGR ||
      !formData.sellerContactName
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newId = Math.max(...sellers.map((s) => s.id), 0) + 1;

    const newSeller: Seller = {
      id: newId,
      ...formData,
      isDeleted: false,
    };

    sellers.push(newSeller);

    console.log("New seller created:", newSeller);
    toast.success("Seller created successfully!");

    setTimeout(() => {
      router.push("/seller-management");
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 md:mt-32 px-4">
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-4xl">
          {/* Heading */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="font-bold text-xl">Create Seller</h1>
            <p className="text-sm">Fill up the form below</p>
          </div>

          <div className="space-y-6">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER LEGAL NAME *
                </label>
                <input
                  type="text"
                  name="sellerLegalName"
                  value={formData.sellerLegalName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER OFFICE ADDRESS *
                </label>
                <input
                  type="text"
                  name="sellerOfficeAddress"
                  value={formData.sellerOfficeAddress}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
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
                  name="sellerABN"
                  value={formData.sellerABN}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER CONTACT NAME *
                </label>
                <input
                  type="text"
                  name="sellerContactName"
                  value={formData.sellerContactName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
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
                  name="sellerEmail"
                  value={formData.sellerEmail}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  name="sellerPhoneNumber"
                  value={formData.sellerPhoneNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
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
                  name="sellerMainNGR"
                  value={formData.sellerMainNGR}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  SELLER ADDITIONAL NGRS (comma separated)
                </label>
                <input
                  type="text"
                  name="sellerAdditionalNGRs"
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="NGR1, NGR2, NGR3"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
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
  );
};

export default CreateSellerPage;
