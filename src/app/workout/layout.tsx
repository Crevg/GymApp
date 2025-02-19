import Tabs from "@/components/Tabs/tabs";
import { ActiveTabContextProvider } from "../context/tabsState";

export default function WorkoutTabsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <ActiveTabContextProvider>
        <main className="centeredFlex main">
            <h1> Workout session </h1>
            <Tabs></Tabs>
            {children}
        </main>
    </ActiveTabContextProvider>
}