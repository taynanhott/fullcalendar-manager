"use client"

import { useState } from "react";
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Icon } from './icon'
import { LogOut, Menu, List, CalendarDays, CalendarRange, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { useUser } from "@/app/context/userContext";
import Loading from "./loading";
import Image from "next/image";

interface Props {
  className?: string,
  handleChangeView: (view: "listWeek" | "dayGridWeek" | "dayGridMonth") => void
}

export default function Sidebar({ className, handleChangeView }: Props) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className={`${className} fixed bottom-0 lg:bottom-auto top-auto lg:top-0 left-0 right-0 z-30`}>
      <nav className="flex items-center justify-around lg:justify-between bg-background p-4 shadow-md">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu" className="w-[40px] h-[40px] rounded-full">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="pt-8 text-left">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>
              <Button variant="ghost" onClick={async () => { handleChangeView('dayGridWeek'); setOpen(false); }} className="w-full flex justify-start mb-8">
                <CalendarDays className="mr-2 h-4 w-4" />
                Manage Week
              </Button>
              <Button variant="ghost" onClick={async () => { handleChangeView('dayGridMonth'); setOpen(false); }} className="w-full flex justify-start mb-8">
                <CalendarRange className="mr-2 h-4 w-4" />
                Manage Month
              </Button>
              <Button variant="ghost" onClick={async () => { handleChangeView('listWeek'); setOpen(false); }} className="w-full flex justify-start">
                <List className="mr-2 h-4 w-4" />Manage List
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Button variant="ghost" size="icon" aria-label="Home" className="w-[130px] h-[40px] hidden lg:block rounded-full hover:bg-transparent" onClick={() => handleChangeView('dayGridMonth')}>
          <Image src="/image/logo.png" width={130} height={40} alt="logo" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Home" className="lg:hidden rounded-full w-[40px] h-[40px] hover:bg-transparent" onClick={() => handleChangeView('dayGridMonth')}>
          <Image src="/image/logo-ico.png" width={40} height={40} alt="logo" />
        </Button>
        <Sheet open={openAccount} onOpenChange={setOpenAccount}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Icon source={user ? user.photoURL : ''} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col h-full">
              <div className="flex items-center space-x-4 mb-6">
                <Icon source={user ? user.photoURL : ''} />
                <div>
                  <h2 className="font-semibold">{user ? user.displayName : 'User actions'}</h2>
                  <p className="text-sm text-gray-500">{user ? user.email : ''}</p>
                </div>
              </div>

              <h2 className="text-lg font-semibold mb-[-16px]">Project infos</h2>
              <div className="pt-8 space-y-4">
                <Button variant="ghost" className="w-full flex justify-start">
                  <a href="https://www.linkedin.com/in/taynan-hott/" target="_blank" className="flex items-center space-x-2 hover:bg-gray-100 rounded p-2">
                    <Linkedin className="h-5 w-5" />
                    <span>Linkedin</span>
                  </a>
                </Button>
                <Button variant="ghost" className="w-full flex justify-start">
                  <a href="https://github.com/taynanhott" target="_blank" className="flex items-center space-x-2 hover:bg-gray-100 rounded p-2">
                    <Github className="h-5 w-5" />
                    <span>Repository</span>
                  </a>
                </Button>
              </div>

              <Button
                onClick={() => { setOpenAccount(false); setLoading(true); }}
                asChild
              >
                <Link
                  href="/api/logout"
                  prefetch={false}
                  className="w-full mt-auto p-2 bg-red-500 text-white rounded flex items-center justify-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Log out</span>
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      <Loading active={loading} />
    </div>
  )
}
