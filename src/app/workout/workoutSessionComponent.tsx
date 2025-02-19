"use client"
import { useContext, useEffect, useState } from "react";
import { ActiveTabContext } from "../context/tabsState";
import { DBProfile, Exercise, Routine, Session, WorkoutSession } from "../../../public/types";
import ExerciseComponent from "./exercise";
import { confirmWorkout } from "../actions";
import SingleOrDoubleModal from "@/components/SingleOrDoubleModal/Modal";
import styles from './page.module.css'


type Props = {
    routine: Routine,
    routineSecondary: Routine,
    currentProfile: DBProfile,
    secondaryProfile: DBProfile | null,
    routineID: string,
    routineIDSecondary: string,
    exerciseList: Array<Exercise>,
    currentDayIndex: number,
    currentDayIndexSecondary: number,
    previousSession: Session | undefined,
    secondaryPreviousSession: Session | undefined

}

export default function WorkoutSessionComponent({
    routine,
    routineSecondary,
    currentProfile,
    secondaryProfile,
    routineID,
    exerciseList,
    currentDayIndex,
    currentDayIndexSecondary,
    previousSession,
    secondaryPreviousSession,
    routineIDSecondary
}: Props) {

    const { activeTab, setNeedTabs } = useContext(ActiveTabContext);
    const [modalOpen, setModalOpen] = useState(false);

    console.log({    currentDayIndex,
        currentDayIndexSecondary,})

    /* Verify if tabs are needed */
    useEffect(() => {
        console.log({ secondaryProfile })
        if (secondaryProfile) {
            setNeedTabs(true);
        }
        else {
            setNeedTabs(false)
        }
    }, [secondaryProfile])

    const currentDayExercises = routine.days[currentDayIndex].exercises ?? [];
    const currentDayExercisesSecondary = routineSecondary.days[currentDayIndexSecondary].exercises ?? [];  

    // Set default values to each exercise from cache or previous session or a default
    const [workouts, setWorkouts] = useState<Array<WorkoutSession>>(() => {
        let useLocalStorageValues = false;
        const cachedValuesString = localStorage.getItem(`workout-session-0`);
        let cachedValuesJson: Session;

        if (cachedValuesString) {
            cachedValuesJson = JSON.parse(cachedValuesString);
            if (cachedValuesJson.day === currentDayIndex && cachedValuesJson.routine === routineID) {
                useLocalStorageValues = true;
            } else {
                localStorage.clear();
            }
        }

        return currentDayExercises.map(exercise => {
            let defaultValues: WorkoutSession | null;
            if (useLocalStorageValues) {
                defaultValues = cachedValuesJson?.workout.find(w => w.exerciseId === exercise) ?? null;
            } else {
                const previousWorkout = { ...previousSession?.workout.find(w => w.exerciseId === exercise) };
                defaultValues = null;
                const setsNumber: number = previousWorkout?.sets?.reduce((amount, set) => {
                    return amount + parseInt(set)
                }, 0) ?? 0;

                /* Get previous workout to 1 set instead of the original amount */
                if (previousWorkout) {
                    const reps = [...previousWorkout.reps ?? []];
                    const weights = [...previousWorkout.weight ?? []];
                    previousWorkout.sets = [setsNumber.toString()]
                    reps?.splice(1);
                    weights?.splice(1);
                    previousWorkout.reps = reps;
                    previousWorkout.weight = weights;
                }
            }
            return {
                exerciseId: exercise,
                sets: defaultValues ? defaultValues.sets : ['3'],
                reps: defaultValues ? defaultValues.reps : ['8'],
                weight: defaultValues ? defaultValues.weight : ['20'],
            }

        })
    })

    /* Initialize workouts for secondary profile */
    const [workoutsSecondary, setWorkoutSecondary] = useState<Array<WorkoutSession>>(() => {
        if (secondaryProfile) {

            let useLocalStorageValues = false;
            const cachedValuesString = localStorage.getItem(`workout-session-1`);
            let cachedValuesJson: Session;

            if (cachedValuesString) {
                cachedValuesJson = JSON.parse(cachedValuesString);
                if (cachedValuesJson.day === currentDayIndexSecondary && cachedValuesJson.routine === routineIDSecondary) {
                    useLocalStorageValues = true;
                } else {
                    localStorage.clear();
                }
            }

            return currentDayExercisesSecondary.map(exercise => {
                let defaultValues: WorkoutSession | null;
                if (useLocalStorageValues) {
                    defaultValues = cachedValuesJson?.workout.find(w => w.exerciseId === exercise) ?? null;
                } else {
                    const previousWorkout = { ...secondaryPreviousSession?.workout.find(w => w.exerciseId === exercise) };
                    defaultValues = null;
                    const setsNumber: number = previousWorkout?.sets?.reduce((amount, set) => {
                        return amount + parseInt(set)
                    }, 0) ?? 0;

                    /* Get previous workout to 1 set instead of the original amount */
                    if (previousWorkout) {

                        const reps = [...previousWorkout.reps ?? []];
                        const weights = [...previousWorkout.weight ?? []];

                        previousWorkout.sets = [setsNumber.toString()]
                        reps?.splice(1);
                        weights?.splice(1);

                        previousWorkout.reps = reps;
                        previousWorkout.weight = weights;
                    }
                }

                return {
                    exerciseId: exercise,
                    sets: defaultValues ? defaultValues.sets : ['3'],
                    reps: defaultValues ? defaultValues.reps : ['8'],
                    weight: defaultValues ? defaultValues.weight : ['20'],
                }

            })
        } else {
            return [];
        }


    })

    console.log({workouts, workoutsSecondary});
    /* Update workout generic depending on currenttab */
    const updateWorkouts = (exercise: number, target: 'sets' | 'weight' | 'reps', index: number, value: string) => {
        let setWorkoutState = activeTab === 0 ? setWorkouts : setWorkoutSecondary;
        let currentWorkouts = activeTab === 0 ? workouts : workoutsSecondary;
        setWorkoutState(curr => {
            /* Copy the innermost object */
            const indexOfSession = curr.findIndex(w => w.exerciseId === exercise);
            const updatedWorkouts = [...currentWorkouts];
            const updatedSession = { ...updatedWorkouts[indexOfSession] }
            const updatedField = [...updatedSession[target]]

            /* Update and spread it back */
            updatedField[index] = value;
            updatedSession[target] = updatedField;
            updatedWorkouts[indexOfSession] = updatedSession;

            localStorage.setItem(`workout-session-${activeTab}`, JSON.stringify(
                {
                    routine: activeTab === 0 ? routineID : routineIDSecondary,
                    day: activeTab === 0 ? currentDayIndex : currentDayIndexSecondary,
                    workout: updatedWorkouts
                }))
            return updatedWorkouts
        })
    }

    /* Add or remove extra set generic depending on active tab */
    const addOrRemoveSet = (exercise: number, add: boolean, removeIndex?: number) => {
        let setWorkoutState = activeTab === 0 ? setWorkouts : setWorkoutSecondary;
        let currentWorkouts = activeTab === 0 ? workouts : workoutsSecondary;
        setWorkoutState(curr => {
            /* Copy the innermost objects */
            const indexOfSession = curr.findIndex(w => w.exerciseId === exercise);
            const updatedWorkouts = [...currentWorkouts];
            const updatedSession = { ...updatedWorkouts[indexOfSession] };
            const sets = [...updatedSession.sets];
            const reps = [...updatedSession.reps];
            const weights = [...updatedSession.weight];

            /* Update it */
            if (add) { //add set
                const amountOfSets = sets.length;
                sets.push('1');
                reps.push(reps[amountOfSets - 1]);
                weights.push(weights[amountOfSets - 1]);
            } else if (removeIndex !== undefined) { //remove set
                sets.splice(removeIndex, 1);
                reps.splice(removeIndex, 1);
                weights.splice(removeIndex, 1);
            }
            /* spread it back */
            updatedSession.sets = sets;
            updatedSession.reps = reps;
            updatedSession.weight = weights;
            updatedWorkouts[indexOfSession] = updatedSession;

            localStorage.setItem(`workout-session-${activeTab}`, JSON.stringify(
                {
                    routine: activeTab === 0 ? routineID : routineIDSecondary,
                    day: activeTab === 0 ? currentDayIndex : currentDayIndexSecondary,
                    workout: updatedWorkouts
                }))
            return updatedWorkouts;


        })
    }



    return <main className="centeredFlex main" style={{ gap: '1rem' }}>

        {(activeTab === 0 ? currentDayExercises : currentDayExercisesSecondary).map((exercise, i) =>
            <ExerciseComponent key={i}
                exerciseID={exercise}
                previousSession={
                    activeTab === 0 ? previousSession?.workout.find(w => w.exerciseId === exercise)
                        : secondaryPreviousSession?.workout.find(w => w.exerciseId === exercise)}
                profile={activeTab === 0 ? currentProfile : secondaryProfile ?? currentProfile}
                session={(activeTab === 0 ? workouts : workoutsSecondary).find(s => s.exerciseId === exercise) as WorkoutSession}
                setSession={(target: 'sets' | 'weight' | 'reps', index: number, value: string) => {
                    updateWorkouts(exercise, target, index, value);
                }}

                exerciseList={exerciseList}
                addRemoveExtraSet={(add: boolean, removeIndex?: number) => {
                    addOrRemoveSet(exercise, add, removeIndex)
                }
                }
            ></ExerciseComponent>
        )}
        <button className="navigationButton" onClick={() => {
            setModalOpen(true);
        }}> Complete </button>


        <SingleOrDoubleModal
            onConfirm={(singleWorkout: boolean) => {
                localStorage.clear();
                confirmWorkout(
                    routineID,
                    routineIDSecondary,
                    currentProfile,
                    secondaryProfile,
                    workouts,
                    workoutsSecondary,
                    currentDayIndex,
                    currentDayIndexSecondary,
                    singleWorkout
                )
                setModalOpen(false);

            }}
            isOpen={modalOpen}
            onClose={() => { setModalOpen(false) }}
        ></SingleOrDoubleModal>


    </main>

}