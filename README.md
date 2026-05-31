# Chaos Engine v3.7

Chaos Engine is a high-performance, injection-ready JavaScript physics sandbox utility. It transforms static DOM elements on any webpage into dynamic, interactive rigid bodies subject to physical forces, including gravity, spatial-grid collisions, magnetic attraction, and rotational fluid dynamics (tornado mode).

It features a non-destructive modular UI menu built with CSS variables, allowing users to scale the interface, switch between visual material profiles, or hot-swap layouts with a built-in live CSS compiler.

---

## Feature Modules

### Physics Sandbox

* **Apply Gravity:** Toggles a downward/upward linear directional force vector acting on initialized elements. Includes an intensity slider managing fine-grain force metrics.
* **Spatial Grid Collisions:** Employs a cellular partitioning grid system ($140\text{px}$ hash spacing) to process discrete element-to-element boundary detection without processing loops dragging performance down.
* **Air Friction:** Adds a $0.98\times$ momentum dampening multiplier to velocities every frame loop to ensure organic deceleration. (Defaults to **ON**).

### Vector Manipulation

* **Vortex Pull:** Generates a real-time positional vector calculation pulling all page bodies toward your cursor location using proximity-relative acceleration rates.
* **Tornado Mode:** Adds a perpendicular velocity calculation offset ($\pm 90^\circ$ tracking angle) to turn cursor attraction into an orbital kinetic cyclone.

### Theme & Appearance Engine

Includes built-in layout configurations mapping custom variables onto the runtime CSS tree:

* `Indigo Core`: Default clean cyberpunk dark layout.
* `Cyberpunk`: High-visibility fluorescent neon yellow and pink aesthetics.
* `The Matrix`: Terminal green aesthetics mapping dark values over runtime grids.
* `Solar Flare`: High-contrast obsidian orange and warning-red visual layout.
* `Glassmorphism`: A frosted translucent composite pane with safety dark filters designed for white or ultra-bright web page backdrops.

Visit [Injected Live CSS Guide](https://github.com/tmbckrms/chaos-engine/guide/css.md) to see the guide how to create your own theme.
