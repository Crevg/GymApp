"use client"

import { faArrowCircleLeft, faGear, faHome } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { Fragment } from "react";

export function BackButton() {

    const router = useRouter();

    return <Fragment>
        {/* <div className="backIcon" onClick={() => router.back()}>
            <FontAwesomeIcon className="backIconFA" icon={faArrowCircleLeft}></FontAwesomeIcon>
        </div> */}
        <div className="homeIcon" onClick={() => router.push("/")}>
            <FontAwesomeIcon className="homeIconFA"  icon={faHome}></FontAwesomeIcon>
        </div>
        <div className="settingIcon" onClick={() => router.push("/settings")}>
            <FontAwesomeIcon className="settingIconFA"  icon={faGear}></FontAwesomeIcon>
        </div>

    </Fragment>
}
