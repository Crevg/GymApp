import { Fragment, useState } from "react";
import { Exercise, SanitizedHistory } from "../../../public/types";
import OpeningCard from "@/components/OpeningCard/openingCard";
import styles from './page.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell, faListOl, faWeightHanging } from "@fortawesome/free-solid-svg-icons";

type Props = {
    session: SanitizedHistory
    exerciseList: Array<Exercise>

}

export default function HistoryCard({ session, exerciseList }: Props) {

    const [height, setHeight] = useState("54px");

    return <OpeningCard title={`${session.routineName} - ${session.day}`} height={height} setHeight={setHeight}>
        <div className={styles.historyGrid}>
            <div className={styles.historyTitle}> <b> Exercise </b> </div>
            <div> <FontAwesomeIcon icon={faListOl} ></FontAwesomeIcon> </div>
            <div> <FontAwesomeIcon icon={faDumbbell} ></FontAwesomeIcon>  </div>
            <div> <FontAwesomeIcon icon={faWeightHanging} ></FontAwesomeIcon> </div>


            {session.workout.map((w, i) =>
                <Fragment key={`hcard-${i}`}>
                    <div>  {exerciseList.find(ex => ex.id === w.exerciseId)?.name} </div>
                    <div style={{ display: 'flex', flexDirection: "column" }}>
                        {w.sets.map((s, index) => <div key={`hcards-${index}`}> {s} </div>)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: "column" }}>
                        {w.reps.map((r, index) => <div key={`hcardr-${index}`}> {r} </div>)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: "column" }}>
                        {w.weight.map((w, index) => <div key={`hcardw-${index}`}> {w} </div>)}
                    </div>
                </Fragment>
            )}
        </div>
    </OpeningCard>
}