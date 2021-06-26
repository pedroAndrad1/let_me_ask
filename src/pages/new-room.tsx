import Head from 'next/head'
import styles_reaproveitado from '../styles/login.module.scss'
import Button from '../components/Button';
import styles from '../styles/new-room.module.scss'
import Link from 'next/link';
import {FormEvent, useState} from 'react';
import { database } from '../services/firebase';
import { useUserContext } from '../contexts/UserContext';
import { useRouter } from "next/router";

export default function NewRoom() {

    const [roomName, setRoomName] = useState('');
    const {user} = useUserContext();
    const router = useRouter();

    const handleNewRoomSubmit = async (event:FormEvent) => {
        event.preventDefault();
        //checando se foi escrito algo. Se tirar os espaços e nao tiver nada, entao nada escrito
        if(roomName.trim() === '') {
            return;
        }
        //Criando uma ref a uma categoria no firebase(RealTime - NoSQL). 
        //Nessa categoria serao colocadas as salas com o id do autor e nome
        const roomsRef = database.ref('rooms');
        //Colocando a nova sala na categoria
        const fireBaseRoom = await roomsRef.push({
            title: roomName,
            authorId: user?.id 
        })

        router.push(`rooms/admin/${fireBaseRoom.key}`)

    }

    return (
        <div className={`${styles_reaproveitado.authContainer} ${styles.new_room}`}>
            <aside>
                <img src="/illustration.svg" alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta</strong>
                <p>Aprenda e compartilhe o conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className={styles_reaproveitado.mainContent}>
                    <img src='/logo.svg' alt="Logo da Let me Ask" />
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleNewRoomSubmit}>
                        <input
                            type="text"
                            placeholder='Digite o nome da sala'
                            onChange={e => setRoomName(e.target.value)}
                            value={roomName}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala já existente? <Link href="/login">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}
