# Modular i18n System: Technical Guide

This document explains the architecture and operational workflow of the modular internationalization (i18n) system implemented in the Qalam Healthcare Dashboard.

---

## 🏗 Architecture Overview

Instead of one massive, hard-to-manage `translation.json` file, we use a **Modular Aggregation** pattern. This allows translations to be split by feature or domain, improving maintainability and reducing merge conflicts.

### The Flow:
1.  **Modules**: Small, focused `.json` files (e.g., `users.json`, `billing.json`).
2.  **Locale Index**: A TypeScript file in each language folder that merges all modules.
3.  **i18n Registry**: The central `i18n.ts` that initializes the engine with these merged objects.

---

## 📂 Directory Structure

```text
src/i18n/
├── i18n.ts                # Central configuration & initialization
└── locales/
    ├── en/                # English Locale
    │   ├── index.ts       # Aggregator (imports all modules)
    │   └── modules/       # Module-specific JSON files
    │       ├── common.json
    │       ├── users.json
    │       └── ...
    ├── dr/                # Dari Locale (follows same structure)
    └── ps/                # Pashto Locale (follows same structure)
```

---

## 🚀 How to Use

### 1. Adding a New Translation String
Simply find the relevant module file (e.g., `src/i18n/locales/en/modules/users.json`) and add your key-value pair.
> [!IMPORTANT]
> Ensure you add the same key to **all** language folders to prevent fallback issues.

### 2. Creating a New Module
If you are building a new feature (e.g., "Pharmacy Management"):
1.  Create `pharmacy.json` in `src/i18n/locales/en/modules/`.
2.  Open `src/i18n/locales/en/index.ts`.
3.  Import the new file and spread it into the export:
    ```typescript
    import pharmacy from './modules/pharmacy.json';
    
    const en = {
      ...common,
      ...pharmacy, // Add it here
    };
    ```

### 3. Adding a New Language (e.g., Arabic `ar`)
1.  Create a new folder: `src/i18n/locales/ar/modules/`.
2.  Copy the JSON files from `en` and translate the values.
3.  Create `src/i18n/locales/ar/index.ts` to aggregate them.
4.  Register the new language in the central **[i18n.ts](file:///d:/my_projects/HCMS/health_care_system_frontend/src/i18n/i18n.ts)**:
    ```typescript
    import translationAR from './locales/ar';
    
    const resources = {
      en: { translation: translationEN },
      ar: { translation: translationAR }, // Register here
    };
    ```

---

## 💡 How It Works Under the Hood

### The Index Merging Logic
The `index.ts` file uses the JavaScript **Spread Operator (`...`)** to merge multiple objects into one. 
If a key exists in both `common.json` and `users.json`, the one defined last in the `index.ts` object will take precedence.

### Language Detection
The system automatically detects the user's preferred language using `i18next-browser-languagedetector`. It checks:
1. `localStorage`
2. `Cookies`
3. `HTML Tag`
4. `URL Path`

The state is persisted automatically, so if a user selects "Dari", the site will remain in Dari on their next visit.

---

## 🛠 Usage in Components

In your React components, use the `useTranslation` hook:

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <h1>{t('users.title')}</h1> // Access nested keys via dot notation
  );
};
```
