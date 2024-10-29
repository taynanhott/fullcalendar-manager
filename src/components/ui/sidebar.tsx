'use client'

import * as React from 'react'
import { Home, Menu, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface Props {
  className?: string
}

export default function Sidebar({ className }: Props) {
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
            <div className="grid gap-4 py-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setOpen(false)}>
                Item 1
              </Button>

              <Button onClick={handleChangeView}>Gerenciar Lista</Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setOpen(false)}>
                Item 2
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setOpen(false)}>
                Item 3
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Button variant="ghost" size="icon" aria-label="Home" className="lg:hidden">
          <Home className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="User">
          <User className="h-6 w-6" />
        </Button>
      </nav>
    </div>
  )
}