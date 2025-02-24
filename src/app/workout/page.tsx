import dynamic from 'next/dynamic'
import { SecondaryProfileID } from "../../../public/data/adminData";
import { getCurrentProfile, getCurrentRoutine } from "../firebase/database";
import isAdminUser from "../helpers/isAdminUser";
import { EmptyProfile, getValidProfile } from "../helpers/ProfileHelper";
import { checkIfSignedIn } from '../actions';
import { redirect, RedirectType } from 'next/navigation';
const WorkoutSessionComponent = dynamic(() => import("./workoutSessionComponent"), { ssr: false })

export default async function WorkoutPage() {

    const sessionProfile = await checkIfSignedIn();
    if (sessionProfile) {
        const currentProfile = await getCurrentProfile(sessionProfile.id);
        const secondaryProfile = await isAdminUser() ? await getCurrentProfile(SecondaryProfileID) : EmptyProfile;

        const sessions = currentProfile.sessions;
        const sessionSecondary = getValidProfile(secondaryProfile)?.sessions;

        if (getValidProfile(currentProfile) === null) {
            redirect("/error", RedirectType.replace);
        }

        const routineSecID = getValidProfile(secondaryProfile)?.routine;

        const currentRoutine = await getCurrentRoutine(currentProfile.routine);
        const currentRoutineSecondary = await getCurrentRoutine(routineSecID);


        /* Get previous session of this day to fill previous values */
        const previousSession = Object.keys(sessions ?? [])
            .map(key => sessions[key])
            .findLast(session =>
                session.routine === currentProfile.routine && session.day === currentProfile.currentDay);

        const previousSessionSecondary = Object.keys(sessionSecondary ?? [])
            .map(key => sessionSecondary[key])
            .findLast(session =>
                session.routine === secondaryProfile.routine && session.day === secondaryProfile.currentDay);


        return <WorkoutSessionComponent
            currentDayIndex={currentProfile.currentDay}
            routine={currentRoutine}
            currentDayIndexSecondary={secondaryProfile.currentDay}
            routineSecondary={currentRoutineSecondary}
            currentProfile={currentProfile}
            secondaryProfile={secondaryProfile ?? null}
            previousSession={previousSession}
            previousSessionSecondary={previousSessionSecondary}
            routineID={currentProfile.routine}
            routineIDSecondary={secondaryProfile.routine}
        ></WorkoutSessionComponent>
    } else {
        redirect("/", RedirectType.replace);
    }
}