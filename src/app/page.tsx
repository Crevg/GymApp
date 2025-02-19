"use client"
import { Card } from "@/components/Card/Card";
import styles from "./page.module.css"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../public/api/api";
import { getRoutineAndCurrentDay } from "./helpers/getPreviousDayHelper";
import { GetCurrentProfile } from "./helpers/getCurrentProfileHelper";
import { HardCodedProfiles1 } from "../../public/data/hardcodeProfiles";
import SkipDayModal from "@/components/SkipDayModal/Modal";
import { Routine } from "../../public/types";
import { updateCurrentDay } from "./actions";

export default function Home() {

  const [nextDay, setNextDay] = useState<string>("N/A");
  const [routine, setRoutine] = useState<Routine>();
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);

  /* Get next day label */
  useEffect(() => {
    fetch(`${db}/profile.json`, { method: 'GET', cache: 'no-cache' })
      .then((profile: any) => {
        return profile.json();
      })
      .then(jsonProfile => {
        return {
          jsonProfile,
          currentProfileID: GetCurrentProfile(jsonProfile, HardCodedProfiles1)
        }
      }
      )
      .then(({ jsonProfile, currentProfileID }) => {
        const currentProfile = jsonProfile[String(currentProfileID)];
        const routineID = currentProfile.routine;
        return getRoutineAndCurrentDay(routineID, currentProfile);
      })
      .then(({ currentDayIndex, jsonRoutine }) => {
        const currentDayExercises = jsonRoutine.days[currentDayIndex].name
        setRoutine(jsonRoutine);
        setCurrentDayIndex(currentDayIndex);
        setNextDay(currentDayExercises ?? "N/A")
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
        <span onClick={() => setOpenSkipDayModal(true)}> Next day: {nextDay} </span>
      </div>
      <Card className={'mainButton'} clickable onClick={() => router.push("/history")}> History </Card>
      <Card className={'mainButton'} clickable onClick={() => router.push("/routines/manage")}>  Routines  </Card>

      <SkipDayModal
        isOpen={openSkipDayModal}
        currentDay={currentDayIndex}
        onClose={() => setOpenSkipDayModal(false)}
        onConfirm={ async (nextDay: number) => {
          setOpenSkipDayModal(false);
          await updateCurrentDay(nextDay);
          setCurrentDayIndex(nextDay);
        }}
        routine={routine as Routine}
      ></SkipDayModal>
    </main>


  );
}
