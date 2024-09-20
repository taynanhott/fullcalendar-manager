import { Navigate } from "react-router-dom";
import axiosClient from "@/axios-client";
import { useStateContext } from "@/context/ContextProvider";
import { MenuSide, MenuTop } from "./menu";
import { Button } from "./button";

export default function Header() {
    const { user, token, setUser, setToken, notification } = useStateContext();

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (!token) {
        return <Navigate to="/login" />;
    }

    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };

    return (
        <header className="flex justify-between w-full items-center px-8 py-2 bg-sigesis">
            {width < 480 ? <MenuSide /> : <MenuTop />}
            <div>
                {user.name} &nbsp; &nbsp;
                <Button className="hover:bg-green-900 text-white font-bold" onClick={onLogout} aria-label="Logout">Logout</Button>
            </div>
        </header>
    );
}
