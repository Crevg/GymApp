"use client"
import { createContext, useContext, useState } from "react";

export const ActiveTabContext = createContext({
  needTabs: true,
  setNeedTabs: (needTabs: boolean) => {},
  activeTab: 1,
  setActiveTab: (activeTab: number) => {}
})

export function useActiveTabContext() {
  return useContext(ActiveTabContext)
}

export function ActiveTabContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [activeTab, setActiveTab] = useState(0);
  const [needTabs, setNeedTabs] = useState(false);

  return <ActiveTabContext.Provider value={{ activeTab, setActiveTab, needTabs, setNeedTabs }}> {children} </ActiveTabContext.Provider>
}