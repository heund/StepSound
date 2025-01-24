class MotionManager {
    constructor() {
        this.stepCount = 0;
        this.lastAccel = 0;
        this.threshold = 1.1;
        this.cooldown = false;
        this.cooldownTime = 250; // ms
        
        this.stepDisplay = document.getElementById('stepCount');
        this.startButton = document.getElementById('startButton');
        
        // Initialize audio player
        window.audioPlayer.loadAudioBooks();
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.requestMotionPermission());
    }
    
    async requestMotionPermission() {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceMotionEvent.requestPermission();
                if (permissionState === 'granted') {
                    this.startTracking();
                }
            } catch (error) {
                console.error('Error requesting motion permission:', error);
            }
        } else {
            this.startTracking();
        }
    }
    
    startTracking() {
        this.startButton.disabled = true;
        window.addEventListener('devicemotion', (e) => this.handleMotion(e));
    }
    
    handleMotion(event) {
        const accel = event.accelerationIncludingGravity;
        if (!accel) return;
        
        const total = Math.sqrt(
            Math.pow(accel.x || 0, 2) +
            Math.pow(accel.y || 0, 2) +
            Math.pow(accel.z || 0, 2)
        );
        
        if (this.detectStep(total)) {
            this.onStep();
        }
        
        this.lastAccel = total;
    }
    
    detectStep(total) {
        if (this.cooldown) return false;
        
        const delta = Math.abs(total - this.lastAccel);
        if (delta > this.threshold) {
            this.cooldown = true;
            setTimeout(() => this.cooldown = false, this.cooldownTime);
            return true;
        }
        
        return false;
    }
    
    onStep() {
        this.stepCount++;
        this.stepDisplay.textContent = this.stepCount;
        
        // Trigger audio player
        window.audioPlayer.onStep();
        
        // Trigger visual effect
        if (typeof window.onStep === 'function') {
            window.onStep();
        }
    }
}

// Initialize motion manager
window.motionManager = new MotionManager();
