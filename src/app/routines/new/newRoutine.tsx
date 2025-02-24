"use client"

import styles from './page.module.css'

import { Fragment, useState } from 'react';

import { saveRoutine } from '@/app/firebase/database';
import RoutineDayComponent from './day';
import { RoutineDay } from '../../../../public/types';
import { Card } from '@/components/Card/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';


export default function NewRoutineComponent() {

    const router = useRouter();

    const [routineName, setRoutineName] = useState<string>("");
    const [routineDays, setRoutineDays] = useState<Array<RoutineDay>>([]);

    const [disabledCreation, setDisabledCreation] = useState<boolean>(true);

    return <main className="main centeredFlex">
        <h1> Create a new routine </h1>


        <Card className={styles.routineNameContainer}>
            <input className={styles.routineNameInput}
                placeholder='Name your routine...'
                value={routineName}
                onChange={(e) => {
                    setRoutineName(e.target.value)
                }}
            ></input>
        </Card>

        {routineName.length >= 3 &&
            <Fragment>

                <div className={styles.routineDaysContainer}>

                    {routineDays.map((day, i) =>
                        <RoutineDayComponent
                            key={`routine-${i}`}
                            name={day.name ?? ''}
                            group={day.group ?? [0]}
                            setName={(newName: string) => {
                                if (newName.length >= 3) {
                                    setDisabledCreation(false);
                                } else {
                                    setDisabledCreation(true);
                                }
                                setRoutineDays(curr => {

                                    const updated = [...curr];
                                    updated[i].name = newName;
                                    return updated;
                                })
                            }
                            }
                            setGroup={(newGroup: Array<number>) => setRoutineDays(curr => {
                                const updated = [...curr];
                                updated[i].group = newGroup;
                                return updated;
                            })}
                            removeDay={() => {
                                if (routineDays.length > 1) {
                                    setDisabledCreation( !!routineDays.find( (r, index) => r.name.length < 3 && index !== i));
                                    setRoutineDays(curr => {
                                        const updated = [...curr];
                                        updated.splice(i, 1);
                                        return updated;
                                    })


                            
                                }
                            }}
                        ></RoutineDayComponent>)}
                    {routineDays.length <= 6 && <div style={{
                        width: "fitContent",
                        alignSelf: "center",
                        cursor: "pointer"
                    }} onClick={() => {
                        setDisabledCreation(true);
                        setRoutineDays(curr =>
                            curr.concat({ name: '', group: [Math.floor(Math.random() * 6)], exercises: [] })
                        )
                    }}

                    > <FontAwesomeIcon color='green' fontSize={"25pt"} icon={faPlusCircle}></FontAwesomeIcon> </div>}


                </div>
                <button
                    className="navigationButton"
                    disabled={disabledCreation}
                    onClick={ async () => {
                        const index = await saveRoutine(routineName, routineDays)
                        router.push( index === -1 ? '/error' : `/routines/${index}`)

                    }}>
                    Create routine
                </button>
            </Fragment>
        }
    </main>

}