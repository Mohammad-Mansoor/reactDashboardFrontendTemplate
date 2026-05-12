# Design System & Theme Documentation

This document outlines the centralized theme system for the application, built using **Tailwind CSS v4** and **CSS Variables**. These rules ensure visual consistency, accessibility, and 100% theme-only styling across the entire frontend.

---

## 🏗️ Architecture Overview

The single source of truth for the theme is located in:
`src/index.css`

The system uses the Tailwind v4 `@theme` block. Colors are defined as CSS variables and automatically exposed as Tailwind utility classes (e.g., `bg-primary1`, `text-blue-light-500`).

---

## 🎨 Core Color Palette

The application uses an **Orange (Primary)** and **Blue (Navigation)** palette. 

### 1. Semantic Tokens
Always prioritize these semantic tokens over literal color names for consistency.

| Token | Color | Usage |
| :--- | :--- | :--- |
| `primary1` | Orange-500 | **Primary Actions**: Buttons, CTAs, Checkboxes, Active highlights. |
| `primary2` | Blue-light-500 | **Navigation**: Sidebar active states, Informational highlights. |
| `primary3` | Orange-700 | **Deep Actions**: Hover states for primary buttons. |
| `brand-*` | Blue-light scale | **System Brand**: Used for borders, backgrounds, and headers. |
| `success` | Emerald-500 | **Positive states**: Success modals, valid inputs. |
| `error` | Red-500 | **Negative states**: Error modals, danger buttons, invalid inputs. |

### 2. Custom Variable Scales
The theme includes full accessibility-tested scales for:
- `blue-light`: 25 to 950
- `orange`: 25 to 950
- `gray`: 25 to 950
- `success`, `error`, `warning`: 25 to 950

---

## 🛠️ How to Add New Colors

To extend the design system, follow these steps:

1. Open `src/index.css`.
2. Find the `@theme` block.
3. Define your color variable using the `--color-` prefix:

```css
@theme {
  /* Step 1: Define the raw hex */
  --color-violet-500: #7a5af8;

  /* Step 2: Map it to a semantic name (Recommended) */
  --color-accent: var(--color-violet-500);
}
```

Tailwind will automatically generate utility classes: `bg-accent`, `text-accent`, `border-accent`, etc.

---

## 🌙 Dark Mode Support

The system uses the `.dark` class strategy (handled automatically by the application shell).

### 1. Using Dark Variants in JSX
Add the `dark:` prefix to any utility class:

```tsx
<div className="bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white">
  Content adjusts to current theme
</div>
```

### 2. Modern "Surface Tint" (Unified Frame)
The Sidebar and Header use a specific unified tint for a premium look:
- **Background**: `bg-slate-50/80 dark:bg-[#070b14]/90`
- **Blur**: `backdrop-blur-xl`

---

## 📜 Style Guidelines (Mandatory)

To maintain a "Grade A" frontend, adhere to these **Strict Rules**:

### ❌ NEVER:
- **Do NOT use hardcoded hex codes** inside JSX: `style={{ color: '#fb6514' }}`.
- **Do NOT use arbitrary Tailwind values**: `bg-[#1c958a]`.
- **Do NOT use literal colors** if a semantic token exists: Use `bg-primary1` instead of `bg-orange-500`.

### ✅ ALWAYS:
- **Use Theme Tokens**: Always use `bg-primary1`, `text-primary2`, etc.
- **Handle Dynamic Colors via CSS Vars**: If a component needs a dynamic color (e.g., from a database), use a CSS variable:
  ```tsx
  <div style={{ "--badge-color": color } as any} className="bg-[var(--badge-color)]">
  ```
- **Consistent Borders**: Use the `border-slate-200/60 dark:border-white/5` pattern for a consistent modern edge.

---

## 🖱️ Global Elements

### Scrollbars
The scrollbar is auto-themed globally in `index.css`. It uses `blue-light-400` with transparency for a sleek, modern navigation feel across all browsers.

### Unified Frame
The application uses an "L-Frame" design where the **Header** and **Sidebar** are visually unified via a shared background tint and blur, isolating the content area for better focus.

---

*Last Updated: 2026-04-21*
*Design System Version: 2.0 (Orange-Blue Migration)*
