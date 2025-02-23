import { child, get, push, ref, set, update } from "firebase/database";
import { db } from "./firebase"
import { DBProfile } from "../../../public/types";
import { EmptyProfile } from "../helpers/ProfileHelper";
import isAdminUser from "../helpers/isAdminUser";
import { checkIfSignedIn } from "../actions";
import { HardCodedProfiles2 } from "../../../public/data/hardcodeProfiles";

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
    const updateSecondary = await isAdminUser() && secondaryRoutineIndex  !== undefined ;

    const routines = await getAllRoutines();
    const routineKeys = Object.keys(routines);
    const routineID = routineKeys[routineIndex];
    const routineIDSecondary = updateSecondary ? routineKeys[secondaryRoutineIndex] : null;
    const allProfiles = await getProfiles();
    const profileKey = await getCurrentProfileKey(userData.id, allProfiles);
    const profileKeySecondary = updateSecondary ? await getCurrentProfileKey(HardCodedProfiles2, allProfiles) : EmptyProfile;

    const profileRef = ref(db, 'profile');
    const updated: any = {};
    updated[profileKey + '/routine'] = routineID;
    if (updateSecondary) {
        updated[profileKeySecondary + '/routine'] = routineIDSecondary;
    }

    update(profileRef, updated);

}