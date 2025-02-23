
import ManageLanding from "./landing";
import { db } from "../../../../public/api/api";
import { GetCurrentProfile } from "@/app/helpers/getCurrentProfileHelper";
import { HardCodedProfiles1, HardCodedProfiles2 } from "../../../../public/data/hardcodeProfiles";
import { DBProfile } from "../../../../public/types";
import { getAllRoutines, getCurrentProfile, getCurrentRoutine } from "@/app/firebase/database";
import isAdminUser from "@/app/helpers/isAdminUser";
import { EmptyProfile, getRoutineIndex, getValidProfile } from "@/app/helpers/ProfileHelper";

export default async function ManageRoutine() {
    const routines = await getAllRoutines();
    const currentProfile = await getCurrentProfile(HardCodedProfiles1);
    const secondaryProfile = isAdminUser() ? await getCurrentProfile(HardCodedProfiles2) : EmptyProfile;

    const routineIndex = getRoutineIndex(routines, currentProfile.routine);
    let routineIndexSecondary;
    if (isAdminUser()) {
        routineIndexSecondary = getRoutineIndex(routines, secondaryProfile.routine)
    }


    return <ManageLanding
        routines={routines}
        currentRoutine={routineIndex}
        currentRoutineSecondary={routineIndexSecondary}
    ></ManageLanding>

}