"use client";

import { GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/app/context/userContext";

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
    const { handleSetUser } = useUser();

    async function signInWithGoogle() {
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
                    if (response === undefined) {
                        console.error('Error');
                    }
                });
            }
        } catch (error) {
            console.error("failed to sign in with Google account:", error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Full Calendar Project</CardTitle>
                    <CardDescription>Sign in to access your calendar</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" variant="outline" onClick={signInWithGoogle}>
                        <ChromeIcon className="mr-2 h-5 w-5" />
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
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
