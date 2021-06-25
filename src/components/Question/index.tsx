import styles from './index.module.scss';

interface QuestionProps{
    content: string;
    author:{
        name: string,
        avatar: string
    }
}

export default function Question({content, author,}: QuestionProps){
    return(
        <div className={styles.question}>
            <p>{content}</p>
            <footer>
                <div className={styles.user_info}>
                    <img src={author.avatar} alt="Foto do usuário" />
                    <span>{author.name}</span>
                </div>
                <div></div>
            </footer>
        </div>
    )
}