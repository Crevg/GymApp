"use client"
import { useState } from "react"
import { Exercise, ExercisesPerMuscle, Routine, RoutineDay } from "../../../../public/types"
import DayCard from './dayCard'
import { editRoutine } from '@/app/firebase/database'
import { useRouter } from 'next/navigation'

type Props = {
    routine: Routine,
    routineId: string,
    exercises: Array<Exercise>
    exercisesPerMuscle: Array<ExercisesPerMuscle>
}
export default function RoutineExercises({ routine, routineId, exercises, exercisesPerMuscle }: Props) {

    const router = useRouter();
    const [currentRoutine, setCurrentRoutine] = useState<Routine>(routine);

    const setExercises = (updatedExercises: Array<number>, index: number) => {
        const currentDay: RoutineDay = { ...currentRoutine.days[index] };
        currentDay.exercises = updatedExercises;

        setCurrentRoutine(curr => {
            const updatedRoutine = { ...curr };
            if (updatedRoutine.days) {
                updatedRoutine.days[index] = currentDay
            }
            return updatedRoutine;
        })


    }

    return <main className="main centeredFlex">
        <h1> {currentRoutine.name} </h1>
        {currentRoutine.days.map((day, i) =>
            <DayCard
                key={i}
                day={day}
                availableExercises={ exercisesPerMuscle.filter( (exerciseList: ExercisesPerMuscle) => day.group.includes(exerciseList.id) )
                    .reduce( (availableExerciseList: Array<number>, muscleGroup: ExercisesPerMuscle) => { 
                        return availableExerciseList.concat(muscleGroup.exercises)
                     }, [] )
                }
                setExercises={(exercises: Array<number>) => setExercises(exercises, i)}
                exercises={exercises}
            ></DayCard>)}
        <button
            onClick={() => {
                editRoutine(currentRoutine, routineId)
                router.push("/")
            }}
            className="navigationButton"
            style={{ marginTop: '2rem', fontSize: "large" }}
        > {"Finish"}
        </button>


    </main>
}