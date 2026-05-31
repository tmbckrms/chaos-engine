# Chaos Engine

Chaos Engine is a browser-based DOM physics sandbox that transforms webpage elements into interactive physics objects. It is designed for experimentation, visual effects, and physics simulations directly on existing websites through the browser console.

## Features

### Physics System

Converts supported DOM elements into movable physics objects with:

- Position and velocity tracking
- Gravity simulation
- Boundary collision handling
- Object-to-object collision detection
- Mouse drag interactions

### Spatial Hash Grid Collision System

Chaos Engine uses a spatial hash grid to improve collision performance.

Benefits:

- Reduces unnecessary collision checks
- Improves performance on pages with many objects
- Scales better than naïve pairwise collision detection

### Gravity

Apply configurable gravity to all physics objects.

Range:

```text
-1.5 to 2.0
```

Supports:

- Standard gravity
- Reduced gravity
- Zero gravity
- Negative gravity (anti-gravity)

### Vortex Magnet

Applies a force that pulls all physics objects toward the mouse cursor.

Useful for:

- Creating object clusters
- Dynamic interactions
- Controlled movement of large numbers of elements

### Tornado Mode

Applies both orbital and attraction forces around the cursor.

Effects:

- Circular motion around the cursor
- Spiral movement
- Emergent group behavior

### Air Friction

Optional velocity damping system.

When enabled:

- Objects gradually lose momentum
- Simulations remain stable

When disabled:

- Objects retain momentum indefinitely
- Motion becomes more chaotic

### Drag and Throw

Supported elements can be:

- Dragged using the mouse
- Released with momentum
- Interacted with independently from the webpage layout

### Design Mode

Provides quick access to the browser's built-in `document.designMode`.

Allows:

- Editing text content
- Modifying page elements
- Testing layout changes

### UI Scaling

Adjusts the mod menu scale between:

```text
50% - 180%
```

### Reset System

Restores the page to its pre-physics state by:

- Stopping the simulation loop
- Removing physics state
- Restoring original inline styles
- Disabling active effects

---

## Architecture

### Physics Objects

Each tracked element is represented by an object containing:

```js
{
    id,
    el,

    x,
    y,

    w,
    h,

    vx,
    vy,

    isDragged,

    dragX,
    dragY,

    orig
}
```

### Main Simulation Loop

The engine runs through `requestAnimationFrame()`.

Per frame:

1. Apply gravity
2. Apply magnetic or tornado forces
3. Apply friction
4. Update positions
5. Resolve screen boundaries
6. Process collisions
7. Update DOM positions

### Collision Detection

Uses Axis-Aligned Bounding Box (AABB) collision detection.

Collision resolution includes:

- Overlap correction
- Velocity exchange
- Bounce response

### Spatial Partitioning

Objects are inserted into a grid:

```js
const CELL_SIZE = 140;
```

Only nearby objects within shared grid cells are checked for collisions.

This significantly reduces collision complexity compared to checking every object against every other object.

---

## Supported Elements

By default, Chaos Engine targets:

```text
p
img
h1
h2
h3
button
input
.card
span
a
label
svg
```

Elements must:

- Be visible
- Have measurable dimensions
- Not be part of the Chaos Engine UI

---

## Controls

### UI Config

- Menu Scale
- Design Mode
- Reset Layout

### Physics

- Gravity Toggle
- Gravity Strength
- Collision Toggle
- Friction Toggle

### Magnet

- Vortex Magnet
- Tornado Mode

---

## Performance Notes

Performance depends on:

- Number of tracked elements
- Complexity of the webpage
- Browser rendering performance

The spatial hash grid helps maintain responsiveness even when hundreds of objects are active simultaneously.

Current soft limit:

```text
250 physics objects
```

---

## Usage

1. Open a webpage.
2. Open browser developer tools.
3. Open the Console tab.
4. Paste the Chaos Engine script.
5. Press Enter.
6. Use the mod menu to control simulation settings.

---

## Version

Current version:

```text
Chaos Engine v3.4
```

Major features:

- DOM physics simulation
- Spatial hash grid collisions
- Gravity system
- Tornado mode
- Magnet system
- Friction controls
- Design mode integration
- Reset and cleanup system
