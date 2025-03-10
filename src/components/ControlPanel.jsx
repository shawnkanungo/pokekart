import React, { useState } from 'react';

export function ControlPanel() {
  const [isVisible, setIsVisible] = useState(false);

  const controls = [
    {
      category: "Movement",
      items: [
        { key: "↑", description: "Accelerate" },
        { key: "↓", description: "Brake/Reverse" },
        { key: "←", description: "Turn Left" },
        { key: "→", description: "Turn Right" },
        { key: "Shift + ←/→", description: "Drift" }
      ]
    },
    {
      category: "Actions",
      items: [
        { key: "Space", description: "Boost" },
        { key: "P", description: "Use Power-up" },
        { key: "I", description: "Use Item" },
        { key: "V", description: "Toggle POV Mode" }
      ]
    },
    {
      category: "Game Info",
      items: [
        { key: "Lap Counter", description: "Top Left" },
        { key: "Speed", description: "Top Right" },
        { key: "Boost Meter", description: "Bottom Left" },
        { key: "Power-up", description: "Bottom Right" },
        { key: "Item Box", description: "Above Power-up" },
        { key: "Pokémon", description: "Top Left Below Lap" }
      ]
    }
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1001,
          padding: '10px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: '1px solid white',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {isVisible ? 'Hide Controls' : 'Show Controls'}
      </button>

      {/* Control Panel */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '20px',
            borderRadius: '10px',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '300px',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>
            Game Controls
          </h2>
          
          {controls.map((category, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                margin: '0 0 10px 0',
                color: '#00ff00',
                fontSize: '18px'
              }}>
                {category.category}
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '5px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '3px',
                      fontFamily: 'monospace'
                    }}>
                      {item.key}
                    </span>
                    <span style={{ color: '#cccccc' }}>
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ 
            textAlign: 'center',
            fontSize: '14px',
            color: '#888888',
            marginTop: '20px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            Press ESC to pause
          </div>
        </div>
      )}
    </>
  );
} 