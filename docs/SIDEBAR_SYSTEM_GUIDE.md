# Advanced Nested Sidebar System: Technical Guide

This document provides a deep dive into the architecture, configuration, and features of the high-end nested sidebar system implemented for the Qalam Healthcare Dashboard.

---

## 📂 Core File Structure

| Component / File | Purpose |
| :--- | :--- |
| [AppSidebar.tsx](file:///d:/my_projects/HCMS/health_care_system_frontend/src/layout/AppSidebar.tsx) | Main sidebar container. Manages the high-level layout, logo, footer, and the view switch between navigation and user menu. |
| [SidebarItem.tsx](file:///d:/my_projects/HCMS/health_care_system_frontend/src/layout/Sidebar/SidebarItem.tsx) | The recursive core. Renders a single menu item (Link or Toggle) and handles nesting depth, active states, and full-width highlights. |
| [SidebarGroup.tsx](file:///d:/my_projects/HCMS/health_care_system_frontend/src/layout/Sidebar/SidebarGroup.tsx) | A structural component that maps over an array of items, allowing for recursive nesting. |
| [menuConfig.tsx](file:///d:/my_projects/HCMS/health_care_system_frontend/src/constants/menuConfig.tsx) | The "Source of Truth" for navigation. Define your menu hierarchy, icons, paths, and permissions here. |
| [SidebarContext.tsx](file:///d:/my_projects/HCMS/health_care_system_frontend/src/context/SidebarContext.tsx) | Global state manager. Handles `expanded` vs `collapsed` toggles and persists opened sub-menus in `localStorage`. |
| [sidebarUtils.tsx](file:///d:/my_projects/HCMS/health_care_system_frontend/src/utils/sidebarUtils.ts) | Helper functions for RBAC filtering and finding active parent categories based on the current URL. |

---

## ✨ Key Features

### 1. Unlimited Recursive Nesting
The system uses a parent-child relationship defined in the config. `SidebarItem` detects if it has children and, if so, renders a `SidebarGroup` within itself, creating an infinite tree structure.

### 2. Full-Width "Edge-to-Edge" UI
The system uses a **Recursive Padding** strategy to ensure the background covers the entire sidebar width while text stays indented:
- **Clickable Area**: Every item spans the full **240px** width.
- **Visual Indentation**: Padding increases by `16px` per level (`depth * 16 + 24`).
- **Active Indicator**: A 3px inset shadow (`shadow-[inset_3px_0_0_0_#3B82F6]`) and a full-height indicator bar provide clear visual feedback for the active route.

### 3. Contextual User Menu (View Switcher)
The sidebar footer serves as the gateway to user profile settings:
- **The Switch**: Clicking the avatar or settings button swaps the main navigation for a **User Settings Menu**.
- **Sliding Animation**: The menu slides in from the bottom using `framer-motion`.
- **Full Features**: Includes Profile, Security Settings, Support, and all Logout variants (Logout All, Other Sessions).

### 4. Smart Persistence
- **Collapse State**: Remembers if the sidebar was slim or wide.
- **Menu Hierarchy**: Persists opened sub-menus in `localStorage`, so your expanded tree stays intact after a page refresh.
- **Auto-Expansion**: Automatically finds and expands all relevant parent categories when a child route is visited directly via URL.

### 5. RBAC (Role-Based Access Control)
Integration with `PermissionsContext` ensures that menu items are automatically hidden if the user lacks the required access levels defined in the metadata of `menuConfig.tsx`.

---

## 🛠 Configuration Example

Adding a new nested item is as simple as updating `menuConfig.tsx`:

```tsx
{
  id: "reports",
  name: "Reports",
  icon: <BarChart size={20} />,
  children: [
    {
      id: "analytics",
      name: "Analytics",
      path: "/reports/analytics",
      badge: { text: "Pro", variant: "pro" }
    }
  ]
}
```

---

## 💡 Technical Implementation Details
- **Animations**: Uses `AnimatePresence` and `layoutId` from Framer Motion for smooth shared element transitions (the active bar).
- **Layout Sync**: The `AppLayout.tsx` dynamic margin (`lg:ms-[240px]`) prevents content overlap with the fixed sidebar.
- **Zero Scrollbars**: Uses the `no-scrollbar` utility and `overflow-x-hidden` to maintain a sleek, application-like feel.
- **Truncation**: Labels automatically use ellipsis (`...`) when they are too long, ensuring badges are never clipped.
