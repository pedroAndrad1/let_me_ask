import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { FormEvent, useState, useEffect } from "react";
import Button from "../../components/Button";
import RoomCode from '../../components/RoomCode';
import { useUserContext } from "../../contexts/UserContext";
import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";
import styles from "../../styles/room.module.scss"
import QuestionStyles from '../../components/Question/index.module.scss';
import Question from './../../components/Question';

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
    const [question, setQuestion] = useState('');
    const { user } = useUserContext();
    const { title, questions } = useRoom(roomId as string, title_prop, questions_prop);



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

    const handleNewLike = async (questionId: string, likeId: string | undefined) => {
        //Se o user ja tiver dado like, vai ter um id no like e, se ja deu like,
        //essa e uma situacao de tirar o like
        if (likeId) {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).remove()
        }
        else {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id
            })
        }
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

                <div className={styles.question_list}>
                    {
                        questions.map((question) =>
                            <Question
                                key={question.id}
                                author={question.author}
                                content={question.content}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                <button
                                    type="button"
                                    aria-aria-label='Marcar como gostei.'
                                    className=
                                    {
                                        `${QuestionStyles.like_button} ${question.likeId && QuestionStyles.liked}`
                                    }
                                    onClick={() => { handleNewLike(question.id, question.likeId) }}
                                >
                                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                    {/**Para mudar a cor de um svg, é preciso colocar a tag dele aqui
                                      * em vez de so colocar o src dele. A cor fica no atributo stroke ou fill.
                                      * Info muito util pro TCC.
                                      */}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
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