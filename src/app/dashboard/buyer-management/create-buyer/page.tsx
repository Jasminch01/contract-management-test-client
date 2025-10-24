"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Buyer, BuyersPaginatedResponse } from "@/types/types";
import { createBuyer } from "@/api/buyerApi";

interface ContactDetails {
  name: string;
  email: string;
  phoneNumber: string;
}

const CreateBuyerPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    abn: "",
    officeAddress: "",
    email: "",
    phoneNumber: "",
    accountNumber: "",
  });

  const [contacts, setContacts] = useState<ContactDetails[]>([]);
  const [currentContact, setCurrentContact] = useState<ContactDetails>({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const createBuyerMutation = useMutation({
    mutationFn: createBuyer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["buyers"] });

      queryClient.setQueryData(
        ["buyers"],
        (oldData: BuyersPaginatedResponse | undefined) => {
          if (oldData && oldData.data && Array.isArray(oldData.data)) {
            return {
              ...oldData,
              data: [data, ...oldData.data],
              total: oldData.total + 1,
            };
          }
        }
      );

      toast.success("Buyer created successfully!");
      router.push("/dashboard/buyer-management");
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

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addContact = () => {
    // Validate contact fields
    if (!currentContact.name.trim()) {
      toast.error("Contact name is required");
      return;
    }

    if (!currentContact.email.trim()) {
      toast.error("Contact email is required");
      return;
    }

    if (!currentContact.phoneNumber.trim()) {
      toast.error("Contact phone number is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentContact.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check for duplicate contact name
    if (contacts.some((c) => c.name === currentContact.name.trim())) {
      toast.error("Contact name already exists");
      return;
    }

    // Add contact to list
    const newContact = {
      name: currentContact.name.trim(),
      email: currentContact.email.trim(),
      phoneNumber: currentContact.phoneNumber.trim(),
    };

    setContacts((prev) => [...prev, newContact]);

    // Reset current contact form
    setCurrentContact({
      name: "",
      email: "",
      phoneNumber: "",
    });

    toast.success("Contact added successfully");
  };

  const removeContact = (nameToRemove: string) => {
    setContacts((prev) => prev.filter((c) => c.name !== nameToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Contact validation
    if (contacts.length === 0) {
      toast.error("Please add at least one contact");
      return;
    }

    // Basic validation for other required fields
    if (
      !formData.name ||
      !formData.abn ||
      !formData.officeAddress ||
      !formData.email ||
      !formData.phoneNumber
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
      contacts: contacts,
    };

    createBuyerMutation.mutate(newBuyer);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 md:mt-32 px-4">
      <Toaster />
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
                  BUYER EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                  disabled={createBuyerMutation.isPending}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col md:flex-row gap-6">
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
                  disabled={createBuyerMutation.isPending}
                />
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                  disabled={createBuyerMutation.isPending}
                />
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="border-t pt-6 mt-6">
              <h2 className="font-semibold text-lg mb-4">Contact Details *</h2>
              
              {/* Add Contact Form */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={currentContact.name}
                      onChange={handleContactChange}
                      placeholder="Enter contact name"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                      disabled={createBuyerMutation.isPending}
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={currentContact.email}
                      onChange={handleContactChange}
                      placeholder="Enter email"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                      disabled={createBuyerMutation.isPending}
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={currentContact.phoneNumber}
                      onChange={handleContactChange}
                      placeholder="Enter phone number"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36] focus:border-transparent"
                      disabled={createBuyerMutation.isPending}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addContact}
                  className="bg-[#2A5D36] text-white px-4 py-2 rounded-md hover:bg-[#1e4728] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={createBuyerMutation.isPending}
                >
                  Add Contact
                </button>
              </div>

              {/* Display Added Contacts */}
              {contacts.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Added Contacts:</h3>
                  {contacts.map((contact, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-md p-4 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">{contact.name}</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>📧 {contact.email}</div>
                          <div>📞 {contact.phoneNumber}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeContact(contact.name)}
                        className="text-red-500 hover:text-red-700 font-bold text-xl"
                        disabled={createBuyerMutation.isPending}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 text-center md:text-left">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
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