import { db } from "../../../public/api/api";
import dynamic from 'next/dynamic'
import { HardCodedProfiles1, HardCodedProfiles2 } from "../../../public/data/hardcodeProfiles";
import { exercises } from "../../../public/data/muscleGroups";
import { DBProfile, Routine } from "../../../public/types";
import { GetCurrentProfile } from "../helpers/getCurrentProfileHelper";
import { getRoutineAndCurrentDay } from "../helpers/getPreviousDayHelper";
const WorkoutSessionComponent = dynamic( () => import("./workoutSessionComponent"), { ssr: false })

export default async function WorkoutPage() {

    // Get current profile and routine
    const readProfile = await fetch(`${db}/profile.json`, { method: 'GET', cache: 'no-cache' })
    const jsonProfile = await readProfile.json();
    const currentProfileID = GetCurrentProfile(jsonProfile, HardCodedProfiles1)
    const currentProfile: DBProfile = jsonProfile[String(currentProfileID)];
    const routineID = currentProfile.routine;
    const myExercises = exercises;
    const allSessions = currentProfile.sessions ?? {}

    // Get Current day and routine
    const { currentDayIndex, jsonRoutine } = await getRoutineAndCurrentDay(routineID, currentProfile);

    /* Get previous session of this day to fill previous values */
    const previousSession = Object.keys(allSessions ?? [])
        .map(key => allSessions[key])
        .findLast(session => session.routine === routineID && session.day === currentDayIndex);


    // Get Secondary Profile information and previous session ONLY IF FIRST PROFILE IS CRIS
    let secondaryProfile;
    let secondaryAllSessions: any;
    let secondaryPreviousSession;
    let currentDayIndexSecondary: number = 0;
    let jsonRoutineSecondary: Routine = { days: [], name: ""};
    let routineIDSecondary: string = "";
    if (currentProfile.id === HardCodedProfiles1) {
        const secondaryProfileID = GetCurrentProfile(jsonProfile, HardCodedProfiles2);
        secondaryProfile = jsonProfile[String(secondaryProfileID)];
        routineIDSecondary = secondaryProfile.routine;

        let routineAndDaySecondary = await getRoutineAndCurrentDay(routineIDSecondary, secondaryProfile);
        currentDayIndexSecondary = routineAndDaySecondary.currentDayIndex;
        jsonRoutineSecondary = routineAndDaySecondary.jsonRoutine;

        secondaryAllSessions = secondaryProfile.sessions;
        secondaryPreviousSession = Object.keys(secondaryAllSessions ?? [])
            .map(key => secondaryAllSessions[key])
            .findLast(session => session.routine === routineIDSecondary && session.day === currentDayIndexSecondary);
    }


    return <WorkoutSessionComponent
        currentDayIndex={currentDayIndex}
        exerciseList={myExercises}
        routine={jsonRoutine}
        currentDayIndexSecondary={currentDayIndexSecondary as number}
        routineSecondary={jsonRoutineSecondary}
        currentProfile={currentProfile}
        secondaryProfile={secondaryProfile ?? null}
        previousSession={previousSession}
        secondaryPreviousSession = {secondaryPreviousSession}
        routineID={routineID}
        routineIDSecondary={routineIDSecondary}
        ></WorkoutSessionComponent>
}