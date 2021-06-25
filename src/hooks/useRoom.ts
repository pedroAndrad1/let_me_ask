import { useEffect, useState } from "react";
import { database } from "../services/firebase";

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

export function useRoom(roomId: string, title_initial?: string, questions_initial?: Question[] ){
    const [questions, setQuestions] = useState<Question[]>(questions_initial? questions_initial : null)
    const [title, setTitle] = useState(title_initial? title_initial : '');

    //Carrega as questions quando houver alguma mudança no id sala
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);
        //escuta o evento, sempre que ouver mudanca, de carregar os values da room
        roomRef.on('value', async room => {
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
            setTitle(databaseRoom?.title);
            setQuestions(parsedQuestions);
        })

        //Parando de ouvir os eventos ao fim do component
        return () =>{
            roomRef.off();
        }

    }, [roomId])

    return{
        title,
        questions
    }
}