import { child, get, push, ref, set, update } from "firebase/database";
import { db } from "./firebase"
import { DBProfile, Routine, RoutineDay, WorkoutSession } from "../../../public/types";
import { EmptyProfile } from "../helpers/ProfileHelper";
import isAdminUser from "../helpers/isAdminUser";
import { checkIfSignedIn } from "../actions";
import { SecondaryProfileID } from "../../../public/data/adminData";

/* Gets */
export const getProfiles = async () => {
    const profilesQuery = ref(db, 'profile/');
    const snapshot = await get(profilesQuery);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

export const getCurrentProfile = async (profileId: string, profiles?: any): Promise<DBProfile> => {
    let AllProfiles;
    if (!profiles) {
        AllProfiles = await getProfiles();
    } else {
        AllProfiles = profiles;
    }

    const allProfilesKeys = Object.keys(AllProfiles);

    let currentProfile = EmptyProfile;

    allProfilesKeys.forEach((profileKey: string) => {
        if (AllProfiles[profileKey].id === profileId) {
            currentProfile = AllProfiles[profileKey];
        }
    })
    return currentProfile;
}

export const getCurrentRoutine = async (routineID?: string) => {
    if (routineID !== null) {
        const routineQuery = ref(db, `routines/${routineID}`);
        const snapshot = await get(routineQuery);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    }
    return null;
}

export const getAllRoutines = async () => {
    const routineQuery = ref(db, `routines/`);
    const snapshot = await get(routineQuery);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

const getCurrentProfileKey = async (profileId: string, profiles?: any) => {

    let AllProfiles;
    if (!profiles) {
        AllProfiles = await getProfiles();
    } else {
        AllProfiles = profiles;
    }
    const allProfilesKeys = Object.keys(AllProfiles);

    let currentKey = "";
    allProfilesKeys.forEach((profileKey: string) => {
        if (AllProfiles[profileKey].id === profileId) {
            currentKey = profileKey;
        }
    })
    return currentKey;
}

/* Posts */

export const newProfile = async (profileId: string, profileName: string) => {
    const profileQuery = ref(db, `profile/`);

    const pushkey = push(profileQuery).key;



    if (pushkey) {
        const userBody = {
            id: profileId,
            name: profileName,
            currentDay: 0,
            sessions: [],
        }
        set(child(profileQuery, pushkey), userBody);
    }
}

export const changeCurrentRoutine = async (routineIndex: number, secondaryRoutineIndex?: number) => {

    const userData = await checkIfSignedIn();
    const updateSecondary = await isAdminUser() && secondaryRoutineIndex !== undefined;

    const routines = await getAllRoutines();
    const routineKeys = Object.keys(routines);
    const routineID = routineKeys[routineIndex];
    const routineIDSecondary = updateSecondary ? routineKeys[secondaryRoutineIndex] : null;
    const allProfiles = await getProfiles();
    const profileKey = await getCurrentProfileKey(userData.id, allProfiles);
    const profileKeySecondary = updateSecondary ? await getCurrentProfileKey(SecondaryProfileID, allProfiles) : null;

    const profileRef = ref(db, 'profile');
    const updated: any = {};
    updated[profileKey + '/routine'] = routineID;
    if (updateSecondary) {
        updated[profileKeySecondary + '/routine'] = routineIDSecondary;
    }

    update(profileRef, updated);
}

export async function updateCurrentDay(dayIndex: number, daySecIndex?: number) {

    const userData = await checkIfSignedIn();
    const updateSecondary = await isAdminUser() && daySecIndex !== undefined;

    /* Get profiles id */

    const allProfiles = await getProfiles();

    const profileKey = await getCurrentProfileKey(userData.id, allProfiles);
    const profileKeySecondary = updateSecondary ? await getCurrentProfileKey(SecondaryProfileID, allProfiles) : null;

    /* Set routineid on profiles */
    const body: any = {}

    body[`${profileKey}/currentDay`] = dayIndex;
    if (updateSecondary) body[`${profileKeySecondary}/currentDay`] = daySecIndex;

    const profilesQuery = ref(db, 'profile/');
    update(profilesQuery, body);
    return;
}

export async function saveRoutine(name: string, days: Array<RoutineDay>) {

    const routinesRef = ref(db, 'routines/');
    const newKey = push(routinesRef).key;
    if (newKey) {
        await set(child(routinesRef, newKey), {
            name: name,
            days: days
        })

        const snap = await get(routinesRef);
        const keys = Object.keys(snap.val());
        const index = keys.findIndex(r => r === newKey);

        return index;
    }
    return -1;
}

export async function editRoutine(routine: Routine, routineId: string) {

    const query = ref(db, `/routines/${routineId}`)
    await set(query, routine)

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

    /* Add updates for workout session */

    const userData = await checkIfSignedIn();
    const profileKey = await getCurrentProfileKey(userData.id);

    /* Get sessiones sanitized for DB */
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

    let sanitizedSecondarySession;
    let profileKeySecondary;
    if (!isSingleWorkout) {
        profileKeySecondary = await getCurrentProfileKey(SecondaryProfileID);
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

    const profileRef = ref(db, '/profile');
    const newSessionKey = push(child(profileRef, `${profileKey}/sessions`)).key;
    const updates: any = {};
    if (newSessionKey) {
        updates[`${profileKey}/sessions/${newSessionKey}`] = {
            routine: routineId,
            workout: sanitizedSession,
            day: day
        }

    }
    if (!isSingleWorkout) {
        const newSessionKeySec = push(child(profileRef, `${profileKeySecondary}/sessions`)).key;
        if (newSessionKeySec) {
            updates[`${profileKeySecondary}/sessions/${newSessionKeySec}`] = {
                routine: routineIdSecondary,
                workout: sanitizedSecondarySession,
                day: daySecondary
            }
        }

    }

    /* Add updates for current day */

    const currentRoutine = await getCurrentRoutine(routineId);
    let currentRoutineSec;
    let newCurrentDaySec;
    if (!isSingleWorkout && secondaryProfile) {
        currentRoutineSec = await getCurrentRoutine(routineIdSecondary);
        newCurrentDaySec = secondaryProfile.currentDay + 1 < currentRoutineSec.days.length ?  secondaryProfile.currentDay + 1 : 0
        updates[`${profileKeySecondary}/currentDay`] = newCurrentDaySec;
    }
    const newCurrentDay = currentProfile.currentDay + 1 < currentRoutine.days.length ?  currentProfile.currentDay + 1 : 0
    updates[`${profileKey}/currentDay`] = newCurrentDay;


    await update(profileRef, updates);
}
