import { useMemo, useState } from "react";
import {
  endOfMonth,
  endOfWeek,
  getLocalTimeZone,
  startOfMonth,
  startOfWeek,
  today,
} from "@internationalized/date";
import {
  DateRangePicker as AriaDateRangePicker,
  Dialog as AriaDialog,
  useLocale,
} from "react-aria-components";
import { Button } from "./button";
import { RangeCalendar } from "./range-calendar";
import { DateInput } from "./date-input";
import { RangePresetButton } from "./range-preset";
import { useTranslation } from "react-i18next";

const now = today(getLocalTimeZone());

export const FTTHCustomDateFilter = ({ onApply, onClose }) => {
  const { locale } = useLocale();
  const { t, i18n } = useTranslation();
  const isRTL =
    i18n.language === "ps" || i18n.language === "dr" || i18n.language === "fa";
  const [focusedValue, setFocusedValue] = useState(null);
  const [value, setValue] = useState({
    start: now.subtract({ days: 7 }),
    end: now,
  });

  const presets = useMemo(
    () => ({
      today: { label: t("dateFilter.today"), value: { start: now, end: now } },
      yesterday: {
        label: t("dateFilter.yesterday"),
        value: {
          start: now.subtract({ days: 1 }),
          end: now.subtract({ days: 1 }),
        },
      },
      thisWeek: {
        label: t("dateFilter.thisWeek"),
        value: {
          start: startOfWeek(now, locale),
          end: endOfWeek(now, locale),
        },
      },
      lastWeek: {
        label: t("dateFilter.lastWeek"),
        value: {
          start: startOfWeek(now, locale).subtract({ weeks: 1 }),
          end: endOfWeek(now, locale).subtract({ weeks: 1 }),
        },
      },
      thisMonth: {
        label: t("dateFilter.thisMonth"),
        value: {
          start: startOfMonth(now),
          end: endOfMonth(now),
        },
      },
      lastMonth: {
        label: t("dateFilter.lastMonth"),
        value: {
          start: startOfMonth(now).subtract({ months: 1 }),
          end: endOfMonth(now).subtract({ months: 1 }),
        },
      },
      thisYear: {
        label: t("dateFilter.thisYear"),
        value: {
          start: startOfMonth(now.set({ month: 1 })),
          end: endOfMonth(now.set({ month: 12 })),
        },
      },
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
    [locale, now, t],
  );

  const handleApply = () => {
    const startDate = value.start.toDate(getLocalTimeZone()).toISOString();
    const endDate = value.end.toDate(getLocalTimeZone()).toISOString();
    if (onApply) onApply(startDate, endDate);
  };

  return (
    <AriaDateRangePicker
      aria-label="Date range picker"
      value={value}
      onChange={setValue}
    >
      <AriaDialog className="flex z-[9999] flex-col lg:flex-row w-full max-w-4xl bg-white/80 dark:bg-[#0c1221]/80 backdrop-blur-xl rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-white/5 overflow-hidden relative">
        <div
          className={`hidden w-52 flex-col gap-1.5 p-5 ${isRTL ? "border-l text-right" : "border-r text-left"} bg-slate-50/50 dark:bg-white/2 border-slate-100 dark:border-white/5 lg:flex`}
        >
          <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] px-3 mb-2">
            {t("dateFilter.presets", "Presets")}
          </span>
          {Object.values(presets).map((preset) => (
            <RangePresetButton
              key={preset.label}
              value={preset.value}
              onClick={() => {
                setFocusedValue(preset.value.start);
                setValue(preset.value);
              }}
              className="px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 hover:bg-white dark:hover:bg-white/5 hover:text-primary1 transition-all"
            >
              {preset.label}
            </RangePresetButton>
          ))}
        </div>
        <div className="flex flex-col flex-1 overflow-x-auto bg-white dark:bg-transparent">
          <RangeCalendar
            focusedValue={focusedValue}
            onFocusChange={setFocusedValue}
            presets={{
              lastWeek: presets.lastWeek,
              lastMonth: presets.lastMonth,
              lastYear: presets.lastYear,
            }}
          />
          <div className="flex flex-col gap-4 p-5 border-t border-slate-100 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-transparent">
            <div className="flex items-center gap-3 min-w-0">
              <DateInput
                slot="start"
                className="w-32 border border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-white rounded-xl px-3 py-2 text-sm font-bold tracking-tight"
              />
              <div className="text-slate-300 dark:text-white/10 font-bold flex-shrink-0">–</div>
              <DateInput
                slot="end"
                className="w-32 border border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-white rounded-xl px-3 py-2 text-sm font-bold tracking-tight"
              />
            </div>
            <div className="flex gap-3">
              <Button
                size="md"
                variant="tertiary"
                className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold uppercase tracking-widest text-xs"
                onClick={() => {
                  setValue(null);
                  if (onApply) onApply(null, null);
                }}
              >
                {t("dateFilter.clear", "Clear Range")}
              </Button>
              <Button
                size="md"
                variant="tertiary"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold uppercase tracking-widest text-xs"
                onClick={onClose}
              >
                {t("dateFilter.cancel", "Cancel")}
              </Button>
              <Button 
                size="md" 
                variant="primary" 
                className="!rounded-xl bg-primary1 text-white hover:bg-primary3 px-6 shadow-lg shadow-primary1/20 font-bold uppercase tracking-widest text-xs"
                onClick={handleApply}
              >
                {t("dateFilter.apply", "Apply Range")}
              </Button>
            </div>
          </div>
        </div>
      </AriaDialog>
    </AriaDateRangePicker>
  );
};
