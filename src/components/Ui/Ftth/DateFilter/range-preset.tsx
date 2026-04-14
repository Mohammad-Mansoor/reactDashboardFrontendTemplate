import { CalendarDate } from "@internationalized/date";
import { ReactNode } from "react";
import { useSlottedContext } from "react-aria-components";
import { RangeCalendarContext } from "./range-calendar";

interface RangePresetButtonProps {
    value: { start: CalendarDate; end: CalendarDate };
    className?: string;
    children: ReactNode;
    onClick?: () => void;
    [key: string]: any;
}

export const RangePresetButton = ({ value, className = "", children, ...props }: RangePresetButtonProps) => {
    const context = useSlottedContext<{ value?: { start?: CalendarDate; end?: CalendarDate } }>(RangeCalendarContext);
    
    const isSelected = context?.value?.start?.compare(value.start) === 0 && 
                      context?.value?.end?.compare(value.end) === 0;

    return (
        <button
            {...props}
            className={`
                cursor-pointer rounded-md px-3 dark:text-white py-2 text-start text-sm font-medium 
                transition-colors duration-100 ease-linear
                focus-visible:outline-2 focus-visible:outline-primary1 focus-visible:outline-offset-2
                ${
                    isSelected 
                        ? "bg-primary1 text-white  hover:bg-primary3" 
                        : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900"
                }
                ${className || ''}
            `}
        >
            {children}
        </button>
    );
};