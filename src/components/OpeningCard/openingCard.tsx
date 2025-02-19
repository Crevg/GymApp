"use client"

import { ReactNode, useEffect, useRef, useState } from "react";
import styles from './openingCard.module.css'
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    title?: string,
    children?: Readonly<ReactNode>,
    height: string,
    setHeight: (h: string) => any;
}

export default function OpeningCard({ title, children, height, setHeight}: Props) {

    const heightValue = 54;

    const ref = useRef<HTMLDivElement>(null);

    const changeDivHeight = () => {
        if (ref.current) {
            if (height === `${heightValue}px`) {
                setHeight(`${ref.current.scrollHeight}px`);
            }
            else {
                setHeight(`${heightValue}px`);
            }
        }
    }

    useEffect( () => {
        console.log("NEW height", ref.current?.scrollHeight);
    }, [ref.current?.clientHeight])


    return <div
        ref={ref}
        className={styles.openingCard}

        style={{ height: height }}>

        <div className={styles.openingCardTitle}
            onClick={() => { changeDivHeight() }}
        >
            <div className={styles.openingCardTitleItem}> {title ?? ''} </div>
            <div className={styles.openingCardTitleItem} > <FontAwesomeIcon icon={height === `${heightValue}px` ? faArrowDown : faArrowUp}></FontAwesomeIcon> </div>
        </div>
        <div className={styles.openingCardBody}>
            {children}
        </div>
    </div>
}