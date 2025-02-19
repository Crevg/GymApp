import { db } from "../../../public/api/api";
import { HardCodedProfiles1 } from "../../../public/data/hardcodeProfiles";
import { exercises } from "../../../public/data/muscleGroups";
import { Routine, Session } from "../../../public/types";
import { GetCurrentProfile } from "../helpers/getCurrentProfileHelper";
import HistoryComponent from "./history";

export default async function HistoryPage () {

    const readProfile = await fetch(`${db}/profile.json`, { method: 'GET', cache: 'no-cache' })
    const jsonProfile = await readProfile.json();

    // Get current profile IN THIS CASE CRIS

    const currentProfileID = GetCurrentProfile(jsonProfile, HardCodedProfiles1);
    const currentProfileSessions = jsonProfile[String(currentProfileID)].sessions ?? {}

    let history: Array<Session> = [];

    for (let session in currentProfileSessions) {
        history.push(currentProfileSessions[session]);
    }

     // sanitize history

     const readRoutine = await fetch(`${db}/routines.json`, { method: 'GET', cache: 'no-cache' })
     const jsonRoutine = await readRoutine.json();

     let sanitizedHistory = history.map( h => {
        let routine: Routine = jsonRoutine[h.routine];
        return {
            routineName: routine.name,
            day: routine.days[h.day].name,
            workout: h.workout

        }
     })

     sanitizedHistory.reverse();
     const myExercises = exercises;

    return <HistoryComponent exerciseList={myExercises} history={sanitizedHistory}></HistoryComponent>
}