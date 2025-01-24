class MotionManager {
    constructor() {
        this.stepCount = 0;
        this.lastUpdate = 0;
        this.isTracking = false;
    }

    async requestPermission() {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceMotionEvent.requestPermission();
                return permission === 'granted';
            } catch (error) {
                console.error('Error requesting motion permission:', error);
                return false;
            }
        }
        return true; // Non-iOS devices don't need permission
    }

    startTracking() {
        if (this.isTracking) return;
        
        if ('ondevicemotion' in window) {
            window.addEventListener('devicemotion', this.handleMotion.bind(this));
            this.isTracking = true;
        } else {
            console.error('Device motion not supported');
        }
    }

    stopTracking() {
        if (!this.isTracking) return;
        window.removeEventListener('devicemotion', this.handleMotion.bind(this));
        this.isTracking = false;
    }

    handleMotion(event) {
        const acceleration = event.acceleration;
        if (!acceleration) return;

        const now = Date.now();
        // Debounce step detection to prevent multiple triggers
        if (now - this.lastUpdate < 300) return; 

        // Simple step detection using acceleration magnitude
        const magnitude = Math.sqrt(
            acceleration.x * acceleration.x +
            acceleration.y * acceleration.y +
            acceleration.z * acceleration.z
        );

        if (magnitude > 10) { // Threshold for step detection
            this.stepCount++;
            document.getElementById('stepCount').textContent = this.stepCount;
            
            // Play sound for the step
            soundManager.playStep();
            
            this.lastUpdate = now;
        }
    }
}

const motionManager = new MotionManager();
