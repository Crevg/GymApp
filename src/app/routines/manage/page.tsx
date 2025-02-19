
import ManageLanding from "./landing";
import { db } from "../../../../public/api/api";
import { GetCurrentProfile } from "@/app/helpers/getCurrentProfileHelper";
import { HardCodedProfiles1, HardCodedProfiles2 } from "../../../../public/data/hardcodeProfiles";
import { DBProfile } from "../../../../public/types";

export default async function ManageRoutine() {
    let routines: any[] = [];
    let currentRoutine: string;
    let currentRoutineSecondary;
    let secondaryProfile;

    let routineIndex = 0;
    let routineIndexSecondary;
    try {

        const readRoutines = await fetch(`${db}routines.json`, { method: 'GET', cache: 'no-cache' });
        const jsonRoutines = await readRoutines.json();

        const readProfiles = await fetch(`${db}profile.json`, { method: 'GET', cache: 'no-cache' });
        const jsonProfiles = await readProfiles.json();


        const currentProfileID = GetCurrentProfile(jsonProfiles, HardCodedProfiles1)
        const currentProfile: DBProfile = jsonProfiles[String(currentProfileID)];
        currentRoutine = currentProfile.routine;

        if (currentProfile.id === HardCodedProfiles1) {
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

        console.log({routineIndexSecondary})

    } catch (e) {
        console.log({ e })
    }


    return <ManageLanding routines={routines} currentRoutine={routineIndex} currentRoutineSecondary={routineIndexSecondary ?? undefined} ></ManageLanding>

}