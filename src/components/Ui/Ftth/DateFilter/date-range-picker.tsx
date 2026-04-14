import { useMemo, useState } from "react";
import { endOfMonth, endOfWeek, getLocalTimeZone, startOfMonth, startOfWeek, today } from "@internationalized/date";
import { useControlledState } from "@react-stately/utils";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useDateFormatter } from "react-aria";
import { DateRangePicker as AriaDateRangePicker, Dialog as AriaDialog, Group as AriaGroup, Popover as AriaPopover, useLocale } from "react-aria-components";
import { Button } from "./button";
import { DateInput } from "./date-input";
import { RangeCalendar } from "./range-calendar";
import { RangePresetButton } from "./range-preset";

const now = today(getLocalTimeZone());
const highlightedDates = [today(getLocalTimeZone())];

interface DateRangePickerProps {
    value?: any;
    defaultValue?: any;
    onChange?: (value: any) => void;
    onApply?: () => void;
    onCancel?: () => void;
    [key: string]: any;
}

export const DateRangePicker = ({ 
    value: valueProp = null, 
    defaultValue = null, 
    onChange = (val: any) => {}, 
    onApply, 
    onCancel, 
    ...props 
}: DateRangePickerProps) => {
    const { locale } = useLocale();
    const formatter = useDateFormatter({
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const [value, setValue] = useControlledState(valueProp, defaultValue || null, onChange);
    const [focusedValue, setFocusedValue] = useState(null);

    const formattedStartDate = value?.start ? formatter.format(value.start.toDate(getLocalTimeZone())) : "Select date";
    const formattedEndDate = value?.end ? formatter.format(value.end.toDate(getLocalTimeZone())) : "Select date";

    const presets = useMemo(
        () => ({
            today: { label: "Today", value: { start: now, end: now } },
            yesterday: { label: "Yesterday", value: { start: now.subtract({ days: 1 }), end: now.subtract({ days: 1 }) } },
            thisWeek: { label: "This week", value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) } },
            lastWeek: {
                label: "Last week",
                value: {
                    start: startOfWeek(now, locale).subtract({ weeks: 1 }),
                    end: endOfWeek(now, locale).subtract({ weeks: 1 }),
                },
            },
            thisMonth: { label: "This month", value: { start: startOfMonth(now), end: endOfMonth(now) } },
            lastMonth: {
                label: "Last month",
                value: {
                    start: startOfMonth(now).subtract({ months: 1 }),
                    end: endOfMonth(now).subtract({ months: 1 }),
                },
            },
            thisYear: { label: "This year", value: { start: startOfMonth(now.set({ month: 1 })), end: endOfMonth(now.set({ month: 12 })) } },
            lastYear: {
                label: "Last year",
                value: {
                    start: startOfMonth(now.set({ month: 1 }).subtract({ years: 1 })),
                    end: endOfMonth(now.set({ month: 12 }).subtract({ years: 1 })),
                },
            },
            allTime: {
                label: "All time",
                value: {
                    start: now.set({ year: 2000, month: 1, day: 1 }),
                    end: now,
                },
            },
        }),
        [locale]
    );

    return (
      <AriaDateRangePicker
        aria-label="Date range picker"
        shouldCloseOnSelect={false}
        {...props}
        value={value}
        onChange={setValue}
      >
        <AriaGroup>
          <Button
            size="md"
            variant="tertiary"
            iconLeading={<CalendarIcon size={18} />}
            className="border border-slate-200 dark:border-white/10 dark:bg-white/5 text-slate-700 dark:text-white/80 hover:border-primary1 !rounded-xl !h-10 px-4 transition-all"
          >
            {!value ? (
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Select Range</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-slate-700 dark:text-white/90 font-black uppercase tracking-widest text-[11px]">
                  {formattedStartDate} – {formattedEndDate}
                </span>
                <div 
                  className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-all cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue(null);
                  }}
                >
                  <X size={14} />
                </div>
              </div>
            )}
          </Button>
        </AriaGroup>
        <AriaPopover
          placement="bottom right"
          offset={8}
          className={({ isEntering, isExiting }) => {
            let classes =
              "will-change-transform shadow-lg rounded-lg overflow-hidden";

            if (isEntering) {
              classes += " duration-150 ease-out animate-in fade-in";
            }

            if (isExiting) {
              classes += " duration-100 ease-in animate-out fade-out";
            }

            return classes;
          }}
        >
          <AriaDialog className="flex bg-white">
            {({ close }) => (
              <div className="flex w-full max-w-200">
                <div className="hidden w-48 flex-col gap-1 border-r border-gray-200 p-3 lg:flex">
                  {Object.values(presets).map((preset) => (
                    <RangePresetButton
                      key={preset.label}
                      value={preset.value}
                      onClick={() => {
                        setValue(preset.value);
                        setFocusedValue(preset.value.start);
                      }}
                    >
                      {preset.label}
                    </RangePresetButton>
                  ))}
                </div>
                <div className="flex flex-1 flex-col">
                  <RangeCalendar
                    focusedValue={focusedValue}
                    onFocusChange={setFocusedValue}
                    highlightedDates={highlightedDates}
                    presets={{
                      lastWeek: presets.lastWeek,
                      lastMonth: presets.lastMonth,
                      lastYear: presets.lastYear,
                    }}
                  />
                  <div className="flex flex-col gap-3 border-t dark:border-gray-700 border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <DateInput
                        slot="start"
                        className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                      <div className="text-gray-400">–</div>
                      <DateInput
                        slot="end"
                        className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        size="md"
                        variant="tertiary"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold uppercase tracking-widest text-xs"
                        onClick={() => {
                          setValue(null);
                          close();
                        }}
                      >
                        Clear Range
                      </Button>
                      <Button
                        size="md"
                        variant="tertiary"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold uppercase tracking-widest text-xs"
                        onClick={() => {
                          if (onCancel) onCancel();
                          close();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="md"
                        variant="primary"
                        className="bg-primary1 text-white hover:bg-primary3"
                        onClick={() => {
                          if (onApply) onApply();
                          close();
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AriaDialog>
        </AriaPopover>
      </AriaDateRangePicker>
    );
};