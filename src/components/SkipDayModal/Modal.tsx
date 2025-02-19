import { useState } from 'react';
import Modal from 'react-modal'

import style from './Modal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Routine } from '../../../public/types';
import { Card } from '../Card/Card';

type Props = {
    isOpen: boolean,
    onClose: () => any;
    onConfirm: (nextDay: number) => any;
    routine: Routine,
    currentDay: number;
}

export default function SkipDayModal({
    isOpen, onClose, onConfirm, routine, currentDay
}: Props) {

    const [nextDay, setNextDay] = useState(currentDay);
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
                height: "auto",
                position: "relative",
                top: "5%",
                left: "0",
                right: "0"


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

                {!skipADay && routine?.days?.map((day, index) =>
                    <div key={index} className={style.SpecificDayContainer}>
                        <input id={`setNextDayRadio-${index}`} checked={nextDay === index}
                            onChange={() => setNextDay(index)} type='radio'></input>
                        <label htmlFor={`setNextDayRadio-${index}`}> {day.name} </label>
                    </div>)}
            </Card>


            <button className='navigationButton' onClick={() => {

                if (skipADay) {
                    const nextDayUpdated = currentDay + 1 < routine?.days?.length ? currentDay + 1 : 0;
                    onConfirm(nextDayUpdated)
                } else {
                    onConfirm(nextDay)
                }

            }}> Confirm </button>


        </div>


    </Modal>
}