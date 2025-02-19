"use client"

import { Exercise, SanitizedHistory } from "../../../public/types"
import HistoryCard from "./historyCard"

type Props = {
    history: Array<SanitizedHistory>
    exerciseList: Array<Exercise>
}

export default function HistoryComponent({ history, exerciseList}: Props) {

    return <main className="centeredFlex main">
        <h1> Workout history </h1>
        {history.map((historySession, i) => <HistoryCard key={`hcomp-${i}`} exerciseList={exerciseList} session={historySession}></HistoryCard>)}
    </main >
}