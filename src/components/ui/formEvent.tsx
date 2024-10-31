import { useEffect, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Switch } from "./switch";
import { Button } from "./button";
import Alert from "./alert";
import { EventApi } from "fullcalendar/index.js";
import ColorSelector from "./color";

interface Props {
    event?: EventApi | null;
    handleEventCreate?: (title: string, start: string, end: string, allDay: boolean, color: string) => void;
    handleEventEdit?: (id: string, title: string, start: string, end: string, allDay: boolean, color: string) => void;
}

export default function FormEvent({ handleEventCreate, handleEventEdit, event }: Props) {
    const [isAllDay, setIsAllDay] = useState(false);
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState('#3788d8')

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            if (event.start) {
                const start = new Date(event.start);
                setStartTime(start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
            }
            if (event.end) {
                const end = new Date(event.end);
                setEndTime(end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
            }

            setIsAllDay(event.allDay);
            setColor(event.backgroundColor);
        }
    }, [event]);

    function formatDateTime(time: string) {
        return time && time.trim() !== '' ? `T${time}` : '';
    }

    const showWarning = () => {
        setIsOpen(true);
        setTimeout(() => {
            setIsOpen(false);
        }, 3000);
    };

    const validateForm = (title: string, start: string, end: string, allDay: boolean, color: string) => {
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

        if (event && handleEventEdit) {
            handleEventEdit(event.id, title, start, end, allDay, color);
        } else if (handleEventCreate) {
            handleEventCreate(title, start, end, allDay, color);
        }
    };

    return (
        <>
            <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const start = formatDateTime(startTime);
                const end = formatDateTime(endTime);

                validateForm(title, start, end, isAllDay, color);
            }}>
                <div className="space-y-2 text-start">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                        id="title"
                        type="text"
                        placeholder="Insert an event title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
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
                            <Label htmlFor="start-time">Start hour</Label>
                            <Input
                                id="start-time"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 text-start">
                            <Label htmlFor="end-time">Ending time</Label>
                            <Input
                                id="end-time"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    <Label htmlFor="repeat-count">Select an color</Label>
                    <ColorSelector
                        value={color}
                        onChange={setColor}
                    />
                </div>

                <Button type="submit" className="w-full bg-[#2c3e50]">
                    {event ? "Update the event" : "Create a new event"}
                </Button>
            </form >
            <Alert isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
}
