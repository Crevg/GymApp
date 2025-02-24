"use client"
import { useState } from "react";
import OpeningCard from "@/components/OpeningCard/openingCard";
import { DBProfile, Exercise, WorkoutSession } from "../../../public/types";
import styles from './page.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faListOl, faDumbbell, faWeightScale, faWeightHanging, faTrash, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

type Props = {
    exerciseID: number
    profile: DBProfile,
    session: WorkoutSession,
    exerciseList: Array<Exercise>,
    setSession: (t: 'sets' | 'weight' | 'reps', i: number, v: string) => any;
    previousSession: WorkoutSession | undefined,
    addRemoveExtraSet: (add: boolean, i?: number) => any;

}


export default function ExerciseComponent({ exerciseID, session, setSession, exerciseList, previousSession, addRemoveExtraSet }: Props) {

    const [height, setHeight] = useState("54px");

    const name = exerciseList.find(exe => exerciseID === exe.id)?.name ?? '';

    return <OpeningCard
        title={name}
        height={height}
        setHeight={setHeight}
    >
        {session.sets.map((set, index) =>
            <div key={`sets-${index}`} className={styles.workoutInfoContainer}>
                <div>
                    <label> <FontAwesomeIcon icon={faListOl} style={{ marginRight: "0.25em" }}></FontAwesomeIcon> </label>
                    <input
                        value={session.sets[index]}
                        type="number"
                        pattern="\d*"
                        className={styles.workoutValueInput}
                        onChange={(e) => setSession('sets', index, e.target.value)}
                    ></input>
                </div>
                <div>
                    <label> <FontAwesomeIcon icon={faDumbbell} style={{ marginRight: "0.25em" }}></FontAwesomeIcon> </label>
                    <input
                        value={session.reps[index]}
                        type="number"
                        pattern="\d*"
                        className={styles.workoutValueInput}
                        onChange={(e) => setSession('reps', index, e.target.value)}

                    ></input>
                </div>
                <div>
                    <label> <FontAwesomeIcon icon={faWeightHanging} style={{ marginRight: "0.25em" }}></FontAwesomeIcon> </label>
                    <input
                        value={session.weight[index]}
                        type="number"
                        pattern="\d.d*"
                        className={styles.workoutValueInput}
                        onChange={(e) => setSession('weight', index, e.target.value)}

                    ></input>
                </div>
                {session.sets.length >= 2 &&
                    <FontAwesomeIcon
                        icon={faTrash}
                        color="#880808"
                        cursor={"pointer"}
                        onClick={() => addRemoveExtraSet(false, index)}
                    ></FontAwesomeIcon>}
            </div>
        )}



        <div
            style={{
                width: "fitContent",
                alignSelf: "center"
            }}
            className={styles.AddSetIconContainer}
            onClick={() => addRemoveExtraSet(true)}
        > <FontAwesomeIcon color='green' fontSize={"1.5rem"} icon={faPlusCircle}></FontAwesomeIcon>
        </div>


        {!!previousSession &&
            <div style={{
                fontSize: "small",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                padding: '1em',
                textAlign: 'center',
                width: '100%'
            }}>

                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "space-between", gap: "0.5em" }}>
                    <span> Last time: </span>
                    {previousSession.sets.map((set, i) => {
                        return <div key={`previous-set-${i}`} style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", gap: "0.75rem", alignItems: 'center' }}>
                            <div> <FontAwesomeIcon icon={faListOl} style={{ marginRight: "0.25em" }}></FontAwesomeIcon> {previousSession.sets[i]} </div>
                            <div> <FontAwesomeIcon icon={faDumbbell} style={{ marginRight: "0.25em" }}></FontAwesomeIcon>  {previousSession.reps[i]} </div>
                            <div> <FontAwesomeIcon icon={faWeightHanging} style={{ marginRight: "0.25em" }}></FontAwesomeIcon>  {previousSession.weight[i]} kg  </div>
                        </div>
                    })}

                </div>
            </div>
        }
    </OpeningCard>
}