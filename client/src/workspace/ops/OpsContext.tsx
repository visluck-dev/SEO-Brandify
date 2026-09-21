import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { OpsStore } from "./OpsStore";

const OpsContext = createContext<{ store: OpsStore; version: number } | null>(null);

/** One store per console session; `version` bumps on every change so pages re-read derived state. */
export function OpsProvider({ children }: { children: ReactNode }) {
  const store = useMemo(() => new OpsStore(), []);
  const [version, setVersion] = useState(0);
  useEffect(() => store.subscribe(() => setVersion((v) => v + 1)), [store]);
  return <OpsContext.Provider value={{ store, version }}>{children}</OpsContext.Provider>;
}

export function useOps() {
  const ctx = useContext(OpsContext);
  if (!ctx) throw new Error("useOps must be used inside <OpsProvider>");
  return ctx;
}
