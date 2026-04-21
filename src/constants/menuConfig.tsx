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
    name: "sidebar.dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/",
  },
  {
    id: "users",
    name: "sidebar.user_management",
    icon: <Users size={20} />,
    children: [
      {
        id: "users-list",
        name: "sidebar.patients",
        path: "/users/patients",
      },
      {
        id: "roles",
        name: "sidebar.roles_permissions",
        path: "/users/roles",
        icon: <ShieldCheck size={18} />,
      }
    ]
  },
  {
    id: "demos",
    name: "sidebar.premium_demos",
    icon: <TableProperties size={20} />,
    children: [
      {
        id: "table-demo",
        name: "sidebar.saas_table",
        path: "/table-demo",
        badge: { text: "common.pro_badge", variant: "pro" }
      },
      {
        id: "transitions-demo",
        name: "sidebar.view_transitions",
        path: "/demo/items",
        icon: <ArrowRightLeft size={18} />,
        badge: { text: "common.new_badge", variant: "new" }
      },
      {
        id: "components",
        name: "sidebar.ui_components",
        path: "/components",
        icon: <LayoutDashboard size={18} />,
      },
      {
        id: "filter-logic",
        name: "sidebar.filter_logic",
        path: "/filter-test",
        icon: <BarChart3 size={18} />,
      }
    ]
  },
  {
    id: "settings",
    name: "sidebar.settings",
    icon: <Settings size={20} />,
    children: [
      {
        id: "account",
        name: "sidebar.account_settings",
        icon: <UserCircle size={18} />,
        children: [
          {
            id: "security",
            name: "sidebar.security",
            path: "/settings/account/security",
            icon: <Lock size={16} />
          },
          {
            id: "sessions",
            name: "sidebar.active_sessions",
            path: "/settings/account/sessions",
            icon: <History size={16} />
          }
        ]
      },
      {
        id: "general",
        name: "sidebar.general_config",
        path: "/settings/general"
      }
    ]
  },
  {
    id: "reports",
    name: "sidebar.reports",
    icon: <BarChart3 size={20} />,
    path: "/reports"
  },
  {
    id: "docs",
    name: "sidebar.documentation",
    icon: <FileText size={20} />,
    path: "/docs"
  }
];

