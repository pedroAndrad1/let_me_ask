import {ButtonHTMLAttributes} from 'react'
import styles from './index.module.scss';

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>){
    return (<button {...props} className={styles.button}></button>)
}