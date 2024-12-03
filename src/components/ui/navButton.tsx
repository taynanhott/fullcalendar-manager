import { motion } from "framer-motion";
import { Button } from "./button";
import { CalendarDays, CalendarRange, Clock, List } from "lucide-react";

interface Props {
    handleChangeView: (view: "listWeek" | "dayGridWeek" | "dayGridMonth" | "timeGridWeek") => void
}

export default function NavButton({ handleChangeView }: Props) {
    return (
        <div className="flex justify-center lg:space-x-4 mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                viewport={{ once: true }}
            >
                <Button variant="ghost" onClick={async () => { handleChangeView('listWeek') }} className="flex justify-start">
                    <List className="lg:mr-2 h-4 w-4" />
                    <p className="hidden lg:flex">Manage List</p>
                    <p className="flex lg:hidden">List</p>
                </Button>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
            >
                <Button variant="ghost" onClick={async () => { handleChangeView('dayGridMonth') }} className="flex justify-start">
                    <CalendarDays className="lg:mr-2 h-4 w-4" />
                    <p className="hidden lg:flex">Manage Month</p>
                    <p className="flex lg:hidden">Month</p>
                </Button>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
                viewport={{ once: true }}
            >
                <Button variant="ghost" onClick={async () => { handleChangeView('dayGridWeek') }} className="flex justify-start">
                    <CalendarRange className="lg:mr-2 h-4 w-4" />
                    <p className="hidden lg:flex">Manage Week</p>
                    <p className="flex lg:hidden">Week</p>
                </Button>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
            >
                <Button variant="ghost" onClick={async () => { handleChangeView('timeGridWeek') }} className="flex justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    <p className="hidden lg:flex">Manage Time</p>
                    <p className="flex lg:hidden">Time</p>
                </Button>
            </motion.div>
        </div>
    )
}