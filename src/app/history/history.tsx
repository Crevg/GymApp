"use client"

import { Exercise, SanitizedHistory } from "../../../public/types"

import HistoryCard from "./historyCard"

type Props = {
    history: Array<SanitizedHistory>
    historySecondary: Array<SanitizedHistory>
}

// MISSING "COLLAPSE" AND "SEE MORE" FUNCTIONALITY

export default function HistoryComponent({ history, historySecondary }: Props) {

    return <main className="centeredFlex main">
        <h1> Workout history </h1>
        {history.map((historySession, i) => <HistoryCard key={`hcomp-${i}`} session={historySession}></HistoryCard>)}

        {historySecondary.length > 0 &&
            <>
                <h1> Workout history secondary </h1>
                {historySecondary.map((historySession, i) => <HistoryCard key={`hcompsec-${i}`} session={historySession}></HistoryCard>)}
            </>
        }
    </main >
}