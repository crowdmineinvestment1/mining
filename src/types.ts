export interface User {
  name: string;
  email: string;
  password?: string;
  balance: number;
  withdrawalFee?: number;
  joined?: string;
  profilePic?: string;
  hashrate?: string;
}

export interface DepositRequest {
  id: string;
  email: string;
  name: string;
  method: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface WithdrawalRequest {
  id: string;
  user: string;
  email: string;
  bank: string;
  account: string;
  routing: string;
  amount: string | number;
  feeStatus: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface GiftCardUpload {
  type: string;
  amount: string | number;
  image: string;
  user: string;
  date: string;
}

export interface WalletAddresses {
  btc: string;
  eth: string;
  sol: string;
  usdt: string;
  bnb: string;
}

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  mcap?: number | null;
  vol?: number | null;
  type: 'crypto' | 'metal' | 'stock';
  algorithm?: string;
  hashrate?: string;
  dailyReward?: string;
}
