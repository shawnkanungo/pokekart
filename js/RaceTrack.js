class RaceTrack {
  constructor(name, type, layout, hazards, itemBoxPositions) {
    this.name = name;
    this.type = type;
    this.layout = layout;
    this.hazards = hazards;
    this.itemBoxPositions = itemBoxPositions;
  }

  // Generate the track layout
  static generateTrackLayout() {
    // To be implemented by child classes
    return null;
  }

  // Find the nearest track segment to a position
  findNearestSegment(position) {
    // To be implemented by child classes
    return null;
  }

  // Calculate distance from a point to a line segment
  distanceToLine(point, lineStart, lineEnd) {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    
    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }
    
    const dx = point.x - xx;
    const dy = point.y - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Calculate distance between two points
  distanceToPoint(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Get track conditions at a specific position
  getTrackConditionsAt(position) {
    // To be implemented by child classes
    return {
      gripFactor: 1.0,
      surface: 'asphalt'
    };
  }

  // Check if the position is in a DRS zone
  isInDrsZone(position) {
    // To be implemented by child classes
    return false;
  }

  // Helper method to check if a point is in a rectangle defined by two corner points
  isPointInRectangle(point, corner1, corner2, width) {
    const minX = Math.min(corner1.x, corner2.x) - width/2;
    const maxX = Math.max(corner1.x, corner2.x) + width/2;
    const minY = Math.min(corner1.y, corner2.y) - width/2;
    const maxY = Math.max(corner1.y, corner2.y) + width/2;
    
    return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
  }

  // Render the track
  render(ctx, cameraPosition) {
    // To be implemented by child classes
  }
} 