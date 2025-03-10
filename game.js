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
    // Create scene with colorful background
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

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

    // Create track
    createTrack();

    // Create car
    createCar();

    // Create power-ups and items
    createPowerUps();
    createItems();

    // Add event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Hide loading screen
    document.getElementById('loading').style.display = 'none';
}

// Create power-ups
function createPowerUps() {
    const powerUpPositions = [
        new THREE.Vector3(-15, 0.5, -15),
        new THREE.Vector3(15, 0.5, -15),
        new THREE.Vector3(15, 0.5, 15),
        new THREE.Vector3(-15, 0.5, 15)
    ];

    powerUpPositions.forEach(pos => {
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
        scene.add(powerUp);
        powerUps.push(powerUp);
    });
}

// Create items
function createItems() {
    const itemPositions = [
        new THREE.Vector3(-10, 0.5, -10),
        new THREE.Vector3(10, 0.5, -10),
        new THREE.Vector3(10, 0.5, 10),
        new THREE.Vector3(-10, 0.5, 10)
    ];

    itemPositions.forEach(pos => {
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
        scene.add(item);
        items.push(item);
    });
}

// Create the racing track
function createTrack() {
    const trackGeometry = new THREE.BufferGeometry();
    const trackPoints = [
        new THREE.Vector3(-20, 0.1, -20),
        new THREE.Vector3(20, 0.1, -20),
        new THREE.Vector3(20, 0.1, 20),
        new THREE.Vector3(-20, 0.1, 20),
        new THREE.Vector3(-20, 0.1, -20)
    ];
    
    trackGeometry.setFromPoints(trackPoints);
    const trackMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffd700,
        opacity: 0.8,
        transparent: true
    });
    track = new THREE.Line(trackGeometry, trackMaterial);
    scene.add(track);

    // Create checkpoints with glow effect
    trackPoints.forEach((point, index) => {
        if (index < trackPoints.length - 1) {
            const checkpointGeometry = new THREE.SphereGeometry(0.5, 32, 32);
            const checkpointMaterial = new THREE.MeshStandardMaterial({
                color: 0xffd700,
                emissive: 0xffd700,
                emissiveIntensity: 0.5
            });
            const checkpoint = new THREE.Mesh(checkpointGeometry, checkpointMaterial);
            checkpoint.position.copy(point);
            checkpoint.castShadow = true;
            checkpoint.receiveShadow = true;
            scene.add(checkpoint);

            checkpoints.push({
                mesh: checkpoint,
                position: point,
                radius: 2,
                passed: false
            });
        }
    });
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
    if (currentItem) {
        switch(currentItem.type.effect) {
            case 'catch':
                // Catch nearby items
                items.forEach(item => {
                    if (item.mesh.position.distanceTo(car.mesh.position) < 5) {
                        item.mesh.visible = false;
                    }
                });
                break;
            case 'heal':
                // Reset boost
                car.boost = 1;
                break;
            case 'boost':
                // Temporary speed boost
                car.speed = Math.min(car.speed * 2, car.maxSpeed * 2);
                break;
        }
        currentItem = null;
        document.getElementById('itemBox').textContent = '🎁';
    }
}

// Use current power-up
function usePowerUp() {
    if (currentPowerUp) {
        switch(currentPowerUp.type.effect) {
            case 'speed':
                car.maxSpeed *= 1.5;
                setTimeout(() => car.maxSpeed /= 1.5, currentPowerUp.type.duration * 1000);
                break;
            case 'invincibility':
                // Add invincibility effect
                car.mesh.material.color.setHex(0xffff00);
                setTimeout(() => car.mesh.material.color.setHex(0xff0000), currentPowerUp.type.duration * 1000);
                break;
            case 'attack':
                // Use Pokémon ability
                if (pokemon.cooldown <= 0) {
                    pokemon.cooldown = 5;
                    car.pokemon.material.color.setHex(0x00ffff);
                    setTimeout(() => {
                        car.pokemon.material.color.setHex(0xFFFF00);
                        pokemon.cooldown = 0;
                    }, 3000);
                }
                break;
        }
        currentPowerUp = null;
        document.getElementById('currentPowerUp').textContent = '⚡';
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
    powerUps.forEach(powerUp => {
        if (powerUp.mesh.visible && car.mesh.position.distanceTo(powerUp.mesh.position) < 2) {
            powerUp.mesh.visible = false;
            currentPowerUp = powerUp;
            document.getElementById('currentPowerUp').textContent = '⚡';
            document.getElementById('powerUp').textContent = powerUp.userData.type.name;
        }
    });
}

// Check item collisions
function checkItems() {
    items.forEach(item => {
        if (item.mesh.visible && car.mesh.position.distanceTo(item.mesh.position) < 2) {
            item.mesh.visible = false;
            currentItem = item;
            document.getElementById('itemBox').textContent = '🎁';
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

// Start the game
init();
animate(); 