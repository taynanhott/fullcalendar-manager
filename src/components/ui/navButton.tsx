import { motion } from "framer-motion";
import { Button } from "./button";
import { CalendarDays, CalendarRange, List } from "lucide-react";

interface Props {
    handleChangeView: (view: "listWeek" | "dayGridWeek" | "dayGridMonth") => void
}

export default function NavButton({ handleChangeView }: Props) {
    return (
        <div className="flex justify-center space-x-4 mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
                viewport={{ once: true }}
            >
                <Button variant="ghost" onClick={async () => { handleChangeView('dayGridWeek') }} className="flex justify-start mb-8 lg:mb-4">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <p className="hidden lg:flex">Manage Week</p>
                </Button>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
            >
                <Button variant="ghost" onClick={async () => { handleChangeView('dayGridMonth') }} className="flex justify-start mb-8 lg:mb-4">
                    <CalendarRange className="mr-2 h-4 w-4" />
                    <p className="hidden lg:flex">Manage Month</p>
                </Button>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
            >
                <Button variant="ghost" onClick={async () => { handleChangeView('listWeek') }} className="flex justify-start">
                    <List className="mr-2 h-4 w-4" />
                    <p className="hidden lg:flex">Manage List</p>
                </Button>
            </motion.div>
        </div>
    )
}