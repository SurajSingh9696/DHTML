 






import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

 
const STICKER_COLORS = {
    'U': 0xFFFFFF,   
    'R': 0xFF3B30,   
    'F': 0x34C759,   
    'D': 0xFFD60A,   
    'L': 0xFF9500,   
    'B': 0x007AFF,   
};

 
const INTERNAL_COLOR = 0x1a1a1a;

 



const FACE_INDEX = {
    '+x': 0,
    '-x': 1,
    '+y': 2,
    '-y': 3,
    '+z': 4,
    '-z': 5,
};

 




function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

 












function buildFaceletMap() {
    const map = new Array(54);

     
    const U = [
        { x: -1, y: 1, z: -1 }, { x: 0, y: 1, z: -1 }, { x: 1, y: 1, z: -1 },
        { x: -1, y: 1, z:  0 }, { x: 0, y: 1, z:  0 }, { x: 1, y: 1, z:  0 },
        { x: -1, y: 1, z:  1 }, { x: 0, y: 1, z:  1 }, { x: 1, y: 1, z:  1 },
    ];
    for (let i = 0; i < 9; i++) map[i] = { pos: U[i], face: '+y' };

     
    const R = [
        { x: 1, y:  1, z:  1 }, { x: 1, y:  1, z:  0 }, { x: 1, y:  1, z: -1 },
        { x: 1, y:  0, z:  1 }, { x: 1, y:  0, z:  0 }, { x: 1, y:  0, z: -1 },
        { x: 1, y: -1, z:  1 }, { x: 1, y: -1, z:  0 }, { x: 1, y: -1, z: -1 },
    ];
    for (let i = 0; i < 9; i++) map[9 + i] = { pos: R[i], face: '+x' };

     
    const F = [
        { x: -1, y:  1, z: 1 }, { x: 0, y:  1, z: 1 }, { x: 1, y:  1, z: 1 },
        { x: -1, y:  0, z: 1 }, { x: 0, y:  0, z: 1 }, { x: 1, y:  0, z: 1 },
        { x: -1, y: -1, z: 1 }, { x: 0, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
    ];
    for (let i = 0; i < 9; i++) map[18 + i] = { pos: F[i], face: '+z' };

     
    const D = [
        { x: -1, y: -1, z:  1 }, { x: 0, y: -1, z:  1 }, { x: 1, y: -1, z:  1 },
        { x: -1, y: -1, z:  0 }, { x: 0, y: -1, z:  0 }, { x: 1, y: -1, z:  0 },
        { x: -1, y: -1, z: -1 }, { x: 0, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
    ];
    for (let i = 0; i < 9; i++) map[27 + i] = { pos: D[i], face: '-y' };

     
    const L = [
        { x: -1, y:  1, z: -1 }, { x: -1, y:  1, z:  0 }, { x: -1, y:  1, z:  1 },
        { x: -1, y:  0, z: -1 }, { x: -1, y:  0, z:  0 }, { x: -1, y:  0, z:  1 },
        { x: -1, y: -1, z: -1 }, { x: -1, y: -1, z:  0 }, { x: -1, y: -1, z:  1 },
    ];
    for (let i = 0; i < 9; i++) map[36 + i] = { pos: L[i], face: '-x' };

     
    const B = [
        { x:  1, y:  1, z: -1 }, { x: 0, y:  1, z: -1 }, { x: -1, y:  1, z: -1 },
        { x:  1, y:  0, z: -1 }, { x: 0, y:  0, z: -1 }, { x: -1, y:  0, z: -1 },
        { x:  1, y: -1, z: -1 }, { x: 0, y: -1, z: -1 }, { x: -1, y: -1, z: -1 },
    ];
    for (let i = 0; i < 9; i++) map[45 + i] = { pos: B[i], face: '-z' };

    return map;
}

 






const MOVE_DEFS = {
    'R': { axis: 'x', slice:  1, angle: -Math.PI / 2 },
    'L': { axis: 'x', slice: -1, angle:  Math.PI / 2 },
    'U': { axis: 'y', slice:  1, angle: -Math.PI / 2 },
    'D': { axis: 'y', slice: -1, angle:  Math.PI / 2 },
    'F': { axis: 'z', slice:  1, angle: -Math.PI / 2 },
    'B': { axis: 'z', slice: -1, angle:  Math.PI / 2 },
};

 
 
 

 







export class Cube3D {
     


    constructor(container) {
         
        this.container = container;

         
         
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a1a);

         
        const aspect = container.clientWidth / container.clientHeight || 1;
         
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.set(5, 4, 5);
        this.camera.lookAt(0, 0, 0);

         
         
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        container.appendChild(this.renderer.domElement);

         
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 5, 5);
        this.scene.add(dirLight);

         
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-4, -2, -4);
        this.scene.add(fillLight);

         
         
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.12;
        this.controls.autoRotate = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 15;
        this.controls.enablePan = false;

         
         





        this.cubies = [];

         
        this._faceletMap = buildFaceletMap();

         
        this._animating = false;

        this._buildCube();

         
         
        this._rafId = null;
        this._animate = this._animate.bind(this);
        this._animate();

         
         
        this._resizeObserver = new ResizeObserver(() => this.resize());
        this._resizeObserver.observe(container);
    }

     
     
     

     



    _buildCube() {
        const geometry = new RoundedBoxGeometry(0.93, 0.93, 0.93, 4, 0.06);

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                     
                    if (x === 0 && y === 0 && z === 0) continue;

                    const materials = this._buildCubieMaterials(x, y, z);
                    const mesh = new THREE.Mesh(geometry, materials);
                    mesh.position.set(x, y, z);

                     
                    const edgeGeometry = new THREE.EdgesGeometry(geometry, 15);
                    const edgeMaterial = new THREE.LineBasicMaterial({
                        color: 0x000000,
                        linewidth: 1,
                        transparent: true,
                        opacity: 0.6,
                    });
                    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
                    mesh.add(edges);

                    this.scene.add(mesh);
                    this.cubies.push({ mesh, materials, edges, position: { x, y, z } });
                }
            }
        }
    }

     








    _buildCubieMaterials(x, y, z) {
         



        const mat = (exposed, defaultColor) => {
            if (exposed) {
                return new THREE.MeshStandardMaterial({
                    color: defaultColor,
                    roughness: 0.3,
                    metalness: 0.05,
                    flatShading: false,
                });
            }
            return new THREE.MeshStandardMaterial({
                color: INTERNAL_COLOR,
                roughness: 0.9,
                metalness: 0.0,
            });
        };

         
        return [
            mat(x ===  1, STICKER_COLORS['R']),   
            mat(x === -1, STICKER_COLORS['L']),   
            mat(y ===  1, STICKER_COLORS['U']),   
            mat(y === -1, STICKER_COLORS['D']),   
            mat(z ===  1, STICKER_COLORS['F']),   
            mat(z === -1, STICKER_COLORS['B']),   
        ];
    }

     
     
     

     










    setState(faceletString) {
        if (faceletString.length !== 54) {
            console.error(`setState: expected 54 chars, got ${faceletString.length}`);
            return;
        }

         
         
        this._resetCubiePositions();

        for (let i = 0; i < 54; i++) {
            const letter = faceletString[i];
            const color = STICKER_COLORS[letter];
            if (color === undefined) {
                console.warn(`setState: unknown facelet letter '${letter}' at index ${i}`);
                continue;
            }
            const { pos, face } = this._faceletMap[i];
            const cubie = this._findCubieAt(pos.x, pos.y, pos.z);
            if (!cubie) continue;
            const matIdx = FACE_INDEX[face];
            cubie.materials[matIdx].color.setHex(color);
            cubie.materials[matIdx].needsUpdate = true;
        }
    }

     



    _resetCubiePositions() {
        let idx = 0;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && z === 0) continue;
                    const cubie = this.cubies[idx];
                    cubie.mesh.position.set(x, y, z);
                    cubie.mesh.rotation.set(0, 0, 0);
                    cubie.mesh.updateMatrix();
                    cubie.position = { x, y, z };
                    idx++;
                }
            }
        }
    }

     







    _findCubieAt(x, y, z) {
        return this.cubies.find(c =>
            Math.round(c.position.x) === x &&
            Math.round(c.position.y) === y &&
            Math.round(c.position.z) === z
        );
    }

     
     
     

     






    animateMove(move, duration = 400) {
        return new Promise((resolve, reject) => {
             
            const face = move[0];
            const modifier = move.substring(1);  

            const def = MOVE_DEFS[face];
            if (!def) {
                console.error(`animateMove: unknown face '${face}'`);
                resolve();
                return;
            }

            let angle = def.angle;
            if (modifier === "'") angle = -angle;
            else if (modifier === '2') angle *= 2;

            const { axis, slice } = def;

             
            const affected = this.cubies.filter(c => {
                const val = Math.round(c.position[axis]);
                return val === slice;
            });

            if (affected.length === 0) {
                resolve();
                return;
            }

             
            const pivot = new THREE.Group();
            this.scene.add(pivot);

             
            for (const cubie of affected) {
                pivot.attach(cubie.mesh);
            }

             
            const startTime = performance.now();
            const axisVec = new THREE.Vector3(
                axis === 'x' ? 1 : 0,
                axis === 'y' ? 1 : 0,
                axis === 'z' ? 1 : 0,
            );

            const step = (now) => {
                const elapsed = now - startTime;
                const rawT = Math.min(elapsed / duration, 1);
                const t = easeInOutCubic(rawT);

                 
                pivot.setRotationFromAxisAngle(axisVec, angle * t);

                if (rawT < 1) {
                    requestAnimationFrame(step);
                } else {
                     
                    pivot.setRotationFromAxisAngle(axisVec, angle);
                    pivot.updateMatrixWorld(true);

                     
                    for (const cubie of affected) {
                        this.scene.attach(cubie.mesh);

                         
                        cubie.position.x = Math.round(cubie.mesh.position.x);
                        cubie.position.y = Math.round(cubie.mesh.position.y);
                        cubie.position.z = Math.round(cubie.mesh.position.z);

                         
                        cubie.mesh.position.set(
                            cubie.position.x,
                            cubie.position.y,
                            cubie.position.z,
                        );
                    }

                     
                    this.scene.remove(pivot);

                    resolve();
                }
            };

            requestAnimationFrame(step);
        });
    }

     
     
     

     



    _animate() {
        this._rafId = requestAnimationFrame(this._animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

     


    resize() {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        if (w === 0 || h === 0) return;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }

     
     
     

     



    dispose() {
         
        if (this._rafId !== null) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }

         
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }

         
        this.controls.dispose();

         
        for (const cubie of this.cubies) {
             
            for (const mat of cubie.materials) {
                mat.dispose();
            }
             
            if (cubie.mesh.children.length > 0) {
                for (const child of cubie.mesh.children) {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) child.material.dispose();
                }
            }
            cubie.mesh.geometry.dispose();
            this.scene.remove(cubie.mesh);
        }
        this.cubies.length = 0;

         
        this.renderer.dispose();
        if (this.renderer.domElement.parentElement) {
            this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
        }
    }
}
