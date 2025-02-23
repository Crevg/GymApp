import { ReactNode } from "react"
import styles from "./Card.module.css"

type Props = { id?:string; children?: ReactNode, className?: string, clickable?: boolean, disabled?: boolean, onClick? : React.MouseEventHandler }

export function Card( {id, children, className, clickable, disabled, onClick} : Props) {

    return <div 
    id={id} 
    onClick={!disabled ? onClick : () => {}}
     className={`${styles.card} ${className} ${clickable ? styles.clickable : ''} ${disabled ? styles.disabled : ''}` }>
        {children}
    </div>
}