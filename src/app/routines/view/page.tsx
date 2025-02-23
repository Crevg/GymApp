import { HardCodedProfiles1, HardCodedProfiles2 } from "../../../../public/data/hardcodeProfiles";
import ViewMyRoutineComponent from "./view";
import { getCurrentProfile, getCurrentRoutine } from "@/app/firebase/database";
import { EmptyProfile, getValidProfile } from "@/app/helpers/ProfileHelper";
import isAdminUser from "@/app/helpers/isAdminUser";


export default async function NewRoutine() {

    const currentProfile = await getCurrentProfile(HardCodedProfiles1);
    const secondaryProfile = isAdminUser() ? await getCurrentProfile(HardCodedProfiles2) : EmptyProfile;

    const routineSecID = getValidProfile(secondaryProfile)?.routine;
    const currentRoutine = await getCurrentRoutine(currentProfile.routine);
    const currentRoutineSecondary = await getCurrentRoutine(routineSecID);

    return <ViewMyRoutineComponent
        currentRoutine={currentRoutine}
        secondaryCurrentRoutine={currentRoutineSecondary}
    ></ViewMyRoutineComponent>
}