export interface Client {
  id: string;
  buyerName: string;
  abn: string;
  mainContract: string;
  email: string;
  phone: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  season: string;
  grower: string;
  tonnes: number;
  buyer: string;
  destination: string;
  contract: string;
  status: string;
}
