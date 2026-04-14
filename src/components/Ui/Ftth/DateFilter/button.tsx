import React, { isValidElement } from "react";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";

interface ButtonProps {
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "primary" | "secondary" | "tertiary" | "destructive" | "outline-primary" | "outline-secondary" | "outline-destructive" | "link-primary" | "link-gray" | "link-destructive";
    iconLeading?: any;
    iconTrailing?: any;
    isLoading?: boolean;
    isDisabled?: boolean;
    showTextWhileLoading?: boolean;
    href?: string;
    children?: React.ReactNode;
    className?: string;
    onClick?: (e: any) => void;
    [key: string]: any;
}

export const Button = ({
    size = "md",
    variant = "primary",
    children = null,
    className = "",
    iconLeading: IconLeading = null,
    iconTrailing: IconTrailing = null,
    isDisabled: disabled = false,
    isLoading: loading = false,
    showTextWhileLoading = false,
    ...otherProps
}: ButtonProps) => {
    const href = "href" in otherProps ? otherProps.href : undefined;
    const Component = href ? AriaLink : AriaButton;
    const isIcon = (IconLeading || IconTrailing) && !children;
    const isLink = variant.startsWith("link");


    let baseClasses = [
        "group relative inline-flex items-center justify-center",
        "whitespace-nowrap outline-none transition-all duration-100 ease-linear",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary1",
        "disabled:cursor-not-allowed disabled:opacity-70"
    ].join(" ");


    const sizeClasses = {
        sm: [
            "h-8 min-w-8 px-3 py-1.5 text-sm font-medium rounded-md",
            isIcon ? "px-2" : "",
        ].join(" "),
        md: [
            "h-10 min-w-10 px-4 py-2 text-sm font-medium rounded-md",
            isIcon ? "px-2.5" : "",
        ].join(" "),
        lg: [
            "h-11 min-w-11 px-4 py-2.5 text-base font-medium rounded-md",
            isIcon ? "px-3" : "",
        ].join(" "),
        xl: [
            "h-12 min-w-12 px-5 py-3 text-base font-medium rounded-md",
            isIcon ? "px-3.5" : "",
        ].join(" "),
    };


    const variantClasses = {

        primary: "bg-primary1 text-white hover:bg-primary3 focus:bg-primary3",
        secondary: "bg-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-700 text-gray-800 hover:bg-gray-300 focus:bg-gray-300",
        tertiary: "bg-transparent text-gray-700 hover:bg-gray-100 focus:bg-gray-100",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:bg-red-700",
        
    
        "outline-primary": "bg-transparent border border-[#CD0202] text-blue-600 hover:bg-blue-50 focus:bg-blue-50",
        "outline-secondary": "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:bg-gray-50",
        "outline-destructive": "bg-transparent border border-red-600 text-red-600 hover:bg-red-50 focus:bg-red-50",
        
    
        "link-primary": "bg-transparent text-blue-600 hover:text-blue-800 hover:underline focus:text-blue-800",
        "link-gray": "bg-transparent text-gray-600 hover:text-gray-800 hover:underline focus:text-gray-800",
        "link-destructive": "bg-transparent text-red-600 hover:text-red-800 hover:underline focus:text-red-800",
    };


    const iconClasses = "shrink-0 w-5 h-5 transition-colors";
    const iconLeadingClasses = IconTrailing ? "me-2" : "";
    const iconTrailingClasses = IconLeading ? "ms-2" : "";

 
    const Spinner = () => (
        <svg 
            className={`animate-spin h-5 w-5 text-current ${
                showTextWhileLoading ? "me-2" : "absolute"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );

 
    const buttonClasses = [
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        isLink ? "px-0 py-0 !min-w-0" : "",
        className,
    ].join(" ");

  
    const props = href 
        ? { ...otherProps, href: disabled ? undefined : href }
        : { ...otherProps, isDisabled: disabled };

    return (
        <Component
            {...props}
            className={buttonClasses}
            data-loading={loading ? "true" : undefined}
        >
       
            {loading && <Spinner />}
            
   
            {!loading && IconLeading && (
                isValidElement(IconLeading) 
                    ? IconLeading 
                    : <IconLeading className={`${iconClasses} ${iconLeadingClasses}`} />
            )}
            
       
            {children && (
                <span className={`
                    ${loading && !showTextWhileLoading ? "invisible" : ""}
                    ${isLink ? "underline underline-offset-4" : ""}
                `}>
                    {children}
                </span>
            )}
            
          
            {!loading && IconTrailing && (
                isValidElement(IconTrailing) 
                    ? IconTrailing 
                    : <IconTrailing className={`${iconClasses} ${iconTrailingClasses}`} />
            )}
        </Component>
    );
};