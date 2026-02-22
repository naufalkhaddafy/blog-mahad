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

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'h-9 justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon className="mr-2 size-4" />
                    {value?.from ? (
                        value.to ? (
                            <>
                                {format(value.from, 'dd MMM yyyy', { locale: idLocale })} –{' '}
                                {format(value.to, 'dd MMM yyyy', { locale: idLocale })}
                            </>
                        ) : (
                            format(value.from, 'dd MMM yyyy', { locale: idLocale })
                        )
                    ) : (
                        <span>{placeholder}</span>
                    )}
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
                    defaultMonth={value?.from}
                    selected={value}
                    onSelect={onChange}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
}
