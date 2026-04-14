import { ReactNode } from "react";
import { Link } from "react-router";

interface BreadcrumbLink {
  name: string;
  href: string;
}

interface HeaderBreadcrumbsProps {
  heading: string;
  links?: BreadcrumbLink[];
  action?: ReactNode;
  subheading?: string;
}

export default function HeaderBreadcrumbs({
  heading,
  links = [],
  action,
  subheading,
}: HeaderBreadcrumbsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {heading}
          </h1>
          {subheading && (
            <p className="text-gray-500 text-sm">{subheading}</p>
          )}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>

      {links.length > 0 && (
        <nav>
          <ol className="flex items-center gap-2 flex-wrap">
            {links.map((link, index) => (
              <li key={`${link.href}-${index}`} className="flex items-center gap-2">
                <Link
                  to={link.href}
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {link.name}
                </Link>
                {index < links.length - 1 && (
                  <span className="text-gray-600">/</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}
