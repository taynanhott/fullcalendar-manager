import { useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function SeletorHoras() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)

  const incrementHours = () => setHours((h) => (h + 1) % 24)
  const decrementHours = () => setHours((h) => (h - 1 + 24) % 24)
  const incrementMinutes = () => setMinutes((m) => (m + 1) % 60)
  const decrementMinutes = () => setMinutes((m) => (m - 1 + 60) % 60)

  const handleHoursChange = (e) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= 0 && value < 24) {
      setHours(value)
    }
  }

  const handleMinutesChange = (e) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= 0 && value < 60) {
      setMinutes(value)
    }
  }

  const formatTime = (hours, minutes) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  return (
    (<Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[180px] justify-start text-left font-normal">
          <Clock className="mr-2 h-4 w-4" />
          {formatTime(hours, minutes)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Selecione a hora</h4>
            <p className="text-sm text-muted-foreground">
              Ajuste as horas e minutos conforme necessário.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="hours" className="text-sm font-medium leading-none">
                Horas
              </label>
              <div className="flex items-center mt-1.5">
                <Button size="sm" onClick={decrementHours}>-</Button>
                <Input
                  id="hours"
                  className="w-14 mx-2 text-center"
                  value={hours}
                  onChange={handleHoursChange} />
                <Button size="sm" onClick={incrementHours}>+</Button>
              </div>
            </div>
            <div>
              <label htmlFor="minutes" className="text-sm font-medium leading-none">
                Minutos
              </label>
              <div className="flex items-center mt-1.5">
                <Button size="sm" onClick={decrementMinutes}>-</Button>
                <Input
                  id="minutes"
                  className="w-14 mx-2 text-center"
                  value={minutes}
                  onChange={handleMinutesChange} />
                <Button size="sm" onClick={incrementMinutes}>+</Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>)
  );
}