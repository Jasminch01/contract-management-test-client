import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
}

const getCurrentDateInputValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [startDate, setStartDate] = useState(getCurrentDateInputValue());
  const [endDate, setEndDate] = useState(getCurrentDateInputValue());

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        toast.error("Start date cannot be after end date");
        return;
      }
      onConfirm(startDate, endDate);
      onClose();
    } else {
      toast.error("Please select both start and end dates");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 max-w-90vw">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Select Date Range for Export
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-[#2A5D36] hover:bg-[#1e4728] text-white rounded-md  transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeModal;
