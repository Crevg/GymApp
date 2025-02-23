import { redirect, RedirectType } from "next/navigation";
import { HardCodedProfiles1, HardCodedProfiles2 } from "../../../public/data/hardcodeProfiles";
import { Routine, Session } from "../../../public/types";
import { checkIfSignedIn } from "../actions";
import { getAllRoutines, getCurrentProfile, getCurrentRoutine } from "../firebase/database";
import isAdminUser from "../helpers/isAdminUser";
import { EmptyProfile, getValidProfile } from "../helpers/ProfileHelper";
import HistoryComponent from "./history";

export default async function HistoryPage() {

    const sessionProfile = await checkIfSignedIn();
    if (sessionProfile) {
        const currentProfile = await getCurrentProfile(sessionProfile.id);
        if (getValidProfile(currentProfile) === null) {
            redirect("/error", RedirectType.replace )    
        }

        let secondaryProfile = await isAdminUser() ? await getCurrentProfile(HardCodedProfiles2) : EmptyProfile;

        const AllRoutines = await getAllRoutines();

        const sessions = currentProfile.sessions;
        const sessionsSecondary = getValidProfile(secondaryProfile)?.sessions;

        let history: Array<Session> = [];
        let historySecondary: Array<Session> = [];

        for (let sessionID in sessions) {
            history.push(sessions[sessionID]);
        }


        for (let sessionIDSec in sessionsSecondary) {
            historySecondary.push(sessionsSecondary[sessionIDSec]);
        }

        // sanitize history

        const sanitizedHistory = history.map(h => {
            let routine: Routine = AllRoutines[h.routine];
            return {
                routineName: routine.name,
                day: routine.days[h.day].name,
                workout: h.workout
            }
        })

        const sanitizedHistorySecondary = historySecondary.map(h => {
            let routine: Routine = AllRoutines[h.routine];
            return {
                routineName: routine.name,
                day: routine.days[h.day].name,
                workout: h.workout
            }
        })

        sanitizedHistory.reverse();
        sanitizedHistorySecondary.reverse();


        return <HistoryComponent history={sanitizedHistory} historySecondary={sanitizedHistorySecondary}></HistoryComponent>
    }


}