import { useState } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";

const PRESETS = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
] as const;

interface AdminDateRangePickerProps {
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
}

export function AdminDateRangePicker({ dateRange, onDateRangeChange }: AdminDateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const handlePreset = (days: number) => {
    onDateRangeChange({ from: startOfDay(subDays(new Date(), days - 1)), to: endOfDay(new Date()) });
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onDateRangeChange({ from: startOfDay(range.from), to: endOfDay(range.to) });
    } else if (range?.from) {
      onDateRangeChange({ from: startOfDay(range.from), to: endOfDay(range.from) });
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex gap-1 bg-muted rounded-lg p-0.5">
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => handlePreset(p.days)}
            className={cn(
              "px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all",
              Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / 86400000) + 1 === p.days
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1.5 px-2.5 border-border">
            <CalendarIcon className="h-3 w-3" />
            {format(dateRange.from, "MMM d")} – {format(dateRange.to, "MMM d")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={handleCalendarSelect}
            numberOfMonths={1}
            disabled={(date) => date > new Date()}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
