"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { getCurrentUser, type CurrentUser } from "@/services/currentUserService";

type CurrentUserState = { user: CurrentUser | null; loading: boolean; error: string };
const CurrentUserContext = createContext<CurrentUserState>({ user: null, loading: true, error: "" });

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [state, setState] = useState<CurrentUserState>({ user: null, loading: true, error: "" });

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated") {
      setState({ user: null, loading: false, error: "" });
      return;
    }
    getCurrentUser()
      .then((user) => setState({ user, loading: false, error: "" }))
      .catch(() => setState({ user: null, loading: false, error: "Không thể tải thông tin tài khoản." }));
  }, [status]);

  return <CurrentUserContext.Provider value={state}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
