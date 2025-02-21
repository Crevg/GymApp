"use client"
import { exercises } from "../../../../public/data/muscleGroups"
import { Routine } from "../../../../public/types"
import DayCard from "../[routine]/dayCard"

type Props = {
    currentRoutine: Routine,
    secondaryCurrentRoutine: Routine | undefined
}

export default function ViewMyRoutineComponent({ currentRoutine, secondaryCurrentRoutine }: Props) {
    return <main className="main centeredFlex">


        <h1> {currentRoutine.name} </h1>
        {currentRoutine.days.map((day, i) =>
            <DayCard
                key={i}
                day={day}
                availableExercises={[]}
                setExercises={(exercises: Array<number>) => { }}
                exercises={exercises}
                readonly={true}
            ></DayCard>)}

        {secondaryCurrentRoutine && <h1> {secondaryCurrentRoutine.name} </h1>}
        {secondaryCurrentRoutine?.days.map((day, i) =>
            <DayCard
                key={i}
                day={day}
                availableExercises={[]}
                setExercises={(exercises: Array<number>) => { }}
                exercises={exercises}
                readonly={true}
            ></DayCard>)}
    </main >
}