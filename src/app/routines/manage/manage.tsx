"use client"

import { Card } from "@/components/Card/Card";
import styles from './page.module.css'
import { useRouter } from "next/navigation";

type Props = {
    routines: any[]
}

export default function ManageRoutineComponent({ routines }: Props) {

    const router = useRouter();

    return <main className="main centeredFlex">
        <h2> {"Update routine"} </h2>
        <div className={`${styles.mainArea}`}> {routines.length === 0 && "You have no routines yet."}
            {routines.map((routine, i) => <Card key={`routine-${i}`} onClick={() => router.push(`/routines/${i}`)}
                className={'mainButton'} clickable> {routine.name} </Card>)}
        </div>

        <button className="navigationButton" onClick={() => router.push("/routines/new")}> Add routine </button>
    </main>

}