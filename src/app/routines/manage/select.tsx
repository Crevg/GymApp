"use client"

import { Card } from "@/components/Card/Card"
import { Routine } from "../../../../public/types"
import styles from './page.module.css'
import { useRouter } from "next/navigation"
import { changeCurrentRoutine } from "@/app/actions"
import { useState } from "react"

type Props = {
    routines: Array<Routine>,
    currentRoutine?: number,
    updateSecondary?: boolean,
    currentRoutineSecondary?: number,
}

export default function SelectRoutine({ routines, currentRoutine, currentRoutineSecondary }: Props) {


    const [selectCurrentRoutine, setSelectCurrentRoutine] = useState<number>(currentRoutine ?? 0);
    const [selectCurrentRoutineSecondary, setSelectCurrentRoutineSecondary] = useState<number>(currentRoutineSecondary ?? 0);

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
                    <input id="selectCurrentRoutine"
                        name="selectRoutineRadio"
                        checked={selectCurrentRoutine === i}
                        onChange={() => setSelectCurrentRoutine(i)} type='radio'
                        className={styles.selectCardItem}></input>
                    <label htmlFor='selectCurrentRoutine' className={styles.selectCardItem}> {routine.name} </label>
                </Card>)}
        </div>
        {routines.length > 0 && currentRoutineSecondary !== undefined ?
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
                            <input id="selectCurrentRoutineSecondary" name="selectRoutineRadioSecondary" checked={selectCurrentRoutineSecondary === i}
                                onChange={() => setSelectCurrentRoutineSecondary(i)}
                                type='radio'
                                className={styles.selectCardItem}></input>
                            <label htmlFor='selectCurrentRoutineSecondary' className={styles.selectCardItem}> {routine.name} </label>
                        </Card>)}
                </div>
            </>
            : null}

        {routines.length > 0 && <button className="navigationButton" onClick={() => {
            if (currentRoutineSecondary === undefined) {
                changeCurrentRoutine(selectCurrentRoutine)
            } else {
                changeCurrentRoutine(selectCurrentRoutine, selectCurrentRoutineSecondary)
            }
        }}> {'Confirm'} </button>}
    </main>
}