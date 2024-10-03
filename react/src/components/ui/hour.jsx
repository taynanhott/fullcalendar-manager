import { useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

export default function Hour({ variant = "fixed", className = "" }) {
    const [time, setTime] = useState({ hours: 0, minutes: 0 })

    const incrementHours = () => setTime(prev => ({ ...prev, hours: (prev.hours + 1) % 24 }))
    const decrementHours = () => setTime(prev => ({ ...prev, hours: (prev.hours - 1 + 24) % 24 }))
    const incrementMinutes = () => {
        setTime(prev => {
            const newMinutes = (prev.minutes + 1) % 60
            const newHours = newMinutes === 0 ? (prev.hours + 1) % 24 : prev.hours
            return { hours: newHours, minutes: newMinutes }
        })
    }
    const decrementMinutes = () => {
        setTime(prev => {
            const newMinutes = (prev.minutes - 1 + 60) % 60
            const newHours = prev.minutes === 0 ? (prev.hours - 1 + 24) % 24 : prev.hours
            return { hours: newHours, minutes: newMinutes }
        })
    }

    const handleTimeChange = (type, value) => {
        const numValue = parseInt(value, 10)
        if (isNaN(numValue)) return

        if (type === 'hours' && numValue >= 0 && numValue < 24) {
            setTime(prev => ({ ...prev, hours: numValue }))
        } else if (type === 'minutes' && numValue >= 0 && numValue < 60) {
            setTime(prev => ({ ...prev, minutes: numValue }))
        }
    }

    const formatTime = (hours, minutes) => {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    const handleClick = () => {
        document.getElementById('time-input')?.focus()
    }

    return (
        variant === "popover" ? (
            <div className={className}>
                <Popover>
                    <PopoverTrigger asChild >
                        <Button variant="outline" className="border-dark-task/20 w-full justify-start text-left font-normal">
                            <Clock className="mr-2 h-4 w-4" />
                            {formatTime(time.hours, time.minutes)}
                        </Button>
                    </PopoverTrigger >
                    <PopoverContent className="w-80 bg-white">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Select an hour</h4>
                                <p className="text-sm text-muted-foreground">
                                    Choose a time of task duration.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="hours">Horas</Label>
                                    <div className="flex items-center">
                                        <Button size="icon" onClick={decrementHours}>-</Button>
                                        <Input
                                            id="hours"
                                            className="w-14 mx-2 text-center"
                                            value={time.hours.toString().padStart(2, '0')}
                                            onChange={(e) => handleTimeChange('hours', e.target.value)}
                                            min={0}
                                            max={23}
                                        />
                                        <Button size="icon" onClick={incrementHours}>+</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="minutes">Minutos</Label>
                                    <div className="flex items-center">
                                        <Button size="icon" onClick={decrementMinutes}>-</Button>
                                        <Input
                                            id="minutes"
                                            className="w-14 mx-2 text-center"
                                            value={time.minutes.toString().padStart(2, '0')}
                                            onChange={(e) => handleTimeChange('minutes', e.target.value)}
                                            min={0}
                                            max={59}
                                        />
                                        <Button size="icon" onClick={incrementMinutes}>+</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        ) : (
            <div className={className}>
                <div className="flex flex-col items-center">
                    <Label className="block lg:hidden">Select an hour</Label>
                    <div
                        className="relative flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer mt-2"
                        onClick={handleClick}
                    >
                        <Clock className="absolute left-3 h-5 w-5 text-gray-400" />
                        <Input
                            id="time-input"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="pl-10 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

        )
    )
}