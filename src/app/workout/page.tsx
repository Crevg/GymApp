import dynamic from 'next/dynamic'
import { HardCodedProfiles1, HardCodedProfiles2 } from "../../../public/data/hardcodeProfiles";
import { getCurrentProfile, getCurrentRoutine } from "../firebase/database";
import isAdminUser from "../helpers/isAdminUser";
import { EmptyProfile, getValidProfile } from "../helpers/ProfileHelper";
const WorkoutSessionComponent = dynamic(() => import("./workoutSessionComponent"), { ssr: false })

export default async function WorkoutPage() {

    const currentProfile = await getCurrentProfile(HardCodedProfiles1);
    const secondaryProfile = isAdminUser() ? await getCurrentProfile(HardCodedProfiles2) : EmptyProfile;
    const sessions = currentProfile.sessions;
    const sessionSecondary = getValidProfile(secondaryProfile)?.sessions;
    const routineSecID = getValidProfile(secondaryProfile)?.routine;
    const currentRoutine = await getCurrentRoutine(currentProfile.routine);
    const currentRoutineSecondary = await getCurrentRoutine(routineSecID);


    /* Get previous session of this day to fill previous values */
    const previousSession = Object.keys(sessions ?? [])
        .map(key => sessions[key])
        .findLast(session =>
            session.routine === currentProfile.routine && session.day === currentProfile.currentDay) ?? [];

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
}