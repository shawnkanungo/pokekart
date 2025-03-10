let characterX = 400; // Center of canvas
let characterY = 300;
let screen = "title"; // Start on title screen
let button;
let resetButton;
let animationFrame = 0;
let partyScene = "diwali"; // Can be "diwali", "garden", or "temple"
let achievements = {
  traditional: { name: "Traditional Beauty", description: "Wear a lehenga with juttis", unlocked: false },
  princess: { name: "Princess Party", description: "Wear the princess dress with tiara", unlocked: false },
  festive: { name: "Festive Spirit", description: "Wear red lehenga with matching juttis", unlocked: false },
  sparkle: { name: "Sparkle Queen", description: "Wear sparkly shoes with princess dress", unlocked: false },
  complete: { name: "Complete Look", description: "Wear all accessories together", unlocked: false }
};
let showAchievement = false;
let achievementTimer = 0;
let allAchievementsUnlocked = false;
let celebrationTimer = 0;

// Draggable items
let items = {
  // Hair styles
  ponytail: { x: 50, y: 50, dragged: false, attached: false, type: 'hair', color: '#000000' },
  braids: { x: 50, y: 100, dragged: false, attached: false, type: 'hair', color: '#000000' },
  pigtails: { x: 50, y: 150, dragged: false, attached: false, type: 'hair', color: '#000000' },
  bun: { x: 50, y: 200, dragged: false, attached: false, type: 'hair', color: '#000000' },
  
  // Dresses
  lehenga: { x: 50, y: 250, dragged: false, attached: false, type: 'dress', color: '#FFB6C1' },
  princessDress: { x: 50, y: 300, dragged: false, attached: false, type: 'dress', color: '#FFC0CB' },
  redLehenga: { x: 50, y: 350, dragged: false, attached: false, type: 'dress', color: '#FF0000' },
  blueLehenga: { x: 50, y: 400, dragged: false, attached: false, type: 'dress', color: '#0000FF' },
  
  // Shoes
  juttis: { x: 50, y: 450, dragged: false, attached: false, type: 'shoes', color: '#000000' },
  sparklyShoes: { x: 50, y: 500, dragged: false, attached: false, type: 'shoes', color: '#FFD700' },
  redJuttis: { x: 50, y: 550, dragged: false, attached: false, type: 'shoes', color: '#FF0000' },
  
  // Accessories
  tiara: { x: 50, y: 600, dragged: false, attached: false, type: 'accessory', color: '#FFD700' },
  necklace: { x: 50, y: 650, dragged: false, attached: false, type: 'accessory', color: '#FFD700' },
  earrings: { x: 50, y: 700, dragged: false, attached: false, type: 'accessory', color: '#FFD700' },
  bangles: { x: 50, y: 750, dragged: false, attached: false, type: 'accessory', color: '#FFD700' },
  anklets: { x: 50, y: 800, dragged: false, attached: false, type: 'accessory', color: '#FFD700' },
  hairClip: { x: 50, y: 850, dragged: false, attached: false, type: 'accessory', color: '#FF69B4' }
};

function setup() {
  createCanvas(800, 600);
  button = createButton("Go to Party!");
  button.position(650, 550);
  button.mousePressed(goToParty);
  
  resetButton = createButton("Reset Outfit");
  resetButton.position(50, 550);
  resetButton.mousePressed(resetOutfit);
  
  // Load saved game if exists
  loadGame();
}

function draw() {
  if (screen === "title") {
    drawTitleScreen();
  } else if (screen === "dressUp") {
    background(255);
    drawCharacter();
    drawDraggableItems();
    drawInstructions();
  } else if (screen === "party") {
    drawPartyBackground();
    drawCharacter();
    drawAttachedItems();
    drawPartyEffects();
    drawSceneButtons();
  }
  
  // Draw achievement notification if active
  if (showAchievement) {
    drawAchievementNotification();
    achievementTimer++;
    if (achievementTimer > 120) { // Show for 2 seconds
      showAchievement = false;
      achievementTimer = 0;
    }
  }
  
  // Draw celebration if all achievements unlocked
  if (allAchievementsUnlocked) {
    drawCelebration();
    celebrationTimer++;
  }
  
  animationFrame++;
}

function drawTitleScreen() {
  background(255, 192, 203);
  
  // Draw title
  fill(255, 215, 0);
  textSize(48);
  textAlign(CENTER);
  text("Party Prep Pal", width/2, height/2 - 50);
  
  // Draw subtitle
  fill(0);
  textSize(24);
  text("Dress up for the perfect party!", width/2, height/2 + 20);
  
  // Draw start button
  fill(255, 215, 0);
  rect(width/2 - 100, height/2 + 50, 200, 50, 10);
  fill(0);
  textSize(20);
  text("Start Game", width/2, height/2 + 85);
}

function drawCelebration() {
  // Draw sparkles
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(3, 8);
    fill(255, 215, 0);
    ellipse(x, y, size, size);
  }
  
  // Draw celebration text
  fill(255, 215, 0);
  textSize(36);
  textAlign(CENTER);
  text("Congratulations!", width/2, height/2);
  textSize(24);
  text("You've unlocked all achievements!", width/2, height/2 + 40);
}

function drawAchievementNotification() {
  // Find the most recently unlocked achievement
  let recentAchievement = null;
  for (let achievement in achievements) {
    if (achievements[achievement].unlocked) {
      recentAchievement = achievements[achievement];
      break;
    }
  }
  
  if (recentAchievement) {
    // Draw achievement box
    fill(255, 215, 0);
    rect(width/2 - 150, 50, 300, 60, 10);
    
    // Draw achievement text
    fill(0);
    textSize(18);
    textAlign(CENTER);
    text(recentAchievement.name, width/2, 80);
    textSize(14);
    text(recentAchievement.description, width/2, 100);
  }
}

function checkAchievements() {
  let allUnlocked = true;
  
  // Traditional Beauty
  if (items.lehenga.attached && items.juttis.attached) {
    achievements.traditional.unlocked = true;
  } else {
    allUnlocked = false;
  }
  
  // Princess Party
  if (items.princessDress.attached && items.tiara.attached) {
    achievements.princess.unlocked = true;
  } else {
    allUnlocked = false;
  }
  
  // Festive Spirit
  if (items.redLehenga.attached && items.redJuttis.attached) {
    achievements.festive.unlocked = true;
  } else {
    allUnlocked = false;
  }
  
  // Sparkle Queen
  if (items.princessDress.attached && items.sparklyShoes.attached) {
    achievements.sparkle.unlocked = true;
  } else {
    allUnlocked = false;
  }
  
  // Complete Look
  if (items.tiara.attached && items.necklace.attached && 
      items.earrings.attached && items.bangles.attached && 
      items.anklets.attached && items.hairClip.attached) {
    achievements.complete.unlocked = true;
  } else {
    allUnlocked = false;
  }
  
  // Check if all achievements are unlocked
  if (allUnlocked && !allAchievementsUnlocked) {
    allAchievementsUnlocked = true;
    saveGame();
  }
  
  // Show achievement notification if any were just unlocked
  for (let achievement in achievements) {
    if (achievements[achievement].unlocked) {
      showAchievement = true;
      break;
    }
  }
}

function saveGame() {
  let gameData = {
    achievements: achievements,
    allAchievementsUnlocked: allAchievementsUnlocked
  };
  localStorage.setItem('partyPrepPal', JSON.stringify(gameData));
}

function loadGame() {
  let savedGame = localStorage.getItem('partyPrepPal');
  if (savedGame) {
    let gameData = JSON.parse(savedGame);
    achievements = gameData.achievements;
    allAchievementsUnlocked = gameData.allAchievementsUnlocked;
  }
}

function drawInstructions() {
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text("Drag items to dress up your character!", 50, 50);
  text("Click 'Go to Party!' when ready!", 50, 70);
  
  // Draw achievements section
  textSize(14);
  text("Achievements:", 50, 100);
  let y = 120;
  for (let achievement in achievements) {
    if (achievements[achievement].unlocked) {
      fill(255, 215, 0); // Gold for unlocked
      text("✓ " + achievements[achievement].name, 50, y);
    } else {
      fill(128, 128, 128); // Gray for locked
      text("? " + achievements[achievement].name, 50, y);
    }
    y += 20;
  }
}

function drawPartyBackground() {
  switch(partyScene) {
    case "diwali":
      background(255, 165, 0); // Orange for Diwali
      break;
    case "garden":
      background(144, 238, 144); // Light green for garden
      // Draw some flowers
      for(let i = 0; i < 10; i++) {
        let x = random(width);
        let y = random(height);
        drawFlower(x, y);
      }
      break;
    case "temple":
      background(255, 218, 185); // Peach for temple
      // Draw temple arches
      for(let i = 0; i < 3; i++) {
        let x = 100 + i * 200;
        drawTempleArch(x, 100);
      }
      break;
  }
}

function drawFlower(x, y) {
  fill(255, 192, 203); // Pink petals
  for(let i = 0; i < 5; i++) {
    let angle = i * TWO_PI / 5;
    let px = x + cos(angle) * 10;
    let py = y + sin(angle) * 10;
    ellipse(px, py, 15, 15);
  }
  fill(255, 255, 0); // Yellow center
  ellipse(x, y, 10, 10);
}

function drawTempleArch(x, y) {
  fill(255, 215, 0); // Gold color
  beginShape();
  vertex(x - 30, y);
  vertex(x, y - 50);
  vertex(x + 30, y);
  endShape();
}

function drawSceneButtons() {
  let buttonWidth = 100;
  let spacing = 20;
  let startX = 50;
  
  // Diwali scene button
  fill(255, 165, 0);
  rect(startX, 50, buttonWidth, 30);
  fill(0);
  text("Diwali", startX + 20, 70);
  
  // Garden scene button
  fill(144, 238, 144);
  rect(startX + buttonWidth + spacing, 50, buttonWidth, 30);
  fill(0);
  text("Garden", startX + buttonWidth + spacing + 20, 70);
  
  // Temple scene button
  fill(255, 218, 185);
  rect(startX + (buttonWidth + spacing) * 2, 50, buttonWidth, 30);
  fill(0);
  text("Temple", startX + (buttonWidth + spacing) * 2 + 20, 70);
}

function mousePressed() {
  if (screen === "title") {
    // Check if start button is clicked
    if (mouseX >= width/2 - 100 && mouseX <= width/2 + 100 &&
        mouseY >= height/2 + 50 && mouseY <= height/2 + 100) {
      screen = "dressUp";
    }
  } else if (screen === "party") {
    // Check scene buttons
    let buttonWidth = 100;
    let spacing = 20;
    let startX = 50;
    
    if (mouseY >= 50 && mouseY <= 80) {
      if (mouseX >= startX && mouseX <= startX + buttonWidth) {
        partyScene = "diwali";
      } else if (mouseX >= startX + buttonWidth + spacing && 
                 mouseX <= startX + buttonWidth * 2 + spacing) {
        partyScene = "garden";
      } else if (mouseX >= startX + (buttonWidth + spacing) * 2 && 
                 mouseX <= startX + buttonWidth * 3 + spacing * 2) {
        partyScene = "temple";
      }
    }
  }
}

function drawPartyEffects() {
  // Add sparkles in the background
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 5);
    fill(255, 255, 0);
    ellipse(x, y, size, size);
  }
  
  // Add floating diyas (lamps) for Diwali scene
  if (partyScene === "diwali") {
    for (let i = 0; i < 3; i++) {
      let x = 100 + i * 200;
      let y = 100 + sin(animationFrame * 0.05 + i) * 20;
      drawDiya(x, y);
    }
  }
  
  // Add butterflies for garden scene
  if (partyScene === "garden") {
    for (let i = 0; i < 3; i++) {
      let x = 100 + i * 200;
      let y = 100 + sin(animationFrame * 0.05 + i) * 20;
      drawButterfly(x, y);
    }
  }
  
  // Add floating petals for temple scene
  if (partyScene === "temple") {
    for (let i = 0; i < 5; i++) {
      let x = random(width);
      let y = random(height);
      drawFloatingPetals(x, y);
    }
  }
}

function drawButterfly(x, y) {
  // Butterfly wings
  fill(255, 192, 203);
  ellipse(x - 10, y, 20, 10);
  ellipse(x + 10, y, 20, 10);
  // Body
  fill(0);
  rect(x - 2, y - 5, 4, 10);
}

function drawFloatingPetals(x, y) {
  fill(255, 182, 193);
  ellipse(x, y, 10, 10);
}

function drawCharacter() {
  // Head
  fill(255, 204, 153); // Light skin tone
  ellipse(characterX, characterY - 50, 50, 50);
  
  // Bindi (traditional forehead decoration)
  fill(255, 0, 0);
  ellipse(characterX, characterY - 65, 8, 8);
  
  // Eyes
  fill(0);
  ellipse(characterX - 10, characterY - 55, 5, 5);
  ellipse(characterX + 10, characterY - 55, 5, 5);
  
  // Smile
  noFill();
  arc(characterX, characterY - 50, 20, 15, 0, PI);
  
  // Traditional choli (top)
  fill(255, 192, 203);
  rect(characterX - 25, characterY, 50, 40, 10);
  
  // Dupatta (scarf)
  fill(255, 255, 255);
  beginShape();
  vertex(characterX - 30, characterY);
  vertex(characterX - 20, characterY - 20);
  vertex(characterX + 20, characterY - 20);
  vertex(characterX + 30, characterY);
  endShape();
  
  // Skirt
  fill(255, 192, 203);
  rect(characterX - 25, characterY + 40, 50, 60, 20);
  
  // Legs
  stroke(255, 204, 153);
  line(characterX - 20, characterY + 50, characterX - 40, characterY + 100);
  line(characterX + 20, characterY + 50, characterX + 40, characterY + 100);
  
  // Bangles
  fill(255, 215, 0);
  ellipse(characterX - 30, characterY + 20, 8, 8);
  ellipse(characterX - 30, characterY + 30, 8, 8);
  ellipse(characterX + 30, characterY + 20, 8, 8);
  ellipse(characterX + 30, characterY + 30, 8, 8);
}

function drawDraggableItems() {
  // Hair styles
  for (let item in items) {
    if (items[item].type === 'hair') {
      fill(items[item].color);
      switch(item) {
        case 'ponytail':
          ellipse(items[item].x, items[item].y, 20, 40);
          break;
        case 'braids':
          ellipse(items[item].x, items[item].y, 15, 40);
          ellipse(items[item].x + 10, items[item].y, 15, 40);
          break;
        case 'pigtails':
          ellipse(items[item].x, items[item].y, 15, 30);
          ellipse(items[item].x + 20, items[item].y, 15, 30);
          break;
        case 'bun':
          ellipse(items[item].x, items[item].y, 25, 25);
          break;
      }
    }
    // Dresses
    else if (items[item].type === 'dress') {
      fill(items[item].color);
      rect(items[item].x, items[item].y, 40, 60, 10);
      if (item === 'princessDress') {
        // Add sparkles
        fill(255, 255, 0);
        for(let i = 0; i < 3; i++) {
          ellipse(items[item].x + i*15, items[item].y + 20, 5, 5);
        }
      }
    }
    // Shoes
    else if (items[item].type === 'shoes') {
      fill(items[item].color);
      ellipse(items[item].x, items[item].y, 20, 10);
      ellipse(items[item].x + 30, items[item].y, 20, 10);
      if (item === 'sparklyShoes') {
        // Add sparkles
        fill(255, 255, 255);
        for(let i = 0; i < 3; i++) {
          ellipse(items[item].x + i*15, items[item].y, 3, 3);
        }
      }
    }
    // Accessories
    else if (items[item].type === 'accessory') {
      fill(items[item].color);
      switch(item) {
        case 'tiara':
          beginShape();
          vertex(items[item].x, items[item].y);
          vertex(items[item].x + 20, items[item].y - 10);
          vertex(items[item].x + 40, items[item].y);
          endShape();
          fill(255, 0, 255);
          ellipse(items[item].x + 20, items[item].y - 15, 8, 8);
          break;
        case 'necklace':
          ellipse(items[item].x, items[item].y, 30, 30);
          fill(0, 255, 255);
          ellipse(items[item].x, items[item].y, 10, 10);
          break;
        case 'earrings':
          ellipse(items[item].x, items[item].y, 8, 8);
          ellipse(items[item].x + 20, items[item].y, 8, 8);
          break;
        case 'bangles':
          for(let i = 0; i < 3; i++) {
            ellipse(items[item].x, items[item].y + i*10, 8, 8);
          }
          break;
        case 'anklets':
          for(let i = 0; i < 3; i++) {
            ellipse(items[item].x, items[item].y + i*5, 8, 8);
          }
          break;
        case 'hairClip':
          beginShape();
          vertex(items[item].x, items[item].y);
          vertex(items[item].x + 15, items[item].y - 10);
          vertex(items[item].x + 30, items[item].y);
          endShape();
          break;
      }
    }
  }
}

function drawAttachedItems() {
  for (let item in items) {
    if (items[item].attached) {
      switch(items[item].type) {
        case 'hair':
          fill(items[item].color);
          switch(item) {
            case 'ponytail':
              ellipse(characterX, characterY - 70, 20, 40);
              break;
            case 'braids':
              ellipse(characterX - 10, characterY - 70, 15, 40);
              ellipse(characterX + 10, characterY - 70, 15, 40);
              break;
            case 'pigtails':
              ellipse(characterX - 15, characterY - 70, 15, 30);
              ellipse(characterX + 15, characterY - 70, 15, 30);
              break;
            case 'bun':
              ellipse(characterX, characterY - 70, 25, 25);
              break;
          }
          break;
        case 'dress':
          fill(items[item].color);
          rect(characterX - 30, characterY, 60, 120, 20);
          if (item === 'princessDress') {
            // Add sparkles
            fill(255, 255, 0);
            for(let i = 0; i < 5; i++) {
              ellipse(characterX - 20 + i*15, characterY + 20, 5, 5);
            }
          }
          break;
        case 'shoes':
          fill(items[item].color);
          ellipse(characterX - 40, characterY + 100, 20, 10);
          ellipse(characterX + 40, characterY + 100, 20, 10);
          if (item === 'sparklyShoes') {
            // Add sparkles
            fill(255, 255, 255);
            for(let i = 0; i < 3; i++) {
              ellipse(characterX - 40 + i*20, characterY + 100, 3, 3);
            }
          }
          break;
        case 'accessory':
          fill(items[item].color);
          switch(item) {
            case 'tiara':
              beginShape();
              vertex(characterX - 20, characterY - 65);
              vertex(characterX, characterY - 75);
              vertex(characterX + 20, characterY - 65);
              endShape();
              fill(255, 0, 255);
              ellipse(characterX, characterY - 80, 8, 8);
              break;
            case 'necklace':
              ellipse(characterX, characterY + 10, 30, 30);
              fill(0, 255, 255);
              ellipse(characterX, characterY + 10, 10, 10);
              break;
            case 'earrings':
              ellipse(characterX - 25, characterY - 55, 8, 8);
              ellipse(characterX + 25, characterY - 55, 8, 8);
              break;
            case 'bangles':
              for(let i = 0; i < 3; i++) {
                ellipse(characterX - 30, characterY + 20 + i*10, 8, 8);
                ellipse(characterX + 30, characterY + 20 + i*10, 8, 8);
              }
              break;
            case 'anklets':
              for(let i = 0; i < 3; i++) {
                ellipse(characterX - 40, characterY + 100 + i*5, 8, 8);
                ellipse(characterX + 40, characterY + 100 + i*5, 8, 8);
              }
              break;
            case 'hairClip':
              beginShape();
              vertex(characterX - 15, characterY - 65);
              vertex(characterX, characterY - 75);
              vertex(characterX + 15, characterY - 65);
              endShape();
              break;
          }
          break;
      }
    }
  }
}

function mouseDragged() {
  for (let item in items) {
    if (dist(mouseX, mouseY, items[item].x, items[item].y) < 20) {
      items[item].x = mouseX;
      items[item].y = mouseY;
      items[item].dragged = true;
    }
  }
}

function mouseReleased() {
  for (let item in items) {
    if (items[item].dragged) {
      let wasAttached = items[item].attached;
      switch(items[item].type) {
        case 'hair':
          if (dist(items[item].x, items[item].y, characterX, characterY - 50) < 50) {
            items[item].x = characterX;
            items[item].y = characterY - 70;
            items[item].attached = true;
          }
          break;
        case 'dress':
          if (dist(items[item].x, items[item].y, characterX, characterY) < 50) {
            items[item].x = characterX;
            items[item].y = characterY;
            items[item].attached = true;
          }
          break;
        case 'shoes':
          if (dist(items[item].x, items[item].y, characterX, characterY + 100) < 50) {
            items[item].x = characterX - 40;
            items[item].y = characterY + 100;
            items[item].attached = true;
          }
          break;
        case 'accessory':
          if (dist(items[item].x, items[item].y, characterX, characterY - 50) < 50) {
            items[item].x = characterX;
            items[item].y = characterY - 65;
            items[item].attached = true;
          }
          break;
      }
    }
    items[item].dragged = false;
  }
  
  // Check achievements after items are attached
  checkAchievements();
}

function resetOutfit() {
  for (let item in items) {
    items[item].attached = false;
    // Reset position to original
    switch(items[item].type) {
      case 'hair':
        items[item].x = 50;
        items[item].y = 50 + (Object.keys(items).indexOf(item) * 50);
        break;
      case 'dress':
        items[item].x = 50;
        items[item].y = 250 + (Object.keys(items).indexOf(item) * 50);
        break;
      case 'shoes':
        items[item].x = 50;
        items[item].y = 450 + (Object.keys(items).indexOf(item) * 50);
        break;
      case 'accessory':
        items[item].x = 50;
        items[item].y = 600 + (Object.keys(items).indexOf(item) * 50);
        break;
    }
  }
  // Don't reset achievements when resetting outfit
}

function goToParty() {
  screen = "party";
} 