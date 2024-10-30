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
import { Button } from '@/components/ui/button';
import ManageEventDialog from '@/components/ui/manage';
import moment from 'moment';
import Sidebar from '@/components/ui/sidebar';
import FormEvent from '@/components/ui/formEvent';

let eventGuid = 1;

function createEventId() {
  return String(eventGuid++);
}

type SideOptions = 'left' | 'right' | 'bottom' | 'top';

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEventInfo, setSelectedEventInfo] = useState<DateSelectArg | null>(null);
  const [dateClick, setDateClick] = useState<DateClickArg | null>(null);
  const [sheetSide, setSheetSide] = useState<SideOptions>('bottom');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [eventToManage, setEventToManage] = useState<EventApi | null>(null);
  const [toolbarConfig, setToolbarConfig] = useState({ left: 'prev,next', center: 'title', right: '' });

  // Other functions ----------------------------------------------
  const handleDateClick = (selectInfo: DateClickArg) => {
    setDateClick(selectInfo);
    setIsSheetOpen(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const small = window.innerWidth < 768;
      setToolbarConfig({
        left: small ? 'prev,next' : 'prev,next today',
        center: 'title',
        right: ''
      });
      setSheetSide(small ? 'bottom' : 'right');
    }
  }, []);

  // Event add functions ----------------------------------------------
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedEventInfo(selectInfo);
    setIsSheetOpen(true);
  };

  // Create -------------------------------------
  const handleEventCreate = (title: string, start: string, end: string, allDay: boolean, repeats: number) => {
    if (typeof window !== 'undefined') {
      const large = window.innerWidth >= 1024;
      const calendarApi = large ? selectedEventInfo?.view.calendar : dateClick?.view.calendar;
      const eventStart = large ? selectedEventInfo?.start : dateClick?.date;
      const eventEnd = large ? selectedEventInfo?.end : dateClick?.date;

      if (calendarApi && eventStart) {
        calendarApi.unselect();

        let count = 0;
        while (count < repeats) {
          calendarApi.addEvent({
            id: createEventId(),
            title,
            start: allDay ? eventStart : moment(eventStart).format('YYYY-MM-DD') + start,
            end: allDay ? eventEnd : moment(eventStart).format('YYYY-MM-DD') + end,
            allDay,
          });
          count++;
        }
        setIsSheetOpen(false);
      }
    }
  };

  // Event remove functions ----------------------------------------------
  function handleEventClick(clickInfo: { event: EventApi }) {
    setEventToManage(clickInfo.event);
    setIsEditOpen(true);
  }

  const handleConfirmRemove = async () => {
    if (eventToManage) {
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
          events={'https://fullcalendar.io/api/demo-feeds/events.json'}
          editable={true}
          selectable={true}
          eventClick={handleEventClick}
        />

        {/* ----------------------------- Event Remove ----------------------------- */}
        <ManageEventDialog
          id={eventToManage ? +eventToManage.id : 0}
          eventName={eventToManage ? eventToManage.title : ""}
          onConfirm={handleConfirmRemove}
          isSheetOpen={isEditOpen}
          sheetSide={sheetSide}
          setIsSheetOpen={setIsEditOpen}  // Passe diretamente, sem função
          handleEventCreate={handleEventCreate}
        />

        {/* ----------------------------- Event Form ----------------------------- */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
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
              <FormEvent handleEventCreate={handleEventCreate} id={0} />
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <Sidebar handleChangeView={handleChangeView} />
    </div >
  );
}
