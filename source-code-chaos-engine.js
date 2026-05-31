(function () {
    const existingMenu = document.getElementById('universal-mod-menu');
    if (existingMenu) existingMenu.remove();

    // Prevent all standard page links from navigating away globally
    document.querySelectorAll('a').forEach(link => link.setAttribute('href', 'javascript:void(0);'));

    // --- BASE UI STYLING ---
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --umm-bg-main: rgba(12, 12, 20, 0.96);
            --umm-bg-side: #090911;
            --umm-bg-content: #11111b;
            --umm-accent: #818cf8;
            --umm-accent-grad: linear-gradient(135deg, #6366f1, #4f46e5);
            --umm-border: #373754;
            --umm-text: #ffffff;
            --umm-text-muted: #8e8ea8;
            --umm-blur: none;
        }
        
        #universal-mod-menu {
            position: fixed; top: 30px; right: 30px; width: 380px; height: 360px;
            background: var(--umm-bg-main); color: var(--umm-text);
            border: 2px solid var(--umm-border); border-radius: 12px;
            z-index: 99999999; font-family: 'Segoe UI', system-ui, sans-serif;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8); user-select: none; box-sizing: border-box;
            display: flex; flex-direction: column; overflow: hidden;
            transform-origin: top right;
            backdrop-filter: var(--umm-blur); -webkit-backdrop-filter: var(--umm-blur);
            transition: background 0.3s, border 0.3s, color 0.3s;
        }
        #umm-header {
            padding: 12px; background: var(--umm-accent-grad); 
            cursor: move; font-weight: bold; text-align: center; text-transform: uppercase; 
            letter-spacing: 1px; font-size: 13px; flex-shrink: 0; color: #fff;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        #umm-body { display: flex; flex-grow: 1; height: calc(100% - 60px); overflow: hidden; }
        #umm-tabs { 
            width: 100px; background: var(--umm-bg-side); border-right: 1px solid var(--umm-border); 
            display: flex; flex-direction: column; gap: 2px; padding-top: 8px; flex-shrink: 0; transition: background 0.3s;
        }
        .umm-tab-btn {
            background: transparent; color: var(--umm-text-muted); border: none; padding: 12px 10px;
            cursor: pointer; font-size: 11px; font-weight: bold; text-align: left;
            text-transform: uppercase; transition: all 0.2s; white-space: nowrap;
        }
        .umm-tab-btn:hover { background: rgba(255,255,255,0.05); color: var(--umm-text); }
        .umm-tab-btn.active { background: var(--umm-bg-content); color: var(--umm-accent); border-left: 3px solid var(--umm-accent); }
        
        #umm-content { flex-grow: 1; padding: 15px; overflow-y: auto; overflow-x: hidden; background: var(--umm-bg-content); transition: background 0.3s; }
        .umm-panel { display: none; flex-direction: column; gap: 12px; }
        .umm-panel.active { display: flex; }
        
        .umm-btn {
            background: rgba(255,255,255,0.04); color: var(--umm-text); border: 1px solid var(--umm-border);
            padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;
            transition: all 0.15s ease; text-align: center; font-size: 12px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-sizing: border-box;
        }
        .umm-btn:hover { background: rgba(255,255,255,0.1); border-color: var(--umm-accent); }
        .umm-btn.active { background: #10b981; border-color: #059669; color: #fff; }
        .umm-btn.danger { background: #ef4444; border-color: #dc2626; color: #fff; }
        .umm-btn.danger:hover { background: #dc2626; }
        
        .umm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; width: 100%; box-sizing: border-box; }
        .umm-group { display: flex; flex-direction: column; gap: 5px; width: 100%; box-sizing: border-box; }
        .umm-label { font-size: 11px; color: var(--umm-text-muted); text-transform: uppercase; font-weight: bold; display: flex; justify-content: space-between; }
        .umm-slider { -webkit-appearance: none; width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; outline: none; }
        .umm-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--umm-accent); cursor: pointer; }
        
        /* FIXED LAYOUT BOX MODEL FOR THE TEXTAREA */
        .umm-textarea {
            width: 100%; box-sizing: border-box; display: block;
            background: rgba(0, 0, 0, 0.25); color: var(--umm-text); border: 1px solid var(--umm-border);
            border-radius: 6px; padding: 8px; font-family: 'Consolas', monospace;
            font-size: 11px; resize: none; height: 75px; outline: none;
            transition: background 0.3s, color 0.3s, border 0.3s;
        }
        .umm-textarea:focus { border-color: var(--umm-accent); }
        
        .umm-footer { text-align: center; font-size: 9px; color: var(--umm-text-muted); padding: 5px; background: rgba(0,0,0,0.2); flex-shrink: 0; }
        .umm-dragging-element { box-shadow: 0 0 20px var(--umm-accent) !important; cursor: grabbing !important; z-index: 99999999 !important; }
    `;
    document.head.appendChild(style);

    const customStyleHook = document.createElement('style');
    customStyleHook.id = 'umm-custom-user-styles';
    document.head.appendChild(customStyleHook);

    // --- CREATE MENU DOM ---
    const menu = document.createElement('div');
    menu.id = 'universal-mod-menu';
    menu.innerHTML = `
        <div id="umm-header">🌐 Chaos Engine v3.7</div>
        <div id="umm-body">
            <div id="umm-tabs">
                <button class="umm-tab-btn active" data-panel="panel-core">UI Config</button>
                <button class="umm-tab-btn" data-panel="panel-physics">Physics</button>
                <button class="umm-tab-btn" data-panel="panel-magnet">Magnet</button>
                <button class="umm-tab-btn" data-panel="panel-theme">Theme</button>
            </div>
            <div id="umm-content">
                <div id="panel-core" class="umm-panel active">
                    <div class="umm-group">
                        <span class="umm-label">Menu Scale: <span id="scale-val">100%</span></span>
                        <input id="umm-scale-slider" class="umm-slider" type="range" min="0.5" max="1.8" step="0.1" value="1">
                    </div>
                    <button id="umm-toggle-design" class="umm-btn">Toggle Design Mode</button>
                    <button id="umm-reset" class="umm-btn danger">Reset Website Layout</button>
                </div>
                
                <div id="panel-physics" class="umm-panel">
                    <button id="umm-toggle-gravity" class="umm-btn">Apply Gravity</button>
                    <button id="umm-toggle-collision" class="umm-btn active">Spatial Grid Collisions: ON</button>
                    <button id="umm-toggle-friction" class="umm-btn active">Air Friction: ON</button>
                    <div class="umm-group">
                        <span class="umm-label">Gravity Intensity: <span id="gravity-val">0.4</span></span>
                        <input id="umm-gravity-slider" class="umm-slider" type="range" min="-1.5" max="2" step="0.1" value="0.4">
                    </div>
                </div>
                
                <div id="panel-magnet" class="umm-panel">
                    <button id="umm-toggle-magnet" class="umm-btn">Toggle Vortex Pull</button>
                    <button id="umm-toggle-tornado" class="umm-btn">Toggle Tornado Mode</button>
                </div>

                <div id="panel-theme" class="umm-panel">
                    <span class="umm-label">Material Presets</span>
                    <div class="umm-grid-2">
                        <button class="umm-btn" data-theme="default">Indigo Core</button>
                        <button class="umm-btn" data-theme="cyberpunk">Cyberpunk</button>
                        <button class="umm-btn" data-theme="matrix">The Matrix</button>
                        <button class="umm-btn" data-theme="solar">Solar Flare</button>
                    </div>
                    <button class="umm-btn" data-theme="glass">✨ Glassmorphism</button>
                    
                    <div class="umm-group" style="margin-top: 5px;">
                        <span class="umm-label">Inject Live Custom CSS</span>
                        <textarea id="umm-custom-css" class="umm-textarea" placeholder="/* Custom overrides */&#10;#universal-mod-menu {&#10;  border-radius: 4px;&#10;}"></textarea>
                        <button id="umm-apply-css" class="umm-btn">Compile CSS</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="umm-footer">Visual Material Engine Operational</div>
    `;
    document.body.appendChild(menu);

    // --- INTERFACE MATERIAL MAPS ---
    const themes = {
        default: {
            '--umm-bg-main': 'rgba(14, 16, 24, 0.72)',
            '--umm-bg-side': '#0b0d14',
            '--umm-bg-content': '#111522',
            '--umm-accent': '#7c8cff',
            '--umm-accent-grad': 'linear-gradient(135deg, #7c8cff, #4f6cff)',
            '--umm-border': 'rgba(255,255,255,0.08)',
            '--umm-text': 'rgba(255,255,255,0.92)',
            '--umm-text-muted': 'rgba(255,255,255,0.55)',
            '--umm-blur': '18px'
        },
        cyberpunk: {
            '--umm-bg-main': 'rgba(10, 10, 14, 0.9)',
            '--umm-bg-side': '#000000',
            '--umm-bg-content': '#0f0f14',
            '--umm-accent': '#ff2bd6',
            '--umm-accent-grad': 'linear-gradient(135deg, #ff2bd6, #00f5ff)',
            '--umm-border': 'rgba(255, 43, 214, 0.35)',
            '--umm-text': '#dff7ff',
            '--umm-text-muted': 'rgba(223,247,255,0.6)',
            '--umm-blur': '14px'
        },
        matrix: {
            '--umm-bg-main': 'rgba(3, 10, 6, 0.92)',
            '--umm-bg-side': '#020a04',
            '--umm-bg-content': '#04120a',
            '--umm-accent': '#00ff88',
            '--umm-accent-grad': 'linear-gradient(135deg, #00ff88, #003b1a)',
            '--umm-border': 'rgba(0,255,136,0.25)',
            '--umm-text': '#b6ffda',
            '--umm-text-muted': 'rgba(182,255,218,0.5)',
            '--umm-blur': '0px'
        },
        solar: {
            '--umm-bg-main': 'rgba(20, 10, 10, 0.92)',
            '--umm-bg-side': '#120606',
            '--umm-bg-content': '#1a0b0b',
            '--umm-accent': '#ff7a18',
            '--umm-accent-grad': 'linear-gradient(135deg, #ff7a18, #ff3d3d)',
            '--umm-border': 'rgba(255,122,24,0.35)',
            '--umm-text': '#ffe9c7',
            '--umm-text-muted': 'rgba(255,233,199,0.55)',
            '--umm-blur': '12px'
        },
        glass: {
            '--umm-bg-main': 'rgba(15, 15, 25, 0.75)',
            '--umm-bg-side': 'rgba(0, 0, 0, 0.4)',
            '--umm-bg-content': 'rgba(255, 255, 255, 0.03)',
            '--umm-accent': '#a5b4fc',
            '--umm-accent-grad': 'linear-gradient(135deg, #6366f1, #4f46e5)',
            '--umm-border': 'rgba(255, 255, 255, 0.1)',
            '--umm-text': '#ffffff',
            '--umm-text-muted': '#9ca3af',
            '--umm-blur': '16px'
        }
    };

    menu.querySelectorAll('[data-theme]').forEach(btn => {
        btn.addEventListener('click', () => {
            const selected = themes[btn.getAttribute('data-theme')];
            for (const [property, value] of Object.entries(selected)) {
                menu.style.setProperty(property, value);
            }
        });
    });

    document.getElementById('umm-apply-css').addEventListener('click', () => {
        const inputStyles = document.getElementById('umm-custom-css').value;
        customStyleHook.innerHTML = inputStyles;
    });

    // --- DRAGGING SYSTEM ---
    let menuDragging = false, mOffsetX, mOffsetY;
    const header = document.getElementById('umm-header');
    header.addEventListener('mousedown', (e) => {
        menuDragging = true;
        mOffsetX = e.clientX - menu.offsetLeft;
        mOffsetY = e.clientY - menu.offsetTop;
    });
    document.addEventListener('mousemove', (e) => {
        if (!menuDragging) return;
        menu.style.left = (e.clientX - mOffsetX) + 'px';
        menu.style.top = (e.clientY - mOffsetY) + 'px';
        menu.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => menuDragging = false);

    // --- TAB SYSTEM ---
    const tabButtons = menu.querySelectorAll('.umm-tab-btn');
    const panels = menu.querySelectorAll('.umm-panel');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-panel')).classList.add('active');
        });
    });

    // --- SCALE INTERFACE ---
    const scaleSlider = document.getElementById('umm-scale-slider');
    const scaleValDisplay = document.getElementById('scale-val');
    scaleSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        menu.style.transform = `scale(${val})`;
        scaleValDisplay.innerText = Math.round(val * 100) + "%";
    });

    // --- DESIGN MODE ---
    const designBtn = document.getElementById('umm-toggle-design');
    designBtn.addEventListener('click', () => {
        const isOn = document.designMode === 'on';
        document.designMode = isOn ? 'off' : 'on';
        designBtn.classList.toggle('active', !isOn);
    });

    // --- ENGINE STATES ---
    let gravityActive = false;
    let collisionActive = true;
    let frictionActive = true;
    let magnetActive = false;
    let tornadoActive = false;
    let gravityStrength = 0.4;
    let physicsElements = [];
    let animationFrameId = null;
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    const gravitySlider = document.getElementById('umm-gravity-slider');
    const gravityValDisplay = document.getElementById('gravity-val');
    gravitySlider.addEventListener('input', (e) => {
        gravityStrength = parseFloat(e.target.value);
        gravityValDisplay.innerText = gravityStrength;
    });

    const collisionBtn = document.getElementById('umm-toggle-collision');
    collisionBtn.addEventListener('click', () => {
        collisionActive = !collisionActive;
        collisionBtn.classList.toggle('active', collisionActive);
        collisionBtn.innerText = collisionActive ? "Spatial Grid Collisions: ON" : "Spatial Grid Collisions: OFF";
    });

    const frictionBtn = document.getElementById('umm-toggle-friction');
    frictionBtn.addEventListener('click', () => {
        frictionActive = !frictionActive;
        frictionBtn.classList.toggle('active', frictionActive);
        frictionBtn.innerText = frictionActive ? "Air Friction: ON" : "Air Friction: OFF";
    });

    // --- INITIALIZE DOM TARGETS ---
    function initPhysicsElements() {
        physicsElements = [];
        const targets = document.querySelectorAll('p, img, h1, h2, h3, button, input, .card, span, a, label, svg');
        let count = 0;
        
        targets.forEach((el, index) => {
            if (menu.contains(el) || count > 250) return;
            const rect = el.getBoundingClientRect();
            
            if (rect.width > 10 && rect.height > 10 && window.getComputedStyle(el).display !== 'none') {
                const origStyle = el.getAttribute('style') || '';
                
                el.style.position = 'fixed';
                el.style.left = rect.left + 'px';
                el.style.top = rect.top + 'px';
                el.style.width = rect.width + 'px';
                el.style.height = rect.height + 'px';
                el.style.margin = '0';
                el.style.zIndex = '999999';

                const pObj = {
                    id: index, el: el, x: rect.left, y: rect.top, w: rect.width, h: rect.height,
                    vx: 0, vy: 0, isDragged: false, dragX: 0, dragY: 0, orig: origStyle
                };

                el.addEventListener('mousedown', (e) => {
                    if (menu.contains(e.target)) return;
                    e.preventDefault();
                    e.stopPropagation();
                    
                    pObj.isDragged = true;
                    el.classList.add('umm-dragging-element');
                    pObj.dragX = e.clientX - pObj.x;
                    pObj.dragY = e.clientY - pObj.y;
                });

                el.addEventListener('click', (e) => {
                    if (menu.contains(e.target)) return;
                    e.preventDefault();
                    e.stopPropagation();
                }, { capture: true });

                physicsElements.push(pObj);
                count++;
            }
        });

        document.addEventListener('mouseup', () => {
            physicsElements.forEach(p => {
                if (p.isDragged) {
                    p.el.classList.remove('umm-dragging-element');
                    p.isDragged = false;
                }
            });
        });
    }

    // --- SPATIAL HASH GRID ---
    const CELL_SIZE = 140;

    function handleCollisionsSpatialGrid() {
        const grid = new Map();

        physicsElements.forEach(p => {
            const startX = Math.floor(p.x / CELL_SIZE);
            const endX = Math.floor((p.x + p.w) / CELL_SIZE);
            const startY = Math.floor(p.y / CELL_SIZE);
            const endY = Math.floor((p.y + p.h) / CELL_SIZE);

            for (let x = startX; x <= endX; x++) {
                for (let y = startY; y <= endY; y++) {
                    const cellKey = `${x},${y}`;
                    if (!grid.has(cellKey)) grid.set(cellKey, []);
                    grid.get(cellKey).push(p);
                }
            }
        });

        const checkedPairs = new Set();
        const bounce = 0.6;

        grid.forEach((elementsInCell) => {
            if (elementsInCell.length < 2) return;

            for (let i = 0; i < elementsInCell.length; i++) {
                for (let j = i + 1; j < elementsInCell.length; j++) {
                    const p = elementsInCell[i];
                    const other = elementsInCell[j];

                    if (p.isDragged || other.isDragged) continue;

                    const pairKey = p.id < other.id ? `${p.id}_${other.id}` : `${other.id}_${p.id}`;
                    if (checkedPairs.has(pairKey)) continue;
                    checkedPairs.add(pairKey);

                    if (p.x < other.x + other.w && p.x + p.w > other.x &&
                        p.y < other.y + other.h && p.y + p.h > other.y) {
                        
                        let overlapX = Math.min(p.x + p.w - other.x, other.x + other.w - p.x);
                        let overlapY = Math.min(p.y + p.h - other.y, other.y + other.h - p.y);

                        if (overlapX < overlapY) {
                            if (p.x < other.x) p.x -= overlapX / 2; else p.x += overlapX / 2;
                            let temp = p.vx; p.vx = other.vx * bounce; other.vx = temp * bounce;
                        } else {
                            if (p.y < other.y) p.y -= overlapY / 2; else p.y += overlapY / 2;
                            let temp = p.vy; p.vy = other.vy * bounce; other.vy = temp * bounce;
                        }
                    }
                }
            }
        });
    }

    // --- ENGINE LOOP ---
    function engineLoop() {
        const currentG = gravityActive ? gravityStrength : 0;
        const bounce = 0.6; 
        const normalFriction = frictionActive ? 0.98 : 1.0; 
        const magnetFriction = frictionActive ? 0.92 : 1.0;

        const H = window.innerHeight;
        const W = window.innerWidth;

        physicsElements.forEach((p) => {
            if (p.isDragged) {
                let targetX = mouseX - p.dragX;
                let targetY = mouseY - p.dragY;
                p.vx = (targetX - p.x) * 0.35;
                p.vy = (targetY - p.y) * 0.35;
                p.x = targetX;
                p.y = targetY;
            } else {
                p.vy += currentG;

                if (magnetActive || tornadoActive) {
                    let dx = mouseX - (p.x + p.w / 2);
                    let dy = mouseY - (p.y + p.h / 2);
                    let dist = Math.sqrt(dx * dx + dy * dy) || 1;

                    if (tornadoActive) {
                        const orbitalSpeed = 1.2;
                        let perpX = -dy / dist;
                        let perpY = dx / dist;
                        p.vx += perpX * orbitalSpeed;
                        p.vy += perpY * orbitalSpeed;
                        p.vx += (dx / dist) * 0.1;
                        p.vy += (dy / dist) * 0.1;
                    } else if (magnetActive) {
                        p.vx += (dx / dist) * 0.8;
                        p.vy += (dy / dist) * 0.8;
                    }
                    p.vx *= magnetFriction; p.vy *= magnetFriction;
                }

                if (!magnetActive && !tornadoActive) {
                    p.vx *= normalFriction;
                    p.vy *= normalFriction;
                }
                
                p.x += p.vx;
                p.y += p.vy;
            }

            if (p.y + p.h > H) { p.y = H - p.h; p.vy = -p.vy * bounce; if(frictionActive) p.vx *= 0.85; }
            if (p.y < 0) { p.y = 0; p.vy = -p.vy * bounce; if(frictionActive) p.vx *= 0.85; }
            if (p.x < 0) { p.x = 0; p.vx = -p.vx * bounce; }
            if (p.x + p.w > W) { p.x = W - p.w; p.vx = -p.vx * bounce; }
        });

        if (collisionActive) {
            handleCollisionsSpatialGrid();
        }

        physicsElements.forEach(p => {
            p.el.style.left = p.x + 'px';
            p.el.style.top = p.y + 'px';
        });

        animationFrameId = requestAnimationFrame(engineLoop);
    }

    function verifyLoopInitiated() {
        if (physicsElements.length === 0) initPhysicsElements();
        if (!animationFrameId) animationFrameId = requestAnimationFrame(engineLoop);
    }

    const gravityBtn = document.getElementById('umm-toggle-gravity');
    gravityBtn.addEventListener('click', () => {
        gravityActive = !gravityActive;
        gravityBtn.classList.toggle('active', gravityActive);
        verifyLoopInitiated();
    });

    const magnetBtn = document.getElementById('umm-toggle-magnet');
    const tornadoBtn = document.getElementById('umm-toggle-tornado');

    magnetBtn.addEventListener('click', () => {
        magnetActive = !magnetActive;
        magnetBtn.classList.toggle('active', magnetActive);
        if (magnetActive) {
            tornadoActive = false;
            tornadoBtn.classList.remove('active');
        }
        verifyLoopInitiated();
    });

    tornadoBtn.addEventListener('click', () => {
        tornadoActive = !tornadoActive;
        tornadoBtn.classList.toggle('active', tornadoActive);
        if (tornadoActive) {
            magnetActive = false;
            magnetBtn.classList.remove('active');
        }
        verifyLoopInitiated();
    });

    verifyLoopInitiated();

    // --- RESET SYSTEM ---
    document.getElementById('umm-reset').addEventListener('click', () => {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        customStyleHook.innerHTML = ''; 
        physicsElements.forEach(p => {
            if (p.orig === '') p.el.removeAttribute('style');
            else p.el.setAttribute('style', p.orig);
            p.el.classList.remove('umm-dragging-element');
        });
        physicsElements = [];
        gravityActive = false;
        magnetActive = false;
        tornadoActive = false;
        frictionActive = true;
        gravityBtn.classList.remove('active');
        magnetBtn.classList.remove('active');
        tornadoBtn.classList.remove('active');
        frictionBtn.classList.add('active');
        frictionBtn.innerText = "Air Friction: ON";
        
        for (const [property, value] of Object.entries(themes.default)) {
            menu.style.setProperty(property, value);
        }
    });
})();
