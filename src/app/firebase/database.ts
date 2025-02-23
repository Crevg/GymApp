import { get, ref } from "firebase/database";
import { db } from "./firebase"
import { DBProfile } from "../../../public/types";
import { EmptyProfile } from "../helpers/ProfileHelper";

export const getProfiles = async () => {
    const profilesQuery = ref(db, 'profile/');
    const snapshot = await get(profilesQuery);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

export const getCurrentProfile = async (profileID: string, profiles?: any): Promise<DBProfile> => {
    let AllProfiles;
    if (!profiles) {
        AllProfiles = await getProfiles();
    } else {
        AllProfiles = profiles;
    }

    const allProfilesKeys = Object.keys(AllProfiles);

    let currentProfile = EmptyProfile;

    allProfilesKeys.forEach((profileKey: string) => {
        if (AllProfiles[profileKey].id === profileID) {
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