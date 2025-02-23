import { checkIfSignedIn } from "@/app/actions";
import { HardCodedProfiles1, HardCodedProfiles2 } from "../../../../public/data/hardcodeProfiles";
import ViewMyRoutineComponent from "./view";
import { getCurrentProfile, getCurrentRoutine } from "@/app/firebase/database";
import { EmptyProfile, getValidProfile } from "@/app/helpers/ProfileHelper";
import isAdminUser from "@/app/helpers/isAdminUser";
import { redirect } from "next/navigation"
import { RedirectType } from "next/navigation";


export default async function NewRoutine() {

    const sessionProfile = await checkIfSignedIn();
    if (sessionProfile) {
        const currentProfile = await getCurrentProfile(sessionProfile.id);
        let secondaryProfile = await isAdminUser() ? await getCurrentProfile(HardCodedProfiles2) : EmptyProfile;

        if (getValidProfile(currentProfile) === null) {
            redirect("/error", RedirectType.replace);
        }

        const routineSecID = getValidProfile(secondaryProfile)?.routine;
        const currentDayIndexSecondary = secondaryProfile.currentDay;

        const currentRoutine = await getCurrentRoutine(currentProfile.routine);
        const currentRoutineSecondary = await getCurrentRoutine(routineSecID);

        return <ViewMyRoutineComponent
            currentRoutine={currentRoutine}
            secondaryCurrentRoutine={currentRoutineSecondary}
        ></ViewMyRoutineComponent>
    }
    else {
        redirect("/", RedirectType.replace);
    }
}