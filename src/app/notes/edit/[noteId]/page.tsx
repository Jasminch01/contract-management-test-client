"use client";
import { Note } from "@/types/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditNotepage = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Note>>({
    noteName: "",
    br: "",
    notes: "",
  });

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/notes.json");
        const notes: Note[] = await response.json();

        // Find the contract with matching ID
        const foundNote = notes.find(
          (note) => note.id === noteId || note?.id === noteId
        );

        if (foundNote) {
          setNote(foundNote);
          setFormData({
            noteName: foundNote.noteName,
            br: foundNote.br,
            notes: foundNote.notes,
          });
        } else {
          setError(`Contract with ID ${noteId} not found`);
        }
      } catch (err) {
        setError("Failed to load contract data");
        console.error("Error fetching contract:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [noteId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated data to your API
    console.log("Updated note data:", formData);
    // Add your submission logic here
  };

  if (loading) {
    return <div className="mt-6 text-center">Loading contract details...</div>;
  }

  if (error) {
    return <div className="mt-6 text-center text-red-500">{error}</div>;
  }

  if (!note) {
    return <div className="mt-6 text-center">Note is not available</div>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 md:mt-32 px-4">
      <div className="w-full flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-4xl">
          <div className="mb-10 text-center md:text-left">
            <h1 className="font-bold text-xl">Edit Note</h1>
          </div>

          <div className="space-y-4 w-full">
            <div className="w-full flex gap-5">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  NOTEBOOK NAME
                </label>
                <input
                  type="text"
                  name="noteName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.noteName || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  BROKER REFERENCE
                </label>
                <input
                  type="text"
                  name="br"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.br || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 uppercase">
                Edit Note
              </label>
              <textarea
                name="notes"
                rows={8}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.notes || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-10 text-center md:text-left">
            <button
              type="submit"
              className="bg-[#2A5D36] py-2 px-6 text-white rounded-md hover:bg-[#1e4728] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNotepage;
