"use client"
import { Card } from "@/components/Card/Card";
import styles from "./page.module.css"
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SecondaryProfileID } from "../../../public/data/adminData";
import SkipDayModal from "@/components/SkipDayModal/Modal";
import { Routine } from "../../../public/types";
import { checkIfSignedIn } from "../actions";
//import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { getCurrentProfile, getCurrentRoutine, updateCurrentDay } from "../firebase/database";
import isAdminUser from "../helpers/isAdminUser";
import { EmptyProfile, getValidProfile } from "../helpers/ProfileHelper";
import LoadingModal from "@/components/Loading/loadingModal";
import { GlobalContext } from "../context/tabsState";


export default function Home() {

    /* Set up local states for displaying correct data on screen */
    const [name, setName] = useState("");
    const [nextDay, setNextDay] = useState<string>("N/A");
    const [routine, setRoutine] = useState<Routine>();
    const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);

    const [nextDaySec, setNextDaySec] = useState<string | null>(null);
    const [routineSec, setRoutineSec] = useState<Routine>();
    const [currentDayIndexSec, setCurrentDayIndexSec] = useState<number | undefined>(0);

    const [loadingQ, setLoadingQ] = useState<Array<number>>([]);

    /* Get next day label */
    useEffect(() => {
        const getNextDayLabel = async () => {
            console.log("IN NEXT DAY LABEL")
            const sessionProfile = await checkIfSignedIn();
            if (sessionProfile) {
                setName(sessionProfile.name)
                const currentProfile = await getCurrentProfile(sessionProfile.id);
                let secondaryProfile = await isAdminUser() ? await getCurrentProfile(SecondaryProfileID) : EmptyProfile;

                if (getValidProfile(currentProfile) === null) {
                    throw "FATAL ERROR: No profile. "
                }

                const routineSecID = getValidProfile(secondaryProfile)?.routine;
                const currentDayIndexSecondary = secondaryProfile.currentDay;

                const routine = await getCurrentRoutine(currentProfile.routine);
                const routineSec = await getCurrentRoutine(routineSecID);

                const currentDayName = routine.days[currentProfile.currentDay].name;
                const currentDaySecondary = routineSec?.days[currentDayIndexSecondary]?.name;

                setRoutine(routine);
                setCurrentDayIndex(currentProfile.currentDay);
                setNextDay(currentDayName ?? "N/A")
                setRoutineSec(routineSec);
                setCurrentDayIndexSec(currentDayIndexSecondary);
                setNextDaySec(currentDaySecondary)
            };
        }
        setLoadingQ(q => {
            const updated = [...q];
            updated.push(1)
            return updated;
        })
        setLoading(true);

        getNextDayLabel().then(() => {
            setTimeout(() => {
                if (loadingQ.length <= 1) {
                    setLoading(false);
                }
                setLoadingQ(q => {
                    const updated = [...q];
                    updated.pop()
                    return updated;
                })
            }, 1000);


        }).catch(e => {
            console.error(e);
            setLoading(false);
            setNextDay("N/A");
        })


    }, [currentDayIndex])


    const { setLoading } = useContext(GlobalContext)


    const router = useRouter();
    const [openSkipDayModal, setOpenSkipDayModal] = useState(false);

    console.log({ routine })

    return (<main className={`main centeredFlex`}>
        <h1> {`Welcome` + `${name ? `, ${name}` : ''}`} </h1>
        <Card id={styles.mainButton} className={'mainButton'} clickable disabled={!routine} onClick={() => {
            setLoadingQ(q => {
                const updated = [...q];
                updated.push(1)
                return updated;
            })
            setLoading(true);
            router.push("/workout")
        }
        }> Workout  </Card>
        {routine && <div className={styles.nextWorkoutLabel}>
            <span onClick={() => setOpenSkipDayModal(true)}> Next: {nextDay} {nextDaySec ? `and ${nextDaySec}` : null}</span>
        </div>}
        {routine && <Card className={'mainButton'} clickable onClick={() => {
            setLoadingQ(q => {
                const updated = [...q];
                updated.push(1)
                return updated;
            })
            setLoading(true);
            router.push("/routines/view")
        }
        }> My Routine </Card>}
        <Card className={'mainButton'} clickable onClick={() => {
            setLoadingQ(q => {
                const updated = [...q];
                updated.push(1)
                return updated;
            })
            setLoading(true);
            router.push("/history")
        }}> History </Card>
        <Card className={'mainButton'} clickable onClick={() => {
            setLoadingQ(q => {
                const updated = [...q];
                updated.push(1)
                return updated;
            })
            setLoading(true);
            router.push("/routines/manage")
        }
        }>  Routines  </Card>

        <SkipDayModal
            isOpen={openSkipDayModal}
            currentDay={currentDayIndex}
            onClose={() => setOpenSkipDayModal(false)}
            onConfirm={async (nextDay: number, nextDaySec: number | undefined) => {
                setLoadingQ(q => {
                    const updated = [...q];
                    updated.push(1)
                    return updated;
                })
                setLoading(true);
                setOpenSkipDayModal(false);
                await updateCurrentDay(nextDay, nextDaySec);
                setCurrentDayIndex(nextDay);
                setCurrentDayIndexSec(nextDaySec);
            }}
            routine={routine as Routine}
            routineSecondary={routineSec}
            currentDaySecondary={currentDayIndexSec}
        ></SkipDayModal>
        <LoadingModal></LoadingModal>

    </main>


    );
}
