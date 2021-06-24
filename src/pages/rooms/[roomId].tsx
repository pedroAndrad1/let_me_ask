import { useRouter } from "next/router";
import React from "react";
import Button from "../../components/Button";
import RoomCode from '../../components/RoomCode';
import styles from "../../styles/room.module.scss"


export default function Room(){

    const router = useRouter();
    const {roomId} = router.query;

    return (
        <div className={styles.page_room}>
            <header>
                <div className= {styles.header_content}>
                    <img src="/logo.svg" alt="Let me ask" />
                    <RoomCode code={roomId as string} />
                </div>
            </header>

            <main>
                <div className={styles.room_title}>
                    <h1>Sala Nome</h1>
                    <span>N perguntas</span>
                </div>

                <form>
                    <textarea 
                        placeholder='O que quer perguntar?'
                    />

                    <div className={styles.form_footer}>
                        <span>Para enviar uma pergunta, <button>faça login</button>.</span>
                        <Button type="submit">Enviar pergunta</Button>
                    </div>
                </form>

            </main>
        </div>
    )
}