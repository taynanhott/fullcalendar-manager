"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";

interface User {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
}

interface UserContextType {
    user: User;
    handleSetUser: (user: { uid: string; displayName: string; email: string; photoURL: string; }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(() => {
        let savedUser;
        if (typeof window !== 'undefined') {
            savedUser = localStorage.getItem('userInfo');
        }
        return savedUser ? JSON.parse(savedUser) : {
            uid: '',
            displayName: '',
            email: '',
            photoURL: '',
        };
    });

    const handleSetUser = (userData: User) => {
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{
            user,
            handleSetUser
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
