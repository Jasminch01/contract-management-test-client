"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Seller } from "@/types/types";
import { sellers } from "@/data/data";

const CreateSellerPage = () => {
  const router = useRouter();
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
  const [formData, setFormData] = useState<
    Omit<Seller, "id" | "isDeleted" | "createdAt" | "updatedAt"> & {
      sellerLocationZone: string;
      accountNumber: string;
    }
  >({
    sellerLegalName: "",
    sellerOfficeAddress: "",
    sellerABN: "",
    sellerMainNGR: "",
    sellerAdditionalNGRs: [],
    sellerContactName: "",
    sellerEmail: "",
    sellerPhoneNumber: "",
    sellerLocationZone: "",
    accountNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    const currentTimestamp = new Date().toISOString();
    const newId = Math.max(...sellers.map((s) => s.id), 0) + 1;

    const newSeller: Seller & {
      sellerLocationZone: string;
      accountNumber: string;
    } = {
      id: newId,
      ...formData,
      isDeleted: false,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
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
        <div className="w-full max-w-4xl">
          {/* Header with Bulk Password Handler Button */}
          <div className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl">Create Seller</h1>
              <p className="text-sm">Fill up the form below</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2A5D36] py-2 px-6 text-white rounded hover:bg-[#1e4728] transition-colors"
            >
              Bulk Handle Password
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
                    name="sellerLegalName"
                    value={formData.sellerLegalName}
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
                    name="sellerOfficeAddress"
                    value={formData.sellerOfficeAddress}
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
                    name="sellerABN"
                    value={formData.sellerABN}
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
                    name="sellerContactName"
                    value={formData.sellerContactName}
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
                    name="sellerEmail"
                    value={formData.sellerEmail}
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
                    name="sellerPhoneNumber"
                    value={formData.sellerPhoneNumber}
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
                    name="sellerMainNGR"
                    value={formData.sellerMainNGR}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    placeholder="NGR1, NGR2, NGR3"
                  />
                </div>
              </div>

              {/* Row 5 - Location Zone and Account Number */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    SELLER LOCATION ZONE
                  </label>
                  <select
                    name="sellerLocationZone"
                    value={formData.sellerLocationZone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  >
                    <option value="">Select a zone</option>
                    <option value="Eyre Peninsula">Eyre Peninsula</option>
                    <option value="Northern Adelaide">Northern Adelaide</option>
                    <option value="Yorke Peninsular">Yorke Peninsular</option>
                    <option value="Southern Adelaide">Southern Adelaide</option>
                    <option value="Riverland/Mallee">Riverland/Mallee</option>
                    <option value="Victoria">Victoria</option>
                    <option value="TRADE">TRADE</option>
                  </select>
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
                className="text-xl focus:outline-none"
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
                        Username/Email/Regos No
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
                      "Local Depots",
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
                className="bg-[#2A5D36] py-2 px-6 text-white rounded hover:bg-[#1e4728] transition-colors focus:outline-none focus:ring-2 focus:ring-green-700"
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
