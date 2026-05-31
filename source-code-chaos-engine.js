(function () {
    const existingMenu = document.getElementById('universal-mod-menu');
    if (existingMenu) existingMenu.remove();

    // Prevent all standard page links from navigating away globally
    document.querySelectorAll('a').forEach(link => link.setAttribute('href', 'javascript:void(0);'));

    // --- UI STYLING ---
    const style = document.createElement('style');
    style.innerHTML = `
        #universal-mod-menu {
            position: fixed; top: 30px; right: 30px; width: 360px; height: 310px;
            background: rgba(12, 12, 20, 0.96); color: #fff;
            border: 2px solid #818cf8; border-radius: 12px;
            z-index: 99999999; font-family: 'Segoe UI', system-ui, sans-serif;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8); user-select: none; box-sizing: border-box;
            display: flex; flex-direction: column; overflow: hidden;
            transform-origin: top right;
        }
        #umm-header {
            padding: 12px; background: linear-gradient(135deg, #6366f1, #4f46e5); 
            cursor: move; font-weight: bold; text-align: center; text-transform: uppercase; 
            letter-spacing: 1px; font-size: 13px; flex-shrink: 0;
        }
        #umm-body { display: flex; flex-grow: 1; height: calc(100% - 60px); }
        #umm-tabs { 
            width: 95px; background: #090911; border-right: 1px solid #222235; 
            display: flex; flex-direction: column; gap: 2px; padding-top: 8px;
        }
        .umm-tab-btn {
            background: transparent; color: #8e8ea8; border: none; padding: 12px 10px;
            cursor: pointer; font-size: 11px; font-weight: bold; text-align: left;
            text-transform: uppercase; transition: all 0.2s;
        }
        .umm-tab-btn:hover { background: #161626; color: #fff; }
        .umm-tab-btn.active { background: #1c1c32; color: #818cf8; border-left: 3px solid #818cf8; }
        #umm-content { flex-grow: 1; padding: 15px; overflow-y: auto; background: #11111b; }
        .umm-panel { display: none; flex-direction: column; gap: 12px; }
        .umm-panel.active { display: flex; }
        .umm-btn {
            background: #1e1e2f; color: #fff; border: 1px solid #373754;
            padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;
            transition: all 0.15s ease; text-align: center; font-size: 12px;
        }
        .umm-btn:hover { background: #2b2b44; border-color: #818cf8; }
        .umm-btn.active { background: #10b981; border-color: #059669; }
        .umm-btn.danger { background: #ef4444; border-color: #dc2626; }
        .umm-btn.danger:hover { background: #dc2626; }
        .umm-group { display: flex; flex-direction: column; gap: 5px; }
        .umm-label { font-size: 11px; color: #9fa6b2; text-transform: uppercase; font-weight: bold; display: flex; justify-content: space-between; }
        .umm-slider { -webkit-appearance: none; width: 100%; height: 6px; background: #27273a; border-radius: 3px; outline: none; }
        .umm-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #818cf8; cursor: pointer; }
        .umm-footer { text-align: center; font-size: 9px; color: #4b5563; padding: 5px; background: #07070c; }
        .umm-dragging-element { box-shadow: 0 0 20px rgba(129, 140, 248, 0.8) !important; cursor: grabbing !important; z-index: 99999999 !important; }
    `;
    document.head.appendChild(style);

    // --- CREATE MENU DOM ---
    const menu = document.createElement('div');
    menu.id = 'universal-mod-menu';
    menu.innerHTML = `
        <div id="umm-header">🌐 Chaos Engine v3.4</div>
        <div id="umm-body">
            <div id="umm-tabs">
                <button class="umm-tab-btn active" data-panel="panel-core">UI Config</button>
                <button class="umm-tab-btn" data-panel="panel-physics">Physics</button>
                <button class="umm-tab-btn" data-panel="panel-magnet">Magnet</button>
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
                    <p style="font-size:11px; margin:0; color:#9fa6b2; line-height:1.4;">Affects ALL elements on screen simultaneously.</p>
                    <button id="umm-toggle-magnet" class="umm-btn">Toggle Vortex Pull</button>
                    <button id="umm-toggle-tornado" class="umm-btn">Toggle Tornado Mode</button>
                </div>
            </div>
        </div>
        <div class="umm-footer">Chaos Engine v3.4</div>
    `;
    document.body.appendChild(menu);

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

    // Friction Button Configuration
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

    // --- CENTRAL CORE RUNTIME LOOP ---
    function engineLoop() {
        const currentG = gravityActive ? gravityStrength : 0;
        const bounce = 0.6; 
        
        // Dynamic drag configurations based on UI toggles
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

            // Screen boundary bounce physics
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
    });
})();
