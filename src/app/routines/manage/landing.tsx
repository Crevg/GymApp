"use client"
import { Card } from '@/components/Card/Card';
import styles from './page.module.css'
import { useState } from 'react';
import ManageRoutineComponent from './manage';
import SelectRoutine from './select';

type Props = {
    routines: any[],
    currentRoutine: number,
    currentRoutineSecondary?: number,
}

export default function ManageLanding({ routines, currentRoutine, currentRoutineSecondary }: Props) {

    const [option, setOption] = useState<number>(0)

    return (
        <main className={`main centeredFlex`}>
            <h1> {"Manage Routines"} </h1>

            <Card className={`${styles.selectCard} mainButton`} clickable onClick={() => setOption(1)}>
                <input id="selectRoutine" name="landingRoutingRadio" checked={option === 1} onChange={() => setOption(1)} type='radio' className={styles.selectCardItem}></input>
                <label htmlFor='selectRoutine' className={styles.selectCardItem}> Select current routine </label>
            </Card>
            <Card className={`${styles.selectCard} mainButton`} clickable  onClick={() => setOption(2)}>
                <input id="updateRoutine" name="landingRoutingRadio" type='radio' onChange={() => setOption(2)}  checked={option === 2} className={styles.selectCardItem}></input>
                <label htmlFor='updateRoutine' className={styles.selectCardItem}> Add or update routine </label>
            </Card>

            {option === 1 && <SelectRoutine routines={routines} currentRoutine={currentRoutine} currentRoutineSecondary={currentRoutineSecondary}></SelectRoutine>}
            {option === 2 && <ManageRoutineComponent routines={routines}></ManageRoutineComponent>}
        </main>

    )
}