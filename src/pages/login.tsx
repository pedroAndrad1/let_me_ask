import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/login.module.scss'
import Button from '../components/Button';
import { useRouter } from 'next/router'
import { UserContext, useUserContext } from '../contexts/UserContext';
import { useContext } from 'react';


export default function Login() {

    const router = useRouter();
    const { user, signInWithGoogle } = useUserContext();

    const handleCreateNewRoom = async () => {
        if (!user) {
           await signInWithGoogle()
        }
        //Se der erro no signIn, ele vai lançar uma exception e não vai chegar aqui 
        router.push('/new-room');
    }

    return (
        <div className={styles.authContainer}>
            <aside>
                <img src="/illustration.svg" alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta</strong>
                <p>Aprenda e compartilhe o conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className={styles.mainContent}>
                    <h2>{user?.name}</h2>
                    <img src='/logo.svg' alt="Logo da Let me Ask" />
                    <button className={styles.createRoom} onClick={handleCreateNewRoom}>
                        <img src='/google-icon.svg' alt="Logo da Google" />
                        Crie sua sala com o Google
                    </button>
                    <span>Ou entre em uma sala</span>
                    <form>
                        <input
                            type="text"
                            placeholder='Digite o código da sala'
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
