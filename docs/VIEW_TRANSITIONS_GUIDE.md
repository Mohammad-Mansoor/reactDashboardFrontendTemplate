# 🚀 View Transitions API: The Complete Integration Guide

This guide explains how to use the Native Browser View Transitions API implemented in this project. The goal is to provide fluid, app-like navigation without external animation libraries.

---

## 🏗️ Architecture Overview

The integration consists of three main parts:
1.  **`ViewTransitionManager`**: A global wrapper that catch every navigation (including browser back/forward buttons).
2.  **`useViewTransitionNavigate`**: A custom hook for manual navigation.
3.  **`view-transitions.css`**: Global CSS defining the "fade + slide" animations and shared element names.

---

## 🛠️ How to Use

### 1. Basic Navigation
Most navigations happen via sidebar links. These are handled automatically by the `ViewTransitionManager`. If you need to navigate programmatically in your code, use the custom hook:

```tsx
import { useViewTransitionNavigate } from "../hooks/useViewTransitionNavigate";

const MyComponent = () => {
  const navigate = useViewTransitionNavigate();
  
  return (
    <button onClick={() => navigate("/dashboard")}>
      Go to Dashboard
    </button>
  );
};
```

### 2. Implementing Shared Element Transitions
Shared elements allow an element (like an image) to "persist" and morph from one page to another.

**Step A: Define names in a source page (e.g., List Page)**
```tsx
<img 
  src={data.image} 
  style={{ viewTransitionName: `item-${data.id}` }} 
/>
```

**Step B: Define the SAME name in the target page (e.g., Detail Page)**
```tsx
<img 
  src={data.image} 
  style={{ viewTransitionName: `item-${data.id}` }} 
/>
```

> [!TIP]
> Always use unique names (e.g., include the ID) when you have multiple shared elements on a single page.

### 3. Preventing Animation on Fixed Elements
The Navbar and Sidebar should usually stay fixed while the content moves. This is already handled in `src/css/view-transitions.css` using:

```css
.app-header { view-transition-name: app-header; }
.app-sidebar { view-transition-name: app-sidebar; }

::view-transition-old(app-header),
::view-transition-new(app-header) {
  animation: none; /* Stay fixed */
}
```

If you add new fixed overlays (like toolbars), add them to this CSS list.

---

## 🎨 Customizing Animations
You can change the global animation style in `src/css/view-transitions.css`.

### Change Duration
```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.6s; /* Slower feel */
}
```

### Change Animation Type (Fade vs Slide)
The logic uses standard CSS keyframes. You can replace `slide-from-right` with a `scale-up` keyframe to create a zooming effect.

---

## ⚠️ Important Considerations

### Browser Support
- **Full Support**: Chrome, Edge, Safari 18+.
- **Fallback**: The `ViewTransitionManager` automatically detects support. If the browser is old (e.g., Safari 17), it performs a standard navigation without crashes.

### React State Updates
The API requires state updates to be synchronous within the transition callback. We use `flushSync` from `react-dom` inside the hooks/manager to ensure the DOM is ready before the browser captures the transition snapshot.

```tsx
document.startViewTransition(() => {
  flushSync(() => {
    // Update React State / Navigate here
  });
});
```

---

## 📁 File Locations
- **CSS Styles**: `src/css/view-transitions.css`
- **Global Manager**: `src/components/Navigation/ViewTransitionManager.tsx`
- **Custom Hook**: `src/hooks/useViewTransitionNavigate.ts`
- **Demo Reference**: `src/pages/Demo/ItemListPage.tsx`
