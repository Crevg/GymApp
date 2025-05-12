"use client"
import { createContext, useContext, useState } from "react";

export const GlobalContext = createContext({
  needTabs: true,
  setNeedTabs: (needTabs: boolean) => {},
  activeTab: 1,
  setActiveTab: (activeTab: number) => {},
  loading: false,
  setLoading: (loading: boolean) => {}
})

export function useGlobalContext() {
  return useContext(GlobalContext)
}

export function GlobalContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [needTabs, setNeedTabs] = useState(false);

  return <GlobalContext.Provider value={{ activeTab, setActiveTab, needTabs, setNeedTabs, loading, setLoading }}> {children} </GlobalContext.Provider>
}