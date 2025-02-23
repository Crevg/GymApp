import { DBProfile, Routine } from "../../../public/types";


export const __NOPROF = "__NOPROF";
export const __NOROUT = "__NOROUT";

export const EmptyProfile: DBProfile = { 
    currentDay: 0,
    id: __NOPROF,
    routine: "0",
    sessions: []
}

export const EmptyRoutine: Routine = {
    days: [],
    name: __NOROUT,
}

export const getValidProfile = (profile: DBProfile) => {
    if (profile.id === __NOPROF) {
        return null;
    } else {
        return profile;
    }
}

export const getValidRoutine = (routine: Routine) => {
    if (routine.name === __NOROUT) {
        return null;
    } else {
        return routine;
    }
}

export const getRoutineIndex = (routines: any, routineID: string) => {
    const keys = Object.keys(routines)
    const index = keys.findIndex( k => k === routineID);
    return index;

}

