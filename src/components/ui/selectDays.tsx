'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DateSelectArg } from 'fullcalendar/index.js';
import moment from 'moment';

interface Props {
    className?: string;
    selectedEventInfo: DateSelectArg | null | undefined;
    daysWeek: number[];
    setDaysWeek: Dispatch<SetStateAction<number[]>>;
}

export default function WeekDaySelector({
    className,
    selectedEventInfo,
    daysWeek,
    setDaysWeek
}: Props) {
    const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    const [daysInRange, setDaysInRange] = useState<number[]>([]);

    useEffect(() => {
        if (selectedEventInfo) {
            const startDate = moment(selectedEventInfo.start).startOf('day');
            const endDate = moment(selectedEventInfo.end).subtract(1, 'day').endOf('day');

            const newDaysInRange: number[] = [];

            for (let date = moment(startDate); date.isBefore(endDate); date.add(1, 'days')) {
                const dayIndex = date.day();
                newDaysInRange.push(dayIndex);
            }

            setDaysInRange(newDaysInRange);
            setDaysWeek(newDaysInRange);
        }
    }, [selectedEventInfo, setDaysWeek]);

    const handleDayToggle = (day: string) => {
        const dayIndex = moment().day(day).day();

        setDaysWeek(prev =>
            prev.includes(dayIndex)
                ? prev.filter(d => d !== dayIndex)
                : [...prev, dayIndex]
        );
    };

    return (
        <div className={`${className}`}>
            <div className="grid grid-cols-2 gap-2">
                {daysOfWeek.map((day) => {
                    const dayIndex = moment().day(day).day();
                    const isLastDay = daysInRange[daysInRange.length] === dayIndex;

                    if (isLastDay) {
                        return null;
                    }

                    return (
                        daysInRange.includes(dayIndex) && (
                            <div key={day} className="flex items-center space-x-2">
                                <Checkbox
                                    id={day}
                                    checked={daysWeek.includes(dayIndex)}
                                    onCheckedChange={() => handleDayToggle(day)}
                                />
                                <Label htmlFor={day}>{day}</Label>
                            </div>
                        )
                    );
                })}
            </div>
        </div>
    );
}
