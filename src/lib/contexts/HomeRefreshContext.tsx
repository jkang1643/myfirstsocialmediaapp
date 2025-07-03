"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface HomeRefreshContextType {
  refreshCount: number;
  triggerRefresh: () => void;
}

const HomeRefreshContext = createContext<HomeRefreshContextType | undefined>(undefined);

export function HomeRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshCount, setRefreshCount] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshCount((c) => c + 1);
  }, []);

  return (
    <HomeRefreshContext.Provider value={{ refreshCount, triggerRefresh }}>
      {children}
    </HomeRefreshContext.Provider>
  );
}

export function useHomeRefresh() {
  const ctx = useContext(HomeRefreshContext);
  if (!ctx) throw new Error('useHomeRefresh must be used within HomeRefreshProvider');
  return ctx;
} 