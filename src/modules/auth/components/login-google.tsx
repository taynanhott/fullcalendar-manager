"use client";

import { GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { useUser } from "@/app/context/userContext";
import { useState } from "react";
import Loading from "@/components/ui/loading";

interface LoginGoogleFormProps {
    loginGoogle: (
        uid: string,
        name: string,
        email: string
    ) => Promise<boolean | void>;
}

interface UserProps {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
}

export default function LoginGoogleForm({ loginGoogle }: LoginGoogleFormProps) {
    const [loading, setLoading] = useState(false);
    const { handleSetUser } = useUser();

    async function signInWithGoogle() {
        setLoading(true);
        const provider = new GoogleAuthProvider();

        try {
            const result: UserCredential = await signInWithPopup(auth, provider);

            if (result) {
                const userInfo: UserProps = {
                    uid: result.user.uid,
                    displayName: result.user.displayName ?? '',
                    email: result.user.email ?? '',
                    photoURL: result.user.photoURL ?? '',
                };
                if (typeof window !== 'undefined') {
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                }
                handleSetUser(userInfo);
                await loginGoogle(
                    result.user.uid,
                    result.user.displayName || '',
                    result.user.email || ''
                ).then((response) => {
                    setLoading(false);
                    if (response === undefined) {
                        console.error('Error');
                    }
                });
            }
        } catch (error) {
            setLoading(false);
            console.error("failed to sign in with Google account:", error);
        }
    }

    return (
        <div className="w-full">
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-96 h-full rounded-full bg-gray-100" />
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-96 h-full rounded-full bg-gray-100" />
            <div className="border border-gray-300 shadow-lg w-96 h-80 p-6 mx-auto backdrop-blur-sm rounded-[80px] flex flex-col items-center justify-center relative z-10">
                <div className="text-center">
                    <span className="mx-auto mb-4 loader-logo"></span>
                    <div className="text-3xl font-bold mb-10">FullCalendar Project</div>
                    <div className="mb-4">Sign in to access your calendar</div>
                </div>
                <Button className="w-44" variant="outline" onClick={signInWithGoogle}>
                    <ChromeIcon className="mr-2 h-5 w-5" />
                    Sign in with Google
                </Button>
            </div>
            <Loading active={loading} />
        </div>
    );
}

function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" x2="12" y1="8" y2="8" />
            <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
            <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
        </svg>
    );
}
