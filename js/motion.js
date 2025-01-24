class MotionManager {
    constructor() {
        this.stepCount = 0;
        this.lastUpdate = 0;
        this.isTracking = false;
        console.log('MotionManager created');
    }

    async requestPermission() {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                console.log('Requesting motion permission...');
                const permission = await DeviceMotionEvent.requestPermission();
                console.log('Motion permission:', permission);
                return permission === 'granted';
            } catch (error) {
                console.error('Error requesting motion permission:', error);
                return false;
            }
        }
        console.log('Motion permission not required for this device');
        return true; // Non-iOS devices don't need permission
    }

    startTracking() {
        if (this.isTracking) return;
        
        if ('ondevicemotion' in window) {
            console.log('Starting motion tracking...');
            window.addEventListener('devicemotion', this.handleMotion.bind(this));
            this.isTracking = true;
            console.log('Motion tracking started');
        } else {
            console.error('Device motion not supported');
            alert('Your device does not support motion detection');
        }
    }

    stopTracking() {
        if (!this.isTracking) return;
        console.log('Stopping motion tracking...');
        window.removeEventListener('devicemotion', this.handleMotion.bind(this));
        this.isTracking = false;
        console.log('Motion tracking stopped');
    }

    handleMotion(event) {
        const acceleration = event.acceleration;
        if (!acceleration) {
            console.warn('No acceleration data available');
            return;
        }

        const now = Date.now();
        // Debounce step detection to prevent multiple triggers
        if (now - this.lastUpdate < 300) return; 

        // Simple step detection using acceleration magnitude
        const magnitude = Math.sqrt(
            acceleration.x * acceleration.x +
            acceleration.y * acceleration.y +
            acceleration.z * acceleration.z
        );

        console.log('Motion magnitude:', magnitude.toFixed(2));

        if (magnitude > 10) { // Threshold for step detection
            this.stepCount++;
            console.log('Step detected! Count:', this.stepCount);
            document.getElementById('stepCount').textContent = this.stepCount;
            
            // Play sound for the step
            soundManager.playStep();
            
            this.lastUpdate = now;
        }
    }
}

const motionManager = new MotionManager();
