"use client";

import FullCalendar, { DateSelectArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'; // Importando DateSelectArg aqui
import { useState } from 'react';
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

interface DateRange {
  start: string;
  end: string;
}

let eventGuid = 0;

function createEventId() {
  return String(eventGuid++);
}

export default function Calendar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEventInfo, setSelectedEventInfo] = useState<DateSelectArg | null>(null);
  const [isAllDay, setIsAllDay] = useState(false)
  const [isRepetitive, setIsRepetitive] = useState(false)

  const handleDateClick = (arg: any) => {
    console.log(arg.dateStr);
  };

  const handleDateSelect = (selectInfo: any) => {
    setSelectedEventInfo(selectInfo);
    setIsSheetOpen(true);
  };

  const handleEventCreate = (title: string) => {
    if (selectedEventInfo) {
      const calendarApi = selectedEventInfo.view.calendar;

      calendarApi.unselect();

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectedEventInfo.startStr,
          end: selectedEventInfo.endStr,
          allDay: selectedEventInfo.allDay
        });
      }
      setIsSheetOpen(false);
    }
  };

  function handleEventClick(clickInfo: any) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  return (
    <div className="p-4">
      <FullCalendar
        headerToolbar={{
          left: window.innerWidth > 768 ? 'prev,next today' : 'prev,next',
          center: window.innerWidth > 768 ? 'title' : '',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height={500}
        dayMaxEvents={true}
        dateClick={handleDateClick}
        select={handleDateSelect}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={'https://fullcalendar.io/api/demo-feeds/events.json'}
        editable={true}
        selectable={true}
        eventClick={handleEventClick}
      />
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="block lg:hidden w-full mt-4" type="button" variant="outline">
            Create a new event
          </Button>
        </SheetTrigger>
        <SheetContent side={window.innerWidth > 768 ? 'right' : 'bottom'}>
          <SheetHeader>
            <SheetTitle>Create a new event</SheetTitle>
            <SheetDescription>
              Enter the title for your event below.
            </SheetDescription>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Evento</Label>
                <Input type="text"
                  placeholder="Event title"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEventCreate((e.target as HTMLInputElement).value);
                  }}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="all-day"
                  checked={isAllDay}
                  onCheckedChange={setIsAllDay}
                />
                <Label htmlFor="all-day">Evento de dia inteiro</Label>
              </div>

              {!isAllDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Horário de Início</Label>
                    <Input id="start-time" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">Horário de Fim</Label>
                    <Input id="end-time" type="time" />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="repetitive"
                  checked={isRepetitive}
                  onCheckedChange={setIsRepetitive}
                />
                <Label htmlFor="repetitive">Evento repetitivo</Label>
              </div>

              {isRepetitive && (
                <div className="space-y-2">
                  <Label htmlFor="repeat-count">Número de repetições</Label>
                  <Input
                    id="repeat-count"
                    type="number"
                    min="1"
                    placeholder="Quantas vezes o evento irá se repetir?"
                  />
                </div>
              )}

              <Button type="button" className="w-full" variant="outline" onClick={() => handleEventCreate((document.querySelector('input') as HTMLInputElement).value)}>
                Criar Evento
              </Button>
            </form>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}