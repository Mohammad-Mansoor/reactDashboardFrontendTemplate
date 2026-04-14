import React from "react";
import {
  CheckCircleIcon,
  AlertIcon,
  InfoIcon,
  ErrorIcon,
} from "../../../icons";

interface AlertProps {
  variant: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
}

const Alert = ({
  variant,
  title,
  message,
  showLink = false,
  linkHref = "#",
  linkText = "Learn more",
}: AlertProps) => {
  const variantClasses = {
    success: {
      container:
        "bg-success-50 border-success-100 dark:bg-success-500/10 dark:border-success-500/20",
      icon: "text-success-500",
    },
    warning: {
      container:
        "bg-warning-50 border-warning-100 dark:bg-warning-500/10 dark:border-warning-500/20",
      icon: "text-warning-500",
    },
    error: {
      container:
        "bg-error-50 border-error-100 dark:bg-error-500/10 dark:border-error-500/20",
      icon: "text-error-500",
    },
    info: {
      container:
        "bg-blue-light-50 border-blue-light-100 dark:bg-blue-light-500/10 dark:border-blue-light-500/20",
      icon: "text-blue-light-500",
    },
  };

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5" />,
    warning: <AlertIcon className="w-5 h-5" />,
    error: <ErrorIcon className="w-5 h-5" />,
    info: <InfoIcon className="w-5 h-5" />,
  };

  return (
    <div
      className={`rounded-xl border p-4 ${variantClasses[variant].container}`}
    >
      <div className="flex items-start gap-3">
        <div className={`-mt-0.5 ${variantClasses[variant].icon}`}>
          {icons[variant]}
        </div>

        <div>
          <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>

          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>

          {showLink && (
            <a
              href={linkHref}
              className="inline-block mt-3 text-sm font-medium text-gray-500 underline dark:text-gray-400"
            >
              {linkText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
