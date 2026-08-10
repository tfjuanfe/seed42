// Local account, v0 of auth. Lives in this browser only; will be
// replaced by Google sign-in (Supabase/Clerk) once provisioned. The
// custom event lets the nav react to login/logout instantly.

export interface Account {
  name: string;
  email: string;
  createdAt: string;
}

const KEY = "seed42:account:v1";
export const ACCOUNT_EVENT = "seed42:account-changed";

export function getAccount(): Account | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
}

export function createAccount(name: string, email: string): Account {
  const account: Account = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(account));
    window.dispatchEvent(new Event(ACCOUNT_EVENT));
  } catch {}
  return account;
}

export function clearAccount(): void {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(ACCOUNT_EVENT));
  } catch {}
}
