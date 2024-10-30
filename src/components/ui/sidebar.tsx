'use client'

import * as React from 'react'
import { Home, Menu, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface Props {
  className?: string,
  handleChangeView: (view: "listWeek" | "dayGridWeek" | "dayGridMonth") => void
}

export default function Sidebar({ className, handleChangeView }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={`${className} fixed bottom-0 lg:bottom-auto top-auto lg:top-0 left-0 right-0 z-30`}>
      <nav className="flex items-center justify-around lg:justify-between bg-background p-4 shadow-md">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="grid gap-4 py-4 text-left">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" onClick={async () => { handleChangeView('dayGridWeek'); setOpen(false); }}>Manage Week</Button>
              <Button variant="ghost" onClick={async () => { handleChangeView('dayGridMonth'); setOpen(false); }}>Manage Month</Button>
              <Button variant="ghost" onClick={async () => { handleChangeView('listWeek'); setOpen(false); }}>Manage List</Button>
            </div>
          </SheetContent>
        </Sheet>
        <Button variant="ghost" size="icon" aria-label="Home" className="lg:hidden" onClick={() => handleChangeView('dayGridMonth')}>
          <Home className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="User">
          <User className="h-6 w-6" />
        </Button>
      </nav>
    </div>
  )
}