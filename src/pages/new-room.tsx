import styles from '../styles/login.module.scss'
import Button from '../components/Button';

export default function NewRoom() {
    return (
        <div className={styles.authContainer}>
            <aside>
                <img src="/illustration.svg" alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta</strong>
                <p>Aprenda e compartilhe o conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className={styles.mainContent}>
                    <img src='/logo.svg' alt="Logo da Let me Ask" />
                    <form>
                        <input
                            type="text"
                            placeholder='Digite o código da sala'
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala já existente?<a href="#">Clique aqui</a></p>
                </div>
            </main>
        </div>
    )
}
