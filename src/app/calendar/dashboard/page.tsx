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
    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('month').add(2, 'days'));
    const [rangeStart, setRangeStart] = useState(moment().startOf('month').format("YYYY-MM-DD"));
    const [rangeEnd, setRangeEnd] = useState(moment().endOf('month').format("YYYY-MM-DD"));

    useEffect(() => {
        const fetchEvents = async (rangeStart: string, rangeEnd: string) => {
            setLoading(true);
            try {
                const eventsData = await getEventsByUserId(user.uid, rangeStart, rangeEnd);
                setEvents(eventsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
                setLoading(false);
            }
        };

        fetchEvents(rangeStart, rangeEnd);
    }, [user.uid, rangeStart, rangeEnd]);

    useEffect(() => {
        setRangeStart(currentWeekStart.clone().format("YYYY-MM-DD"));
        setRangeEnd(currentWeekStart.clone().add(6, "days").format("YYYY-MM-DD"));
    }, [currentWeekStart]);

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
        const currentDay = moment(startOfWeek);
        while (currentDay.isSameOrBefore(endOfWeek)) {
            labels.push(currentDay.format("DD/MM"));
            currentDay.add(1, "day");
        }
        return labels;
    };

    const generateWeekdaysLabels = () => {
        const { startOfWeek } = getWeekDateRange();
        const labels = [];
        const currentDay = moment(startOfWeek);
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
                hoursPerDay[dayOfEvent] += +duration.toFixed(2);
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

            eventsPerDay[dayOfEvent] = Math.floor(eventsPerDay[dayOfEvent]) + 1;
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
                    foreColor: "#FFFFFF",
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
                colors: ["#FFFFFF"],
                dataLabels: {
                    enabled: false,
                },
            },
            series: [
                {
                    name: "Hours per day",
                    data: hoursData.map(hour => {
                        const hours = Math.floor(hour);
                        const decimalMinutes = (hour - hours) * 60;
                        const decimal = hours + decimalMinutes / 100;
                        return parseFloat(decimal.toFixed(2));
                    }),
                },
            ],
            height: 185,
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
                    position: "right" as const,
                    labels: {
                        colors: "#000000",
                    },
                },
                colors: ["#67C7D1", "#5E9B3A", "#2A8BCE", "#F1A40D", "#B24E88", "#39A8A0", "#E57E17"],
            },
            series: hoursData.map(hour => {
                const hours = Math.floor(hour);
                const decimalMinutes = (hour - hours) * 60;
                const decimal = hours + decimalMinutes / 100;
                return parseFloat(decimal.toFixed(2));
            }),
            height: 185,
        },
    ];


    const simpleBarNumber = [
        {
            options: {
                chart: {
                    id: "bar" as const,
                    foreColor: "#FFFFFF",
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
                colors: ["#2c3e50"],
                dataLabels: {
                    enabled: false,
                },
            },
            series: [
                {
                    name: "number of events per day",
                    data: eventsData.map(event => Math.round(event)),
                },
            ],
            height: 185,
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
                    position: "right" as const,
                    labels: {
                        colors: "#000000",
                    },
                },
                colors: ["#67C7D1", "#5E9B3A", "#2A8BCE", "#F1A40D", "#B24E88", "#39A8A0", "#E57E17"],
            },
            series: eventsData,
            height: 185,
        }
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
            <div id="features-dashboard" className="mb-24 lg:mb-0 px-0 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 px-[38px]">
                    <div className="h-60 col-span-1 lg:col-span-3 rounded-sm border bg-gradient-to-r from-slate-500 to-slate-400  shadow-md">
                        <div className="col-span-1 items-center text-white text-lg font-poppins-bold px-4 pt-4 pointer-events-none">
                            Hours of events per week
                        </div>
                        <Graph className="max-w-3xl" components={simpleBarHour} />
                    </div>
                    <div className="h-72 lg:h-60 col-span-1 lg:col-span-2 rounded-sm border bg-wite shadow-md">
                        <div className="col-span-1 items-center text-lg text-black font-poppins-bold px-4 pt-4 pointer-events-none">
                            % Hours of events per week
                        </div>
                        <div className="bg-gradient-to-r">
                            <Graph className="mt-8 lg:mt-0 max-w-3xl" components={simplePieChartHour} />
                        </div>
                    </div>
                    <div className="h-72 lg:h-60 col-span-1 lg:col-span-2 rounded-sm border bg-wite">
                        <div className="col-span-1 items-center text-lg text-black font-poppins-bold px-4 pt-4 pointer-events-none">
                            % Number of Event per Week
                        </div>
                        <div className="bg-gradient-to-r">
                            <Graph className="mt-8 lg:mt-0 max-w-3xl" components={simplePieChartNumber} />
                        </div>
                    </div>
                    <div className="h-60 col-span-1 lg:col-span-3 rounded-sm border bg-gradient-to-r from-slate-500 to-slate-400 shadow-md">
                        <div className="col-span-1 items-center text-white text-lg font-poppins-bold px-4 pt-4 pointer-events-none">
                            Number of Event per Week
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
