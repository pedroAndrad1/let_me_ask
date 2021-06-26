import { useTheme } from "next-themes";
import { HTMLAttributes, useEffect, useState, } from "react";
import styles from './toogle_theme.module.scss';

export default function ToogleTheme(props: HTMLAttributes<HTMLDivElement>) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    console.log('Tema', theme);

    // Como nao da pra saber o tema no server, e preciso garantir que o cliente esteja montado
    // com a info theme para poder mostrar a UI.
    // Fonte: https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div {...props} >
            <div className={styles.container}>
                {
                    theme == 'dark' ?
                        <img onClick={() => setTheme('light')} src='/light-mode.png'
                            alt='Tema claro' className={styles.themeIcon} />
                        :
                        <img onClick={() => setTheme('dark')} src='/night-mode.png'
                            alt='Tema escuro' className={styles.themeIcon} />
                }
            </div>
        </div>
    )
}