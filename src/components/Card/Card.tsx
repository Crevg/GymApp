import { ReactNode } from "react"
import styles from "./Card.module.css"

type Props = { id?:string; children?: ReactNode, className?: string, clickable?: boolean, onClick? : React.MouseEventHandler }

export function Card( {id, children, className, clickable, onClick} : Props) {

    return <div id={id} onClick={onClick} className={`${styles.card} ${className} ${clickable ? styles.clickable : ''}` }>
        {children}
    </div>
}