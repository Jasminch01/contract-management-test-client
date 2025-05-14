/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { CSVLink } from "react-csv";

// Types
interface CSVHeader {
  label: string;
  key: string;
}
interface DeliverdBid {
  location: string;
}

interface PortZone {
  port: string;
}

interface HistoricalPrice {
  id: string;
  portZones: PortZone[];
  [key: string]: string | PortZone[];
}

interface DeliverdBids {
  id: string;
  locations: DeliverdBid[];
  [key: string]: string | DeliverdBid[];
}

type ExportData = HistoricalPrice | DeliverdBids;

interface ExportCSVButtonProps {
  data: ExportData[] | ExportData[][];
  keys: string[];
  filename: string;
  disabled: boolean;
  isPortZoneData?: boolean;
}

const ExportCSVPrice: React.FC<ExportCSVButtonProps> = ({
  data,
  keys,
  filename,
  disabled,
  isPortZoneData = true,
}) => {
  // Headers
  const headers: CSVHeader[] = isPortZoneData
    ? [
        { label: "Port Zone", key: "portzone" },
        ...keys.map((key) => ({
          label: key.toUpperCase(),
          key,
        })),
      ]
    : [
        { label: "Location", key: "location" },
        ...keys.map((key) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          key,
        })),
      ];

  // Flatten nested data arrays
  const flatData: ExportData[] = Array.isArray(data[0])
    ? (data as ExportData[][]).flat()
    : (data as ExportData[]);

  // Construct CSV data
  const csvData: Record<string, string>[] = React.useMemo(() => {
    if (!flatData || flatData.length === 0) return [];

    return flatData.map((row) => {
      if (isPortZoneData) {
        const historical = row as HistoricalPrice;
        const portZone = historical.portZones
          .map((zone) => zone.port)
          .join(", ");
        const rowData: Record<string, string> = { portzone: portZone };
        keys.forEach((key) => {
          rowData[key] = (historical[key] as string) || "";
        });
        return rowData;
      } else {
        const delivered = row as DeliverdBids;
        const locations = delivered.locations
          .map((loc) => loc.location)
          .join(", ");
        const rowData: Record<string, string> = {
          location: locations,
        };
        keys.forEach((key) => {
          rowData[key] = (delivered[key] as string) || "";
        });
        return rowData;
      }
    });
  }, [flatData, keys, isPortZoneData]);

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
