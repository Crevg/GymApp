"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faTrash } from '@fortawesome/free-solid-svg-icons'
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
                style={{ marginLeft: 'auto' }}
                cursor={'pointer'}
                onClick={() => removeDay()}
            ></FontAwesomeIcon>
            <input
                className={`${styles.dayInput} ${styles.dayName}`}
                placeholder='Day name'
                name='dayName'
                value={name}
                onChange={(e) => setName(e.target.value)}
            >
            </input>
            {group.map((g, i) =>
                <div key={`muscleGroup-${i}`} className={styles.dayInputContainer}>
                    <select className={styles.dayInput}
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
                        style={{ marginLeft: 'auto' }}
                        cursor={'pointer'}
                        onClick={() => removeGroup(i)}
                    ></FontAwesomeIcon>
                </div>
            )}
            {group.length <= 3 && <button className='navigationButtonSmall' onClick={addNewGroup}> <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></button>}


        </Card>
    </div>

}