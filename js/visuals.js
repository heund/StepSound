let particles = [];
let noiseScale = 0.01;
let noiseStrength = 1;
let particleCount = 50;
let stepImpact = 0;
let lineSpacing = 15;
let lines = [];
let lineCount = 15; // Reduced number of lines to make each one thicker
let targetRotation = 0;
let currentRotation = 0;

class Line {
    constructor(x) {
        this.x = x;
        this.width = windowWidth / lineCount;
        this.reset();
    }

    reset() {
        this.height = random(windowHeight * 0.4, windowHeight * 0.9); // Increased minimum height
        this.y = (windowHeight - this.height) / 2;
        this.targetWidth = this.width;
        this.currentWidth = this.width;
        this.phase = random(TWO_PI);
        this.speed = random(0.02, 0.05);
    }

    update() {
        // Smooth width transition
        this.currentWidth = lerp(this.currentWidth, this.targetWidth, 0.1);
        
        // Update phase for organic movement
        this.phase += this.speed;
        
        // Calculate dynamic height based on step impact
        let dynamicHeight = this.height * (1 + sin(this.phase) * 0.15); // Increased movement amplitude
        dynamicHeight *= (1 + stepImpact * 0.5);
        
        // Draw the line with minimum width
        fill(0);
        noStroke();
        let minWidth = max(this.currentWidth * 0.8, 30); // Ensure minimum width of 30px
        rect(this.x, this.y, minWidth, dynamicHeight);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    
    // Create vertical lines
    const spacing = windowWidth / lineCount;
    for (let x = 0; x < windowWidth; x += spacing) {
        lines.push(new Line(x));
    }
}

function draw() {
    background(255);
    
    // Smooth rotation transition
    currentRotation = lerp(currentRotation, targetRotation, 0.1);
    
    // Apply transforms
    translate(width/2, height/2);
    rotate(currentRotation);
    translate(-width/2, -height/2);
    
    // Update and draw lines
    lines.forEach(line => line.update());
    
    // Fade step impact
    stepImpact *= 0.95;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
    // Recreate lines for new width
    lines = [];
    const spacing = windowWidth / lineCount;
    for (let x = 0; x < windowWidth; x += spacing) {
        lines.push(new Line(x));
    }
}

// Function to trigger visual impact on step
function onStep() {
    console.log('Visual step trigger');
    
    // Add rotation
    targetRotation += random(-0.05, 0.05);
    
    // Increase step impact
    stepImpact = 1;
    
    // Randomly adjust line widths with larger variations
    lines.forEach(line => {
        line.targetWidth = (windowWidth / lineCount) * random(0.8, 2.0); // Increased width variation
    });
    
    // Occasionally reset some lines
    if (random() < 0.3) {
        lines.forEach(line => {
            if (random() < 0.2) line.reset();
        });
    }
}

// Make onStep function available globally
window.onStep = onStep;
