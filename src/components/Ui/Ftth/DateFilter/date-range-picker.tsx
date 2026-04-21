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
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    const { locale } = useLocale();
    const formatter = useDateFormatter({
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const [value, setValue] = useControlledState(valueProp, defaultValue || null, onChange);
    const [focusedValue, setFocusedValue] = useState(null);

    const formattedStartDate = value?.start ? formatter.format(value.start.toDate(getLocalTimeZone())) : t("dateFilter.select_date");
    const formattedEndDate = value?.end ? formatter.format(value.end.toDate(getLocalTimeZone())) : t("dateFilter.select_date");
 
    const presets = useMemo(
        () => ({
            today: { label: t("dateFilter.today"), value: { start: now, end: now } },
            yesterday: { label: t("dateFilter.yesterday"), value: { start: now.subtract({ days: 1 }), end: now.subtract({ days: 1 }) } },
            thisWeek: { label: t("dateFilter.thisWeek"), value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) } },
            lastWeek: {
                label: t("dateFilter.lastWeek"),
                value: {
                    start: startOfWeek(now, locale).subtract({ weeks: 1 }),
                    end: endOfWeek(now, locale).subtract({ weeks: 1 }),
                },
            },
            thisMonth: { label: t("dateFilter.thisMonth"), value: { start: startOfMonth(now), end: endOfMonth(now) } },
            lastMonth: {
                label: t("dateFilter.lastMonth"),
                value: {
                    start: startOfMonth(now).subtract({ months: 1 }),
                    end: endOfMonth(now).subtract({ months: 1 }),
                },
            },
            thisYear: { label: t("dateFilter.thisYear"), value: { start: startOfMonth(now.set({ month: 1 })), end: endOfMonth(now.set({ month: 12 })) } },
            lastYear: {
                label: t("dateFilter.lastYear"),
                value: {
                    start: startOfMonth(now.set({ month: 1 }).subtract({ years: 1 })),
                    end: endOfMonth(now.set({ month: 12 }).subtract({ years: 1 })),
                },
            },
            allTime: {
                label: t("dateFilter.allTime"),
                value: {
                    start: now.set({ year: 2000, month: 1, day: 1 }),
                    end: now,
                },
            },
        }),
        [locale, t]
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
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">{t("dateFilter.select_range")}</span>
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
          placement="bottom"
          offset={8}
          containerPadding={12}
          isNonModal={true}
          className={({ isEntering, isExiting }) => {
             // 🌌 THE MAGIC: Intelligent Viewport-Aware Popover
             let classes = "z-[9999] transition-all duration-300 pointer-events-auto bg-white/40 backdrop-blur-md rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]";
             
             if (isEntering) classes += " animate-in zoom-in-95 fade-in duration-200";
             if (isExiting) classes += " animate-out zoom-out-95 fade-out duration-150";
             return classes;
          }}
        >
          <AriaDialog className="outline-none">
            {({ close }) => (
               <div className="relative flex flex-col md:flex-row w-[calc(100vw-24px)] md:w-full md:max-w-3xl bg-white dark:bg-[#0c1221] border border-slate-200 dark:border-white/5 rounded-2xl max-h-[min(88vh,600px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10 transition-all">
                  <div className="hidden w-48 flex-col gap-1 border-r border-gray-200 dark:border-white/5 p-3 lg:flex bg-slate-50/50 dark:bg-white/2">
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
                   <div className="flex flex-col gap-3 border-t dark:border-white/5 border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                       <DateInput
                        slot="start"
                        className="w-28 sm:w-32 border border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-md px-3 py-2 text-sm"
                      />
                      <div className="text-gray-400 font-bold">–</div>
                      <DateInput
                        slot="end"
                        className="w-28 sm:w-32 border border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                      <Button
                        size="md"
                        variant="tertiary"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold uppercase tracking-widest text-xs"
                        onClick={() => {
                          setValue(null);
                          close();
                        }}
                      >
                        {t("dateFilter.clear_range")}
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
                        {t("dateFilter.cancel")}
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
                        {t("dateFilter.apply")}
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