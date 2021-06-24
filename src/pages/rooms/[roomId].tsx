import { useRouter } from "next/router";
import React, { FormEvent, useState, useEffect } from "react";
import Button from "../../components/Button";
import RoomCode from '../../components/RoomCode';
import { useUserContext } from "../../contexts/UserContext";
import { database } from "../../services/firebase";
import styles from "../../styles/room.module.scss"

type FirabaseQuestion = Record<string, {
    author: {
        name: string,
        avatar: string
    }
    content: string,
    isHighlighted: string,
    isAnswered: string,
}>

interface Question{
    id: string,
    author: {
        name: string,
        avatar: string
    }
    content: string,
    isHighlighted: string,
    isAnswered: string,
}
export default function Room() {

    const router = useRouter();
    const { roomId } = router.query;
    const [question, setQuestion] = useState('');
    const { user } = useUserContext();
    const [questions, setQuestions] = useState<Question[]>()
    const [title, setTitle] = useState('');

    //Carrega as questions quando carregar e quando o id mudar
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);
        //escuta o evento, uma vez, de carregar os values da room
        roomRef.once('value', async room => {
            //Pegando as questions
            const databaseRoom = await room.val();
            //Tem chance de nao ter pergunta
            const firabaseQuestion: FirabaseQuestion = databaseRoom?.questions ?? {}; 
            //Parseando as questions de objeto para array de chave valor
            const parsedQuestions = Object.entries(firabaseQuestion).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                }
            })
            console.log(databaseRoom)
            console.log(parsedQuestions)
            setTitle(databaseRoom?.title);
            setQuestions(parsedQuestions);
        })

    }, [roomId])

    const handleNewQuestionSubmit = async (e: FormEvent) => {
        e.preventDefault();
        //checando se foi escrito algo. Se tirar os espaços e nao tiver nada, entao nada escrito
        if (question.trim() === '') {
            return;
        }

        if (!user) {
            throw new Error("Você precisa estar logado")
        }

        const questionData = {
            content: question,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false, //Se o admin marcou a question
            isAnswered: false, //Se o admin respondeu
        }

        //Acessa uma categoria no catalogo de rooms (linguajar de ElasticSearch)
        const firabaseQuestion = await database.ref(`rooms/${roomId}/questions`).push(questionData);
    }

    return (
        <div className={styles.page_room}>
            <header>
                <div className={styles.header_content}>
                    <img src="/logo.svg" alt="Let me ask" />
                    <RoomCode code={roomId as string} />
                </div>
            </header>

            <main>
                <div className={styles.room_title}>
                    <h1>Sala {title}</h1>
                    {/* {
                        questions.length > 0 && <span>{question.length} perguntas</span>
                    } */}
                </div>
                <form onSubmit={handleNewQuestionSubmit}>
                    <textarea
                        placeholder='O que quer perguntar?'
                        onChange={e => setQuestion(e.target.value)}
                        value={question}
                    />
                    <div className={styles.form_footer}>
                        {user ?
                            <div className={styles.user_info}>
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                            :
                            <span>Para enviar uma pergunta, <button>faça login</button>.</span>
                        }
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

            </main>
        </div>
    )
}