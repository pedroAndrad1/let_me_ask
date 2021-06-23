import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../models/UserModel";
import { auth, firebase } from '../services/firebase';

interface UserContextData {
    user: User;
    signInWithGoogle: () => Promise<void>;
}

interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContext = createContext({} as UserContextData);

export function UserContextProvider({ children }: UserContextProviderProps) {

    const [user, setUser] = useState<User>(null);

    //Checa se o user esta logado ao carregar a app
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            const { displayName, photoURL, uid } = user;

            if (!displayName || !photoURL) {
                throw new Error("Missing display name or photoUrl")
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL,
            })
        })

        //Deixande de ouvir o evento
        return () =>{
            unsubscribe();
        }
    }, [])

    const signInWithGoogle = async () => {
        const googleProvider = new firebase.auth.GoogleAuthProvider();

        const res = await auth.signInWithPopup(googleProvider)

        if (res.user) {
            const { displayName, photoURL, uid } = res.user;

            if (!displayName || !photoURL) {
                throw new Error("Missing display name or photoUrl")
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL,
            })
        }

    }

    return (
        <UserContext.Provider value={{
            user,
            signInWithGoogle
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => {
    return useContext(UserContext);
}