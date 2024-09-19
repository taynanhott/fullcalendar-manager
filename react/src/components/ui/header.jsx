import { Link, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./sheet";
import axiosClient from "@/axios-client";
import { useStateContext } from "@/context/ContextProvider";

export default function Header() {
    const { user, token, setUser, setToken, notification } = useStateContext();
    const [routes, setRoutes] = useState([]);
    const [subRoutes, setSubRoutes] = useState([]);

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

    useEffect(() => {
        Promise.all([
            axiosClient.get("/routes"),
            axiosClient.get("/subroutes"),
            axiosClient.get("/users"),
        ]).then(([routesRes, subRoutesRes, usersRes]) => {
            setRoutes(routesRes.data);
            setSubRoutes(subRoutesRes.data);
            setUser(usersRes.data);
        });
    }, []);

    return (
        <header className="flex justify-between items-center px-8 pt-4">
            <Sheet key="left">
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent side="left" className="bg-emerald-800">
                    <SheetHeader>
                        <SheetTitle></SheetTitle>
                        <SheetDescription>
                            <aside>
                                {routes.map((element, index) => (
                                    <React.Fragment key={`route-${index}`}>
                                        <ul className="mt-4">
                                            <Link className="text-white text-lg font-bold hover:text-emerald-300" to={`${element.route}`}>{`${element.name}`}</Link>
                                            {subRoutes
                                                .filter((subElement) => subElement.route_id === element.id)
                                                .map((subRoute) => (
                                                    <li className="mt-2" key={`subroute-${subRoute.id}`}>
                                                        <Link className="text-white hover:text-emerald-300" to={`${subRoute.route}`}>{subRoute.name}</Link>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </React.Fragment>
                                ))}
                            </aside>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

            <div>
                {user.name} &nbsp; &nbsp;
                <a onClick={onLogout} className="btn-logout" href="#">
                    Logout
                </a>
            </div>
        </header>
    );
}
