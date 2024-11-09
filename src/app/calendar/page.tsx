"use client";

import { DateSelectArg, EventApi, EventInput } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useState, useEffect, useRef } from 'react';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ManageEventDialog from '@/components/ui/manage';
import moment from 'moment';
import Sidebar from '@/components/ui/sidebar';
import FormEvent from '@/components/ui/formEvent';
import { deleteEvent, getEventsByUserId, updateEvent, writeEventData } from '@/firebase/config';
import { useUser } from '../context/userContext';
import Loading from '@/components/ui/loading';
import { motion } from "framer-motion";
import NavButton from '@/components/ui/navButton';

let small = false;
let height = 596;

if (typeof window !== 'undefined') {
    small = window.innerWidth < 768;
    height = window.innerHeight >= 740 ? 596 : 531;
}

type SideOptions = 'left' | 'right' | 'bottom' | 'top';

export default function Calendar() {
    const { user } = useUser();
    const calendarRef = useRef<FullCalendar>(null);
    const [loading, setLoading] = useState(false);
    const [isDateSelectActive, setIsDateSelectActive] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedEventInfo, setSelectedEventInfo] = useState<DateSelectArg | null>(null);
    const [sheetSide, setSheetSide] = useState<SideOptions>('bottom');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [eventToManage, setEventToManage] = useState<EventApi | null>(null);
    const [toolbarConfig, setToolbarConfig] = useState({ left: 'prev,next', center: 'title', right: '' });
    const [events, setEvents] = useState<EventInput[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const eventsData = await getEventsByUserId(user.uid);
                setEvents(eventsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user.uid]);

    // Other functions =======================================================================
    useEffect(() => {
        setToolbarConfig({
            left: small ? 'prev,next' : 'prev,next today',
            center: 'title',
            right: ''
        });
        setSheetSide(small ? 'bottom' : 'right');
    }, []);

    const handleDateClick = (selectInfo: DateClickArg) => {
        if (!isDateSelectActive) {
            if (calendarRef.current) {
                calendarRef.current.getApi().changeView('dayGridDay', selectInfo.dateStr);
            }
        }
    };

    // Event add functions =======================================================================
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

            setLoading(true);
            if (looping === 1) {
                while (count < repeat) {
                    const startDate = allDay
                        ? moment(eventStart).add(count, durationUnit).format('YYYY-MM-DD')
                        : moment(eventStart).add(count, durationUnit).format('YYYY-MM-DD') + start;
                    const endDate = allDay
                        ? moment(eventEnd).add(count, durationUnit).format('YYYY-MM-DD')
                        : moment(eventStart).add(count, durationUnit).format('YYYY-MM-DD') + end;

                    const id = (await writeEventData(title, startDate, endDate, allDay, color, user.uid)).key ?? '';

                    calendarApi.addEvent({
                        id,
                        title,
                        start: startDate,
                        end: endDate,
                        allDay,
                        backgroundColor: color,
                        borderColor: color,
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
                        const id = (await writeEventData(title, startDate, endDate, allDay, color, user.uid)).key ?? '';

                        calendarApi.addEvent({
                            id,
                            title,
                            start: startDate,
                            end: endDate,
                            allDay,
                            backgroundColor: color,
                            borderColor: color,
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
    const handleEventEdit = (eventEdit: EventApi, title: string, start: string, end: string, allDay: boolean, color: string) => {
        let formattedStart = allDay ? moment(eventEdit.startStr).format("YYYY-MM-DD") : moment(eventEdit.start).format("YYYY-MM-DD") + start;
        let formattedEnd = allDay ? moment(eventEdit.endStr).format("YYYY-MM-DD") : moment(eventEdit.start).format("YYYY-MM-DD") + end;

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
            color: color,
            userId: user.uid
        });

        // Update event properties after updating backend
        eventEdit.setProp("title", title);
        eventEdit.setDates(formattedStart, formattedStart === formattedEnd ? moment(formattedEnd).add(1, 'day').format("YYYY-MM-DD") : formattedEnd, { allDay: allDay });
        eventEdit.setProp("backgroundColor", color);
        eventEdit.setProp("borderColor", color);

        setIsEditOpen(false);
        setLoading(false);
    };

    // Event remove functions =======================================================================
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

    const handleChangeView = (view: 'listWeek' | 'dayGridWeek' | 'dayGridMonth') => {
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
            color: eventEdit.borderColor,
            userId: user.uid
        }).then(() => {
            eventEdit.setDates(eventEdit.startStr, eventEdit.endStr, { allDay: eventEdit.allDay });
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <div>
            <div className="p-4 mt-0 lg:mt-20">
                {/* =================================== Calendar =============================================== */}
                <NavButton handleChangeView={handleChangeView} />
                <motion.div
                    className="mt-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    viewport={{ once: true }}
                >
                    <FullCalendar
                        ref={calendarRef}
                        headerToolbar={toolbarConfig}
                        height={height}
                        views={{
                            dayGridMonth: {
                                titleFormat: { month: 'short', year: 'numeric' },
                            },
                        }}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        editable={true}
                        selectable={true}
                        select={handleDateSelect}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        eventDrop={(info) => handleResizeEventEdit(info.event)}
                        eventResize={(info) => handleResizeEventEdit(info.event)}
                        selectLongPressDelay={500}
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
