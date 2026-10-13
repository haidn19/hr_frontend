"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { CurrentUserProvider } from "@/components/CurrentUserProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider><CurrentUserProvider>{children}</CurrentUserProvider></SessionProvider>;
}
