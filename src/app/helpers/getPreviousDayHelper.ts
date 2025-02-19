import { db } from "../../../public/api/api"
import { DBProfile, Routine } from "../../../public/types";

// Get the routine and the next day of it
export const getRoutineAndCurrentDay = async (routineID: string, currentProfile: DBProfile) => {

    // get current routine
    const readRoutine = await fetch(`${db}/routines/${routineID}.json`, { method: 'GET', cache: 'no-cache' })
    const jsonRoutine: Routine = await readRoutine.json();

    /* Get current day and its exercises */
    const currentDayIndex: number = currentProfile.currentDay < jsonRoutine.days.length ? currentProfile.currentDay : 0;

    console.log({currentProfile})

    return { currentDayIndex, jsonRoutine };

}