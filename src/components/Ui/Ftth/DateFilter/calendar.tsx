import { useContext } from "react";
import { useDateFormatter } from "react-aria";
import {
  Calendar as AriaCalendar,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  CalendarStateContext,
} from "react-aria-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { CalendarCell } from "./cell";

const CalendarTitle = () => {
  const context = useContext(CalendarStateContext);

  if (!context) {
    throw new Error("<CalendarTitle /> must be used within a <Calendar /> component.");
  }

  const formatter = useDateFormatter({
    month: "long",
    year: "numeric",
    calendar: context.visibleRange.start.calendar.identifier,
    timeZone: context.timeZone,
  });

  return formatter.format(context.visibleRange.start.toDate(context.timeZone));
};

export const Calendar = ({ highlightedDates = [], ...props }) => {
  return (
    <AriaCalendar
      className="flex items-start bg-white dark:bg-gray-900 rounded-lg overflow-hidden"
      {...props}
    >
      <div className="flex flex-col gap-4 px-4 py-4 w-full">
        <header className="relative flex items-center justify-between">
          <Button
            slot="previous"
            iconLeading={ChevronLeft}
            size="sm"
            variant="tertiary"
            className="size-8 rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900 text-gray-500"
          />

          <h2 className="absolute top-1/2 start-1/2 transform -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700 dark:text-white">
            <CalendarTitle />
          </h2>

          <Button
            slot="next"
            iconLeading={ChevronRight}
            size="sm"
            variant="tertiary"
            className="size-8 rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900 text-gray-500"
          />
        </header>

        <div className="mt-2">
          <AriaCalendarGrid weekdayStyle="short" className="w-full">
            <AriaCalendarGridHeader className="border-b dark:border-gray-700 border-gray-200">
              {(day) => (
                <AriaCalendarHeaderCell className="p-0">
                  <div className="flex size-10 items-center justify-center text-xs font-medium text-gray-500 dark:text-white">
                    {day.slice(0, 2)}
                  </div>
                </AriaCalendarHeaderCell>
              )}
            </AriaCalendarGridHeader>
            <AriaCalendarGridBody className="[&_td]:p-0 [&_tr]:border-b dark:[&_tr]:border-gray-700 [&_tr]:border-gray-100">
              {(date) => (
                <CalendarCell
                  date={date}
                  isHighlighted={highlightedDates.some((highlightedDate) => highlightedDate.compare(date) === 0)}
                />
              )}
            </AriaCalendarGridBody>
          </AriaCalendarGrid>
        </div>
      </div>
    </AriaCalendar>
  );
};
