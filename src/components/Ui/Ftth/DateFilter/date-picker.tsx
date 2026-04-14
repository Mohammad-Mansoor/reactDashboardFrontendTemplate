import { getLocalTimeZone, today } from "@internationalized/date";
import { useControlledState } from "@react-stately/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import clsx from "clsx";
import { useDateFormatter } from "react-aria";
import { DatePicker as AriaDatePicker, Dialog as AriaDialog, Group as AriaGroup, Popover as AriaPopover } from "react-aria-components";
import { Button } from "./button";
import { Calendar } from "./calendar";

const highlightedDates = [today(getLocalTimeZone())];

export const DatePicker = ({ value: valueProp, defaultValue, onChange, onApply, onCancel, ...props }) => {
    const formatter = useDateFormatter({
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const [value, setValue] = useControlledState(valueProp, defaultValue || null, onChange);

    const formattedDate = value ? formatter.format(value.toDate(getLocalTimeZone())) : "Select date";

    return (
        <AriaDatePicker shouldCloseOnSelect={false} {...props} value={value} onChange={setValue} className="w-full">
            <AriaGroup className="relative w-full">
                <Button 
                    size="md" 
                    variant="tertiary"
                    iconTrailing={CalendarIcon}
                    className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent text-gray-800 dark:text-white/90 hover:text-gray-800 dark:hover:text-white/90 focus:text-gray-800 dark:focus:text-white/90 active:text-gray-800 dark:active:text-white/90 px-4 py-2.5 text-sm flex items-center !justify-between hover:border-primary2 focus:border-primary2 focus:ring-4 focus:ring-primary2/12 transition-all duration-300 shadow-none !font-normal"
                >
                    <span className="truncate">{formattedDate}</span>
                </Button>
            </AriaGroup>
            <AriaPopover
                offset={8}
                placement="bottom right"
                className={({ isEntering, isExiting }) =>
                    clsx(
                        "will-change-transform",
                        isEntering &&
                            "duration-150 ease-out animate-in fade-in placement-right:origin-left placement-right:slide-in-from-left-0.5 placement-top:origin-bottom placement-top:slide-in-from-bottom-0.5 placement-bottom:origin-top placement-bottom:slide-in-from-top-0.5",
                        isExiting &&
                            "duration-100 ease-in animate-out fade-out placement-right:origin-left placement-right:slide-out-to-left-0.5 placement-top:origin-bottom placement-top:slide-out-to-bottom-0.5 placement-bottom:origin-top placement-bottom:slide-out-to-top-0.5",
                    )
                }
            >
                <AriaDialog className="rounded-2xl bg-primary shadow-xl ring ring-secondary_alt">
                    {({ close }) => (
                        <>
                            <div className="flex px-6 py-5">
                                <Calendar highlightedDates={highlightedDates} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 dark:border-gray-700 border-t border-secondary p-4">
                                <Button
                                    size="md"
                                    color="secondary"
                                    onClick={() => {
                                        onCancel?.();
                                        close();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="md"
                                    color="primary"
                                    onClick={() => {
                                        onApply?.();
                                        close();
                                    }}
                                >
                                    Apply
                                </Button>
                            </div>
                        </>
                    )}
                </AriaDialog>
            </AriaPopover>
        </AriaDatePicker>
    );
};
