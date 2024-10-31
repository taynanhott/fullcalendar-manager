import { redirect } from "next/navigation";
import AuthService from "../services/auth-services";

async function loginGoogle(uid: string, name: string, email: string) {
    "use server";

    await AuthService.createSessionToken({
        sub: uid,
        name: name,
        email: email,
    });

    return redirect("/");
}

const AuthActions = {
    loginGoogle,
};

export default AuthActions;