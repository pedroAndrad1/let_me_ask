import styles from './index.module.scss';

interface RoomCodeProps {
    code: string;
}

export default function RoomCode({ code }: RoomCodeProps) {

    const copyCodeToClipboard = () => {
        navigator.clipboard.writeText(code);
    }


    return (
        <button className={styles.room_code} onClick={copyCodeToClipboard}>
            <div>
                <img src="/copy.svg" alt="Copiar código" />
            </div>
            <span>Sala {code}</span>
        </button>
    )
}