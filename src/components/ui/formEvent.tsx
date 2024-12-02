import { useEffect, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Switch } from "./switch";
import { Button } from "./button";
import Alert from "./alert";
import { DateSelectArg, EventApi } from "fullcalendar/index.js";
import ColorSelector from "./color";
import moment from "moment";
import WeekDaySelector from "./selectDays";

interface Props {
    handleEventCreate?: ((title: string, start: string, end: string, allDay: boolean, finish: boolean, color: string, repeat: number, typeRepeat: string, daysWeek: number[]) => void) | undefined
    handleEventEdit?: (event: EventApi, title: string, start: string, end: string, allDay: boolean, finish: boolean, color: string) => void;
    selectedEventInfo?: DateSelectArg | null;
    event?: EventApi | null;
}

export default function FormEvent({ handleEventCreate, handleEventEdit, selectedEventInfo, event }: Props) {
    const [title, setTitle] = useState('');
    const [repeat, setRepeat] = useState(1);
    const [endTime, setEndTime] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [finish, setFinish] = useState(false);
    const [color, setColor] = useState('#3788d8');
    const [startTime, setStartTime] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [useRepeat, setUseRepeat] = useState(false);
    const [typeRepeat, setTypeRepeat] = useState('week');
    const [daysWeek, setDaysWeek] = useState<number[]>([]);
    const [oneDay] = useState(moment(selectedEventInfo?.end).diff(moment(selectedEventInfo?.start), 'days'));

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
            setFinish(event.extendedProps.finish);
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

    const validateForm = (title: string, start: string, end: string, allDay: boolean, finish: boolean, color: string, repeat: number, typeRepeat: string, daysWeek: number[]) => {
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
            handleEventEdit(event, title, start, end, allDay, finish, color);
        } else if (handleEventCreate) {
            handleEventCreate(title, start, end, allDay, finish, color, repeat, typeRepeat, daysWeek);
        }
    };

    return (
        <>
            <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const start = formatDateTime(startTime);
                const end = formatDateTime(endTime);

                validateForm(title, start, end, isAllDay, finish, color, repeat, typeRepeat, daysWeek);
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
                    <Label htmlFor="all-day">Event during all-day</Label>
                    <Switch
                        id="all-day"
                        checked={isAllDay}
                        onCheckedChange={setIsAllDay}
                    />
                </div>

                {!isAllDay ? (
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
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="all-day">Finished</Label>
                            <Switch
                                id="finish"
                                checked={finish}
                                onCheckedChange={setFinish}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="repeat-count">Select an color</Label>
                        <ColorSelector
                            value={color}
                            onChange={setColor}
                        />
                    </div>
                )}

                {(!event && oneDay == 1) ? (
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="all-day">Recurring Event</Label>
                        <Switch
                            id="all-day"
                            checked={useRepeat}
                            onCheckedChange={setUseRepeat}
                        />
                    </div>) : !event &&
                <WeekDaySelector daysWeek={daysWeek} setDaysWeek={setDaysWeek} className="col-span-2" selectedEventInfo={selectedEventInfo} />
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
                            <Label htmlFor="type-repeat">Type</Label>
                            <select defaultValue="week" className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center space-x-2 h-10 rounded-md border border-input bg-background text-smrounded-md px-3 py-2 w-full" onChange={(e) => setTypeRepeat(e.target.value)}>
                                <option value="day">day</option>
                                <option value="week">week</option>
                            </select>
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
