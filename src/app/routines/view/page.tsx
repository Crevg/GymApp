import { GetCurrentProfile } from "@/app/helpers/getCurrentProfileHelper";
import { db } from "../../../../public/api/api";
import { HardCodedProfiles1, HardCodedProfiles2 } from "../../../../public/data/hardcodeProfiles";
import { DBProfile } from "../../../../public/types";
import ViewMyRoutineComponent from "./view";


export default async function NewRoutine() {

    let routines: any[] = [];
    let currentRoutine: string;
    let currentRoutineSecondary;
    let secondaryProfile;

    let routineIndex = 0;
    let routineIndexSecondary;

    const readRoutines = await fetch(`${db}routines.json`, { method: 'GET', cache: 'no-cache' });
    const jsonRoutines = await readRoutines.json();

    const readProfiles = await fetch(`${db}profile.json`, { method: 'GET', cache: 'no-cache' });
    const jsonProfiles = await readProfiles.json();


    const currentProfileID = GetCurrentProfile(jsonProfiles, HardCodedProfiles1)
    const currentProfile: DBProfile = jsonProfiles[String(currentProfileID)];
    currentRoutine = currentProfile.routine;

    if (HardCodedProfiles1) {
        const secondaryProfileID = GetCurrentProfile(jsonProfiles, HardCodedProfiles2);
        secondaryProfile = jsonProfiles[String(secondaryProfileID)];
        currentRoutineSecondary = secondaryProfile.routine;
    }

    for (let i in jsonRoutines) {
        routines.push(jsonRoutines[i]);
        if (i === currentRoutine) {
            routineIndex = routines.length - 1;
        }
        if (!!secondaryProfile && !!currentRoutineSecondary && currentRoutineSecondary === i) {
            routineIndexSecondary = routines.length - 1;
        }
    }

    return <ViewMyRoutineComponent
        currentRoutine={routines[routineIndex]}
        secondaryCurrentRoutine={routineIndexSecondary ? routines[routineIndexSecondary] : null}
    ></ViewMyRoutineComponent>
}