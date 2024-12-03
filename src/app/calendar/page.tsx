"use client";

import moment from 'moment';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { useUser } from '../context/userContext';
import { useState, useEffect, useRef } from 'react';
import { DateSelectArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { deleteEvent, getEventsByUserId, updateEvent, writeEventData } from '@/firebase/config';

import listPlugin from '@fullcalendar/list';
import Sidebar from '@/components/ui/sidebar';
import Loading from '@/components/ui/loading';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import NavButton from '@/components/ui/navButton';
import FormEvent from '@/components/ui/formEvent';
import timeGridPlugin from '@fullcalendar/timegrid';
import ManageEventDialog from '@/components/ui/manage';

import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

let small = false;
let height = 0;

if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    const screenHeight = window.innerHeight;

    small = width < 768;

    const percent = small ? 0.83 : 0.82;

    height = Math.round(screenHeight * percent);
}

type SideOptions = 'left' | 'right' | 'bottom' | 'top';

export default function Calendar() {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const calendarRef = useRef<FullCalendar>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [events, setEvents] = useState<EventInput[]>([]);
    const [sheetSide, setSheetSide] = useState<SideOptions>('bottom');
    const [isDateSelectActive, setIsDateSelectActive] = useState(false);
    const [eventToManage, setEventToManage] = useState<EventApi | null>(null);
    const [selectedEventInfo, setSelectedEventInfo] = useState<DateSelectArg | null>(null);
    const [rangeEnd, setRangeEnd] = useState(moment().endOf('month').format("YYYY-MM-DD"));
    const [rangeStart, setRangeStart] = useState(moment().startOf('month').format("YYYY-MM-DD"));
    const monthsShort = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [date, setDate] = useState<string>(`${monthsShort[moment().month()]}, ${moment().year() - 2000}`);

    useEffect(() => {
        setSheetSide(small ? 'bottom' : 'right');
    }, []);

    useEffect(() => {
        const fetchEvents = async (rangeStart: string, rangeEnd: string) => {
            setLoading(true);
            try {
                const eventsData = await getEventsByUserId(user.uid, rangeStart, rangeEnd);
                console.log(eventsData)
                setEvents(eventsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
                setLoading(false);
            }
        };

        fetchEvents(rangeStart, rangeEnd);
    }, [user.uid, rangeStart, rangeEnd]);

    // Other functions =======================================================================
    const handleDateClick = (selectInfo: DateClickArg) => {
        if (!isDateSelectActive) {
            if (calendarRef.current) {
                calendarRef.current.getApi().changeView('dayGridDay', selectInfo.dateStr);
            }
        }
    };

    // Event add functions ===================================================================
    const handleDateSelect = (selectInfo: DateSelectArg) => {
        setSelectedEventInfo(selectInfo);
        setIsSheetOpen(true);
        setIsDateSelectActive(true);

        if (calendarRef.current && small) {
            calendarRef.current.getApi().changeView('dayGridMonth', selectInfo.startStr);
        }

        setTimeout(() => {
            setIsDateSelectActive(false);
        }, 300);
    };

    // Create -----------------------------------------------------------
    const handleEventCreate = async (
        title: string,
        start: string,
        end: string,
        allDay: boolean,
        finish: boolean,
        color: string,
        repeat: number,
        typeRepeat: string,
        daysWeek: number[]
    ) => {
        const calendarApi = selectedEventInfo?.view.calendar;
        const eventStart = selectedEventInfo?.start;
        const eventEnd = selectedEventInfo?.end;

        const durationUnit = typeRepeat as moment.unitOfTime.DurationConstructor;

        if (calendarApi && eventStart && eventEnd) {
            calendarApi.unselect();

            let count = 0;
            const daysDiff = moment(eventEnd).diff(moment(eventStart), 'days');
            const looping = allDay ? daysWeek.length === daysDiff ? 1 : daysDiff : daysDiff;
            const equal = daysWeek.length === daysDiff;
            const colorCode = !allDay ? (finish ? '#3ad737' : '#e63333') : color;

            setLoading(true);
            if (looping === 1) {
                while (count < repeat) {
                    const startDate = allDay
                        ? moment(eventStart).add(count, durationUnit).format('YYYY-MM-DD')
                        : moment(eventStart).add(count, durationUnit).format('YYYY-MM-DD') + start;
                    const endDate = allDay
                        ? moment(eventEnd).add(count, durationUnit).format('YYYY-MM-DD')
                        : moment(eventStart).add(count, durationUnit).format('YYYY-MM-DD') + end;

                    const id = (await writeEventData(title, startDate, endDate, allDay, finish, colorCode, user.uid)).key ?? '';

                    calendarApi.addEvent({
                        id,
                        title,
                        start: startDate,
                        end: endDate,
                        allDay,
                        finish,
                        backgroundColor: colorCode,
                        borderColor: colorCode,
                    });
                    count++;
                }
            } else {
                while (count < looping) {
                    let startDate = allDay ?
                        equal ? moment(eventStart).format('YYYY-MM-DD') : moment(eventStart).add(count, 'days').format('YYYY-MM-DD')
                        : moment(eventStart).add(count, 'days').format('YYYY-MM-DD') + start;
                    let endDate = allDay ?
                        equal ? moment(eventStart).format('YYYY-MM-DD') : moment(eventStart).add(count, 'days').format('YYYY-MM-DD')
                        : moment(eventStart).add(count, 'days').format('YYYY-MM-DD') + end;

                    if (moment(startDate).isAfter(moment(endDate))) {
                        [startDate, endDate] = [endDate, startDate];
                    }

                    const dayOfWeek = moment(startDate).day();

                    if (daysWeek.length === 0 || daysWeek.includes(dayOfWeek)) {
                        const id = (await writeEventData(title, startDate, endDate, allDay, finish, colorCode, user.uid)).key ?? '';

                        calendarApi.addEvent({
                            id,
                            title,
                            start: startDate,
                            end: endDate,
                            allDay,
                            finish,
                            backgroundColor: colorCode,
                            borderColor: colorCode,
                        });
                    }
                    count++;
                }
            }
            setIsSheetOpen(false);
            setLoading(false);
        }
    };

    // Edit -----------------------------------------------------------
    const handleEventEdit = (eventEdit: EventApi, title: string, start: string, end: string, allDay: boolean, finish: boolean, color: string) => {
        let formattedStart = allDay ? moment(eventEdit.startStr).format("YYYY-MM-DD") : moment(eventEdit.start).format("YYYY-MM-DD") + start;
        let formattedEnd = allDay ? moment(eventEdit.endStr).format("YYYY-MM-DD") : moment(eventEdit.start).format("YYYY-MM-DD") + end;
        const colorCode = !allDay ? (finish ? '#3ad737' : '#e63333') : color;

        if (moment(formattedStart).isAfter(moment(formattedEnd))) {
            [formattedStart, formattedEnd] = [formattedEnd, formattedStart];
        }

        setLoading(true);
        updateEvent(eventEdit.id, {
            id: eventEdit.id,
            title: title,
            start: formattedStart,
            end: formattedStart === formattedEnd ? moment(formattedEnd).add(1, 'day').format("YYYY-MM-DD") : formattedEnd,
            allDay: allDay,
            finish: finish ?? false,
            color: colorCode,
            userId: user.uid
        });

        // Update event properties after updating backend
        eventEdit.setProp("title", title);
        eventEdit.setDates(formattedStart, formattedStart === formattedEnd ? moment(formattedEnd).add(1, 'day').format("YYYY-MM-DD") : formattedEnd, { allDay: allDay });
        eventEdit.setProp("backgroundColor", colorCode);
        eventEdit.setProp("borderColor", colorCode);
        eventEdit.setExtendedProp("finish", finish);

        setIsEditOpen(false);
        setLoading(false);
    };

    // Event remove functions ==============================================================
    function handleEventClick(clickInfo: { event: EventApi }) {
        setEventToManage(clickInfo.event);
        setIsEditOpen(true);
    }

    const handleConfirmRemove = async () => {
        if (eventToManage) {
            deleteEvent(eventToManage.id);
            eventToManage.remove();
            setEventToManage(null);
            setIsEditOpen(false);
        }
    };

    const handleChangeView = (view: 'listWeek' | 'dayGridWeek' | 'dayGridMonth' | 'timeGridWeek') => {
        if (calendarRef.current) {
            calendarRef.current.getApi().changeView(view);
        }
    };

    const handleResizeEventEdit = (eventEdit: EventApi) => {
        setLoading(true);
        updateEvent(eventEdit.id, {
            id: eventEdit.id,
            title: eventEdit.title,
            start: eventEdit.startStr,
            end: eventEdit.endStr,
            allDay: eventEdit.allDay,
            finish: eventEdit.extendedProps.finish ?? false,
            color: eventEdit.borderColor,
            userId: eventEdit.extendedProps.userId
        }).then(() => {
            eventEdit.setDates(eventEdit.startStr, eventEdit.endStr, { allDay: eventEdit.allDay });
        }).finally(() => {
            setLoading(false);
        });
    };

    const getResponsiveView = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 768) {
                return 'listWeek';
            }
        }
        return 'dayGridMonth';
    };

    const nextRange = () => {
        if (calendarRef.current) {
            calendarRef.current.getApi().next();
            const currentMonth = moment(calendarRef.current.getApi().getDate()).month();
            setDate(`${monthsShort[currentMonth]}, ${moment(calendarRef.current.getApi().getDate()).year() - 2000}`);
        }
    };

    const previousRange = () => {
        if (calendarRef.current) {
            calendarRef.current.getApi().prev();
            const currentMonth = moment(calendarRef.current.getApi().getDate()).month();
            setDate(`${monthsShort[currentMonth]}, ${moment(calendarRef.current.getApi().getDate()).year() - 2000}`);
        }
    };
    return (
        <div>
            <div className="px-4 py-2 mt-0 lg:mt-14">

                {/* =================================== Calendar =============================================== */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="flex flex-col items-center mb-2">
                        <div className="block lg:flex items-center gap-2">
                            <div className="flex w-10/12 mx-auto">
                                <Button
                                    onClick={previousRange}
                                    className="bg-[#2c3e50] w-20 h-6 border border-transparent rounded p-[0.4em] px-[0.65em] text-center select-none align-middle text-[1em] font-normal leading-[1.5]"
                                >
                                    {"<<"}
                                </Button>
                                <p className="px-2 text-lg font-bold">{date}</p>
                                <Button
                                    onClick={nextRange}
                                    className="bg-[#2c3e50] w-20 h-6 border border-transparent rounded p-[0.4em] px-[0.65em] text-center select-none align-middle text-[1em] font-normal leading-[1.5]"
                                >
                                    {">>"}
                                </Button>
                            </div>
                            <NavButton handleChangeView={handleChangeView} />
                        </div>
                    </div>
                    <FullCalendar
                        ref={calendarRef}
                        headerToolbar={false}
                        height={height}
                        views={{
                            dayGridMonth: {
                                titleFormat: { month: 'short', year: 'numeric' },
                            },
                        }}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView={getResponsiveView()}
                        events={events}
                        editable={true}
                        dayMaxEventRows={2}
                        selectable={true}
                        select={handleDateSelect}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        eventDrop={(info) => handleResizeEventEdit(info.event)}
                        eventResize={(info) => handleResizeEventEdit(info.event)}
                        selectLongPressDelay={500}
                        datesSet={(info) => {
                            setRangeStart(moment(info.start).format("YYYY-MM-DD"));
                            setRangeEnd(moment(info.end).format("YYYY-MM-DD"));
                        }}
                    />
                </motion.div>

                {/* =================================== Event Remove =================================== */}
                <ManageEventDialog
                    event={eventToManage}
                    onConfirm={handleConfirmRemove}
                    isSheetOpen={isEditOpen}
                    sheetSide={sheetSide}
                    setIsSheetOpen={setIsEditOpen}
                    handleEventEdit={handleEventEdit}
                />

                {/* =================================== Event Form =================================== */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className={`hidden w-full mt-4 bg-[#2c3e50]`} type="button">
                            Create a new event
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={sheetSide}>
                        <SheetHeader>
                            <SheetTitle>New Event</SheetTitle>
                            <FormEvent handleEventCreate={handleEventCreate} selectedEventInfo={selectedEventInfo} />
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            <Sidebar />
            <Loading active={loading} />
        </div >
    );
}
