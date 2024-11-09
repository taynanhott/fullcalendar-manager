"use client"

import { useUser } from "@/app/context/userContext";
import Graph from "@/components/graph/graph";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import Sidebar from "@/components/ui/sidebar";
import { getEventsByUserId } from "@/firebase/config";
import { EventInput } from "fullcalendar/index.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<EventInput[]>([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('month').add(2, 'days')); // Start at the 3rd of the month

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

    const getWeekDateRange = () => {
        const startOfWeek = currentWeekStart.clone();
        const endOfWeek = startOfWeek.clone().add(6, "days");
        return { startOfWeek, endOfWeek };
    };

    const filterEventsByDate = () => {
        const { startOfWeek, endOfWeek } = getWeekDateRange();
        return events.filter(event => {
            const eventDate = moment(event.start);
            return eventDate.isBetween(startOfWeek, endOfWeek, "day", "[]");
        });
    };

    const generateDynamicLabels = () => {
        const { startOfWeek, endOfWeek } = getWeekDateRange();
        const labels = [];
        const currentDay = moment(startOfWeek);  // Use const here
        while (currentDay.isSameOrBefore(endOfWeek)) {
            labels.push(currentDay.format("DD/MM"));
            currentDay.add(1, "day");
        }
        return labels;
    };

    const generateWeekdaysLabels = () => {
        const { startOfWeek } = getWeekDateRange();
        const labels = [];
        const currentDay = moment(startOfWeek);  // Use const here
        while (labels.length < 7) {
            labels.push(currentDay.format("dddd"));
            currentDay.add(1, "day");
        }
        return labels;
    };

    const calculateHoursPerDay = () => {
        const hoursPerDay: { [key: string]: number } = {};
        const filteredEvents = filterEventsByDate();

        filteredEvents.forEach(event => {
            if (!event.allDay) {
                const start = moment(event.start);
                const end = moment(event.end);
                const duration = moment.duration(end.diff(start)).asHours();
                const dayOfEvent = start.format("DD/MM");

                if (!hoursPerDay[dayOfEvent]) {
                    hoursPerDay[dayOfEvent] = 0;
                }
                hoursPerDay[dayOfEvent] += duration;
            }
        });
        return hoursPerDay;
    };

    const calculateEventsPerDay = () => {
        const eventsPerDay: { [key: string]: number } = {};
        const filteredEvents = filterEventsByDate();

        filteredEvents.forEach(event => {
            const start = moment(event.start);
            const dayOfEvent = start.format("DD/MM");

            if (!eventsPerDay[dayOfEvent]) {
                eventsPerDay[dayOfEvent] = 0;
            }
            eventsPerDay[dayOfEvent] += 1;
        });
        return eventsPerDay;
    };

    const labels = generateDynamicLabels();
    const hoursData = labels.map(label => calculateHoursPerDay()[label] || 0);
    const eventsData = labels.map(label => calculateEventsPerDay()[label] || 0);

    const simpleBarHour = [
        {
            options: {
                chart: {
                    id: "bar" as const,
                    foreColor: "#000000",
                },
                xaxis: {
                    categories: labels,
                },
                yaxis: {
                    max: 24
                },
                fill: {
                    colors: ["#2c3e50"],
                },
                colors: ["#000000"],
                dataLabels: {
                    enabled: false,
                    formatter: function (val: number) {
                        return val.toFixed(2);
                    },
                },
            },
            series: [
                {
                    name: "Horas por dia",
                    data: hoursData,
                },
            ],
            height: 240,
        },
    ];

    const simplePieChartHour = [
        {
            options: {
                chart: {
                    id: "pie" as const,
                },
                labels: generateWeekdaysLabels(),
                legend: {
                    position: "bottom" as const,
                    labels: {
                        colors: "#FFFFFF",
                    },
                },
                colors: ["#FF6F61", "#6B8E23", "#1E90FF", "#FFD700", "#8A2BE2", "#00CED1", "#FF8C00"],
            },
            series: hoursData,
            height: 260,
        },
    ];

    const simpleBarNumber = [
        {
            options: {
                chart: {
                    id: "bar" as const,
                    foreColor: "#000000",
                },
                xaxis: {
                    categories: labels,
                },
                yaxis: {
                    max: Math.max(...eventsData) + 1,
                },
                fill: {
                    colors: ["#2c3e50"],
                },
                colors: ["#000000"],
                dataLabels: {
                    enabled: false,
                    formatter: function (val: number) {
                        return val.toFixed(0);
                    },
                },
            },
            series: [
                {
                    name: "Número de eventos por dia",
                    data: eventsData,
                },
            ],
            height: 240,
        },
    ];

    const simplePieChartNumber = [
        {
            options: {
                chart: {
                    id: "pie" as const,
                },
                labels: generateWeekdaysLabels(),
                legend: {
                    position: "bottom" as const,
                    labels: {
                        colors: "#FFFFFF",
                    },
                },
                colors: ["#FF6F61", "#6B8E23", "#1E90FF", "#FFD700", "#8A2BE2", "#00CED1", "#FF8C00"],
            },
            series: eventsData,
            height: 260,
        },
    ];

    const goToPreviousWeek = () => {
        setCurrentWeekStart(currentWeekStart.clone().subtract(7, "days"));
    };

    const goToNextWeek = () => {
        setCurrentWeekStart(currentWeekStart.clone().add(7, "days"));
    };

    const formattedWeekRange = `${getWeekDateRange().startOfWeek.format("MMM DD")} - ${getWeekDateRange().endOfWeek.format("DD, YYYY")}`;

    return (
        <div>
            <div className="p-4 mt-0 lg:mt-20 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        onClick={goToPreviousWeek}
                        className="bg-[#2c3e50] border border-transparent rounded p-[0.4em] px-[0.65em] text-center select-none align-middle text-[1em] font-normal leading-[1.5]"
                    >
                        <ChevronLeft />
                    </Button>
                    <span className="text-lg">
                        {formattedWeekRange}
                    </span>
                    <Button
                        onClick={goToNextWeek}
                        className="bg-[#2c3e50] border border-transparent rounded p-[0.4em] px-[0.65em] text-center select-none align-middle text-[1em] font-normal leading-[1.5]"
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>
            <div id="features-dashboard" className="mb-24 lg:mb-0 px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-[38px]">
                    <div className="h-72 col-span-2 lg:col-span-1 rounded-sm border bg-white shadow-md">
                        <div className="col-span-1 items-center text-lg font-poppins-bold px-4 pt-4 pointer-events-none">
                            Event Hours of Days in Week
                        </div>
                        <Graph className="max-w-3xl" components={simpleBarHour} />
                    </div>
                    <div className="h-72 col-span-2 lg:col-span-1 rounded-sm border bg-gradient-to-r from-slate-500 to-slate-400 shadow-md">
                        <div className="col-span-1 items-center text-lg text-white font-poppins-bold px-4 pt-4 pointer-events-none">
                            % Event Hours of Week
                        </div>
                        <div className="bg-gradient-to-r">
                            <Graph className="max-w-3xl" components={simplePieChartHour} />
                        </div>
                    </div>
                    <div className="h-72 col-span-2 lg:col-span-1 rounded-sm border bg-gradient-to-r from-slate-500 to-slate-400 shadow-md">
                        <div className="col-span-1 items-center text-lg text-white font-poppins-bold px-4 pt-4 pointer-events-none">
                            % Event Number of Week
                        </div>
                        <div className="bg-gradient-to-r">
                            <Graph className="max-w-3xl" components={simplePieChartNumber} />
                        </div>
                    </div>
                    <div className="h-72 col-span-2 lg:col-span-1 rounded-sm border bg-white shadow-md">
                        <div className="col-span-1 items-center text-lg font-poppins-bold px-4 pt-4 pointer-events-none">
                            Event Number of Days in Week
                        </div>
                        <Graph className="max-w-3xl" components={simpleBarNumber} />
                    </div>
                    <Sidebar />
                    <Loading active={loading} />
                </div>
            </div>
        </div >
    );
}
