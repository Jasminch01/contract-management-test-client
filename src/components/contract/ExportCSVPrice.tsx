/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from "react";
import { CSVLink } from "react-csv";

// Define types
interface CSVHeader {
  label: string;
  key: string;
}

interface PortZone {
  port: string;
}

interface DataRow {
  id: string;
  portZones: PortZone[];
  [key: string]: string | PortZone[]; // Allow dynamic properties
}

interface ExportCSVButtonProps {
  data: DataRow[];
  keys: string[];
  filename: string;
  disabled: boolean;
}

const ExportCSVPrice: React.FC<ExportCSVButtonProps> = ({
  data,
  keys,
  filename,
  disabled,
}) => {
  // Prepare CSV headers
  const headers: CSVHeader[] = [
    { label: "Port Zone", key: "portzone" },
    ...keys.map((key) => ({
      label: key.toUpperCase(),
      key,
    })),
  ];

  // Prepare CSV data
  const csvData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((row) => {
      const portZone = row.portZones.map((zone) => zone.port).join(", ");
      const rowData: Record<string, string> = { portzone: portZone };

      keys.forEach((key) => {
        rowData[key] = (row[key] as string) || "";
      });

      return rowData;
    });
  }, [data, keys]);

  return (
    // @ts-expect-error
    <CSVLink
      data={csvData}
      headers={headers}
      filename={filename}
      className={`flex items-center gap-2 px-2 py-1 border border-gray-300 rounded-md text-gray-700 ${
        disabled
          ? "bg-gray-100 cursor-not-allowed opacity-50"
          : "bg-white hover:bg-gray-50 cursor-pointer"
      }`}
      target="_blank"
      style={disabled ? { pointerEvents: "none" } : undefined}
    >
      Export as CSV
    </CSVLink>
  );
};

export default ExportCSVPrice;
