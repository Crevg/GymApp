"use server"

import { redirect, RedirectType } from "next/navigation";
import { DBProfile, Routine, RoutineDay, WorkoutSession } from "../../public/types";
import { db as database } from "../../public/api/api";
import { db } from "./firebase/firebase"
import { GetCurrentProfile } from "./helpers/getCurrentProfileHelper";
import { HardCodedProfiles1, HardCodedProfiles2 } from "../../public/data/hardcodeProfiles";
import { cookies } from "next/headers";

// Save a new routine layout 
export async function saveRoutine(name: string, days: Array<RoutineDay>) {
    const routine: Routine = {
        name: name,
        days: days
    }

    const saveRoutinesRes = await fetch(`${database}routines.json`, {
        method: "POST",
        body: JSON.stringify(routine)
    }
    );

    const saveRoutinesJson = await saveRoutinesRes.json();

    const routinesRes = await fetch(`${database}routines.json`, {
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
    const res = await fetch(`${database}routines/${routineId}.json`, {
        method: 'PUT',
        body: JSON.stringify(routine)
    })

    redirect("/", RedirectType.push)
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
        const readProfile = await fetch(`${database}/profile.json`, { method: 'GET', cache: 'no-cache' })
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
        const newSession = await fetch(`${database}profile/${currentProfileID}/sessions.json`, {
            method: "POST",
            body: JSON.stringify({
                routine: routineId,
                workout: sanitizedSession,
                day: day
            })
        })

        const updatedCurrentDay = await fetch(`${database}/profile/${currentProfileID}.json`, {
            method: "PATCH",
            body: JSON.stringify({
                currentDay: (day + 1) < currentProfile.routine.length ? day + 1 : 0
            })
        })

        /* Update secondary profile session on DB if able*/
        if (secondaryProfile && !isSingleWorkout && sanitizedSecondarySession) {
            const newSecondarySession = await fetch(`${database}profile/${secondaryProfileID}/sessions.json`, {
                method: "POST",
                body: JSON.stringify({
                    routine: routineIdSecondary,
                    workout: sanitizedSecondarySession,
                    day: daySecondary
                })
            })

            const updatedCurrentDay = await fetch(`${database}/profile/${secondaryProfileID}.json`, {
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
        const newSession = await fetch(`${database}profile.json`, {
            method: "POST",
            body: JSON.stringify(jsonBody)
        });
        const json = await newSession.json()
    }
    catch (e) {
        console.log(e)
    }

    redirect('/', RedirectType.push)
}

export async function updateCurrentDay(dayIndex: number, daySecIndex?: number) {

    /* Get profiles id */
    const readProfile = await fetch(`${database}/profile.json`, { method: 'GET', cache: 'no-cache' })
    const jsonProfile = await readProfile.json();

    const currentProfileID = GetCurrentProfile(jsonProfile, HardCodedProfiles1);
    const secondaryProfileID = daySecIndex !== undefined ? GetCurrentProfile(jsonProfile, HardCodedProfiles2) : null;

    /* Set routineid on profiles */
    const body: any = {}
    body[`${currentProfileID}/currentDay`] = dayIndex;
    if (secondaryProfileID) body[`${secondaryProfileID}/currentDay`] = daySecIndex;

    await fetch(`${database}profile.json`, {
        method: "PATCH",
        body: JSON.stringify(body)
    })

    return;
}

export async function login(token: string, name: string, id: string) {
    try {
        const cookieStore = await cookies();
        cookieStore.set("gym-clapp-session", JSON.stringify({
            name: name ?? "New user",
            id: id,
            token: token
        }), { maxAge: 2600000 });
        return true;
    } catch (e) { return false }
}

export async function checkIfSignedIn() {
    const cookieStore = await cookies();
    const exists = cookieStore.has("gym-clapp-session");
    if (exists) {
        const value = cookieStore.get("gym-clapp-session")?.value;
        if (value) {
            return JSON.parse(value);
        }
    }
    return null;
}



