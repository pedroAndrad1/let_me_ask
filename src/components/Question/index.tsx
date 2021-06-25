import { ReactNode } from 'react';
import styles from './index.module.scss';

interface QuestionProps{
    content: string;
    author:{
        name: string,
        avatar: string
    }
    children?: ReactNode
}

export default function Question({content, author, children}: QuestionProps,){
    return(
        <div className={styles.question}>
            <p>{content}</p>
            <footer>
                <div className={styles.user_info}>
                    <img src={author.avatar} alt="Foto do usuário" />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}