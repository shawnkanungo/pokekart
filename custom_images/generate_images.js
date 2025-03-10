const { createCanvas } = require('canvas');
const fs = require('fs');

// Create kart image
const kartCanvas = createCanvas(32, 32);
const kartCtx = kartCanvas.getContext('2d');
kartCtx.fillStyle = '#ff0000';
kartCtx.fillRect(0, 0, 32, 32);
kartCtx.fillStyle = '#ffffff';
kartCtx.fillRect(4, 4, 24, 24);
const kartBuffer = kartCanvas.toBuffer('image/png');
fs.writeFileSync('kart.png', kartBuffer);

// Create road image
const roadCanvas = createCanvas(64, 64);
const roadCtx = roadCanvas.getContext('2d');
roadCtx.fillStyle = '#333333';
roadCtx.fillRect(0, 0, 64, 64);
roadCtx.strokeStyle = '#ffffff';
roadCtx.lineWidth = 2;
roadCtx.beginPath();
roadCtx.moveTo(0, 32);
roadCtx.lineTo(64, 32);
roadCtx.stroke();
const roadBuffer = roadCanvas.toBuffer('image/png');
fs.writeFileSync('road.png', roadBuffer);

// Create tree image
const treeCanvas = createCanvas(32, 32);
const treeCtx = treeCanvas.getContext('2d');
treeCtx.fillStyle = '#00ff00';
treeCtx.beginPath();
treeCtx.arc(16, 16, 16, 0, Math.PI * 2);
treeCtx.fill();
treeCtx.fillStyle = '#8b4513';
treeCtx.fillRect(14, 24, 4, 8);
const treeBuffer = treeCanvas.toBuffer('image/png');
fs.writeFileSync('tree.png', treeBuffer); 