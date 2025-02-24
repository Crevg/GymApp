"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { muscleGroups } from '../../../../public/data/muscleGroups'
import styles from './page.module.css'

import { Card } from "@/components/Card/Card"
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'

type Props = {
    name: string,
    setName: (n: string) => any;
    group: Array<number>,
    setGroup: (g: Array<number>) => any;
    removeDay: () => any;
}

export default function RoutineDayComponent({ name, group, setName, setGroup, removeDay }: Props) {

    const changeGroup = (g: number, i: number) => {
        const updatedGroup = [...group];
        updatedGroup[i] = g;
        setGroup(updatedGroup);

    }

    const addNewGroup = () => {
        const updatedGroup = [...group];
        updatedGroup.push(0);
        setGroup(updatedGroup);
    }

    const removeGroup = (index: number) => {
        if (group.length > 1) {
            const updatedGroup = [...group];
            updatedGroup.splice(index, 1);
            setGroup(updatedGroup);
        }

    }


    return <div className={styles.routineDayComponent}>
        <Card className="main centeredFlex">
            <FontAwesomeIcon
                icon={faClose}
                color='#880808'
                style={{ marginLeft: 'auto'}}
                cursor={'pointer'}
                onClick={() => removeDay()}
            ></FontAwesomeIcon>
            <input
                className={`${styles.dayInput} ${styles.dayName}`}
                placeholder='Enter day name'
                name='dayName'
                value={name}
                onChange={(e) => setName(e.target.value)}
            >
            </input>
            <div className={styles.separator}></div>
            {group.map((g, i) =>
                <div key={`muscleGroup-${i}`} className={styles.dayInputContainer}>
                    <select className={styles.muscleInput}
                        style={{ cursor: 'pointer' }}
                        value={g}
                        onChange={e => changeGroup(parseInt(e.target.value), i)}
                    >
                        {muscleGroups.filter(mg => !group.includes(mg.id) || mg.id === g).map(muscleGroup =>
                            <option key={muscleGroup.name} value={muscleGroup.id}>
                                {muscleGroup.name}
                            </option>)}
                    </select>
                    <FontAwesomeIcon
                        icon={faTrash}
                        color='#880808'
                        style={{ marginLeft: 'auto',  marginRight: '7%'  }}
                        cursor={'pointer'}
                        onClick={() => removeGroup(i)}
                    ></FontAwesomeIcon>
                </div>
            )}
            {group.length <= 3 && <div style={{
                width: "fitContent",
                alignSelf: "center",
                cursor: "pointer"
            }} onClick={addNewGroup}>
                <FontAwesomeIcon color='green' fontSize={"1.5rem"} icon={faPlusCircle}></FontAwesomeIcon> 
            </div>}


        </Card>
    </div>

}