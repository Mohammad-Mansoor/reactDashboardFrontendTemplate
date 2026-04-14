import { getDayOfWeek, getLocalTimeZone, isToday } from "@internationalized/date";
import { CalendarCell as AriaCalendarCell, RangeCalendarContext, useLocale, useSlottedContext } from "react-aria-components";

export const CalendarCell = ({ date, isHighlighted, ...props }) => {
    const { locale } = useLocale();
    const dayOfWeek = getDayOfWeek(date, locale);
    const rangeCalendarContext = useSlottedContext(RangeCalendarContext);

    const isRangeCalendar = !!rangeCalendarContext;
    const start = rangeCalendarContext?.value?.start;
    const end = rangeCalendarContext?.value?.end;

    const isAfterOrOnStart = start && date.compare(start) >= 0;
    const isBeforeOrOnEnd = end && date.compare(end) <= 0;
    const isInRange = isAfterOrOnStart && isBeforeOrOnEnd;
    const isTodayDate = isToday(date, getLocalTimeZone());

    return (
        <AriaCalendarCell
            {...props}
            date={date}
            className={({ 
                isDisabled, 
                isSelectionStart, 
                isSelectionEnd, 
                isSelected, 
                isOutsideMonth 
            }) => {
                const isRoundedLeft = isSelectionStart || dayOfWeek === 0;
                const isRoundedRight = isSelectionEnd || dayOfWeek === 6;
                
                let className = "relative h-10 w-10 focus:outline-none";
                
                if (isRoundedLeft) className += " rounded-s-full";
                if (isRoundedRight) className += " rounded-e-full";
                if (isInRange && isDisabled) className += " bg-primary1/12";
                if (isSelected && isRangeCalendar) className += " bg-primary1/12";
                if (isDisabled) className += " pointer-events-none";
                if (!isDisabled) className += " cursor-pointer";
                // if (isFocusVisible) className += " z-10 ring-2 ring-primary1 ring-inset";
                if (isRangeCalendar && isOutsideMonth) className += " hidden";
                
                return className;
            }}
        >
            {({ 
                isDisabled, 
                isFocusVisible, 
                isSelectionStart, 
                isSelectionEnd, 
                isSelected, 
                formattedDate 
            }) => {
                const markedAsSelected = isSelectionStart || isSelectionEnd || (isSelected && !isDisabled && !isRangeCalendar);
                const isStart = isSelectionStart;
                const isEnd = isSelectionEnd;
                const isRangeMiddle = isInRange && !isStart && !isEnd;
                
                let className = "relative flex h-full w-full items-center justify-center dark:text-white rounded-full text-sm";
                

                if (isDisabled) className += "  text-gray-400";
                if (!isDisabled && !markedAsSelected) className += " text-gray-700 hover:text-gray-900";
                
       
                if (markedAsSelected) className += " bg-primary1 text-white shadow-lg shadow-primary1/30 scale-105 z-10";
                if (isRangeMiddle) className += " bg-primary1/10 !rounded-none";
                if (!markedAsSelected && !isRangeMiddle && !isDisabled) className += " hover:bg-slate-100 dark:hover:bg-white/5";
                if (!markedAsSelected && isTodayDate) className += " border border-primary1/30 text-primary1 font-bold";

                if (isFocusVisible) className += " outline-2 outline-offset-2 outline-primary1";
                
                return (
                    <div className={className}>
                        {formattedDate}
                        
                        {(isHighlighted || isTodayDate) && !markedAsSelected && (
                            <div className={
                                `absolute bottom-1 start-1/2 h-1.5 w-1.5 -translate-x-1/2 rtl:translate-x-1/2 rounded-full ${
                                    isDisabled 
                                        ? "bg-primary1/20" 
                                        : isTodayDate 
                                            ? "bg-primary1" 
                                            : "bg-yellow-400"
                                }`
                            } />
                        )}
                    </div>
                );
            }}
        </AriaCalendarCell>
    );
};