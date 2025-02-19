export type Routine = {
    name: string,
    days: Array<RoutineDay>
}

export type RoutineDay = {
    name: string,
    group: Array<number>,
    exercises: Array<number>
}

export type Exercise = {
    name: string,
    id: number
    //add video eventually
}

/* New profile types */ 
 export type DBProfile = {
    id: string,
    sessions: any,
    routine: string;
    currentDay: number;
 }

export type WorkoutSession = {
    exerciseId: number,
    sets: Array<string>,
    reps: Array<string>,
    weight: Array<string>,
}

export type ExercisesPerMuscle = {
    id: number,
    exercises: Array<number>
}

export type Session = {
    day: number,
    routine: string,
    workout: Array<WorkoutSession>
}
export type SanitizedHistory = {
    day: string,
    routineName: string,
    workout: Array<WorkoutSession>
}
