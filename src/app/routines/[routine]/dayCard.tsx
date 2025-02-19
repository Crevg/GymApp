import { useState, useRef } from "react";
import { Exercise, RoutineDay } from "../../../../public/types"
import styles from './page.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import OpeningCard from "@/components/OpeningCard/openingCard";


type Props = {
    day: RoutineDay;
    setExercises: (exercises: Array<number>) => any;
    availableExercises: Array<number>;
    exercises: Array<Exercise>
}

const heightValue = 54;

export default function DayCard({ day, setExercises, availableExercises, exercises }: Props) {

    // check if never created SHOULD ADD A CREATING CLAUSE ON POST
    if (!day.exercises) {
        setExercises([]);
    }

    const [height, setHeight] = useState<string>(`54px`);

    const addNewExercise = () => {
        setHeight('auto');
        const exercises = day.exercises ?? [];
        exercises.push(availableExercises[0]);
        setExercises(exercises)
    }

    /*   const onChangeExerciseNameHandler = (exercise: string, i: number) => {
          const exercises = day.exercises ?? [];
          exercises[i].name = exercise;
          setExercises(exercises)
      } */

    const onChangeExerciseHandler = (exerciseId: number, index: number) => {
        const updatedExercises = day.exercises;
        updatedExercises[index] = exerciseId;
        setExercises(updatedExercises)
    }

    const deleteExercise = (index: number) => {
        setHeight('auto');
        const exercises = day.exercises ?? [];
        exercises.splice(index, 1)
        setExercises(exercises)
    }

    return <OpeningCard title={day.name} height={height} setHeight={setHeight}  >

        {day.exercises.length === 0 && 'There are currently no exercises.'}
        {day.exercises.map((exercise, i) =>
            <div className={styles.exerciseInputContainer}
                key={`${exercise}-${i}`}>
                {/*     <input
                    className={styles.exerciseInput}
                    onChange={(e) => onChangeExerciseNameHandler(e.target.value, i)}
                    value={exercise.name}
                ></input> */}

                <select
                    className={styles.exerciseInput}
                    value={exercise}
                    onChange={(e) => onChangeExerciseHandler(parseInt(e.target.value), i)}>
                    {availableExercises.map((availableExe, i) =>
                        <option key={`availableExercise-${i}`} value={availableExe}> {exercises.find(exe => exe.id === availableExe)?.name ?? 'No name'}</option>)}
                </select>

                <FontAwesomeIcon cursor={'pointer'} color="#880808" icon={faTrash} onClick={() => deleteExercise(i)}></FontAwesomeIcon>
            </div>)}

        <div style={{
            width: "fitContent",
            alignSelf: "center"
        }} onClick={() => addNewExercise()} className="navigationButtonSmall">
            <FontAwesomeIcon cursor={'pointer'} icon={faPlusCircle}></FontAwesomeIcon> </div>
    </OpeningCard >







}
