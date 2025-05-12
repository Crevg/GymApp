import { useContext } from "react";
import { GlobalContext } from "../../app/context/tabsState";
import ReactModal from "react-modal";
import styles from './loadingModal.module.css'



function loadingModal() {


    const { loading } = useContext(GlobalContext)

    return (
        <ReactModal
            isOpen={loading}
            ariaHideApp={false}
            style={{
                overlay: {
                    margin: "0",
                    padding: "0",
                },
                content: {
                    backgroundColor: "rgba(255,255,255,0.8)",
                    inset: "0",
                    height: '100%',
                    width: '100vw',
                    background: 'white',
                    margin: "0",
                    padding: "0"
                }
            }}
        >
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                <div className={styles.spinner}><div className={styles.spinnerInner}>
                    <div></div>
                </div></div>
            </div>
        </ReactModal>
    );
}

export default loadingModal;