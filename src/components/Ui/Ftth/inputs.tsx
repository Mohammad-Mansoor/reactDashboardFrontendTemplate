import React, { forwardRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// ==========================================
// Base Input Element
// ==========================================
export interface InputElementProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean | string;
  success?: boolean;
  hint?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  actionElement?: React.ReactNode; // For search bars/appended buttons
  containerClassName?: string;
}

export const InputElement = forwardRef<HTMLInputElement, InputElementProps>(
  (
    {
      label,
      type = "text",
      id,
      className = "",
      containerClassName = "",
      error = false,
      success = false,
      hint,
      leftIcon,
      rightIcon,
      onRightIconClick,
      actionElement,
      ...props
    },
    ref
  ) => {
    // Elegant border and focus rings
    let stateClasses = "border-primary5 dark:border-gray-700/80 focus:border-primary2 focus:ring-primary2/20 dark:focus:border-primary2";
    if (error) {
      stateClasses = "border-red-500 dark:border-red-500/80 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-100";
    } else if (success) {
      stateClasses = "border-emerald-500 dark:border-emerald-500/80 focus:border-emerald-500 focus:ring-emerald-500/20 text-emerald-900 dark:text-emerald-100";
    }

    if (props.disabled) {
      stateClasses = "border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 opacity-70 cursor-not-allowed";
    }

    const inputClasses = `
      w-full h-10 px-3 py-2 text-[14px] font-medium leading-tight
      bg-transparent dark:bg-transparent text-gray-800 dark:text-white/90
      placeholder-gray-400 dark:placeholder-gray-500
      border rounded-sm shadow-theme-xs
      outline-none focus:ring-4 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
      ${leftIcon ? "pl-10" : ""}
      ${rightIcon ? "pr-10" : ""}
      ${stateClasses}
      ${className}
    `;

    return (
      <div className={`relative flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-0.5 tracking-wide">
            {label} {props.required && <span className="text-red-500 dark:text-red-400">*</span>}
          </label>
        )}

        <div className="relative w-full flex items-center group">
          {leftIcon && (
            <div className="absolute left-3 text-gray-400 group-focus-within:text-primary2 transition-colors pointer-events-none flex items-center justify-center z-10">
              {leftIcon}
            </div>
          )}

          <input ref={ref} type={type} id={id} className={inputClasses.replace(/\s+/g, " ").trim()} {...props} />

          {rightIcon && (
            <div
              onClick={onRightIconClick}
              className={`absolute right-3 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors flex items-center justify-center z-10 ${
                onRightIconClick ? "cursor-pointer pointer-events-auto" : "pointer-events-none"
              }`}
            >
              {rightIcon}
            </div>
          )}

          {actionElement}
        </div>

        {(hint || typeof error === "string") && (
          <p
            className={`text-[12.5px] font-medium ml-0.5 mt-0.5 tracking-wide ${
              error
                ? "text-red-500 dark:text-red-400"
                : success
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {typeof error === "string" ? error : hint}
          </p>
        )}
      </div>
    );
  }
);


// ==========================================
// Password Input Element
// ==========================================
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputElementProps, "type" | "rightIcon">>((props, ref) => {
  const [show, setShow] = useState(false);
  return (
    <InputElement
      ref={ref}
      type={show ? "text" : "password"}
      {...props}
      rightIcon={
        <div onClick={() => setShow(!show)} className="h-full px-2 flex items-center justify-center hover:text-primary2">
           {show ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
        </div>
      }
      onRightIconClick={() => setShow(!show)}
    />
  );
});


// ==========================================
// Search Input Element
// ==========================================
export interface SearchInputElementProps extends InputElementProps {
  onSearch?: () => void;
  icon?: React.ReactNode;
  iconHeight?: string;
  iconWidth?: string;
}

export const SearchInputElement = forwardRef<HTMLInputElement, SearchInputElementProps>(
  (
    {
      onSearch,
      icon = <CiSearch />,
      iconHeight = "h-5",
      iconWidth = "w-5",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <InputElement
        ref={ref}
        {...props}
        className={`pr-[52px] ${className}`} // Ensure text doesn't overlap the button
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSearch) onSearch();
          if (props.onKeyDown) props.onKeyDown(e);
        }}
        actionElement={
          <button
            type="button"
            onClick={onSearch}
            className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center bg-primary2 hover:bg-primary1 text-white transition-all duration-300 ease-out rounded-r-sm z-10 focus:outline-none"
          >
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
              className: `${iconHeight} ${iconWidth}`,
            })}
          </button>
        }
      />
    );
  }
);


// ==========================================
// Textarea Element
// ==========================================
export interface TextareaElementProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean | string;
  success?: boolean;
  hint?: React.ReactNode;
  containerClassName?: string;
}

export const TextareaElement = forwardRef<HTMLTextAreaElement, TextareaElementProps>(
  (
    {
      label,
      id,
      className = "",
      containerClassName = "",
      error = false,
      success = false,
      hint,
      ...props
    },
    ref
  ) => {
    let stateClasses = "border-primary5 dark:border-gray-700/80 focus:border-primary2 focus:ring-primary2/20 dark:focus:border-primary2";
    if (error) {
      stateClasses = "border-red-500 dark:border-red-500/80 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-100";
    } else if (success) {
      stateClasses = "border-emerald-500 dark:border-emerald-500/80 focus:border-emerald-500 focus:ring-emerald-500/20 text-emerald-900 dark:text-emerald-100";
    }

    if (props.disabled) {
      stateClasses = "border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 opacity-70 cursor-not-allowed";
    }

    const inputClasses = `
      w-full min-h-[100px] px-3 py-2.5 text-[14px] font-medium leading-relaxed
      bg-transparent dark:bg-transparent text-gray-800 dark:text-white/90
      placeholder-gray-400 dark:placeholder-gray-500
      border rounded-sm shadow-theme-xs
      outline-none focus:ring-4 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
      resize-y
      ${stateClasses}
      ${className}
    `;

    return (
      <div className={`relative flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-0.5 tracking-wide">
            {label} {props.required && <span className="text-red-500 dark:text-red-400">*</span>}
          </label>
        )}

        <textarea ref={ref} id={id} className={inputClasses.replace(/\s+/g, " ").trim()} {...props} />

        {(hint || typeof error === "string") && (
          <p
            className={`text-[12.5px] font-medium ml-0.5 mt-0.5 tracking-wide ${
              error
                ? "text-red-500 dark:text-red-400"
                : success
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {typeof error === "string" ? error : hint}
          </p>
        )}
      </div>
    );
  }
);
