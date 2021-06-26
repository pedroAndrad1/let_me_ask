import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import Button from "../../../components/Button";
import RoomCode from '../../../components/RoomCode';
import { useUserContext } from "../../../contexts/UserContext";
import { useRoom } from "../../../hooks/useRoom";
import { database } from "../../../services/firebase";
import styles from "../../../styles/room.module.scss";
import Question from '../../../components/Question';
import Head from 'next/head'

type FirabaseQuestion = Record<string, {
    author: {
        name: string,
        avatar: string
    }
    content: string,
    isHighlighted: boolean,
    isAnswered: boolean,
}>

interface Question {
    id: string,
    author: {
        name: string,
        avatar: string
    }
    content: string,
    isHighlighted: boolean,
    isAnswered: boolean,
}


export default function Room({ title_prop, questions_prop }) {

    const router = useRouter();
    const { roomId } = router.query;
    const { user } = useUserContext();
    const { title, questions } = useRoom(roomId as string, title_prop, questions_prop);


    const handleCloseRoom = async () => {
        await database.ref(`rooms/${roomId}`).update({
            closedAt: new Date()
        })

        router.push('/')
    }

    const handleDeleteQuestion = async (questionId: string) => {
        if (window.confirm('Tem certeza que deseja remover essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    const handleCheckQuestionAnswered = async (questionId: string) => {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        });
    }

    const handleHighlightQuestion = async (questionId: string) => {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });
    }

    const moveToStandardVision = () => {
        router.push(`/rooms/${roomId}`)
    }

    const moveToHome = () => {
        router.push(`/`)
    }
    return (
        <div className={styles.page_room}>
            <Head>
                <title>Let me ask | Admin</title>
            </Head>
            <header>
                <div className={styles.header_content}>
                    <img src="/logo.svg" alt="Let me ask" />
                    <div>
                        <RoomCode code={roomId as string} />
                        <Button onClick={moveToStandardVision}> Visão padrão</Button>
                        <Button onClick={moveToHome}>Sair da sala</Button>
                        <Button isOutlined onClick={handleCloseRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className={styles.room_title}>
                    <h1>Sala {title}</h1>
                    {/* {
                        questions.length > 0 && <span>{question.length} perguntas</span>
                    } */}
                </div>
                <div className={styles.question_list}>
                    {
                        questions.length == 0 ?
                        <div className={styles.no_questions}>
                            <img src="/empty-questions.svg" alt="Não há perguntas ainda" />
                            <p>Nenhuma pergunta por aqui...</p>
                            <span>Faça seu login e seja a primeira pessoa a fazer uma pergunta!</span>
                        </div>
                        :
                        questions.map((question) =>
                            <Question
                                key={question.id}
                                author={question.author}
                                content={question.content}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered &&
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAnswered(question.id)}
                                        >
                                            <img src="/check.svg" alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src="/answer.svg" alt="Destacar pergunta" />
                                        </button>
                                    </>
                                }
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src="/delete.svg" alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    }
                </div>

            </main>
        </div>
    )
}

//Pega as questions e o nome da sala antes de carregar a pagina.
//Assim evita um flash na pagina
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { roomId } = context.params;
    let title_prop = null;
    let questions_prop = null;

    const roomRef = database.ref(`rooms/${roomId}`);
    //escuta o evento, uma vez, de carregar os values da room
    await roomRef.once('value', async room => {
        //Pegando as questions
        const databaseRoom = await room.val();
        //Tem chance de nao ter pergunta
        const firabaseQuestion: FirabaseQuestion = databaseRoom.questions ?? {};
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

        title_prop = databaseRoom.title;
        questions_prop = parsedQuestions;
    })

    return {
        props: {
            title_prop,
            questions_prop
        }
    }
}