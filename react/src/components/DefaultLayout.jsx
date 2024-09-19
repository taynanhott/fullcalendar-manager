import { Outlet } from "react-router-dom";
import React from "react";
import Header from "./ui/header";
import { useStateContext } from "@/context/ContextProvider";

export default function DefaultLayout() {
  const { notification } = useStateContext(); // Use context to get notification

  return (
    <>
      <Header />
      <div id="defaultLayout">
        <div className="content">
          <main>
            <Outlet />
          </main>
          {notification && <div className="notification">{notification}</div>}
        </div>
      </div>
      </>
  );
}