import { createContext, type ReactNode } from "react";

type AppContextValue = Record<string, never>;

export const AppContext = createContext<AppContextValue>({});

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  );
}
