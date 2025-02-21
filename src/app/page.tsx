"use client"
import { Card } from "@/components/Card/Card";
import styles from "./page.module.css"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../public/api/api";
import { getRoutineAndCurrentDay } from "./helpers/getPreviousDayHelper";
import { GetCurrentProfile } from "./helpers/getCurrentProfileHelper";
import { HardCodedProfiles1, HardCodedProfiles2 } from "../../public/data/hardcodeProfiles";
import SkipDayModal from "@/components/SkipDayModal/Modal";
import { Routine } from "../../public/types";
import { updateCurrentDay } from "./actions";

export default function Home() {

  const [nextDay, setNextDay] = useState<string>("N/A");
  const [routine, setRoutine] = useState<Routine>();
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);

  const [nextDaySec, setNextDaySec] = useState<string>("N/A");
  const [routineSec, setRoutineSec] = useState<Routine>();
  const [currentDayIndexSec, setCurrentDayIndexSec] = useState<number | undefined>(0);

  /* Get next day label */
  useEffect(() => {
    fetch(`${db}/profile.json`, { method: 'GET', cache: 'no-cache' })
      .then((profile: any) => {
        return profile.json();
      })
      .then(jsonProfile => {
        return {
          jsonProfile,
          currentProfileID: GetCurrentProfile(jsonProfile, HardCodedProfiles1),
          secondaryProfileID: HardCodedProfiles1 ? GetCurrentProfile(jsonProfile, HardCodedProfiles2) : null
        }
      }
      )
      .then(({ jsonProfile, currentProfileID, secondaryProfileID }) => {
        const currentProfile = jsonProfile[String(currentProfileID)];
        const secondaryProfile = secondaryProfileID ? jsonProfile[String(secondaryProfileID)] : null;
        const routineID = currentProfile.routine;
        const routineSecID = secondaryProfile ? secondaryProfile.routine : null;
        return {
          primaryProfile: getRoutineAndCurrentDay(routineID, currentProfile),
          secondaryProfile: secondaryProfile ? getRoutineAndCurrentDay(routineSecID, secondaryProfile) : null
        }
      })
      .then(async ({ primaryProfile, secondaryProfile }) => {
        const primaryProfileJson = await primaryProfile;
        const secondaryProfileJson = secondaryProfile ? await secondaryProfile : null;
        const currentDayExercises = primaryProfileJson.jsonRoutine.days[primaryProfileJson.currentDayIndex].name
        const secondaryDayExercises = secondaryProfileJson ? secondaryProfileJson.jsonRoutine.days[secondaryProfileJson.currentDayIndex].name : null
        setRoutine(primaryProfileJson.jsonRoutine);
        setCurrentDayIndex(primaryProfileJson.currentDayIndex);
        setNextDay(currentDayExercises ?? "N/A")
        setRoutineSec(secondaryProfileJson?.jsonRoutine);
        setCurrentDayIndexSec(secondaryProfileJson?.currentDayIndex);
        setNextDaySec(secondaryDayExercises ?? "N/A")
      }).catch(e => {
        console.error(e);
        setNextDay("N/A");
      })
  }, [currentDayIndex])

  const router = useRouter();
  const [openSkipDayModal, setOpenSkipDayModal] = useState(false);
  return (
    <main className={`main centeredFlex`}>
      <h1> {"Training App"} </h1>
      <Card id={styles.mainButton} className={'mainButton'} clickable onClick={() => router.push("/workout")}> Workout  </Card>
      <div className={styles.nextWorkoutLabel}>
        <span onClick={() => setOpenSkipDayModal(true)}> Next: {nextDay} {nextDaySec ? `and ${nextDaySec}` : null }</span>
      </div>
      <Card className={'mainButton'} clickable onClick={() => router.push("/routines/view")}> My Routine </Card>
      <Card className={'mainButton'} clickable onClick={() => router.push("/history")}> History </Card>
      <Card className={'mainButton'} clickable onClick={() => router.push("/routines/manage")}>  Routines  </Card>

      <SkipDayModal
        isOpen={openSkipDayModal}
        currentDay={currentDayIndex}
        onClose={() => setOpenSkipDayModal(false)}
        onConfirm={async (nextDay: number, nextDaySec: number | undefined) => {
          setOpenSkipDayModal(false);
          await updateCurrentDay(nextDay, nextDaySec);
          setCurrentDayIndex(nextDay);
          setCurrentDayIndexSec(nextDaySec);

        }}
        routine={routine as Routine}
        routineSecondary={routineSec}
        currentDaySecondary={currentDayIndexSec}
      ></SkipDayModal>
    </main>


  );
}
