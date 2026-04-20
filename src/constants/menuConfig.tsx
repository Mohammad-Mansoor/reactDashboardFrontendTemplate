import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  ShieldCheck, 
  UserCircle, 
  Lock, 
  History,
  FileText,
  TableProperties,
  ArrowRightLeft
} from "lucide-react";

export interface MenuItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permissions?: string[]; // RBAC placeholder
  badge?: {
    text: string;
    variant: "new" | "pro" | "update";
  };
}

export const MENU_CONFIG: MenuItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/",
  },
  {
    id: "users",
    name: "User Management",
    icon: <Users size={20} />,
    children: [
      {
        id: "users-list",
        name: "Patients",
        path: "/users/patients",
      },
      {
        id: "roles",
        name: "Roles & Permissions",
        path: "/users/roles",
        icon: <ShieldCheck size={18} />,
      }
    ]
  },
  {
    id: "demos",
    name: "Premium Demos",
    icon: <TableProperties size={20} />,
    children: [
      {
        id: "table-demo",
        name: "SaaS Table",
        path: "/table-demo",
        badge: { text: "PRO", variant: "pro" }
      },
      {
        id: "transitions-demo",
        name: "View Transitions",
        path: "/demo/items",
        icon: <ArrowRightLeft size={18} />,
        badge: { text: "NEW", variant: "new" }
      },
      {
        id: "components",
        name: "UI Components",
        path: "/components",
        icon: <LayoutDashboard size={18} />,
      },
      {
        id: "filter-logic",
        name: "Filter Logic",
        path: "/filter-test",
        icon: <BarChart3 size={18} />,
      }
    ]
  },
  {
    id: "settings",
    name: "Settings",
    icon: <Settings size={20} />,
    children: [
      {
        id: "account",
        name: "Account Settings",
        icon: <UserCircle size={18} />,
        children: [
          {
            id: "security",
            name: "Security",
            path: "/settings/account/security",
            icon: <Lock size={16} />
          },
          {
            id: "sessions",
            name: "Active Sessions",
            path: "/settings/account/sessions",
            icon: <History size={16} />
          }
        ]
      },
      {
        id: "general",
        name: "General Config",
        path: "/settings/general"
      }
    ]
  },
  {
    id: "reports",
    name: "Reports",
    icon: <BarChart3 size={20} />,
    path: "/reports"
  },
  {
    id: "docs",
    name: "Documentation",
    icon: <FileText size={20} />,
    path: "/docs"
  }
];
