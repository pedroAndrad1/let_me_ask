import {ButtonHTMLAttributes} from 'react'
import styles from './index.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
}

export default function Button({isOutlined = false, ...props}: ButtonProps){
    return (<button {...props} className={`${styles.button} ${isOutlined && styles.outlined}`}></button>)
}