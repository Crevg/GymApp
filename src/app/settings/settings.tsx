"use client"

import { Card } from "@/components/Card/Card"
import Modal from "@/components/CreateProfileModal/Modal";
import { useState } from "react"
import { createNewProfile } from "../actions";

export default function SettingsComponent() {

    const [createProfileModal, setCreateProfileModal] = useState(false);



    return <main className="centeredFlex main">
        <h1> Settings </h1>
        <Card clickable={true} onClick={() => setCreateProfileModal(true)}> Create new profile </Card>
        <Modal
            isOpen={createProfileModal}
            onClose={() => setCreateProfileModal(false)}
            onConfirm={(profileName) => {
                setCreateProfileModal(false)
                createNewProfile(profileName)
            }}
        ></Modal>
    </main >


}