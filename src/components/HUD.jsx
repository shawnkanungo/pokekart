import React from 'react';

export function HUD() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      {/* Lap Counter */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: 'white',
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        Lap: <span id="lap">1</span>/3
      </div>

      {/* Speed Display */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          color: 'white',
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        Speed: <span id="speed">0</span> km/h
      </div>

      {/* Boost Meter */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          color: 'white',
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        Boost: <span id="boost">100</span>%
      </div>

      {/* Power-up Display */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          color: 'white',
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        Power-up: <span id="currentPowerUp">⚡</span>
      </div>

      {/* Item Display */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          right: '20px',
          color: 'white',
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        Item: <span id="itemBox">🎁</span>
      </div>

      {/* Pokémon Display */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '20px',
          color: 'white',
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        Pokémon: <span id="pokemonSprite">🐱</span>
      </div>

      {/* POV Mode Display */}
      <div
        style={{
          position: 'absolute',
          top: '100px',
          left: '20px',
          color: 'white',
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        <span id="povStatus">POV Mode: OFF</span>
      </div>

      {/* Controls Help */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}
      >
        Controls: ↑↓ Accelerate/Brake | ←→ Turn | V Toggle POV | Space Boost | P Power-up | I Item
      </div>
    </div>
  );
} 