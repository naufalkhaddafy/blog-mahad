import * as React from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { CalendarIcon, XIcon } from 'lucide-react';
import { type DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateRangePickerProps {
    value?: DateRange;
    onChange?: (range: DateRange | undefined) => void;
    placeholder?: string;
    className?: string;
}

const isValidDate = (date: any): date is Date => date instanceof Date && !isNaN(date.getTime());

export function DateRangePicker({
    value,
    onChange,
    placeholder = 'Pilih tanggal',
    className,
}: DateRangePickerProps) {
    const [open, setOpen] = React.useState(false);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(undefined);
    };

    const displayValue = React.useMemo(() => {
        if (!value?.from || !isValidDate(value.from)) return <span>{placeholder}</span>;

        const fromStr = format(value.from, 'dd MMM yyyy', { locale: idLocale });

        if (value.to && isValidDate(value.to)) {
            const toStr = format(value.to, 'dd MMM yyyy', { locale: idLocale });
            return (
                <>
                    {fromStr} – {toStr}
                </>
            );
        }

        return fromStr;
    }, [value, placeholder]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'h-9 justify-start text-left font-normal',
                        !value?.from && 'text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon className="mr-2 size-4" />
                    {displayValue}
                    {value?.from && (
                        <XIcon
                            className="ml-auto size-4 opacity-50 hover:opacity-100"
                            onClick={handleClear}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={isValidDate(value?.from) ? value?.from : undefined}
                    selected={value}
                    onSelect={onChange}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
}
