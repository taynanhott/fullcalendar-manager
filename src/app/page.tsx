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

let small = false;
let height = 650;
if (typeof window !== 'undefined') {
  small = window.innerWidth < 768;
  height = window.innerHeight >= 740 ? 650 : 500;
}

function createEventId() {
  return String(eventGuid++);
}

type SideOptions = 'left' | 'right' | 'bottom' | 'top';

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [isDateSelectActive, setIsDateSelectActive] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEventInfo, setSelectedEventInfo] = useState<DateSelectArg | null>(null);
  const [sheetSide, setSheetSide] = useState<SideOptions>('bottom');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [eventToManage, setEventToManage] = useState<EventApi | null>(null);
  const [toolbarConfig, setToolbarConfig] = useState({ left: 'prev,next', center: 'title', right: '' });

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
  const handleEventCreate = (title: string, start: string, end: string, allDay: boolean, color: string) => {
    const calendarApi = selectedEventInfo?.view.calendar;
    const eventStart = selectedEventInfo?.start;
    const eventEnd = selectedEventInfo?.end;

    if (calendarApi && eventStart && eventEnd) {
      calendarApi.unselect();

      let count = 0;
      const repeats = allDay ? 1 : moment(eventEnd).diff(moment(eventStart), 'days');

      while (count < repeats) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: allDay ? eventStart : moment(eventStart).add(count, 'days').format('YYYY-MM-DD') + start,
          end: allDay ? eventEnd : moment(eventStart).add(count, 'days').format('YYYY-MM-DD') + end,
          allDay,
          backgroundColor: color,
          borderColor: color
        });
        count++;
      }
      setIsSheetOpen(false);
    }
  };

  // Edit -----------------------------------------------------------
  const handleEventEdit = (id: string, title: string, start: string, end: string, allDay: boolean, color: string) => {
    const calendarApi = selectedEventInfo?.view.calendar;
    const event = calendarApi?.getEventById(id);

    if (calendarApi && event && event.start) {
      const formattedStart = moment(event.start).format("YYYY-MM-DD") + start;
      const formattedEnd = moment(event.start).format("YYYY-MM-DD") + end;

      event.setProp("title", title);
      event.setAllDay(allDay);
      event.setProp("backgroundColor", color);
      event.setProp("borderColor", color);

      if (allDay) {
        event.setDates(moment(event.start).format("YYYY-MM-DD"), moment(event.end).format("YYYY-MM-DD"));
      } else {
        event.setDates(formattedStart, formattedEnd);
      }

      setIsEditOpen(false);
    }
  };

  // Event remove functions =======================================================================
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
        {/* =================================== Calendar =============================================== */}
        <FullCalendar
          ref={calendarRef}
          headerToolbar={toolbarConfig}
          views={{
            dayGridMonth: {
              titleFormat: { month: 'short', year: 'numeric' }
            }
          }}
          height={height}
          dayMaxEvents={true}
          dateClick={handleDateClick}
          select={handleDateSelect}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          // events={'https://fullcalendar.io/api/demo-feeds/events.json'}
          editable={true}
          selectable={true}
          eventClick={handleEventClick}
        />

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
              <SheetDescription>
                Enter the title for your event below.
              </SheetDescription>
              <FormEvent handleEventCreate={handleEventCreate} />
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <Sidebar handleChangeView={handleChangeView} />
    </div >
  );
}
