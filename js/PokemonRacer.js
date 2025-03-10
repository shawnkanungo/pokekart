class PokemonRacer {
  constructor(name, type, sprite, baseSpeed, acceleration, handling) {
    this.name = name;
    this.type = type;
    this.sprite = sprite;
    this.baseSpeed = baseSpeed;
    this.acceleration = acceleration;
    this.handling = handling;
    
    // Basic properties
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.direction = 0;
    this.visualRotation = 0;
  }

  // Set control inputs
  setControls(throttle, steering, drift, boost) {
    this.throttleInput = Math.max(-1, Math.min(1, throttle));
    this.steeringInput = Math.max(-1, Math.min(1, steering));
    this.driftInput = Math.max(0, Math.min(1, drift));
    
    if (boost && this.boostCharge > 0 && !this.isBoosting) {
      this.isBoosting = true;
    }
  }

  // Update the racer's state
  update(dt, track, physics) {
    // To be implemented by child classes
  }

  // Render the racer
  render(ctx, cameraPosition) {
    const screenX = this.position.x - cameraPosition.x;
    const screenY = this.position.y - cameraPosition.y;
    
    // Save context state
    ctx.save();
    
    // Translate to racer position and rotate
    ctx.translate(screenX, screenY);
    ctx.rotate(this.visualRotation);
    
    // Draw racer sprite (placeholder rectangle for now)
    ctx.fillStyle = this.getColorForType();
    ctx.fillRect(-20, -10, 40, 20);
    
    // Draw racer name
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, 0, -20);
    
    // Restore context state
    ctx.restore();
  }

  // Get color based on Pokémon type
  getColorForType() {
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
} 