class SaffronCityCircuit extends RaceTrack {
  constructor() {
    // Define track hazards
    const trackHazards = [
      { type: 'oil_slick', positions: [{x: 1200, y: 450}, {x: 2800, y: 1200}, {x: 3500, y: 3200}] },
      { type: 'boost_pad', positions: [{x: 800, y: 300}, {x: 3000, y: 2000}, {x: 4500, y: 1500}] },
      { type: 'roughTerrain', positions: [{x: 2100, y: 800, width: 100, height: 200}, {x: 3800, y: 2800, width: 150, height: 100}] }
    ];
    
    // Define item box positions
    const itemBoxPositions = [
      {x: 500, y: 250}, {x: 1500, y: 600}, {x: 2500, y: 1000}, 
      {x: 3200, y: 2200}, {x: 4000, y: 1800}, {x: 4800, y: 1000}
    ];
    
    super('Saffron City Circuit', 'City', SaffronCityCircuit.generateTrackLayout(), trackHazards, itemBoxPositions);
    
    // Add F1-specific track properties
    this.trackLength = 5000; // Track length in units
    this.trackWidth = 120; // Track width in pixels
    this.pitLane = {
      entry: {x: 4600, y: 1000},
      exit: {x: 200, y: 300}
    };
    
    // Track segments with detailed properties for physics calculations
    this.segments = [
      { 
        type: 'straight', 
        start: {x: 200, y: 300}, 
        end: {x: 1000, y: 300},
        surface: 'asphalt',
        gripFactor: 1.0
      },
      { 
        type: 'turn', 
        center: {x: 1150, y: 450}, 
        radius: 200,
        startAngle: Math.PI * 1.5,
        endAngle: Math.PI * 2.0,
        surface: 'asphalt',
        gripFactor: 0.85,
        idealLine: [
          {x: 1000, y: 330}, {x: 1080, y: 350}, 
          {x: 1150, y: 400}, {x: 1250, y: 530}
        ]
      },
      { 
        type: 'straight', 
        start: {x: 1300, y: 600}, 
        end: {x: 2000, y: 800},
        surface: 'asphalt',
        gripFactor: 1.0
      },
      { 
        type: 'chicane', 
        points: [
          {x: 2000, y: 800}, {x: 2100, y: 900}, 
          {x: 2050, y: 1000}, {x: 2150, y: 1100}
        ],
        surface: 'asphalt',
        gripFactor: 0.8,
        idealLine: [
          {x: 2020, y: 820}, {x: 2070, y: 880}, 
          {x: 2040, y: 980}, {x: 2120, y: 1070}
        ]
      },
      { 
        type: 'straight', 
        start: {x: 2150, y: 1100}, 
        end: {x: 2800, y: 1200},
        surface: 'asphalt',
        gripFactor: 1.0
      },
      { 
        type: 'turn', 
        center: {x: 3000, y: 1400}, 
        radius: 250,
        startAngle: Math.PI * 1.8,
        endAngle: Math.PI * 0.8,
        surface: 'concrete',
        gripFactor: 0.9,
        idealLine: [
          {x: 2800, y: 1230}, {x: 2900, y: 1300}, 
          {x: 3050, y: 1500}, {x: 3100, y: 1650}
        ]
      },
      { 
        type: 'straight', 
        start: {x: 3150, y: 1700}, 
        end: {x: 3200, y: 2500},
        surface: 'asphalt',
        gripFactor: 1.0
      },
      { 
        type: 'hairpin', 
        center: {x: 3350, y: 2700}, 
        radius: 200,
        startAngle: Math.PI * 1.5,
        endAngle: Math.PI * 0.5,
        surface: 'asphalt',
        gripFactor: 0.75,
        idealLine: [
          {x: 3200, y: 2550}, {x: 3270, y: 2650}, 
          {x: 3400, y: 2700}, {x: 3450, y: 2600}
        ]
      },
      { 
        type: 'straight', 
        start: {x: 3500, y: 2500}, 
        end: {x: 3800, y: 2000},
        surface: 'asphalt',
        gripFactor: 1.0
      },
      { 
        type: 'turn', 
        center: {x: 4000, y: 1900}, 
        radius: 220,
        startAngle: Math.PI * 2.8,
        endAngle: Math.PI * 3.5,
        surface: 'asphalt',
        gripFactor: 0.85,
        idealLine: [
          {x: 3850, y: 1970}, {x: 3950, y: 1920}, 
          {x: 4050, y: 1850}, {x: 4100, y: 1750}
        ]
      },
      { 
        type: 'straight', 
        start: {x: 4100, y: 1700}, 
        end: {x: 4800, y: 1000},
        surface: 'asphalt',
        gripFactor: 1.0
      },
      { 
        type: 'turn', 
        center: {x: 4900, y: 800}, 
        radius: 230,
        startAngle: Math.PI * -0.3,
        endAngle: Math.PI * 0.7,
        surface: 'concrete',
        gripFactor: 0.8,
        idealLine: [
          {x: 4800, y: 970}, {x: 4880, y: 900}, 
          {x: 4950, y: 750}, {x: 4870, y: 650}
        ]
      },
      { 
        type: 'straight', 
        start: {x: 4800, y: 600}, 
        end: {x: 200, y: 300},
        surface: 'asphalt',
        gripFactor: 1.0
      }
    ];
    
    // Weather affects the track
    this.weather = 'clear'; // clear, rain, fog
    
    // DRS (Drag Reduction System) zones for F1-style racing
    this.drsZones = [
      { start: {x: 200, y: 300}, end: {x: 1000, y: 300} },
      { start: {x: 4100, y: 1700}, end: {x: 4800, y: 1000} }
    ];
    
    // Define start grid positions
    this.startGrid = this.generateStartGrid();
    
    // Spectator areas
    this.spectatorAreas = [
      { x: 550, y: 200, width: 200, height: 50 },
      { x: 1200, y: 500, width: 100, height: 150 },
      { x: 3000, y: 1500, width: 150, height: 200 },
      { x: 3400, y: 2800, width: 200, height: 100 },
      { x: 4200, y: 900, width: 150, height: 150 }
    ];
  }
  
  // Generate the detailed track layout
  static generateTrackLayout() {
    // In a real implementation, this would be a detailed track mesh or bitmap
    // For now, we'll return a placeholder
    return "saffron_city_circuit_layout";
  }
  
  // Generate grid start positions
  generateStartGrid() {
    const startPositions = [];
    const startX = 350;
    const startY = 300;
    
    // Two-by-two grid formation
    for (let i = 0; i < 8; i++) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      startPositions.push({
        x: startX + row * 80,
        y: startY + (col * 40) - 20,
        rotation: 0 // Facing right
      });
    }
    
    return startPositions;
  }
  
  // Find the nearest track segment to a position
  findNearestSegment(position) {
    let nearestSegment = null;
    let minDistance = Infinity;
    
    for (const segment of this.segments) {
      let distance = 0;
      
      if (segment.type === 'straight') {
        distance = this.distanceToLine(position, segment.start, segment.end);
      } else if (segment.type === 'turn' || segment.type === 'hairpin') {
        distance = Math.abs(this.distanceToPoint(position, segment.center) - segment.radius);
      } else if (segment.type === 'chicane') {
        // For chicanes, find minimum distance to any of the defining lines
        let minChicaneDistance = Infinity;
        for (let i = 0; i < segment.points.length - 1; i++) {
          const dist = this.distanceToLine(position, segment.points[i], segment.points[i + 1]);
          minChicaneDistance = Math.min(minChicaneDistance, dist);
        }
        distance = minChicaneDistance;
      }
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestSegment = segment;
      }
    }
    
    return { segment: nearestSegment, distance: minDistance };
  }
  
  // Get track conditions at a specific position
  getTrackConditionsAt(position) {
    const { segment, distance } = this.findNearestSegment(position);
    
    if (!segment) return { gripFactor: 1.0, surface: 'asphalt' };
    
    // Base grip depends on the segment
    let gripFactor = segment.gripFactor;
    
    // Apply weather effects
    if (this.weather === 'rain') {
      gripFactor *= 0.7; // Reduced grip in rain
    } else if (this.weather === 'fog') {
      gripFactor *= 0.9; // Slightly reduced grip in fog
    }
    
    // Check if on track or off-track
    const isOffTrack = distance > this.trackWidth / 2;
    if (isOffTrack) {
      gripFactor *= 0.5; // Significantly reduced grip off-track
    }
    
    // Check for hazards
    for (const hazard of this.hazards) {
      for (const hazardPos of hazard.positions) {
        // For simplicity, checking proximity to hazard center
        // In a real implementation, would check collision with hazard area
        const hazardDistance = this.distanceToPoint(position, hazardPos);
        if (hazardDistance < 30) { // Arbitrary hazard radius
          if (hazard.type === 'oil_slick') {
            gripFactor *= 0.3; // Oil slicks severely reduce grip
          } else if (hazard.type === 'roughTerrain') {
            gripFactor *= 0.7; // Rough terrain reduces grip
          }
          break;
        }
      }
    }
    
    return {
      gripFactor,
      surface: segment.surface,
      isOffTrack
    };
  }
  
  // Check if the position is in a DRS zone
  isInDrsZone(position) {
    for (const zone of this.drsZones) {
      // Simple check - in a real implementation would be more precise
      if (this.isPointInRectangle(position, zone.start, zone.end, this.trackWidth)) {
        return true;
      }
    }
    return false;
  }
  
  // Render the track
  render(ctx, cameraPosition) {
    // Draw track outline
    ctx.strokeStyle = '#333';
    ctx.lineWidth = this.trackWidth;
    ctx.beginPath();
    
    for (const segment of this.segments) {
      if (segment.type === 'straight') {
        ctx.moveTo(segment.start.x - cameraPosition.x, segment.start.y - cameraPosition.y);
        ctx.lineTo(segment.end.x - cameraPosition.x, segment.end.y - cameraPosition.y);
      } else if (segment.type === 'turn' || segment.type === 'hairpin') {
        ctx.arc(
          segment.center.x - cameraPosition.x, 
          segment.center.y - cameraPosition.y, 
          segment.radius, 
          segment.startAngle, 
          segment.endAngle
        );
      } else if (segment.type === 'chicane') {
        ctx.moveTo(segment.points[0].x - cameraPosition.x, segment.points[0].y - cameraPosition.y);
        for (let i = 1; i < segment.points.length; i++) {
          ctx.lineTo(segment.points[i].x - cameraPosition.x, segment.points[i].y - cameraPosition.y);
        }
      }
    }
    
    ctx.stroke();
    
    // Draw track surface
    ctx.strokeStyle = '#777';
    ctx.lineWidth = this.trackWidth - 4;
    ctx.stroke();
    
    // Draw center line
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw start/finish line
    ctx.fillStyle = '#FFF';
    const startLine = {x: 180, y: 300, width: 40, height: this.trackWidth};
    ctx.fillRect(
      startLine.x - cameraPosition.x, 
      startLine.y - this.trackWidth/2 - cameraPosition.y, 
      startLine.width, 
      startLine.height
    );
    
    // Draw checkered pattern on start/finish
    ctx.fillStyle = '#000';
    const squareSize = 10;
    for (let x = 0; x < startLine.width; x += squareSize) {
      for (let y = 0; y < startLine.height; y += squareSize) {
        if ((x + y) % (squareSize * 2) === 0) {
          ctx.fillRect(
            startLine.x + x - cameraPosition.x, 
            startLine.y - this.trackWidth/2 + y - cameraPosition.y, 
            squareSize, 
            squareSize
          );
        }
      }
    }
    
    // Draw hazards
    for (const hazard of this.hazards) {
      for (const position of hazard.positions) {
        if (hazard.type === 'oil_slick') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.beginPath();
          ctx.ellipse(
            position.x - cameraPosition.x, 
            position.y - cameraPosition.y, 
            30, 20, 0, 0, Math.PI * 2
          );
          ctx.fill();
        } else if (hazard.type === 'boost_pad') {
          ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
          ctx.fillRect(
            position.x - 25 - cameraPosition.x, 
            position.y - 15 - cameraPosition.y, 
            50, 30
          );
        }
      }
    }
    
    // Draw item boxes
    ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
    for (const position of this.itemBoxPositions) {
      ctx.beginPath();
      ctx.arc(
        position.x - cameraPosition.x, 
        position.y - cameraPosition.y, 
        15, 0, Math.PI * 2
      );
      ctx.fill();
    }
    
    // Draw spectator areas
    ctx.fillStyle = 'rgba(0, 100, 200, 0.3)';
    for (const area of this.spectatorAreas) {
      ctx.fillRect(
        area.x - cameraPosition.x, 
        area.y - cameraPosition.y, 
        area.width, 
        area.height
      );
    }
  }
} 