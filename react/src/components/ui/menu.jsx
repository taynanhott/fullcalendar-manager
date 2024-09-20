import React, { useEffect, useState } from "react";
import axiosClient from "@/axios-client";
import { Link } from "react-router-dom";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { Menu } from "lucide-react";
import { Button } from "./button";

export function MenuSide() {
    const [routes, setRoutes] = useState([]);
    const [subRoutes, setSubRoutes] = useState([]);

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
        <Sheet key="left">
            <SheetTrigger>
                <Button className="border-none" variant="outline" size="icon" aria-label="Abrir menu">
                    <Menu className="text-white" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-emerald-800 bor">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription>
                        <Accordion type="single" collapsible>
                            {routes.map((element, index) => (
                                <AccordionItem value={`route-${index}`}>
                                    <AccordionTrigger className="text-lg">{`${element.name}`}</AccordionTrigger>
                                    {subRoutes
                                        .filter((subElement) => subElement.route_id === element.id)
                                        .map((subRoute) => (
                                            <AccordionContent>
                                                <Link className="text-white hover:text-emerald-300" to={subRoute.route}>{subRoute.name}</Link>
                                            </AccordionContent>
                                        ))
                                    }
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}

export function MenuTop() {
    const [routes, setRoutes] = useState([]);
    const [subRoutes, setSubRoutes] = useState([]);

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
        <Menubar>
            {routes.map((element, index) => (
                <MenubarMenu key={`route-${index}`} >
                    <MenubarTrigger>{element.name}</MenubarTrigger>
                    <MenubarContent>
                        {subRoutes
                            .filter((subElement) => subElement.route_id === element.id)
                            .map((subRoute) => (
                                <>
                                    <MenubarItem asChild>
                                        <Link className="text-white hover:text-emerald-300" to={subRoute.route}>{subRoute.name}</Link>
                                    </MenubarItem>
                                </>
                            ))
                        }
                    </MenubarContent>
                </MenubarMenu>
            ))}
        </Menubar>
    );
}