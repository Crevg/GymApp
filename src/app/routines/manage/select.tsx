"use client"

import { Card } from "@/components/Card/Card"
import { Routine } from "../../../../public/types"
import styles from './page.module.css'
import { useRouter } from "next/navigation"
import { changeCurrentRoutine } from "@/app/firebase/database"
import { useEffect, useState } from "react"
import isAdminUser from "@/app/helpers/isAdminUser"

type Props = {
    routines: Array<Routine>,
    currentRoutine: number,
    currentRoutineSecondary: number,
}

export default function SelectRoutine({ routines, currentRoutine, currentRoutineSecondary}: Props) {

    const router = useRouter();

    useEffect( () => {
        const updateSecondary = async () => {
            const isAdmin = await isAdminUser();
            setUpdateSecondary(isAdmin);
        }

        updateSecondary().then();
    }, [])

    const [updateSecondary, setUpdateSecondary] = useState<boolean>(false);
    const [selectCurrentRoutine, setSelectCurrentRoutine] = useState<number>(currentRoutine === -1 ? 0 : currentRoutine);
    const [selectCurrentRoutineSecondary, setSelectCurrentRoutineSecondary] = 
    useState<number>(currentRoutineSecondary === -1 ? 0 : currentRoutineSecondary);

    return <main className="main centeredFlex">
        <h2> {"Select current routine"} </h2>
        <div className={`${styles.mainArea}`}> {routines.length === 0 && "You have no routines yet."}
            {routines.map((routine, i) =>
                <Card
                    key={`routine-${i}`}
                    onClick={() => setSelectCurrentRoutine(i)}
                    className={`mainButton ${styles.selectCard}`}
                    clickable
                >
                    <input id={`selectCurrentRoutine-${i}`}
                        name={`selectCurrentRoutine-${i}`}
                        checked={selectCurrentRoutine === i}
                        onChange={() => setSelectCurrentRoutine(i)} type='radio'
                        className={styles.selectCardItem}></input>
                    <label htmlFor={`selectCurrentRoutine-${i}`} className={styles.selectCardItem}> {routine.name} </label>
                </Card>)}
        </div>
        {routines.length > 0 && updateSecondary ?
            <>
                <h2> {"Select current routine for secondary profile"} </h2>
                <div className={`${styles.mainArea}`}> {routines.length === 0 && "You have no routines yet."}
                    {routines.map((routine, i) =>
                        <Card
                            key={`routinesecondary-${i}`}
                            onClick={() => setSelectCurrentRoutineSecondary(i)}
                            className={`mainButton ${styles.selectCard}`}
                            clickable
                        >
                            <input id={`selectCurrentRoutineSec-${i}`} name={`selectCurrentRoutineSec-${i}`} checked={selectCurrentRoutineSecondary === i}
                                onChange={() => setSelectCurrentRoutineSecondary(i)}
                                type='radio'
                                className={styles.selectCardItem}></input>
                            <label htmlFor={`selectCurrentRoutineSec-${i}`} className={styles.selectCardItem}> {routine.name} </label>
                        </Card>)}
                </div>
            </>
            : null}

        {routines.length > 0 && <button className="navigationButton" onClick={() => {
            if (!updateSecondary) {
                changeCurrentRoutine(selectCurrentRoutine)
            } else {
                changeCurrentRoutine(selectCurrentRoutine, selectCurrentRoutineSecondary)
            }
            router.push("/")
        }}> {'Confirm'} </button>}
    </main>
}