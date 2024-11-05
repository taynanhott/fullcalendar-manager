import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Switch } from "./switch";
import { Button } from "./button";
import Alert from "./alert";
import { DateSelectArg, EventApi } from "fullcalendar/index.js";
import ColorSelector from "./color";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import moment from "moment";

interface Props {
    event?: EventApi | null;
    handleEventCreate?: (title: string, start: string, end: string, allDay: boolean, color: string, repeat: number, typeRepeat: string) => void;
    handleEventEdit?: (event: EventApi, title: string, start: string, end: string, allDay: boolean, color: string) => void;
    selectedEventInfo?: DateSelectArg | null
}

export default function FormEvent({ handleEventCreate, handleEventEdit, selectedEventInfo, event }: Props) {
    const [isAllDay, setIsAllDay] = useState(false);
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState('#3788d8');
    const [oneDay] = useState(moment(selectedEventInfo?.end).diff(moment(selectedEventInfo?.start), 'days'));
    const [repeat, setRepeat] = useState(1);
    const [useRepeat, setUseRepeat] = useState(false);
    const [typeRepeat, setTypeRepeat] = useState('day');

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

    const validateForm = (title: string, start: string, end: string, allDay: boolean, color: string, repeat: number, typeRepeat: string) => {
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
            handleEventEdit(event, title, start, end, allDay, color);
        } else if (handleEventCreate) {
            handleEventCreate(title, start, end, allDay, color, repeat, typeRepeat);
        }
    };

    return (
        <>
            <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const start = formatDateTime(startTime);
                const end = formatDateTime(endTime);

                validateForm(title, start, end, isAllDay, color, repeat, typeRepeat);
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
                {(!event && oneDay == 1) && (
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="all-day"
                            checked={useRepeat}
                            onCheckedChange={setUseRepeat}
                        />
                        <Label htmlFor="all-day">Recurring Event</Label>
                    </div>)
                }

                {useRepeat && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 text-start">
                            <Label htmlFor="start-time">Repeats</Label>
                            <Input
                                id="repeat"
                                type="number"
                                min="1"
                                value={repeat}
                                onChange={(e) => setRepeat(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2 text-start">
                            <Label htmlFor="type-repeat">Type of Repetition</Label>
                            <RadioGroup defaultValue="day" onChange={(e: ChangeEvent<HTMLInputElement>) => setTypeRepeat(e.target.value)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="day" id="r1" />
                                    <Label htmlFor="r1">Day</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="week" id="r2" />
                                    <Label htmlFor="r2">Week</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                )}

                <Button type="submit" className="w-full bg-[#2c3e50]">
                    {event ? "Update the event" : "Create a new event"}
                </Button>
            </form >
            <Alert isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
}
