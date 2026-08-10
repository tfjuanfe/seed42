"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ACCOUNT_EVENT, getAccount } from "@/lib/account";

// The course is unlocked by creating an account: everything except
// /login redirects there until one exists. Client-side by design —
// progress and the account both live in the browser for now.
export function AccountGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // /login is public: render it on the server immediately. Protected
  // routes stay blank until the client-side account check passes.
  const [ready, setReady] = useState(pathname === "/login");

  useEffect(() => {
    function check() {
      const has = Boolean(getAccount());
      if (!has && pathname !== "/login") {
        router.replace("/login");
        setReady(false);
        return;
      }
      if (has && pathname === "/login") {
        router.replace("/");
        setReady(false);
        return;
      }
      setReady(true);
    }
    check();
    window.addEventListener(ACCOUNT_EVENT, check);
    return () => window.removeEventListener(ACCOUNT_EVENT, check);
  }, [pathname, router]);

  // Nothing flashes while the redirect decision is made.
  if (!ready) return <div className="min-h-[60vh]" />;
  return <>{children}</>;
}
