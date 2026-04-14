import { Fragment, useContext, useState } from "react";
import { useDateFormatter } from "react-aria";
import {
    CalendarGrid as AriaCalendarGrid,
    CalendarGridBody as AriaCalendarGridBody,
    CalendarGridHeader as AriaCalendarGridHeader,
    CalendarHeaderCell as AriaCalendarHeaderCell,
    RangeCalendar as AriaRangeCalendar,
    RangeCalendarContext,
    RangeCalendarStateContext,
    useSlottedContext,
} from "react-aria-components";

export { RangeCalendarContext };
import { Button } from "./button";
import { useBreakpoint } from "../../../../hooks/use-breakpoint";
import { CalendarCell } from "./cell";
import { DateInput } from "./date-input";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const RangeCalendarContextProvider = ({ children }) => {
    const [value, setValue] = useState<any>(null);
    const [focusedValue, setFocusedValue] = useState<any>(undefined);

    const onChange = (date: any) => {
        setValue(date);
    };

    const onFocusChange = (date: any) => {
        setFocusedValue(date);
    };

    return (
        <RangeCalendarContext.Provider value={{ value, onChange, focusedValue, onFocusChange }}>
            {children}
        </RangeCalendarContext.Provider>
    );
};

const RangeCalendarTitle = ({ part }) => {
    const context = useContext(RangeCalendarStateContext);

    if (!context) {
        throw new Error("<RangeCalendarTitle /> must be used within a <RangeCalendar /> component.");
    }

    const formatter = useDateFormatter({
        month: "long",
        year: "numeric",
        calendar: context.visibleRange.start.calendar.identifier,
        timeZone: context.timeZone,
    });

    return part === "start"
        ? formatter.format(context.visibleRange.start.toDate(context.timeZone))
        : formatter.format(context.visibleRange.end.toDate(context.timeZone));
};

const MobilePresetButton = ({ value, children, ...props }) => {
    const context = useContext(RangeCalendarStateContext);

    return (
        <Button
            {...props}
            slot={null}
            size="sm"
            variant="tertiary"
            onClick={() => {
                if (context) {
                    context.setValue(value);
                    context.setFocusedDate(value.start);
                }
            }}
            className="text-sm font-medium text-gray-600 hover:bg-gray-100 px-3 py-2"
        >
            {children}
        </Button>
    );
};

export const RangeCalendar = ({ presets, ...props }) => {
    const isDesktop = useBreakpoint("md");
    const context = useSlottedContext(RangeCalendarContext);

    const ContextWrapper = context ? Fragment : RangeCalendarContextProvider;

    return (
        <ContextWrapper>
            <AriaRangeCalendar
                className="flex items-start bg-white dark:bg-gray-900 rounded-lg  overflow-hidden"
                visibleDuration={{
                    months: isDesktop ? 2 : 1,
                }}
                {...props}
            >
                <div className="flex flex-col gap-5 px-5 py-5 w-full">
                    <header className="relative flex items-center justify-between">
                        <Button 
                            slot="previous" 
                            iconLeading={ChevronLeft} 
                            size="sm" 
                            variant="tertiary"
                            className="size-9 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 dark:text-white/60 text-slate-400 transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/5" 
                        />

                        <h2 className="absolute top-1/2 start-1/2 transform -translate-x-1/2 rtl:translate-x-1/2 dark:text-white/90 -translate-y-1/2 text-[13px] font-bold uppercase tracking-widest text-slate-700">
                            <RangeCalendarTitle part="start" />
                        </h2>

                        <Button 
                            slot="next" 
                            iconLeading={ChevronRight} 
                            size="sm" 
                            variant="tertiary"
                            className="size-9 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 dark:text-white/60 text-slate-400 md:hidden" 
                        />
                    </header>

                    {!isDesktop && (
                        <div className="flex items-center gap-2 md:hidden">
                            <DateInput 
                                slot="start" 
                                className="flex-1 border dark:border-gray-700  border-gray-300  rounded-md px-3 py-2 text-sm"
                            />
                            <div className="text-gray-400">–</div>
                            <DateInput 
                                slot="end" 
                                className="flex-1 border dark:border-gray-700 border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                        </div>
                    )}

                    {!isDesktop && presets && (
                        <div className="mt-1 flex flex-wrap gap-2 px-1 md:hidden">
                            {Object.values(presets).map((preset: any) => (
                                <MobilePresetButton key={preset.label} value={preset.value}>
                                    {preset.label}
                                </MobilePresetButton>
                            ))}
                        </div>
                    )}

                    <div className="mt-2">
                        <AriaCalendarGrid weekdayStyle="short" className="w-full">
                            <AriaCalendarGridHeader className="border-b dark:border-gray-700 dark:border-gray-700 border-gray-200">
                                {(day) => (
                                    <AriaCalendarHeaderCell className="p-0">
                                        <div className="flex size-10 items-center justify-center text-xs dark:text-white font-medium text-gray-500">
                                            {day.slice(0, 2)}
                                        </div>
                                    </AriaCalendarHeaderCell>
                                )}
                            </AriaCalendarGridHeader>
                            <AriaCalendarGridBody className="[&_td]:p-0 [&_tr]:border-b  dark:[&_tr]:border-gray-700 [&_tr]:border-gray-100">
                                {(date) => <CalendarCell date={date} isHighlighted={false} />}
                            </AriaCalendarGridBody>
                        </AriaCalendarGrid>
                    </div>
                </div>

                {isDesktop && (
                    <div className="flex flex-col gap-5 border-l border-slate-100 dark:border-white/5 px-5 py-5 w-full">
                        <header className="relative flex items-center justify-end">
                            <h2 className="absolute top-1/2 start-1/2 transform -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 text-[13px] font-bold uppercase tracking-widest dark:text-white/90 text-slate-700">
                                <RangeCalendarTitle part="end" />
                            </h2>

                            <Button 
                                slot="next" 
                                iconLeading={ChevronRight} 
                                size="sm" 
                                variant="tertiary"
                                className="size-9 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 dark:text-white/60 text-slate-400" 
                            />
                        </header>


                        <div className="mt-2">
                            <AriaCalendarGrid weekdayStyle="short" offset={{ months: 1 }} className="w-full">
                                <AriaCalendarGridHeader className="border-b  dark:border-gray-700 border-gray-200">
                                    {(day) => (
                                        <AriaCalendarHeaderCell className="p-0">
                                            <div className="flex size-10 items-center dark:text-white  justify-center text-xs font-medium text-gray-500">
                                                {day.slice(0, 2)}
                                            </div>
                                        </AriaCalendarHeaderCell>
                                    )}
                                </AriaCalendarGridHeader>
                                <AriaCalendarGridBody className="[&_td]:p-0 [&_tr]:border-b dark:[&_tr]:border-gray-700 [&_tr]:border-gray-100">
                                    {(date) => <CalendarCell date={date} isHighlighted={false} />}
                                </AriaCalendarGridBody>
                            </AriaCalendarGrid>
                        </div>
                    </div>
                )}
            </AriaRangeCalendar>
        </ContextWrapper>
    );
};