import Head from 'next/head'
import styles_reaproveitado from '../styles/login.module.scss'
import Button from '../components/Button';
import styles from '../styles/new-room.module.scss'
import Link from 'next/link';

export default function NewRoom() {
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
                    <form>
                        <input
                            type="text"
                            placeholder='Digite o código da sala'
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
