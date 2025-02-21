import { Fragment, useEffect, useState } from 'react';
import Modal from 'react-modal'

import style from './Modal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Routine } from '../../../public/types';
import { Card } from '../Card/Card';

type Props = {
    isOpen: boolean,
    onClose: () => any;
    onConfirm: (nextDay: number, nextDaySec: number | undefined) => any;
    routine: Routine,
    routineSecondary: Routine | undefined,
    currentDay: number;
    currentDaySecondary: number | undefined;
}

export default function SkipDayModal({
    isOpen, onClose, onConfirm, routine, currentDay, routineSecondary, currentDaySecondary
}: Props) {

    useEffect( () => {
        setNextDay(currentDay);
        setNextDaySecondary(currentDaySecondary);
    }, [currentDay, currentDaySecondary])

    const [nextDay, setNextDay] = useState(currentDay);
    const [nextDaySecondary, setNextDaySecondary] = useState(currentDaySecondary);
    const [skipADay, setSkipADay] = useState(true);

    return <Modal
        isOpen={isOpen}
        shouldCloseOnEsc={true}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        shouldFocusAfterRender={true}
        onRequestClose={onClose}
        style={{
            content: {
                width: "80vw",
                margin: "auto",
                height: "90vh",
                overflow: 'auto',
                position: "relative",
                top: "5%",
                left: "0",
                right: "0",
                paddingBottom: "0",


            },
            overlay: {
                background: "rgb(0, 0, 0, 0.8)"
            }
        }}
    >
        <div className={style.ModalTitle}>
            <h1> Change workout day </h1>
        </div>
        <FontAwesomeIcon
            icon={faClose}
            onClick={onClose}
            cursor={"pointer"}
            color='#880808'
            style={{
                position: "absolute",
                top: "1em",
                right: "1em"
            }}></FontAwesomeIcon>
        <div className={style.ModalContent}>
            <Card
                className={style.SkipDayCard}
                onClick={() => {
                    setSkipADay(true)
                }}
                clickable
            >
                <input id="skipADayRadio" checked={skipADay} onChange={() => setSkipADay(true)} type='radio' ></input>
                <label htmlFor='skipADayRadio'> Skip a day </label>
            </Card>
            <Card
                className={style.SkipDayCard}
                onClick={() => setSkipADay(false)}
                clickable
            >
                <input id="specificDayRadio" checked={!skipADay} onChange={() => setSkipADay(false)} type='radio'></input>
                <label htmlFor='specificDayRadio'> Select specific day </label>
                <div className={style.SelectDayContainer}>
                    {!skipADay && <div className={style.DaysColumn}>
                        <span> Select day </span>
                        {routine?.days?.map((day, index) => {
                             return <div key={index}>
                                <input id={`setNextDayRadio-${index}`} checked={nextDay === index}
                                    onChange={() => setNextDay(index)} type='radio'></input>
                                <label htmlFor={`setNextDayRadio-${index}`}> {day.name} </label>
                            </div>
                            }
                        )}
                    </div>
                    }
                    {!skipADay && <div className={style.DaysColumn}>
                        <span> Select day for secondary profile</span>
                        {routineSecondary?.days?.map((day, index) =>
                            <div key={`secondaryRadio-${index}`}>
                                <input id={`setNextDayRadioSecondary-${index}`} checked={nextDaySecondary === index}
                                    onChange={() => setNextDaySecondary(index)} type='radio'></input>
                                <label htmlFor={`setNextDayRadioSecondary-${index}`}> {day.name} </label>
                            </div>
                        )}
                    </div>
                    }

                </div>
            </Card>

            <button className='navigationButton' onClick={() => {
                if (skipADay) {
                    const nextDayUpdated = currentDay + 1 < routine?.days?.length ? currentDay + 1 : 0;
                    let nextDayUpdatedSecondary;
                    if (!!routineSecondary && currentDaySecondary !== undefined) {
                        nextDayUpdatedSecondary = currentDaySecondary + 1 < routineSecondary?.days?.length ? currentDaySecondary + 1 : 0;
                    }
                    onConfirm(nextDayUpdated, nextDayUpdatedSecondary)
                } else {
                    onConfirm(nextDay, nextDaySecondary)
                }
            }}> Confirm </button>
        </div>
        <div className={style.footer}></div>

    </Modal>
}