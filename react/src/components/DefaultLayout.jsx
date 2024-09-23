import { Outlet } from "react-router-dom";
import React from "react";
import Header from "./ui/header";
import { useStateContext } from "@/context/ContextProvider";

export default function DefaultLayout() {
  const { notification } = useStateContext(); // Use context to get notification

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-100 px-8 py-4">
        <main className="flex-grow">
          <Outlet />
        </main>
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
}