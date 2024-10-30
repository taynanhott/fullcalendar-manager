"use client";

import { DateSelectArg, EventApi } from '@fullcalendar/core';
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
  SheetDescription
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import RemoveEventDialog from '@/components/ui/remove';
import moment from 'moment';
import Sidebar from '@/components/ui/sidebar';

let eventGuid = 0;

function createEventId() {
  return String(eventGuid++);
}
type SideOptions = 'left' | 'right' | 'bottom' | 'top';

export default function Calendar() {
  const repeatRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // const [hidden, setHidden] = useState(false);
  const [selectedEventInfo, setSelectedEventInfo] = useState<DateSelectArg | null>(null);
  const [dateClick, setDateClick] = useState<DateClickArg | null>(null);
  const [isAllDay, setIsAllDay] = useState(false);
  const [isRepetitive, setIsRepetitive] = useState(false);
  const [sheetSide, setSheetSide] = useState<SideOptions>('bottom');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventToRemove, setEventToRemove] = useState<EventApi | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [toolbarConfig, setToolbarConfig] = useState({
    left: 'prev,next',
    center: 'title',
    right: ''
  });

  // Other functions ----------------------------------------------
  function formatDateTime(time: string) {
    return `T${time}-03:00`;
  }

  const handleDateClick = (selectInfo: DateClickArg) => {
    setDateClick(selectInfo);
    setIsSheetOpen(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToolbarConfig({
        left: window.innerWidth > 768 ? 'prev,next today' : 'prev,next',
        center: 'title',
        right: ''
      });
      setSheetSide(window.innerWidth > 768 ? 'right' : 'bottom');
    }
  }, []);

  // Event add functions ----------------------------------------------
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedEventInfo(selectInfo);
    setIsSheetOpen(true);
  };

  const handleEventCreate = (
    title: string,
    allDay: boolean,
    start: string,
    end: string,
    repeats: number
  ) => {
    if (window.innerWidth >= 1024) {
      if (selectedEventInfo) {
        const calendarApi = selectedEventInfo.view.calendar;
        calendarApi.unselect();
        if (title) {
          let count = 0;
          while (count < repeats) {
            calendarApi.addEvent({
              id: createEventId(),
              title,
              start: allDay ? selectedEventInfo.start : moment(selectedEventInfo.start).format('YYYY-MM-DD') + start,
              end: allDay ? selectedEventInfo.end : moment(selectedEventInfo.start).format('YYYY-MM-DD') + end,
              allDay,
            });
            count++;
          }
          setIsSheetOpen(false);
        }
      }
    } else {
      if (dateClick) {
        const calendarApi = dateClick.view.calendar;
        calendarApi.unselect();
        if (title) {
          let count = 0;
          while (count < repeats) {
            calendarApi.addEvent({
              id: createEventId(),
              title,
              start: allDay ? dateClick.date : moment(dateClick.date).format('YYYY-MM-DD') + start,
              end: allDay ? dateClick.date : moment(dateClick.date).format('YYYY-MM-DD') + end,
              allDay,
            });
            count++;
          }
          setIsSheetOpen(false);
        }
      }
    }
  };

  // Event remove functions ----------------------------------------------
  function handleEventClick(clickInfo: { event: EventApi }) {
    setEventToRemove(clickInfo.event);
    setIsDialogOpen(true);
  }

  const handleConfirmRemove = async () => {
    if (eventToRemove) {
      eventToRemove.remove();
      setEventToRemove(null);
      setIsDialogOpen(false);
    }
  };

  const handleChangeView = (view: 'listWeek' | 'dayGridWeek' | 'dayGridMonth') => {
    // view === "listWeek" ? setHidden(true) : setHidden(false);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };

  return (
    <div>
      <div className="p-4 mt-0 lg:mt-20">
        {/* ----------------------------- Calendar ----------------------------- */}
        <FullCalendar
          ref={calendarRef}
          headerToolbar={toolbarConfig}
          views={{
            dayGridMonth: {
              titleFormat: { month: 'short', year: 'numeric' }
            }
          }}
          height={500}
          dayMaxEvents={true}
          dateClick={handleDateClick}
          select={handleDateSelect}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          events={''}
          editable={true}
          selectable={true}
          eventClick={handleEventClick}
        />

        {/* ----------------------------- Event Remove ----------------------------- */}
        <RemoveEventDialog
          eventName={eventToRemove ? eventToRemove.title : ""}
          onConfirm={handleConfirmRemove}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />

        {/* ----------------------------- Event Form ----------------------------- */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            {/*<Button className={`block ${hidden && 'hidden'} lg:hidden w-full mt-4 bg-[#2c3e50]`} type="button">*/}
            <Button className="hidden w-full mt-4 bg-[#2c3e50]" type="button">
              Create a new event
            </Button>
          </SheetTrigger>
          <SheetContent side={sheetSide}>
            <SheetHeader>
              <SheetTitle>New Event</SheetTitle>
              <SheetDescription>
                Enter the title for your event below.
              </SheetDescription>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const title = (document.querySelector('#title') as HTMLInputElement).value;
                const start = formatDateTime(startTime);
                const end = formatDateTime(endTime);
                const repeats = repeatRef.current ? +repeatRef.current.value : 1;

                handleEventCreate(title, isAllDay, start, end, repeats);
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
                      <Label htmlFor="start-time" className="">Select a start hour</Label>
                      <Input id="start-time" type="time" onChange={(e) => setStartTime(e.target.value)} />
                    </div>
                    <div className="space-y-2 text-start">
                      <Label htmlFor="end-time">Select an end-hour</Label>
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
                  Create a new event
                </Button>
              </form>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <Sidebar handleChangeView={handleChangeView} />
    </div >
  );
}
