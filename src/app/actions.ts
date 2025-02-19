"use server"

import { redirect, RedirectType } from "next/navigation";
import { DBProfile, Routine, RoutineDay, WorkoutSession } from "../../public/types";
import { db } from "../../public/api/api";
import { GetCurrentProfile } from "./helpers/getCurrentProfileHelper";
import { HardCodedProfiles1, HardCodedProfiles2 } from "../../public/data/hardcodeProfiles";

// Save a new routine layout 
export async function saveRoutine(name: string, days: Array<RoutineDay>) {
    console.log({days});
    const routine: Routine = {
        name: name,
        days: days
    }

    const saveRoutinesRes = await fetch(`${db}routines.json`, {
        method: "POST",
        body: JSON.stringify(routine)
    }
    );

    const saveRoutinesJson = await saveRoutinesRes.json();
    console.log({ saveRoutinesJson });

    const routinesRes = await fetch(`${db}routines.json`, {
        method: "GET",
        cache: "no-cache"
    })

   

    const jsonRoutinesList = await routinesRes.json();

    const routinesKeys: Array<string> = Object.keys(jsonRoutinesList);
    const routineId: string = saveRoutinesJson.name;

    const indexOfRoutine = routinesKeys.findIndex(r => r === routineId)

    if (indexOfRoutine !== -1) {
        redirect(`/routines/${indexOfRoutine}`, RedirectType.push)

    } else {
        redirect(`/`, RedirectType.push)
    }

}

// edit the exercises in a routine
export async function editRoutine(routine: Routine, routineId: string) {
    const res = await fetch(`${db}routines/${routineId}.json`, {
        method: 'PUT',
        body: JSON.stringify(routine)
    })

    console.log({ res });
    redirect("/", RedirectType.push)
}

// change current routine
export async function changeCurrentRoutine(routineIndex: number, secondaryRoutineIndex?: number) {
    const res = await fetch(`${db}routines.json`, { method: 'GET', cache: 'no-cache' })
    const json = await res.json();

    let routineId = "";
    let secondaryRoutineId = "";
    let j = 0;
    const routinesId = Object.keys(json);
    routineId = routineId[routineIndex];
    if (secondaryRoutineIndex !== undefined) secondaryRoutineId = routinesId[secondaryRoutineIndex];
   /*  for (let i in json) {
        if (j == rotuineIndex) {
            routineId = i;
            if (secondaryRoutineIndex === undefined) break;
        } 
        if (secondaryRoutineIndex !== undefined && j === secondaryRoutineIndex) {
            secondaryRoutineId = i
        }
        j++;
    }; */

    const readProfile = await fetch(`${db}/profile.json`, { method: 'GET', cache: 'no-cache' })
    const jsonProfile = await readProfile.json();

    // Get current profile and secondary profile if needed 
    const currentProfileID = GetCurrentProfile(jsonProfile, HardCodedProfiles1);
    const secondaryProfileID = jsonProfile[String(currentProfileID)].id === HardCodedProfiles1 ?
        GetCurrentProfile(jsonProfile, HardCodedProfiles2) : null;


    /* Set routineid on profiles */
    const body: any = {}
    body[`${currentProfileID}/routine`] = routineId;
    if (secondaryProfileID) body[`${secondaryProfileID}/routine`] = secondaryRoutineId;


    console.log({ currentProfileID, secondaryProfileID, body })

    await fetch(`${db}profile.json`, {
        method: "PATCH",
        body: JSON.stringify(body)
    })

    redirect('/', RedirectType.push)


}

export async function confirmWorkout(
    routineId: string,
    routineIdSecondary: string,
    currentProfile: DBProfile,
    secondaryProfile: DBProfile | null,
    workouts: Array<WorkoutSession>,
    secondaryProfileWorkout: Array<WorkoutSession> | [],
    day: number,
    daySecondary: number,
    isSingleWorkout: boolean
) {


    try {

        /* Get profiles id */
        const readProfile = await fetch(`${db}/profile.json`, { method: 'GET', cache: 'no-cache' })
        const jsonProfile = await readProfile.json();

        const currentProfileID = GetCurrentProfile(jsonProfile, currentProfile.id);
        const secondaryProfileID = secondaryProfile ? GetCurrentProfile(jsonProfile, secondaryProfile.id) : null;

        /* Sanitize main profile workouts */
        const sanitizedSession = workouts.map(w => {
            const updatedWorkout = { ...w };
            // TODO: logic to catch different sets of same reps and same weight and collapse them together
            for (let i = 0; i < updatedWorkout.sets.length; i++) {
                if (updatedWorkout.sets[i] === "") updatedWorkout.sets[i] = "0";
                if (updatedWorkout.reps[i] === "") updatedWorkout.reps[i] = "0";
                if (updatedWorkout.weight[i] === "") updatedWorkout.weight[i] = "0";
            }
            return updatedWorkout
        })

        /* Sanitize secondary profile workouts if able*/
        let sanitizedSecondarySession;
        if (secondaryProfile && !isSingleWorkout && secondaryProfileWorkout) {
            sanitizedSecondarySession = secondaryProfileWorkout.map(w => {
                const updatedWorkout = { ...w };
                // TODO: logic to catch different sets of same reps and same weight and collapse them together
                for (let i = 0; i < updatedWorkout.sets.length; i++) {
                    if (updatedWorkout.sets[i] === "") updatedWorkout.sets[i] = "0";
                    if (updatedWorkout.reps[i] === "") updatedWorkout.reps[i] = "0";
                    if (updatedWorkout.weight[i] === "") updatedWorkout.weight[i] = "0";
                }
                return updatedWorkout
            })
        }

        /* Update main profile session on DB */
        const newSession = await fetch(`${db}profile/${currentProfileID}/sessions.json`, {
            method: "POST",
            body: JSON.stringify({
                routine: routineId,
                workout: sanitizedSession,
                day: day
            })
        })

        const updatedCurrentDay = await fetch(`${db}/profile/${currentProfileID}.json`, {
            method: "PATCH",
            body: JSON.stringify({
                currentDay: (day + 1) < currentProfile.routine.length ? day + 1 : 0
            })
        })

        /* Update secondary profile session on DB if able*/
        if (secondaryProfile && !isSingleWorkout && sanitizedSecondarySession) {
            const newSecondarySession = await fetch(`${db}profile/${secondaryProfileID}/sessions.json`, {
                method: "POST",
                body: JSON.stringify({
                    routine: routineIdSecondary,
                    workout: sanitizedSecondarySession,
                    day: daySecondary
                })
            })

            const updatedCurrentDay = await fetch(`${db}/profile/${secondaryProfileID}.json`, {
                method: "PATCH",
                body: JSON.stringify({
                    currentDay: (daySecondary + 1) < secondaryProfile.routine.length ? day + 1 : 0
                })
            })
        }

    }
    catch (e) {
        console.log(e)
    }

    redirect('/', RedirectType.push)

}


export async function createNewProfile(profileName: string) {
    try {
        const jsonBody = {
            id: profileName,
            currentDay: 0,
        }
        const newSession = await fetch(`${db}profile.json`, {
            method: "POST",
            body: JSON.stringify(jsonBody)
        });
        const json = await newSession.json()
        console.log({ json })

    }
    catch (e) {
        console.log(e)
    }

    redirect('/', RedirectType.push)
}

export async function updateCurrentDay(dayIndex: number) {

     /* Get profiles id */
     const readProfile = await fetch(`${db}/profile.json`, { method: 'GET', cache: 'no-cache' })
     const jsonProfile = await readProfile.json();

     const currentProfileID = GetCurrentProfile(jsonProfile, HardCodedProfiles1);
     const secondaryProfileID = HardCodedProfiles2 ? GetCurrentProfile(jsonProfile, HardCodedProfiles2) : null;


    /* Set routineid on profiles */
    const body: any = {}
    body[`${currentProfileID}/currentDay`] = dayIndex;
    if (secondaryProfileID) body[`${secondaryProfileID}/currentDay`] = dayIndex;

    console.log({body})

    await fetch(`${db}profile.json`, {
        method: "PATCH",
        body: JSON.stringify(body)
    })

    return;
}



