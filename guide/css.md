This document outlines the architectural design patterns, CSS custom properties, and layout mechanics powering the **Chaos Engine** web interface. Use this guide to understand the layout structure or when writing custom runtime overrides via the live compilation panel.

---

## Architecture Overview

The interface relies on an isolated, client-side decoupled layout model. It encapsulates components within an explicit `#universal-mod-menu` boundary tree to prevent style pollution with host applications or target web environments.

```
#universal-mod-menu [flex direction: column]
 ├── #umm-header (Fixed-track, Drag Hook)
 │    └── .umm-close-btn [display: flex]
 ├── #umm-body [flex-grow: 1]
 │    ├── #umm-tabs (Sidebar Control, Width: 100px)
 │    └── #umm-content (Scrollable Panel Workspace)
 └── .umm-footer (Fixed Metric Engine Track)

```

---

## Global Variables & Tokenization

The visual engine is built entirely on design tokens map-allocated to standard CSS custom properties. Runtime theme switching is achieved by directly targeting the layout shell element using `Element.style.setProperty()`.

```css
:root {
    /* Background Surfaces */
    --umm-bg-main: rgba(12, 12, 20, 0.96);       /* Primary container element body */
    --umm-bg-side: #090911;                       /* Navigation rail wrapper background */
    --umm-bg-content: #11111b;                    /* Dynamic workspace container view */

    /* Brand & Accent Vectors */
    --umm-accent: #818cf8;                        /* High-visibility active states */
    --umm-accent-grad: linear-gradient(135deg, #6366f1, #4f46e5); /* Linear header background */
    --umm-border: #373754;                        /* Strict component stroke limits */

    /* Typography Hierarchy */
    --umm-text: #ffffff;                          /* High-contrast functional copy */
    --umm-text-muted: #8e8ea8;                    /* Supplementary data and metadata labels */

    /* Compositing Engine */
    --umm-blur: none;                             /* Glassmorphism engine blur radius */
}

```
The visual engine is built entirely on design tokens map-allocated to standard CSS custom properties. Runtime theme switching is achieved by directly targeting the layout shell element using `Element.style.setProperty()`.

### Design Token Implementation Mapping

| Custom Property | Default Token Value | Target Elements / Components Using This Token |
| --- | --- | --- |
| `--umm-bg-main` | `rgba(12, 12, 20, 0.96)` | `#universal-mod-menu` (background color) |
| `--umm-bg-side` | `#090911` | `#umm-tabs` (Side tab's background color) |
| `--umm-bg-content` | `#11111b` | `#umm-content`, `.umm-tab-btn.active` (Side tabs background panel when active and wrapper's background color) |
| `--umm-accent` | `#818cf8` | `.umm-tab-btn.active`, `.umm-slider::-webkit-slider-thumb`, `.umm-textarea:focus`, `.umm-btn:hover`, `.umm-dragging-element` (Active text side tabs, border left active side tab, focus states, and drag glow effects) |
| `--umm-accent-grad` | `linear-gradient(135deg, ...)` | `#umm-header` (The main window drag-handle header background) |
| `--umm-border` | `#373754` | `#universal-mod-menu`, `#umm-tabs`, `.umm-btn`, `.umm-textarea` (Outer window bounds, system dividers, input/button bounding boxes) |
| `--umm-text` | `#ffffff` | `#universal-mod-menu`, `.umm-tab-btn:hover`, `.umm-btn`, `.umm-textarea` (Global primary text color, input strings, and hover text states) |
| `--umm-text-muted` | `#8e8ea8` | `.umm-tab-btn` (inactive), `.umm-label`, `.umm-footer` (Inactive navigation tracks, configuration headers, status track data) |
| `--umm-blur` | `none` | `#universal-mod-menu` (`backdrop-filter` and `-webkit-backdrop-filter` rendering pass targets) |

---
## Base Shell Layout (`#universal-mod-menu`)

The main shell uses a fixed container that behaves predictably when scaled or subjected to mouse coordinate tracking loops.

```css
#universal-mod-menu {
    position: fixed;
    top: 30px;
    right: 30px;
    width: 380px;
    height: 360px;
    background: var(--umm-bg-main);
    color: var(--umm-text);
    border: 2px solid var(--umm-border);
    border-radius: 12px;
    z-index: 99999999;
    font-family: 'Segoe UI', system-ui, sans-serif;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    user-select: none;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform-origin: top right;
    backdrop-filter: var(--umm-blur);
    -webkit-backdrop-filter: var(--umm-blur);
    transition: background 0.3s, border 0.3s, color 0.3s;
}

```

### Critical Layout Mechanics

* **Box Model Enforcement (`box-sizing: border-box`)**: Ensures padding and structural border strokes are calculated inward from the `380px × 360px` design window.
* **Text Selection Mask (`user-select: none`)**: Prevents accidental DOM highlighting patterns during high-frequency coordinate dragging operations.
* **Transform Anchor (`transform-origin: top right`)**: Anchors scale adjustments (`scale()`) dynamically passed down through the scaling control panel.

---

## Structural Flex Containers

### Drag Target Header

```css
#umm-header {
    padding: 12px;
    background: var(--umm-accent-grad);
    cursor: move;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 13px;
    flex-shrink: 0;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

```

* **`flex-shrink: 0`**: Guarantees the tracking header maintains vertical structural integrity independent of runtime changes inside the core panels.

### Split Body Window

```css
#umm-body {
    display: flex;
    flex-grow: 1;
    height: calc(100% - 60px);
    overflow: hidden;
}

```

* **`flex-grow: 1`**: Instructs the inner canvas area to absorb all remaining spatial calculations inside the wrapper core.

---

## Navigation & Interface State Components

### Tab Selection Rail

```css
#umm-tabs {
    width: 100px;
    background: var(--umm-bg-side);
    border-right: 1px solid var(--umm-border);
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 8px;
    flex-shrink: 0;
    transition: background 0.3s;
}

.umm-tab-btn {
    background: transparent;
    color: var(--umm-text-muted);
    border: none;
    padding: 12px 10px;
    cursor: pointer;
    font-size: 11px;
    font-weight: bold;
    text-align: left;
    text-transform: uppercase;
    transition: all 0.2s;
    white-space: nowrap;
}

.umm-tab-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--umm-text);
}

.umm-tab-btn.active {
    background: var(--umm-bg-content);
    color: var(--umm-accent);
    border-left: 3px solid var(--umm-accent);
}

```

### Action Controls

```css
.umm-btn {
    background: rgba(255, 255, 255, 0.04);
    color: var(--umm-text);
    border: 1px solid var(--umm-border);
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.15s ease;
    text-align: center;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
}

.umm-btn:hover { background: rgba(255, 255, 255, 0.1); border-color: var(--umm-accent); }
.umm-btn.active { background: #10b981; border-color: #059669; color: #fff; }
.umm-btn.danger { background: #ef4444; border-color: #dc2626; color: #fff; }
.umm-btn.danger:hover { background: #dc2626; }

```

* **Text Truncation Safe-Guards**: `text-overflow: ellipsis` and `white-space: nowrap` isolate string sizes from destroying panel alignments during standard mutations.

---

## Input Control Layouts

### Custom Range Control Surfaces

The layout applies deep vendor selectors (`::-webkit-slider-thumb`) alongside structural baseline overrides to output high-performance range rails.

```css
.umm-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    outline: none;
}

.umm-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--umm-accent);
    cursor: pointer;
}

```

### Monospaced Engine Compiler

```css
.umm-textarea {
    width: 100%;
    box-sizing: border-box;
    display: block;
    background: rgba(0, 0, 0, 0.25);
    color: var(--umm-text);
    border: 1px solid var(--umm-border);
    border-radius: 6px;
    padding: 8px;
    font-family: 'Consolas', monospace;
    font-size: 11px;
    resize: none;
    height: 75px;
    outline: none;
    transition: background 0.3s, color 0.3s, border 0.3s;
}

.umm-textarea:focus {
    border-color: var(--umm-accent);
}

```

---

## Layout Scaffolding Framework

The runtime engine implements CSS Grid and flexible box structures inside the tracking panel workspace to streamline multi-column assignments.

```css
.umm-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    width: 100%;
    box-sizing: border-box;
}

.umm-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    box-sizing: border-box;
}

```

---

## Dynamic Engine Classes

The spatial physics engine uses specific layout utility states during runtime loop evaluation.

```css
.umm-dragging-element {
    box-shadow: 0 0 20px var(--umm-accent) !important;
    cursor: grabbing !important;
    z-index: 99999999 !important;
}

```

* **Specificity Enforcements (`!important`)**: Forces inline absolute mapping rules applied during the Spatial Grid collision loops to yield to layout definitions during active element drag vectors.

# CSS after v3.7
So I'm lazy to add all new CSS thing in this really long guide so I decided to add CSS after 3.7.

## Close Button
```
.umm-close-btn {
    position: absolute; /* Don't touch */
    right: 12px; /* Don't touch */
    top: 50%; /* Don't touch */
    transform: translateY(-50%); /* Don't touch */
    background: rgba(0, 0, 0, 0.2); 
    color: #fff; 
    border: none;
    width: 22px; /* Don't touch */
    height: 22px; /* Don't touch */
    border-radius: 50%; 
    font-size: 11px;
    font-weight: bold; 
    cursor: pointer; 
    display: flex; /* Don't touch */
    align-items: center; /* Don't touch */
    justify-content: center; /* Don't touch */
    transition: all 0.15s ease;
}
.umm-close-btn:hover { 
    background: #ef4444; 
    color: #fff; 
}
```
