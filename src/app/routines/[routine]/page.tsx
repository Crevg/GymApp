import sanitizeRoutine from "@/app/helpers/sanitizeRoutine";
import { db } from "../../../../public/api/api";
import { exercises, exercisesPerMuscle } from "../../../../public/data/muscleGroups";
import { Routine } from "../../../../public/types";
import RoutineExercises from "./routineExercises";



export default async function RoutinePage({ params }: { params: { routine: number } }) {


    const res = await fetch(`${db}/routines.json`, { method: 'GET', cache: 'no-cache' });
    const json = await res.json();


    let routines = [];
    let routineId = "";
    let j = 0;
    for (let i in json) {
        routines.push(json[i])
        if (j == params.routine) {
            routineId = i;
            break;
        }
        j++;

    };

    let myRoutine: Routine = routines[params.routine]
    sanitizeRoutine(myRoutine);

    const myExercises = exercises;
    const myExercisesPerMuscle = exercisesPerMuscle;

    return <RoutineExercises exercises={myExercises} exercisesPerMuscle ={myExercisesPerMuscle} routineId={routineId} routine={myRoutine}></RoutineExercises>
}