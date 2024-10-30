import { useRef, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Switch } from "./switch";
import { Button } from "./button";
import Alert from "./alert";

interface Props {
    id: number;
    handleEventCreate: (title: string, start: string, end: string, allDay: boolean, repeats: number) => void;
}

export default function FormEvent({ handleEventCreate, id }: Props) {
    const repeatRef = useRef<HTMLInputElement>(null);
    const [isAllDay, setIsAllDay] = useState(false);
    const [isRepetitive, setIsRepetitive] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    function formatDateTime(time: string) {
        return time && time.trim() !== '' ? `T${time}-03:00` : '';
    }

    const showWarning = () => {
        setIsOpen(true);
        setTimeout(() => {
            setIsOpen(false);
        }, 3000)
    }

    const validateForm = (title: string, start: string, end: string, allDay: boolean, repeats: number) => {
        if (!title || title.trim() === '') {
            showWarning();
            return false;
        }

        if (!allDay) {
            if (!start || start.trim() === '') {
                showWarning();
                return false;
            }
            if (!end || end.trim() === '') {
                showWarning();
                return false;
            }
        }

        handleEventCreate(title, start, end, allDay, repeats);
    }

    return (
        <>
            <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const title = (document.querySelector('#title') as HTMLInputElement).value;
                const start = formatDateTime(startTime);
                const end = formatDateTime(endTime);
                const repeats = repeatRef.current ? +repeatRef.current.value : 1;

                validateForm(title, start, end, isAllDay, repeats)
            }}>
                <div className="space-y-2 text-start">
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" type="text" placeholder="Insert a event title" />
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="all-day"
                        checked={isAllDay}
                        onCheckedChange={setIsAllDay}
                    />
                    <Label htmlFor="all-day">Event during all-day</Label>
                </div>

                {!isAllDay && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 text-start">
                            <Label htmlFor="start-time" className="">Start hour</Label>
                            <Input id="start-time" type="time" onChange={(e) => setStartTime(e.target.value)} />
                        </div>
                        <div className="space-y-2 text-start">
                            <Label htmlFor="end-time">Ending time</Label>
                            <Input id="end-time" type="time" onChange={(e) => setEndTime(e.target.value)} />
                        </div>
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    <Switch
                        id="repetitive"
                        checked={isRepetitive}
                        onCheckedChange={setIsRepetitive}
                    />
                    <Label htmlFor="repetitive">Repeat event</Label>
                </div>

                {isRepetitive && (
                    <div className="space-y-2">
                        <Label htmlFor="repeat-count">Number repeats</Label>
                        <Input
                            id="repeat-count"
                            type="number"
                            min="1"
                            placeholder="How much repeat this event?"
                            defaultValue={1}
                            ref={repeatRef}
                        />
                    </div>
                )}

                <Button type="submit" className="w-full bg-[#2c3e50]">
                    {id > 0 ? "Update the event" : "Create a new event"}
                </Button>
            </form>
            <Alert isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    )
}