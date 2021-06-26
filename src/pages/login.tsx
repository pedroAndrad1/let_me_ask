import Head from 'next/head'
import styles from '../styles/login.module.scss'
import Button from '../components/Button';
import { useRouter } from 'next/router'
import { useUserContext } from '../contexts/UserContext';
import React, { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
import ToogleTheme from '../components/ToogleTheme';
import { useTheme } from 'next-themes';


export default function Login() {

    const router = useRouter();
    const { user, signInWithGoogle } = useUserContext();
    const [roomCode, setRoomCode] = useState('');

    const handleCreateNewRoom = async () => {
        if (!user) {
           await signInWithGoogle()
        }
        //Se der erro no signIn, ele vai lançar uma exception e não vai chegar aqui 
        router.push('/new-room');
    }

    const handleAcessRoom = async (event: FormEvent) => {
        event.preventDefault();
        //checando se foi escrito algo. Se tirar os espaços e nao tiver nada, entao nada escrito
        if(roomCode.trim() === '') {
            return;
        }
        //checando se existe o registro dessa sala. 
        //Referenciando a categoria rooms/ o documento com o codigo e pegando os dados
        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        //Se nao tiver vindo alguma coisa, ou seja, se a sala nao existe
        //termina aqui. Senao manda o user para a sala
        if(!roomRef.exists()){
            alert('sala nao existe');
            return;
        }

        if(roomRef.val().closedAt){
            alert('A sala já foi fechada');
            setRoomCode('');
            return;
        }

        router.push(`rooms/${roomCode}`)
    }


    return (
        <div className={styles.authContainer}>
            <Head>
                <title>Let me ask | Home</title>
            </Head>
            <aside>
                <img src="/illustration.svg" alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta</strong>
                <p>Aprenda e compartilhe o conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className={styles.mainContent}>
                    <ToogleTheme className={styles.toogle_theme}/>
                    <img src='/logo.svg' alt="Logo da Let me Ask" />
                    <button className={styles.createRoom} onClick={handleCreateNewRoom}>
                        <img src='/google-icon.svg' alt="Logo da Google" />
                        Crie sua sala com o Google
                    </button>
                    <span>Ou entre em uma sala</span>
                    <form onSubmit={handleAcessRoom}>
                        <input
                            type="text"
                            placeholder='Digite o código da sala'
                            onChange={e => setRoomCode(e.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
