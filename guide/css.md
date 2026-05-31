## Design Tokens & CSS Custom Properties

The menu utilizes a strict `:root` variable configuration scoped locally once applied. Using custom properties allows the engine to instantly rewrite themes globally by modifying values on the parent container (`menu.style.setProperty`).

```css
:root {
    --umm-bg-main: rgba(12, 12, 20, 0.96);       /* Primary container fill */
    --umm-bg-side: #090911;                       /* Sidebar navigation background */
    --umm-bg-content: #11111b;                    /* Tab content panel wrapper */
    --umm-accent: #818cf8;                        /* Interaction state highlights */
    --umm-accent-grad: linear-gradient(135deg, #6366f1, #4f46e5); /* Brand header gradient */
    --umm-border: #373754;                        /* Global stroke boundaries */
    --umm-text: #ffffff;                          /* High-contrast typography */
    --umm-text-muted: #8e8ea8;                    /* Secondary details/labels */
    --umm-blur: none;                             /* Material blur configuration */
}

```

### Overriding Tokens in Custom CSS

To forcefully modify components via the live compilation compiler, target the core ID wrapper and explicitly reassign the variables:

```css
#universal-mod-menu {
    --umm-accent: #00ff88;
    --umm-border: rgba(0, 255, 136, 0.3);
}

```

---

## Structural Shell Architecture

The primary modal uses a rigid container template that enforces strict boundary rules (`box-sizing: border-box`), prevents text selection highlighting during physics dragging (`user-select: none`), and uses `flex-direction: column` to handle structural content shifting seamlessly.

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

### Key Layout Mechanisms

* **`position: fixed` + `z-index: 99999999**`: Detaches the node from document structure flows and forces it above all standard browser overlays.
* **`transform-origin: top right`**: Ensures that when scale updates are pushed via the UI range slider (`scale(${val})`), the sizing scales relative to its default anchor point.
* **`overflow: hidden`**: Masks interior elements dynamically to prevent layout breaks when child boundaries scale or change.

---

## Component Modules

### Header Module

Designed as the primary hook for structural window manipulation.

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

* **`flex-shrink: 0`**: Prevents parent flex containers from compacting header heights when panel scrolling occurs.
* **`cursor: move`**: Generates native browser UI signals denoting that the element can be dragged.

### Column Body Split-Layout

The structural center relies on a nested flex matrix layout.

```css
#umm-body { 
    display: flex; 
    flex-grow: 1; 
    height: calc(100% - 60px); 
    overflow: hidden; 
}

```

* **`flex-grow: 1`**: Instructs the element to claim all remaining vertical real estate inside the menu wrap.
* **`height: calc(100% - 60px)`**: Explicit calculation matching the leftover space once the header and footer tracks are reserved.

---

## 4. Navigation & Control Surface States

### Sidebar Tabs

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
    background: rgba(255,255,255,0.05); 
    color: var(--umm-text); 
}
.umm-tab-btn.active { 
    background: var(--umm-bg-content); 
    color: var(--umm-accent); 
    border-left: 3px solid var(--umm-accent); 
}

```

* **State Isolation**: Class variations `.active` explicitly switch from default transparency values to explicit background variables while shifting active user focus via `border-left`.

### Action Inputs & Buttons

```css
.umm-btn {
    background: rgba(255,255,255,0.04); 
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

```

* **Layout Safeguards**: `text-overflow: ellipsis` along with `white-space: nowrap` protects your buttons from visual layout breaks when long string configurations are applied.

---

## 5. Layout Scaffolding Grid

To maintain responsive spacing inside the narrow 280px workspace track, the theme uses CSS Grid matrices to handle multi-column split variations cleanly.

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

## 6. Form Field Elements

### Custom Input Range Sliders

Standard cross-browser element definitions are stripped using `-webkit-appearance: none` to deploy customized modern slider controls.

```css
.umm-slider { 
    -webkit-appearance: none; 
    width: 100%; 
    height: 6px; 
    background: rgba(255,255,255,0.1); 
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

### Monospaced Code Box

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

```

---

## 7. Interactive Physics States

When options like gravity or magnet vectors are active on the site, targeted items are decoupled globally. These specific classes provide extra styling cues to show which elements are currently active in the physics loop.

```css
.umm-dragging-element { 
    box-shadow: 0 0 20px var(--umm-accent) !important; 
    cursor: grabbing !important; 
    z-index: 99999999 !important; 
}

```

* **`!important` Interception**: Overrides standard inline structural values generated dynamically by the Javascript coordinate loop engine during runtime tracking.

---

## 8. Theme Recipes for Custom Injection

You can inject these custom theme blocks straight into the `#umm-custom-css` textarea to overwrite your menu's styling live:

### Neon Amethyst Cyber

```css
#universal-mod-menu {
    --umm-bg-main: rgba(10, 5, 18, 0.95);
    --umm-bg-side: #05020a;
    --umm-bg-content: #0d0818;
    --umm-accent: #bd00ff;
    --umm-border: rgba(189, 0, 255, 0.4);
    --umm-text: #f3e6ff;
    border-radius: 0px;
    box-shadow: 0 0 30px rgba(189, 0, 255, 0.2);
}
.umm-btn {
    border-radius: 0px;
}

```

### Stealth Slate (Minimal Dark)

```css
#universal-mod-menu {
    --umm-bg-main: #121214;
    --umm-bg-side: #1a1a1e;
    --umm-bg-content: #16161a;
    --umm-accent: #e4e4e7;
    --umm-accent-grad: linear-gradient(135deg, #27272a, #18181b);
    --umm-border: #27272a;
    border-radius: 8px;
}

```
