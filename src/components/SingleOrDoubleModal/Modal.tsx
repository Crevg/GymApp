import { useState } from 'react';
import Modal from 'react-modal'

import style from './Modal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

type Props = {
    isOpen: boolean,
    onClose: () => any;
    onConfirm: (single: boolean) => any;
}

export default function SingleOrDoubleModal({
    isOpen, onClose, onConfirm
}: Props) {

    const [singleSession, setSingleSession] = useState(false);

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
            <h1> Finish training </h1>
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
            <div className={style.CheckboxContainer}>
                <div className={style.CheckboxInnerBox}>
                    <input type="radio" id='singlesessionFalse' checked={!singleSession} onChange={() => setSingleSession(s => !s)}></input>
                    <label htmlFor='singlesessionFalse'> Both </label>
                </div>
                <div className={style.CheckboxInnerBox}  >
                    <input type="radio" id='singlesessiontTrue' checked={singleSession} onChange={() => setSingleSession(s => !s)}></input>
                    <label htmlFor='singlesessiontTrue'> Just me </label>
                </div>

            </div>
            <button className='navigationButton' onClick={ () => onConfirm(singleSession)}> Confirm </button>
        </div>


    </Modal>
}