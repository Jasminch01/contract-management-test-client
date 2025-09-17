export interface HistoricalPrice {
  id: string;
  commodity: string;
  date: string;
  price: number;
  quality: string;
  comment?: string; // Optional field
}

export interface ContractType {
  id: number;
  name: string;
}

export type BrokeragePayableOption = {
  name: string;
  value: string;
};

export interface ConveyanceOption {
  id: number;
  value: string;
  label: string;
}

export interface TrashData {
  buyers: Buyer[];
  sellers: Seller[];
  contracts: TContract[];
}

export interface HistoricalPricesData {
  historical_prices: HistoricalPrice[];
}

export interface PortZoneBid {
  _id?: string;
  label:
    | "Outer Harbor"
    | "Port Lincoln"
    | "Port Giles"
    | "Wallaroo"
    | "Lucky Bay"
    | "Thevenard"
    | "Wallaroo Tports";
  season: string;

  // Bid types - matching backend schema exactly
  APW1: number | null;
  H1: number | number | null;
  H2: number | null;
  AUH2: number | null;
  ASW1: number | null;
  AGP1: number | null;
  SFW1: number | null;
  BAR1: number | null;
  MA1: number | null;
  CM1: number | null;
  COMD: number | null;
  CANS: number | null;
  FIEV: number | null;
  "NIP/HAL": number | null;
  // Timestamps (handled by MongoDB)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Buyer {
  _id?: string;
  name: string;
  abn: string;
  officeAddress: string;
  accountNumber: string;
  contactName: string[]; // Now an array instead of string
  email: string;
  phoneNumber: string;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;
}

export type ContractStatus = "Draft" | "Incomplete" | "Complete" | "Invoiced";

// For the array of contracts

export type BulkHandlerName =
  | "Viterra"
  | "Graincorp"
  | "GrainFlow"
  | "Tports"
  | "CBH"
  | "Louis Dreyfus";

export type BulkHandlerCredential = {
  handlerName: BulkHandlerName;
  identifier: string;
  password: string;
};

export interface Seller {
  _id?: string;
  legalName: string;
  abn?: string;
  additionalNgrs?: string[];
  accountNumber?: string;
  email?: string;
  authorityToAct?: string;
  address?: string;
  mainNgr?: string;
  contactName: string[];
  locationZone?: string[];
  phoneNumber?: string;
  authorityActFormPdf?: string;
  bulkHandlerCredentials: BulkHandlerCredential[];
  isDeleted?: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TContract {
  _id?: string;
  buyerContractReference: string;
  sellerContractReference: string;
  grade: string;
  buyer: Buyer;
  seller: Seller;
  contractType: string;
  deliveryOption: string;
  deliveryPeriod: {
    start: string;
    end: string;
  };
  freight: string;
  weights: string;
  priceExGST: string;
  conveyance: string;
  attachedSellerContract?: string;
  attachedBuyerContract?: string;
  commodity: string;
  certificationScheme: string;
  paymentTerms: string;
  brokerRate: string;
  deliveryDestination: string;
  brokeragePayableBy: string;
  specialCondition: string;
  termsAndConditions: string;
  notes: string;
  ngrNumber?: string;
  buyerContactName?: string;
  sellerContactName?: string;
  tonnes: string;
  tolerance: string;
  season: string;
  isDeleted: boolean;
  deletedAt: string;
  status: string;
  createdAt: string; // or Date if you'll parse it
  contractNumber: string;
  contractDate: string; // Added contractDate
}
export interface TUpdateContract {
  _id?: string;
  contractNumber: string;
  buyerContractReference: string;
  sellerContractReference: string;
  grade: string;
  buyer: string;
  seller: string;
  contractType: string;
  deliveryOption: string;
  deliveryPeriod: {
    start: string;
    end: string;
  };
  freight: string;
  weights: string;
  priceExGST: string;
  conveyance: string;
  attachedSellerContract?: string;
  attachedBuyerContract?: string;
  commodity: string;
  certificationScheme: string;
  paymentTerms: string;
  brokerRate: string;
  deliveryDestination: string;
  brokeragePayableBy: string;
  specialCondition: string;
  termsAndConditions: string;
  notes: string;
  tonnes: string;
  ngrNumber?: string;
  buyerContactName?: string;
  sellerContactName?: string;
  tolerance: string;
  season: string;
  status?: string;
  contractDate: string; // Added contractDate
}

// Add these interfaces to your existing types/types.ts file

// Add these interfaces to your existing types/types.ts file

export interface FetchContractsParams {
  page?: number;
  limit?: number;
  search?: string; // Global search (keep for backward compatibility)
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  // Specific field filters for AdvanceSearchFilter
  contractNumber?: string;
  ngrNumber?: string;
  commodity?: string;
  sellerName?: string;
  buyerName?: string;
  grade?: string;
  tonnes?: string;

  // Add any other filter parameters your API supports
  season?: string;
  buyerId?: string;
  sellerId?: string;
  dateFrom?: string;
  dateTo?: string;
  deliveryDestination?: string;
  priceFrom?: number;
  priceTo?: number;
}

export interface ContractsPaginatedResponse {
  page: number;
  totalPages: number;
  total: number;
  data: TContract[];
  // Optional additional metadata
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  limit?: number;
}

// If you want to add more specific pagination metadata
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  startRecord: number;
  endRecord: number;
}
