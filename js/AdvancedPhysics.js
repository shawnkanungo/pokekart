class AdvancedPhysics {
  constructor() {
    // Physics constants
    this.gravity = 9.8; // m/s^2
    this.airDensity = 1.2; // kg/m^3
    
    // Car physics parameters
    this.dragCoefficient = 0.3;
    this.downforceCoefficient = 1.5;
    this.rollingResistance = 0.015;
    this.lateralGripBaseFactor = 1.8;
    
    // Tire physics
    this.tireGripCurve = [
      { slip: 0.0, grip: 0.0 },    // No slip, no grip
      { slip: 0.05, grip: 0.8 },   // Small slip, building grip
      { slip: 0.1, grip: 1.0 },    // Optimal slip ratio for peak grip
      { slip: 0.2, grip: 0.95 },   // Past optimal, slightly less grip
      { slip: 0.3, grip: 0.85 },   // More slip, less grip
      { slip: 0.5, grip: 0.7 },    // Significant slip, reduced grip
      { slip: 1.0, grip: 0.6 }     // Full slip, minimum grip
    ];
    
    // Tire temperatures
    this.optimalTireTemp = 90; // °C
    this.currentTireTemp = {
      frontLeft: 25,
      frontRight: 25,
      rearLeft: 25,
      rearRight: 25
    };
  }

  // Calculate tire slip based on velocity and steering angle
  calculateTireSlip(velocity, steeringAngle, driftInput) {
    // Decompose velocity into forward and lateral components
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    if (speed < 0.1) return 0; // No slip at very low speeds
    
    // Calculate intended direction vs actual direction
    const forwardDirection = { x: Math.cos(steeringAngle), y: Math.sin(steeringAngle) };
    const actualDirection = { x: velocity.x / speed, y: velocity.y / speed };
    
    // Dot product gives cosine of angle between vectors
    const dotProduct = forwardDirection.x * actualDirection.x + forwardDirection.y * actualDirection.y;
    const slipAngle = Math.acos(Math.min(1, Math.max(-1, dotProduct)));
    
    // Convert to slip ratio (0 to 1)
    let slipRatio = slipAngle / (Math.PI / 2);
    
    // Apply drift input to increase slip
    slipRatio += driftInput * 0.3;
    
    return Math.min(slipRatio, 1);
  }

  // Get grip factor based on slip ratio using the tire grip curve
  getGripFromSlip(slipRatio) {
    // Find grip using the tire grip curve
    for (let i = 0; i < this.tireGripCurve.length - 1; i++) {
      if (slipRatio >= this.tireGripCurve[i].slip && slipRatio <= this.tireGripCurve[i + 1].slip) {
        // Linear interpolation between points
        const t = (slipRatio - this.tireGripCurve[i].slip) / 
                  (this.tireGripCurve[i + 1].slip - this.tireGripCurve[i].slip);
        return this.tireGripCurve[i].grip * (1 - t) + this.tireGripCurve[i + 1].grip * t;
      }
    }
    
    // Return minimum grip for slip ratios beyond the curve
    return this.tireGripCurve[this.tireGripCurve.length - 1].grip;
  }

  // Update tire temperatures based on driving conditions
  updateTireTemperatures(slipRatio, speed, dt) {
    const heatingFactor = slipRatio * speed * 0.01;
    const coolingFactor = 0.05;
    
    // Update temperatures for each tire
    for (const tire in this.currentTireTemp) {
      // Heat up tires based on slip and speed
      this.currentTireTemp[tire] += heatingFactor * dt;
      
      // Natural cooling
      const tempDiff = this.currentTireTemp[tire] - 25; // Ambient temp (25°C)
      this.currentTireTemp[tire] -= tempDiff * coolingFactor * dt;
    }
    
    // Calculate grip modifier based on temperature
    // Optimal grip at optimal temp, worse when too cold or too hot
    const avgTemp = Object.values(this.currentTireTemp).reduce((sum, temp) => sum + temp, 0) / 4;
    const tempDiff = Math.abs(avgTemp - this.optimalTireTemp);
    const tempGripModifier = 1 - Math.min(1, tempDiff / 50) * 0.3;
    
    return tempGripModifier;
  }

  // Calculate forces on the car
  calculateForces(car, trackConditions, dt) {
    const speed = Math.sqrt(car.velocity.x * car.velocity.x + car.velocity.y * car.velocity.y);
    
    // Calculate tire slip
    const slipRatio = this.calculateTireSlip(car.velocity, car.steeringAngle, car.driftInput);
    
    // Calculate grip based on slip, temperature, and track conditions
    const baseGrip = this.getGripFromSlip(slipRatio);
    const tempGripModifier = this.updateTireTemperatures(slipRatio, speed, dt);
    const trackGripFactor = trackConditions.gripFactor;
    
    // Final grip calculation
    const finalGrip = baseGrip * tempGripModifier * trackGripFactor * this.lateralGripBaseFactor;
    
    // Drag force (air resistance)
    const dragForce = 0.5 * this.airDensity * this.dragCoefficient * speed * speed;
    
    // Downforce (increases with speed)
    const downforce = 0.5 * this.airDensity * this.downforceCoefficient * speed * speed;
    
    // Rolling resistance
    const rollingResistance = this.rollingResistance * car.mass * this.gravity;
    
    // Boost physics
    let boostForce = 0;
    if (car.isBoosting) {
      boostForce = car.boostPower * car.mass;
    }
    
    // DRS effect (drag reduction)
    let drsMultiplier = 1.0;
    if (car.hasDrsActive) {
      drsMultiplier = 0.7; // 30% drag reduction
    }
    
    return {
      grip: finalGrip,
      drag: dragForce * drsMultiplier,
      downforce: downforce,
      rollingResistance: rollingResistance,
      boost: boostForce,
      slipRatio: slipRatio
    };
  }

  // Apply physics forces to update car movement
  updateCarPhysics(car, track, dt) {
    // Get track conditions at car's position
    const trackConditions = track.getTrackConditionsAt(car.position);
    
    // Calculate forces
    const forces = this.calculateForces(car, trackConditions, dt);
    
    // Convert steering input to direction change
    car.direction += car.steeringInput * car.handling * dt * (1 - forces.slipRatio * 0.5);
    
    // Normalize direction angle
    car.direction = car.direction % (Math.PI * 2);
    if (car.direction < 0) car.direction += Math.PI * 2;
    
    // Forward direction vector
    const forwardDir = {
      x: Math.cos(car.direction),
      y: Math.sin(car.direction)
    };
    
    // Calculate forward speed component
    const forwardVel = car.velocity.x * forwardDir.x + car.velocity.y * forwardDir.y;
    
    // Calculate lateral speed component (perpendicular to forward)
    const rightDir = { x: -forwardDir.y, y: forwardDir.x };
    const rightVel = car.velocity.x * rightDir.x + car.velocity.y * rightDir.y;
    
    // Apply engine force
    let engineForce = 0;
    if (car.throttleInput > 0) {
      engineForce = car.throttleInput * car.enginePower;
    } else if (car.throttleInput < 0) {
      // Braking
      engineForce = car.throttleInput * car.brakingPower;
    }
    
    // Calculate acceleration along forward direction
    const forwardAcc = (engineForce - forces.drag - forces.rollingResistance * Math.sign(forwardVel) + forces.boost) / car.mass;
    
    // Update forward velocity
    let newForwardVel = forwardVel + forwardAcc * dt;
    
    // Apply lateral grip (cornering force)
    // Higher grip means faster reduction in lateral velocity
    const lateralGripForce = forces.grip * (1 + forces.downforce / (car.mass * this.gravity)) * car.mass;
    const lateralDampingFactor = Math.exp(-lateralGripForce * dt / car.mass);
    let newRightVel = rightVel * lateralDampingFactor;
    
    // Special handling for drifting
    if (car.driftInput > 0 && Math.abs(forwardVel) > 2) {
      // During drift, we reduce lateral grip but maintain some control
      const driftFactor = 0.2 + (1 - car.driftInput) * 0.3;
      newRightVel = rightVel * Math.exp(-lateralGripForce * driftFactor * dt / car.mass);
      
      // Drift steering effect - helps rotate car during drift
      car.direction += car.steeringInput * car.driftInput * 0.3 * dt;
      
      // Speed loss during drift
      newForwardVel *= (1 - car.driftInput * 0.02);
      
      // Visual and gameplay effects
      car.isDrifting = true;
      
      // Charge boost during successful drift
      car.boostCharge = Math.min(car.boostCharge + car.driftInput * 0.2 * dt, car.maxBoostCharge);
    } else {
      car.isDrifting = false;
    }
    
    // Check if car is in DRS zone
    car.hasDrsActive = car.drsEnabled && track.isInDrsZone(car.position);
    
    // Convert back to world space velocities
    car.velocity.x = newForwardVel * forwardDir.x + newRightVel * rightDir.x;
    car.velocity.y = newForwardVel * forwardDir.y + newRightVel * rightDir.y;
    
    // Update position based on velocity
    car.position.x += car.velocity.x * dt;
    car.position.y += car.velocity.y * dt;
    
    // Handle collisions with track boundaries
    this.handleTrackCollisions(car, track, dt);
    
    // Update visual rotation to match driving direction
    car.visualRotation = car.direction;
    
    // Boost management
    if (car.isBoosting && car.boostCharge > 0) {
      car.boostCharge = Math.max(0, car.boostCharge - dt);
      if (car.boostCharge <= 0) {
        car.isBoosting = false;
      }
    }
    
    // Update drift visual effects
    if (car.isDrifting) {
      car.driftEffectIntensity = Math.min(1, car.driftEffectIntensity + dt * 2);
    } else {
      car.driftEffectIntensity = Math.max(0, car.driftEffectIntensity - dt * 3);
    }
    
    // Return physics state for gameplay mechanics
    return {
      speed: Math.sqrt(car.velocity.x * car.velocity.x + car.velocity.y * car.velocity.y),
      grip: forces.grip,
      slipRatio: forces.slipRatio,
      isDrifting: car.isDrifting,
      isOffTrack: trackConditions.isOffTrack,
      boostCharge: car.boostCharge / car.maxBoostCharge, // 0 to 1 value
      hasDrsActive: car.hasDrsActive
    };
  }

  // Handle collisions with track boundaries
  handleTrackCollisions(car, track, dt) {
    const { segment, distance } = track.findNearestSegment(car.position);
    
    if (!segment) return; // No nearby segment found
    
    const isOffTrack = distance > track.trackWidth / 2;
    
    if (isOffTrack) {
      // Car is off track, apply resistance and slowing
      const offTrackFriction = 0.8;
      car.velocity.x *= offTrackFriction;
      car.velocity.y *= offTrackFriction;
      
      // Find nearest point on track to guide car back (soft barrier)
      let nearestPoint = { x: 0, y: 0 };
      
      if (segment.type === 'straight') {
        // Find nearest point on straight segment
        const A = car.position.x - segment.start.x;
        const B = car.position.y - segment.start.y;
        const C = segment.end.x - segment.start.x;
        const D = segment.end.y - segment.start.y;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        const param = Math.max(0, Math.min(1, dot / lenSq));
        
        nearestPoint.x = segment.start.x + param * C;
        nearestPoint.y = segment.start.y + param * D;
      } else if (segment.type === 'turn' || segment.type === 'hairpin') {
        // Find nearest point on curved segment
        const dx = car.position.x - segment.center.x;
        const dy = car.position.y - segment.center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize and scale to track radius
        nearestPoint.x = segment.center.x + (dx / distance) * segment.radius;
        nearestPoint.y = segment.center.y + (dy / distance) * segment.radius;
      }
      
      // Apply a gentle force toward the track
      const pushStrength = 0.5; // Strength of force pushing back to track
      const dx = nearestPoint.x - car.position.x;
      const dy = nearestPoint.y - car.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        car.velocity.x += (dx / distance) * pushStrength;
        car.velocity.y += (dy / distance) * pushStrength;
      }
      
      // Apply speed penalty for being off-track
      car.velocity.x *= 0.98;
      car.velocity.y *= 0.98;
    }
  }
} 