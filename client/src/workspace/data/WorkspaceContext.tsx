import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { deriveState, type WorkspaceState } from "./derive";
import type { WorkspaceData, WorkspaceLoad } from "./provider";

export type WorkspaceMode = "demo" | "live";

interface WorkspaceContextValue {
  state: WorkspaceState;
  data: WorkspaceData;
  mode: WorkspaceMode;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  data: WorkspaceData;
  mode: WorkspaceMode;
  fallback?: ReactNode;
  children: ReactNode;
}

/** Loads the snapshot once per provider instance, re-derives on every change notification. */
export function WorkspaceProvider({ data, mode, fallback = null, children }: WorkspaceProviderProps) {
  const [loaded, setLoaded] = useState<WorkspaceLoad | null>(null);

  useEffect(() => {
    let alive = true;
    const refresh = () => data.load().then((r) => alive && setLoaded({ ...r }));
    refresh();
    const unsubscribe = data.subscribe(refresh);
    return () => {
      alive = false;
      unsubscribe();
    };
  }, [data]);

  const state = useMemo(() => (loaded ? deriveState(loaded.snapshot, loaded.now) : null), [loaded]);

  if (!state) return <>{fallback}</>;
  return <WorkspaceContext.Provider value={{ state, data, mode }}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return ctx;
}
