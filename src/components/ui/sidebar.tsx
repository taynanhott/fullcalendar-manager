"use client"

import { useState } from "react";
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Icon } from './icon'
import { Home, Settings, HelpCircle, LogOut, Menu, User, List, CalendarDays, CalendarRange } from 'lucide-react'
import Link from 'next/link'
import { useUser } from "@/app/context/userContext";

interface Props {
  className?: string,
  handleChangeView: (view: "listWeek" | "dayGridWeek" | "dayGridMonth") => void
}

export default function Sidebar({ className, handleChangeView }: Props) {
  const { user } = useUser();
  const [open, setOpen] = useState(false)
  const [openAccount, setOpenAccount] = useState(false)

  return (
    <div className={`${className} fixed bottom-0 lg:bottom-auto top-auto lg:top-0 left-0 right-0 z-30`}>
      <nav className="flex items-center justify-around lg:justify-between bg-background p-4 shadow-md">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu" className="rounded-full">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="pt-8 text-left">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>
              <Button variant="ghost" onClick={async () => { handleChangeView('dayGridWeek'); setOpen(false); }}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Manage Week
              </Button>
              <Button variant="ghost" onClick={async () => { handleChangeView('dayGridMonth'); setOpen(false); }} className="text-lg">
                <CalendarRange className="mr-2 h-4 w-4" />
                Manage Month
              </Button>
              <Button variant="ghost" onClick={async () => { handleChangeView('listWeek'); setOpen(false); }} className="text-lg">
                <List className="mr-2 h-4 w-4" />Manage List
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Button variant="ghost" size="icon" aria-label="Home" className="lg:hidden rounded-full" onClick={() => handleChangeView('dayGridMonth')}>
          <Home className="h-6 w-6" />
        </Button>
        <Sheet open={openAccount} onOpenChange={setOpenAccount}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Icon source={user ? user.photoURL : ''} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col h-full">
              <div className="flex items-center space-x-4">
                <Icon source={user ? user.photoURL : ''} />
                <div>
                  <h2 className="font-semibold">{user ? user.displayName : 'User actions'}</h2>
                  <p className="text-sm text-gray-500">{user ? user.email : ''}</p>
                </div>
              </div>

              <div className="pt-8 text-left">
                <Button variant="ghost" className="block">
                  <a href="#" className="flex items-center space-x-2 hover:bg-gray-100 rounded p-2 text-lg">
                    <User className="h-5 w-5" />
                    <span>My Profile</span>
                  </a>
                </Button>
                <Button variant="ghost" className="block">
                  <a href="#" className="flex items-center space-x-2 hover:bg-gray-100 rounded p-2 text-lg">
                    <Settings className="h-5 w-5" />
                    <span>Configs</span>
                  </a>
                </Button>
                <Button variant="ghost" className="block">
                  <a href="#" className="flex items-center space-x-2 hover:bg-gray-100 rounded p-2 text-lg">
                    <HelpCircle className="h-5 w-5" />
                    <span>Help</span>
                  </a>
                </Button>
              </div>

              <Button
                onClick={() => setOpenAccount(false)}
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
    </div>
  )
}
