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

export interface HistoricalPricesData {
  historical_prices: HistoricalPrice[];
}

export interface PortZoneBid {
  _id?: string; // MongoDB _id mapped to this
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
  contactName: string;
  email: string;
  phoneNumber: string;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;
}

export interface Seller {
  _id?: string;
  legalName: string;
  abn: string;
  additionalNgrs: string[];
  accountNumber: string;
  email: string;
  authorityToAct: string;
  address: string;
  mainNgr: string;
  contactName: string;
  locationZone: string[];
  phoneNumber: string;
  authorityActFormPdf: string | File;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;

  bulkHandlerCredentials?: {
    handlerName: {
      type: StringConstructor;
      enum: [
        "Viterra",
        "Graincorp",
        "GrainFlow",
        "Tports",
        "CBH",
        "Louis Dreyfus"
      ];
      required: true;
    };
    identifier?: string;
    password?: string;
  };
}

export type ContractStatus = "Incomplete" | "Complete" | "Invoiced";

// For the array of contracts

export interface Buyer {
  _id?: string;
  name: string;
  abn: string;
  email: string;
  accountNumber: string;
  officeAddress: string;
  contactName: string;
  phoneNumber: string;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface Seller {
  locationZone?: string[];
  _id?: string;
  legalName: string;
  abn: string;
  mainNgr: string;
  additionalNgrs?: string[];
  accountNumber: string;
  email: string;
  address: string;
  contactName: string;
  phoneNumber: string;
  isDeleted?: boolean;
  createdAt?: string;
  bulkHandlerCredentials?: Bulk;
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
  tonnes: number;
  tolerance: string;
  season: string;
  isDeleted: boolean;
  status: string;
  createdAt: string; // or Date if you'll parse it
  contractNumber: string;
}
export interface TUpdateContract {
  _id?: string;
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
  tonnes: number;
  tolerance: string;
  season: string;
  status: string;
}
