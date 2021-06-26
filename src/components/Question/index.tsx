import { ReactNode } from 'react';
import styles from './index.module.scss';

interface QuestionProps{
    content: string;
    author:{
        name: string,
        avatar: string
    }
    children?: ReactNode,
    isAnswered?: boolean,
    isHighlighted?: boolean
}

export default function Question({content, author, isAnswered = false, isHighlighted = false, children}:
    QuestionProps,){
    console.log(isAnswered, isHighlighted)
    return(
        <div className={`
            ${styles.question} 
            ${isAnswered && styles.answered} 
            ${(isHighlighted && !isAnswered) && styles.highlighted}`
        }>
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