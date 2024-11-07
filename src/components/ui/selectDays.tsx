'use client'

import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Props {
    className?: string
    dayStart: Date | undefined
}

export default function WeekDaySelector({ className, dayStart }: Props) {
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    console.log(dayStart)
    const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    const handleDayToggle = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        )
    }

    return (
        <div className={`${className}`}>
            <div className="grid grid-cols-2 gap-2">
                {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                            id={day}
                            checked={selectedDays.includes(day)}
                            onCheckedChange={() => handleDayToggle(day)}
                        />
                        <Label htmlFor={day}>{day}</Label>
                    </div>
                ))}
            </div>
        </div>
    )
}