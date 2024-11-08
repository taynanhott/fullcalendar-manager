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
            const startDate = moment(selectedEventInfo.start).startOf('day'); // Início do dia
            const endDate = moment(selectedEventInfo.end).endOf('day'); // Final do dia

            const newDaysInRange: number[] = [];

            // Verificar os dias no intervalo, excluindo o último dia
            for (let date = moment(startDate); date.isBefore(endDate); date.add(1, 'days')) {
                const dayIndex = date.day();  // Pega o índice do dia da semana
                newDaysInRange.push(dayIndex); // Adiciona o índice ao array de dias válidos
            }

            setDaysInRange(newDaysInRange); // Atualiza os dias no intervalo
            setDaysWeek(newDaysInRange); // Atualiza o estado do componente
        }
    }, [selectedEventInfo, setDaysWeek]);

    const handleDayToggle = (day: string) => {
        const dayIndex = moment().day(day).day(); // Recupera o índice do dia

        setDaysWeek(prev =>
            prev.includes(dayIndex)
                ? prev.filter(d => d !== dayIndex) // Se estiver selecionado, remove
                : [...prev, dayIndex] // Caso contrário, adiciona
        );
    };

    return (
        <div className={`${className}`}>
            <div className="grid grid-cols-2 gap-2">
                {daysOfWeek.map((day, index) => {
                    const dayIndex = moment().day(day).day();  // Recupera o índice do dia atual
                    const isLastDay = daysInRange[daysInRange.length - 1] === dayIndex; // Verifica se é o último dia

                    // Não renderiza o último dia
                    if (isLastDay) {
                        return null;
                    }

                    return (
                        daysInRange.includes(dayIndex) && (  // Só renderiza se o dia estiver no intervalo
                            <div key={day} className="flex items-center space-x-2">
                                <Checkbox
                                    id={day}
                                    checked={daysWeek.includes(dayIndex)}  // Marca o checkbox se o dia estiver selecionado
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
