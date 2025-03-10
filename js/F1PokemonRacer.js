class F1PokemonRacer extends PokemonRacer {
  constructor(name, type, sprite, baseSpeed, acceleration, handling) {
    super(name, type, sprite, baseSpeed, acceleration, handling);
    
    // F1-specific properties
    this.mass = 700; // kg
    this.enginePower = 30000; // N (Newtons)
    this.brakingPower = 50000; // N
    this.boostPower = 15000; // N
    this.maxBoostCharge = 5.0; // seconds
    this.boostCharge = 0;
    this.drsEnabled = true;
    
    // Control inputs
    this.throttleInput = 0; // -1 to 1 (brake to throttle)
    this.steeringInput = 0; // -1 to 1 (left to right)
    this.driftInput = 0; // 0 to 1 (drift intensity)
    
    // Physics state
    this.direction = 0; // angle in radians
    this.visualRotation = 0; // for rendering
    this.isDrifting = false;
    this.isBoosting = false;
    this.hasDrsActive = false;
    this.driftEffectIntensity = 0;
    
    // Race state
    this.currentLap = 0;
    this.bestLapTime = Infinity;
    this.lapStartTime = 0;
    this.sector1Time = 0;
    this.sector2Time = 0;
    this.sector3Time = 0;
    this.lastCheckpointId = 0;
    
    // Type-specific racing traits
    this.setupTypeTraits();
  }
  
  setupTypeTraits() {
    // Adjust racer physics based on Pokémon type
    switch (this.type) {
      case 'Fire':
        this.enginePower *= 1.2; // More power
        this.mass *= 0.9; // Lighter
        this.boostPower *= 1.3; // Stronger boost
        break;
        
      case 'Water':
        this.handling *= 1.15; // Better handling
        // Better performance on wet tracks
        break;
        
      case 'Electric':
        this.acceleration *= 1.25; // Better acceleration
        this.boostCharge = this.maxBoostCharge * 0.5; // Start with some boost
        break;
        
      case 'Ground':
        this.mass *= 1.2; // Heavier
        // Better performance on rough terrain
        break;
        
      case 'Flying':
        this.mass *= 0.85; // Lightest
        this.enginePower *= 0.9; // Less power but better power-to-weight
        break;
        
      case 'Steel':
        this.mass *= 1.3; // Heaviest
        this.enginePower *= 1.15; // More power to compensate
        // More resilient to collisions
        break;
        
      case 'Ice':
        // Better handling on slippery surfaces
        this.handling *= 1.2; // Best handling
        break;
        
      case 'Psychic':
        // Can see the ideal racing line more clearly
        // Special ability to temporarily predict other racers' moves
        break;
    }
  }
  
  setControls(throttle, steering, drift, boost) {
    this.throttleInput = Math.max(-1, Math.min(1, throttle));
    this.steeringInput = Math.max(-1, Math.min(1, steering));
    this.driftInput = Math.max(0, Math.min(1, drift));
    
    if (boost && this.boostCharge > 0 && !this.isBoosting) {
      this.isBoosting = true;
    }
  }
  
  activateDRS() {
    this.drsEnabled = true;
  }
  
  deactivateDRS() {
    this.drsEnabled = false;
    this.hasDrsActive = false;
  }
  
  update(dt, track, physics) {
    // Apply advanced physics
    const physicsState = physics.updateCarPhysics(this, track, dt);
    
    // Update race progress
    this.updateRaceProgress(track, dt);
    
    // Update special abilities
    this.updateTypeSpecificEffects(track, physicsState);
    
    // Update drift particles and visual effects
    this.updateVisualEffects(physicsState);
    
    return physicsState;
  }
  
  updateRaceProgress(track, dt) {
    // Check if crossed start/finish line
    const startLine = { x: 180, y: 300, width: 40 };
    const distToStartLine = track.distanceToLine(this.position, 
                                               { x: startLine.x, y: startLine.y - track.trackWidth/2 },
                                               { x: startLine.x, y: startLine.y + track.trackWidth/2 });
                                               
    // Simple check for now - in a real implementation would check direction of crossing
    if (distToStartLine < 5 && this.lastCheckpointId === track.segments.length - 1) {
      // Crossed finish line
      if (this.currentLap > 0) {
        // Calculate lap time
        const currentTime = performance.now();
        const lapTime = (currentTime - this.lapStartTime) / 1000;
        
        if (lapTime < this.bestLapTime) {
          this.bestLapTime = lapTime;
        }
      }
      
      this.currentLap++;
      this.lapStartTime = performance.now();
      this.lastCheckpointId = 0;
    }
    
    // Check for passing checkpoints (simplified)
    // In a real implementation, would check all segments properly
    const { segment, distance } = track.findNearestSegment(this.position);
    if (segment) {
      const segmentIndex = track.segments.indexOf(segment);
      if (segmentIndex > this.lastCheckpointId && distance < track.trackWidth / 2) {
        this.lastCheckpointId = segmentIndex;
        
        // Record sector times
        if (segmentIndex === 3) { // Arbitrary segment for sector 1
          this.sector1Time = (performance.now() - this.lapStartTime) / 1000;
        } else if (segmentIndex === 7) { // Arbitrary segment for sector 2
          this.sector2Time = (performance.now() - this.lapStartTime) / 1000 - this.sector1Time;
        }
      }
    }
  }
  
  updateTypeSpecificEffects(track, physicsState) {
    // Apply type-specific effects based on track conditions
    const trackConditions = track.getTrackConditionsAt(this.position);
    
    switch (this.type) {
      case 'Water':
        // Water types perform better in rain
        if (track.weather === 'rain') {
          this.velocity.x *= 1.02;
          this.velocity.y *= 1.02;
        }
        break;
        
      case 'Fire':
        // Fire types perform worse in rain, better in heat
        if (track.weather === 'rain') {
          this.velocity.x *= 0.98;
          this.velocity.y *= 0.98;
        }
        break;
        
      case 'Electric':
        // Electric types can boost longer
        if (this.isBoosting) {
          this.boostCharge -= 0.8 * (1/60); // 20% longer boost duration
        }
        break;
        
      case 'Ground':
        // Ground types perform better off-track
        if (physicsState.isOffTrack) {
          this.velocity.x *= 1.05;
          this.velocity.y *= 1.05;
        }
        break;
    }
  }
  
  updateVisualEffects(physicsState) {
    // Update drift particles
    if (physicsState.isDrifting) {
      // In a real implementation, would spawn drift particles
      // For now, just update the drift effect intensity
      this.driftEffectColor = this.getDriftColorForType();
    }
  }
  
  getDriftColorForType() {
    // Return appropriate drift color based on Pokémon type
    switch (this.type) {
      case 'Fire': return '#FF3700';
      case 'Water': return '#0077FF';
      case 'Electric': return '#FFD700';
      case 'Grass': return '#00C050';
      case 'Ice': return '#80F0FF';
      case 'Psychic': return '#FF80A0';
      default: return '#FFFFFF';
    }
  }
  
  render(ctx, cameraPosition) {
    super.render(ctx, cameraPosition);
    
    // Add F1-specific rendering
    const screenX = this.position.x - cameraPosition.x;
    const screenY = this.position.y - cameraPosition.y;
    
    // Render drift effects if drifting
    if (this.driftEffectIntensity > 0) {
      ctx.globalAlpha = this.driftEffectIntensity * 0.7;
      ctx.fillStyle = this.getDriftColorForType();
      
      // Render drift particles/trails behind the car
      const trailLength = 40;
      const trailWidth = 15;
      
      // Calculate trail position based on car direction
      const offsetX = -Math.cos(this.direction) * 20;
      const offsetY = -Math.sin(this.direction) * 20;
      
      // Draw left trail
      const leftOffsetX = -Math.sin(this.direction) * trailWidth/2;
      const leftOffsetY = Math.cos(this.direction) * trailWidth/2;
      
      ctx.beginPath();
      ctx.moveTo(screenX + offsetX + leftOffsetX, screenY + offsetY + leftOffsetY);
      ctx.lineTo(screenX + offsetX + leftOffsetX - Math.cos(this.direction) * trailLength,
                screenY + offsetY + leftOffsetY - Math.sin(this.direction) * trailLength);
      ctx.lineTo(screenX + offsetX - Math.cos(this.direction) * trailLength, 
                screenY + offsetY - Math.sin(this.direction) * trailLength);
      ctx.lineTo(screenX + offsetX, screenY + offsetY);
      ctx.fill();
      
      // Draw right trail
      const rightOffsetX = Math.sin(this.direction) * trailWidth/2;
      const rightOffsetY = -Math.cos(this.direction) * trailWidth/2;
      
      ctx.beginPath();
      ctx.moveTo(screenX + offsetX + rightOffsetX, screenY + offsetY + rightOffsetY);
      ctx.lineTo(screenX + offsetX + rightOffsetX - Math.cos(this.direction) * trailLength,
                screenY + offsetY + rightOffsetY - Math.sin(this.direction) * trailLength);
      ctx.lineTo(screenX + offsetX - Math.cos(this.direction) * trailLength, 
                screenY + offsetY - Math.sin(this.direction) * trailLength);
      ctx.lineTo(screenX + offsetX, screenY + offsetY);
      ctx.fill();
      
      ctx.globalAlpha = 1.0;
    }
    
    // Render boost effect if boosting
    if (this.isBoosting) {
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#FF9900';
      
      // Draw flame effect behind car
      const flameLength = 50;
      const flameWidth = 20;
      
      // Base position behind car
      const baseX = screenX - Math.cos(this.direction) * 25;
      const baseY = screenY - Math.sin(this.direction) * 25;
      
      // Draw flame
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX - Math.cos(this.direction + 0.3) * flameLength,
                baseY - Math.sin(this.direction + 0.3) * flameLength);
      ctx.lineTo(baseX - Math.cos(this.direction) * (flameLength + 15),
                baseY - Math.sin(this.direction) * (flameLength + 15));
      ctx.lineTo(baseX - Math.cos(this.direction - 0.3) * flameLength,
                baseY - Math.sin(this.direction - 0.3) * flameLength);
      ctx.fill();
      
      ctx.globalAlpha = 1.0;
    }
    
    // Render DRS indicator if active
    if (this.hasDrsActive) {
      ctx.fillStyle = '#00FF00';
      ctx.font = '12px Arial';
      ctx.fillText('DRS', screenX, screenY - 40);
    }
    
    // Render boost meter
    const boostPercentage = this.boostCharge / this.maxBoostCharge;
    if (boostPercentage > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(screenX - 25, screenY - 35, 50, 5);
      
      ctx.fillStyle = this.isBoosting ? '#FF0000' : '#00FFFF';
      ctx.fillRect(screenX - 25, screenY - 35, 50 * boostPercentage, 5);
    }
  }
} 