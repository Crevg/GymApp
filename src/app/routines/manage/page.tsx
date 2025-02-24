
import ManageLanding from "./landing";
import { SecondaryProfileID } from "../../../../public/data/adminData";
import { getAllRoutines, getCurrentProfile } from "@/app/firebase/database";
import isAdminUser from "@/app/helpers/isAdminUser";
import { EmptyProfile, getRoutineIndex, getValidProfile } from "@/app/helpers/ProfileHelper";
import { checkIfSignedIn } from "@/app/actions";
import { redirect, RedirectType } from "next/navigation";

export default async function ManageRoutine() {

    const sessionProfile = await checkIfSignedIn();
    if (sessionProfile) {
        const currentProfile = await getCurrentProfile(sessionProfile.id);
        if (getValidProfile(currentProfile) === null) {
            redirect("/error", RedirectType.replace)
        }
        const routines = await getAllRoutines();


        let routinesArray = [];
        let routineId = "";
        let j = 0;
        for (let i in routines) {
            routinesArray.push(routines[i])
            j++;
        };
        const secondaryProfile = await isAdminUser() ? await getCurrentProfile(SecondaryProfileID) : EmptyProfile;
        const routineIndex = getRoutineIndex(routines, currentProfile.routine);
   
        const routineIndexSecondary = getRoutineIndex(routines, secondaryProfile.routine)
        

        return <ManageLanding
            routines={routinesArray}
            currentRoutine={routineIndex}
            currentRoutineSecondary={routineIndexSecondary}
        ></ManageLanding>
    }

}