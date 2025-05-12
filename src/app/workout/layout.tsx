import Tabs from "@/components/Tabs/tabs";
import { GlobalContextProvider } from "../context/tabsState";

export default function WorkoutTabsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <GlobalContextProvider>
        <main className="centeredFlex main">
            <h1> Workout session </h1>
            <Tabs></Tabs>
            {children}
        </main>
    </GlobalContextProvider>
}