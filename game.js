// Import Three.js
import * as THREE from 'three';

// Game state variables
let scene, camera, renderer, car, track;
let lapCount = 0;
let checkpoints = [];
let lastCheckpoint = -1;
let powerUps = [];
let items = [];
let currentPowerUp = null;
let currentItem = null;
let pokemon = {
    name: 'Pikachu',
    type: 'Electric',
    ability: 'Thunder',
    cooldown: 0
};

// Debug logging
const DEBUG = true;
function log(...args) {
    if (DEBUG) {
        console.log('[PokéKart]', ...args);
    }
}

// Error handling
function handleError(error, context) {
    console.error(`[PokéKart] Error in ${context}:`, error);
    const errorElement = document.getElementById('error');
    if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.textContent = `Error in ${context}: ${error.message}`;
    }
}

// Power-up types
const POWER_UPS = {
    MUSHROOM: { name: 'Mushroom', effect: 'speed', duration: 5, color: 0xff0000 },
    STAR: { name: 'Star', effect: 'invincibility', duration: 8, color: 0xffff00 },
    THUNDER: { name: 'Thunder', effect: 'attack', duration: 3, color: 0x00ffff }
};

// Item types
const ITEMS = {
    POKEBALL: { name: 'Pokéball', effect: 'catch', color: 0xff0000 },
    POTION: { name: 'Potion', effect: 'heal', color: 0x00ff00 },
    BERRY: { name: 'Berry', effect: 'boost', color: 0xff00ff }
};

// Initialize the game
function init() {
    try {
        log('Starting game initialization...');
        
        // Create scene with colorful background
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB); // Sky blue
        log('Scene created');

        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);
        log('Camera created');

        // Create renderer
        renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(renderer.domElement);
        log('Renderer created and added to DOM');

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        log('Lighting added');

        // Create ground with grass texture
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x90EE90,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);
        log('Ground created');

        // Create track
        createTrack();
        log('Track created');

        // Create car
        createCar();
        log('Car created');

        // Create power-ups and items
        createPowerUps();
        createItems();
        log('Power-ups and items created');

        // Add event listeners
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        log('Event listeners added');

        // Hide loading screen
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            log('Loading screen hidden');
        }

        // Start animation loop
        animate();
        log('Animation loop started');

        log('Game initialization complete!');
    } catch (error) {
        handleError(error, 'game initialization');
    }
}

// Create power-ups
function createPowerUps() {
    try {
        const powerUpPositions = [
            new THREE.Vector3(-15, 0.5, -15),
            new THREE.Vector3(15, 0.5, -15),
            new THREE.Vector3(15, 0.5, 15),
            new THREE.Vector3(-15, 0.5, 15)
        ];

        // Clear existing power-ups array
        powerUps = [];

        powerUpPositions.forEach(pos => {
            try {
                const powerUpGeometry = new THREE.SphereGeometry(0.5, 32, 32);
                const powerUpType = Object.values(POWER_UPS)[Math.floor(Math.random() * Object.keys(POWER_UPS).length)];
                const powerUpMaterial = new THREE.MeshStandardMaterial({
                    color: powerUpType.color,
                    emissive: powerUpType.color,
                    emissiveIntensity: 0.5
                });
                const powerUp = new THREE.Mesh(powerUpGeometry, powerUpMaterial);
                powerUp.position.copy(pos);
                powerUp.castShadow = true;
                powerUp.receiveShadow = true;
                powerUp.userData = { type: powerUpType };
                powerUp.visible = true; // Explicitly set visibility
                
                if (scene) {
                    scene.add(powerUp);
                    powerUps.push(powerUp);
                } else {
                    console.error('Scene not initialized when creating power-ups');
                }
            } catch (error) {
                console.error('Error creating individual power-up:', error);
                handleError(error, 'creating individual power-up');
            }
        });
    } catch (error) {
        console.error('Error in createPowerUps:', error);
        handleError(error, 'creating power-ups');
    }
}

// Create items
function createItems() {
    try {
        const itemPositions = [
            new THREE.Vector3(-10, 0.5, -10),
            new THREE.Vector3(10, 0.5, -10),
            new THREE.Vector3(10, 0.5, 10),
            new THREE.Vector3(-10, 0.5, 10)
        ];

        // Clear existing items array
        items = [];

        itemPositions.forEach(pos => {
            try {
                const itemGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                const itemType = Object.values(ITEMS)[Math.floor(Math.random() * Object.keys(ITEMS).length)];
                const itemMaterial = new THREE.MeshStandardMaterial({
                    color: itemType.color,
                    emissive: itemType.color,
                    emissiveIntensity: 0.5
                });
                const item = new THREE.Mesh(itemGeometry, itemMaterial);
                item.position.copy(pos);
                item.castShadow = true;
                item.receiveShadow = true;
                item.userData = { type: itemType };
                item.visible = true; // Explicitly set visibility
                
                if (scene) {
                    scene.add(item);
                    items.push(item);
                } else {
                    console.error('Scene not initialized when creating items');
                }
            } catch (error) {
                console.error('Error creating individual item:', error);
                handleError(error, 'creating individual item');
            }
        });
    } catch (error) {
        console.error('Error in createItems:', error);
        handleError(error, 'creating items');
    }
}

// Create the racing track
function createTrack() {
    try {
        // Create grass base
        const grassGeometry = new THREE.PlaneGeometry(1000, 1000);
        const grassMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x90EE90,
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        const grass = new THREE.Mesh(grassGeometry, grassMaterial);
        grass.rotation.x = -Math.PI / 2;
        grass.position.y = 0.05;
        grass.receiveShadow = true;
        scene.add(grass);

        // Define track points for a more interesting circuit
        const trackPoints = [
            // Start/Finish straight
            new THREE.Vector3(-40, 0.2, 0),
            new THREE.Vector3(-20, 0.2, 0),
            // First curve
            new THREE.Vector3(-10, 0.2, -10),
            new THREE.Vector3(0, 0.2, -20),
            // First straight
            new THREE.Vector3(20, 0.2, -20),
            // Second curve
            new THREE.Vector3(30, 0.2, -10),
            new THREE.Vector3(40, 0.2, 0),
            // Second straight
            new THREE.Vector3(40, 0.2, 20),
            // Third curve
            new THREE.Vector3(30, 0.2, 30),
            new THREE.Vector3(20, 0.2, 40),
            // Third straight
            new THREE.Vector3(0, 0.2, 40),
            // Fourth curve
            new THREE.Vector3(-20, 0.2, 30),
            new THREE.Vector3(-30, 0.2, 20),
            // Fourth straight
            new THREE.Vector3(-30, 0.2, 0),
            // Final curve back to start
            new THREE.Vector3(-40, 0.2, 0)
        ];

        // Create track surface using curved path
        const curve = new THREE.CatmullRomCurve3(trackPoints);
        const trackGeometry = new THREE.TubeGeometry(curve, 200, 5, 8, false);
        const trackMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080, // Light gray
            roughness: 0.7,
            metalness: 0.3,
            side: THREE.DoubleSide
        });
        const trackBase = new THREE.Mesh(trackGeometry, trackMaterial);
        trackBase.position.y = 0.1;
        trackBase.receiveShadow = true;
        trackBase.castShadow = true;
        scene.add(trackBase);

        // Create track outline (the racing line)
        const trackLineGeometry = new THREE.BufferGeometry().setFromPoints(trackPoints);
        const trackLineMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffd700,
            opacity: 0.8,
            transparent: true,
            linewidth: 2
        });
        track = new THREE.Line(trackLineGeometry, trackLineMaterial);
        track.position.y = 0.3; // Raise the line above the track
        scene.add(track);

        // Create track barriers with reflective material
        const barrierGeometry = new THREE.BoxGeometry(1, 1, 1);
        const barrierMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.5,
            metalness: 0.8,
            envMapIntensity: 1.0
        });

        // Create barriers along the track
        trackPoints.forEach((point, index) => {
            if (index < trackPoints.length - 1) {
                const nextPoint = trackPoints[index + 1];
                const direction = nextPoint.clone().sub(point);
                const length = direction.length();
                direction.normalize();

                // Create multiple barrier segments
                const segments = Math.floor(length / 2);
                for (let i = 0; i < segments; i++) {
                    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
                    const position = point.clone().add(direction.clone().multiplyScalar(i * 2));
                    barrier.position.copy(position);
                    barrier.scale.set(0.2, 0.5, 2); // Make barriers thin and tall
                    barrier.castShadow = true;
                    barrier.receiveShadow = true;
                    scene.add(barrier);
                }
            }
        });

        // Create checkpoints with enhanced glow effect
        trackPoints.forEach((point, index) => {
            if (index < trackPoints.length - 1) {
                const checkpointGeometry = new THREE.SphereGeometry(0.5, 32, 32);
                const checkpointMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffd700,
                    emissive: 0xffd700,
                    emissiveIntensity: 0.5,
                    metalness: 0.8,
                    roughness: 0.2
                });
                const checkpoint = new THREE.Mesh(checkpointGeometry, checkpointMaterial);
                checkpoint.position.copy(point);
                checkpoint.position.y += 0.2; // Raise checkpoints above track
                checkpoint.castShadow = true;
                checkpoint.receiveShadow = true;
                scene.add(checkpoint);

                // Add checkpoint number with glow effect
                const textGeometry = new THREE.PlaneGeometry(1, 1);
                const textMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.copy(point);
                textMesh.position.y += 1.2; // Raise text above checkpoints
                scene.add(textMesh);

                checkpoints.push({
                    mesh: checkpoint,
                    position: point,
                    radius: 2,
                    passed: false,
                    text: textMesh
                });
            }
        });

        // Add track decorations
        const decorationPositions = [
            new THREE.Vector3(-30, 0.2, 20),
            new THREE.Vector3(30, 0.2, -20),
            new THREE.Vector3(20, 0.2, 30),
            new THREE.Vector3(-20, 0.2, -30)
        ];

        decorationPositions.forEach(pos => {
            // Create traffic cone
            const coneGeometry = new THREE.ConeGeometry(0.3, 1, 32);
            const coneMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6600,
                roughness: 0.7,
                metalness: 0.3,
                emissive: 0xff6600,
                emissiveIntensity: 0.2
            });
            const cone = new THREE.Mesh(coneGeometry, coneMaterial);
            cone.position.copy(pos);
            cone.position.y += 0.2; // Raise cones above track
            cone.castShadow = true;
            cone.receiveShadow = true;
            scene.add(cone);

            // Add track signs
            const signGeometry = new THREE.PlaneGeometry(1, 1);
            const signMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.5,
                metalness: 0.5
            });
            const sign = new THREE.Mesh(signGeometry, signMaterial);
            sign.position.copy(pos);
            sign.position.y += 1.2; // Raise signs above track
            sign.rotation.y = Math.PI / 4;
            sign.castShadow = true;
            sign.receiveShadow = true;
            scene.add(sign);
        });

        // Add track markings (start/finish line)
        const startLineGeometry = new THREE.PlaneGeometry(2, 4);
        const startLineMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5
        });
        const startLine = new THREE.Mesh(startLineGeometry, startLineMaterial);
        startLine.position.copy(trackPoints[0]);
        startLine.position.y += 0.2; // Raise start line above track
        startLine.rotation.x = -Math.PI / 2;
        startLine.castShadow = true;
        startLine.receiveShadow = true;
        scene.add(startLine);

        // Add ambient light to improve visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Add directional light for better shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        log('Track created successfully with textures');
    } catch (error) {
        console.error('Error creating track:', error);
        handleError(error, 'creating track');
    }
}

// Create the car
function createCar() {
    // Create a group to hold both car and Pokémon
    const vehicleGroup = new THREE.Group();

    // Car body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        metalness: 0.8,
        roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    vehicleGroup.add(body);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        metalness: 0.9,
        roughness: 0.1
    });
    
    const wheels = [];
    const wheelPositions = [
        [-1.2, 0.2, -1.2], [1.2, 0.2, -1.2],
        [-1.2, 0.2, 1.2], [1.2, 0.2, 1.2]
    ];

    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(...pos);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        wheel.receiveShadow = true;
        wheels.push(wheel);
        vehicleGroup.add(wheel);
    });

    // Create Pokémon character (Pikachu-like shape)
    const pokemonGroup = new THREE.Group();
    
    // Body
    const pokemonBody = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0xFFFF00 })
    );
    pokemonBody.position.set(0, 1.2, 0);
    pokemonBody.castShadow = true;
    pokemonBody.receiveShadow = true;
    pokemonGroup.add(pokemonBody);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 1.4, 0.7);
    pokemonGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.3, 1.4, 0.7);
    pokemonGroup.add(rightEye);

    // Cheeks
    const cheekGeometry = new THREE.CircleGeometry(0.2, 32);
    const cheekMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    
    const leftCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
    leftCheek.position.set(-0.8, 1.2, 0.7);
    leftCheek.rotation.y = Math.PI / 2;
    pokemonGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
    rightCheek.position.set(0.8, 1.2, 0.7);
    rightCheek.rotation.y = -Math.PI / 2;
    pokemonGroup.add(rightCheek);

    // Add Pokémon to vehicle group
    vehicleGroup.add(pokemonGroup);

    car = {
        mesh: vehicleGroup,
        speed: 0,
        angle: 0,
        acceleration: 0.1,
        maxSpeed: 0.5,
        turnSpeed: 0.02,
        drift: false,
        boost: 0,
        pokemon: pokemonGroup
    };

    scene.add(car.mesh);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle key presses
function onKeyDown(event) {
    switch(event.keyCode) {
        case 38: // Up arrow
            car.speed = Math.min(car.speed + car.acceleration, car.maxSpeed);
            break;
        case 40: // Down arrow
            car.speed = Math.max(car.speed - car.acceleration, -car.maxSpeed/2);
            break;
        case 37: // Left arrow
            if (event.shiftKey) {
                car.drift = true;
                car.mesh.rotation.y += car.turnSpeed * 2;
            } else {
                car.mesh.rotation.y += car.turnSpeed;
            }
            break;
        case 39: // Right arrow
            if (event.shiftKey) {
                car.drift = true;
                car.mesh.rotation.y -= car.turnSpeed * 2;
            } else {
                car.mesh.rotation.y -= car.turnSpeed;
            }
            break;
        case 32: // Spacebar
            car.boost = 1;
            car.speed = Math.min(car.speed * 1.5, car.maxSpeed * 1.5);
            break;
        case 73: // I key for using item
            useItem();
            break;
        case 80: // P key for using power-up
            usePowerUp();
            break;
    }
}

// Handle key releases
function onKeyUp(event) {
    switch(event.keyCode) {
        case 37: // Left arrow
        case 39: // Right arrow
            car.drift = false;
            break;
    }
}

// Use current item
function useItem() {
    if (currentItem && currentItem.type) {
        try {
            switch(currentItem.type.effect) {
                case 'catch':
                    // Catch nearby items
                    items.forEach(item => {
                        if (item && item.mesh && item.mesh.visible !== undefined) {
                            const distance = item.mesh.position.distanceTo(car.mesh.position);
                            if (distance < 5) {
                                item.mesh.visible = false;
                            }
                        }
                    });
                    break;
                case 'heal':
                    // Reset boost
                    if (car && typeof car.boost === 'number') {
                        car.boost = 1;
                    }
                    break;
                case 'boost':
                    // Temporary speed boost
                    if (car && typeof car.speed === 'number' && typeof car.maxSpeed === 'number') {
                        car.speed = Math.min(car.speed * 2, car.maxSpeed * 2);
                    }
                    break;
            }
            currentItem = null;
            const itemBox = document.getElementById('itemBox');
            if (itemBox) {
                itemBox.textContent = '🎁';
            }
        } catch (error) {
            console.error('Error using item:', error);
            handleError(error, 'using item');
        }
    }
}

// Use current power-up
function usePowerUp() {
    if (currentPowerUp && currentPowerUp.type && car) {
        try {
            switch(currentPowerUp.type.effect) {
                case 'speed':
                    if (typeof car.maxSpeed === 'number') {
                        car.maxSpeed *= 1.5;
                        setTimeout(() => {
                            if (typeof car.maxSpeed === 'number') {
                                car.maxSpeed /= 1.5;
                            }
                        }, currentPowerUp.type.duration * 1000);
                    }
                    break;
                case 'invincibility':
                    if (car.mesh && car.mesh.material) {
                        car.mesh.material.color.setHex(0xffff00);
                        setTimeout(() => {
                            if (car.mesh && car.mesh.material) {
                                car.mesh.material.color.setHex(0xff0000);
                            }
                        }, currentPowerUp.type.duration * 1000);
                    }
                    break;
                case 'attack':
                    if (pokemon && typeof pokemon.cooldown === 'number' && pokemon.cooldown <= 0) {
                        pokemon.cooldown = 5;
                        if (car.pokemon && car.pokemon.material) {
                            car.pokemon.material.color.setHex(0x00ffff);
                            setTimeout(() => {
                                if (car.pokemon && car.pokemon.material) {
                                    car.pokemon.material.color.setHex(0xFFFF00);
                                    pokemon.cooldown = 0;
                                }
                            }, 3000);
                        }
                    }
                    break;
            }
            currentPowerUp = null;
            const powerUpElement = document.getElementById('currentPowerUp');
            if (powerUpElement) {
                powerUpElement.textContent = '⚡';
            }
        } catch (error) {
            console.error('Error using power-up:', error);
            handleError(error, 'using power-up');
        }
    }
}

// Update game state
function update() {
    // Update car position
    car.mesh.position.x += Math.sin(car.mesh.rotation.y) * car.speed;
    car.mesh.position.z += Math.cos(car.mesh.rotation.y) * car.speed;

    // Apply friction
    car.speed *= 0.98;

    // Update boost
    if (car.boost > 0) {
        car.boost -= 0.01;
    }

    // Update camera position
    camera.position.x = car.mesh.position.x;
    camera.position.z = car.mesh.position.z + 10;
    camera.position.y = 5;
    camera.lookAt(car.mesh.position);

    // Animate Pokémon
    if (car.speed > 0) {
        // Bounce animation when moving
        car.pokemon.position.y = 1.2 + Math.sin(Date.now() * 0.01) * 0.1;
    } else {
        car.pokemon.position.y = 1.2;
    }

    // Check power-ups and items
    checkPowerUps();
    checkItems();

    // Check checkpoints
    checkCheckpoints();

    // Update HUD
    updateHUD();
}

// Check power-up collisions
function checkPowerUps() {
    if (!powerUps || !Array.isArray(powerUps)) return;
    
    powerUps.forEach(powerUp => {
        try {
            if (powerUp && powerUp.mesh && powerUp.mesh.visible !== undefined && car && car.mesh) {
                const distance = car.mesh.position.distanceTo(powerUp.mesh.position);
                if (distance < 2) {
                    powerUp.mesh.visible = false;
                    currentPowerUp = powerUp;
                    const powerUpElement = document.getElementById('currentPowerUp');
                    const powerUpTextElement = document.getElementById('powerUp');
                    if (powerUpElement) powerUpElement.textContent = '⚡';
                    if (powerUpTextElement) powerUpTextElement.textContent = powerUp.userData.type.name;
                }
            }
        } catch (error) {
            console.error('Error checking power-up collision:', error);
            handleError(error, 'checking power-up collision');
        }
    });
}

// Check item collisions
function checkItems() {
    if (!items || !Array.isArray(items)) return;
    
    items.forEach(item => {
        if (item && item.mesh && item.mesh.visible !== undefined && car && car.mesh) {
            try {
                const distance = car.mesh.position.distanceTo(item.mesh.position);
                if (distance < 2) {
                    item.mesh.visible = false;
                    currentItem = item;
                    const itemBox = document.getElementById('itemBox');
                    if (itemBox) {
                        itemBox.textContent = '🎁';
                    }
                }
            } catch (error) {
                console.error('Error checking item collision:', error);
                handleError(error, 'checking item collision');
            }
        }
    });
}

// Check checkpoint collisions
function checkCheckpoints() {
    checkpoints.forEach((checkpoint, index) => {
        const distance = car.mesh.position.distanceTo(checkpoint.position);
        if (distance < checkpoint.radius && !checkpoint.passed) {
            checkpoint.passed = true;
            checkpoint.mesh.material.color.setHex(0x00ff00);
            checkpoint.mesh.material.emissiveIntensity = 1;
            
            if (index === 0 && lastCheckpoint === checkpoints.length - 1) {
                lapCount++;
                if (lapCount >= 3) {
                    alert('Race Complete!');
                    resetGame();
                }
            }
            
            lastCheckpoint = index;
        }
    });
}

// Update HUD
function updateHUD() {
    document.getElementById('lap').textContent = lapCount + 1;
    document.getElementById('speed').textContent = Math.round(Math.abs(car.speed) * 100);
    document.getElementById('boost').textContent = Math.round(car.boost * 100);
    if (pokemon.cooldown > 0) {
        document.getElementById('pokemonSprite').textContent = '⚡';
    } else {
        document.getElementById('pokemonSprite').textContent = '🐱';
    }
}

// Reset game
function resetGame() {
    lapCount = 0;
    car.mesh.position.set(0, 0.5, 0);
    car.speed = 0;
    car.angle = 0;
    car.boost = 0;
    lastCheckpoint = -1;
    currentPowerUp = null;
    currentItem = null;
    pokemon.cooldown = 0;
    
    checkpoints.forEach(checkpoint => {
        checkpoint.passed = false;
        checkpoint.mesh.material.color.setHex(0xffd700);
        checkpoint.mesh.material.emissiveIntensity = 0.5;
    });

    powerUps.forEach(powerUp => {
        powerUp.mesh.visible = true;
    });

    items.forEach(item => {
        item.mesh.visible = true;
    });

    document.getElementById('currentPowerUp').textContent = '⚡';
    document.getElementById('itemBox').textContent = '🎁';
    document.getElementById('pokemonSprite').textContent = '🐱';
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// Start the game when the module is loaded
log('Game module loaded, starting initialization...');
init(); 