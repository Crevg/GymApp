"use client"

import styles from './page.module.css'

import { Fragment, useState } from 'react';

import { saveRoutine } from '@/app/actions';
import RoutineDayComponent from './day';
import { RoutineDay } from '../../../../public/types';
import { Card } from '@/components/Card/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


export default function NewRoutineComponent() {

    const [routineName, setRoutineName] = useState<string>("");
    const [routineDays, setRoutineDays] = useState<Array<RoutineDay>>([{
        name: '',
        group: [0],
        exercises: []
    }]);

    return <main className="main centeredFlex">
        <h1> Create a new routine </h1>


        <Card className={styles.routineNameContainer}>
            <input className={styles.dayInput}
                placeholder='Name your routine...'
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
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
                            setName={(newName: string) => setRoutineDays(curr => {
                                const updated = [...curr];
                                updated[i].name = newName;
                                return updated;
                            })}
                            setGroup={(newGroup: Array<number>) => setRoutineDays(curr => {
                                const updated = [...curr];
                                updated[i].group = newGroup;
                                return updated;
                            })}
                            removeDay={() => {
                                if (routineDays.length > 1) {
                                    setRoutineDays(curr => {
                                        const updated = [...curr];
                                        updated.splice(i, 1);
                                        return updated;
                                    })
                                }
                            }}
                        ></RoutineDayComponent>)}
                    { routineDays.length <= 6 && <button className="navigationButton" onClick={() =>
                        setRoutineDays(curr =>
                            curr.concat({ name: '', group: [0], exercises: []})
                        )}> <FontAwesomeIcon color='black' icon={faPlus}></FontAwesomeIcon> </button>}

                </div>
                <button className="navigationButton" onClick={() => saveRoutine(routineName, routineDays)}> Create routine </button>
            </Fragment>
        }
    </main>

}